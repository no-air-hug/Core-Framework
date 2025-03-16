import { debounce, get } from "../../utils";

import "./search.scss";

class SearchForm extends HTMLFormElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]');
    this.resetButton = this.querySelector('button[type="reset"]');

    if (this.input) {
      this.input.addEventListener(
        "input",
        debounce((event) => {
          this.onChange(event);
        }, 300).bind(this),
      );
    }
  }

  onChange() {
    //
  }
}

customElements.define("search-form", SearchForm, {
  extends: "form",
});

class PredictiveSearch extends SearchForm {
  isBusy = false;

  constructor() {
    super();

    this.statusElement = document.createElement("span");
    this.statusElement.className = "sr-only";
    this.statusElement.role = "status";
    this.statusElement.setAttribute("aria-hidden", "true");
    this.append(this.statusElement);

    this.predictiveSearchResults = document.createElement("div");
    this.predictiveSearchResults.className = "predictive-search";
    this.predictiveSearchResults.setAttribute("tabindex", "-1");
    this.predictiveSearchResults.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="predictive-search__loading-state">
        <div class="loading-overlay__spinner">
          <svg
            aria-hidden="true"
            focusable="false"
            class="spinner"
            viewBox="0 0 66 66"
            stroke="currentColor"
          >
          <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
        </svg>
        </div>
      </div>`,
    );
    this.append(this.predictiveSearchResults);

    this.searchOverlay = get(".js-search-overlay");

    this.cachedResults = {};
    this.allPredictiveSearchInstances =
      document.querySelectorAll("predictive-search");
    this.isOpen = false;
    this.abortController = new AbortController();
    this.searchTerm = "";

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.input.form.addEventListener("submit", this.onFormSubmit.bind(this));

    this.input.addEventListener("focus", this.onFocus.bind(this));
    this.addEventListener("focusout", this.onFocusOut.bind(this));
    this.addEventListener("keyup", this.onKeyup.bind(this));
    this.addEventListener("keydown", this.onKeydown.bind(this));
  }

  getQuery() {
    return this.input.value.trim();
  }

  onChange() {
    super.onChange();
    const newSearchTerm = this.getQuery();
    if (!this.searchTerm || !newSearchTerm.startsWith(this.searchTerm)) {
      // Remove the results when they are no longer relevant for the new search term
      // so they don't show up when the dropdown opens again
      this.querySelector("#predictive-search-results-groups-wrapper")?.remove();
    }

    // Update the term asap, don't wait for the predictive search query to finish loading
    this.updateSearchForTerm(this.searchTerm, newSearchTerm);

    this.searchTerm = newSearchTerm;

    if (this.searchTerm.length === 0) {
      this.close(true);
      return;
    }

    this.getSearchResults(this.searchTerm);
  }

  onFormSubmit(event) {
    if (
      this.getQuery().length === 0 ||
      this.querySelector('[aria-selected="true"] a')
    )
      event.preventDefault();
  }

  onFocus() {
    const currentSearchTerm = this.getQuery();

    if (currentSearchTerm.length === 0) return;

    if (this.searchTerm !== currentSearchTerm) {
      // Search term was changed from other search input, treat it as a user change
      this.onChange();
    } else if (this.getAttribute("results") === "true") {
      this.open();
    } else {
      this.getSearchResults(this.searchTerm);
    }
  }

  onFocusOut() {
    if (this.isBusy) return;
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onKeyup(event: KeyboardEvent) {
    if (this.getQuery().length === 0) this.close(true);
    event.preventDefault();

    switch (event.code) {
      case "ArrowUp": {
        this.switchOption("up");
        break;
      }
      case "ArrowDown": {
        this.switchOption("down");
        break;
      }
      case "Enter": {
        this.selectOption();
        break;
      }
    }
  }

  onKeydown(event) {
    document.documentElement.style.scrollPaddingTop = "0";

    // Prevent the cursor from moving in the input when using the up and down arrow keys
    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
      event.preventDefault();
    }
  }

  updateSearchForTerm(previousTerm, newTerm) {
    const searchForTextElement = this.querySelector(
      "[data-predictive-search-search-for-text]",
    );
    const currentButtonText = searchForTextElement?.innerText;
    if (currentButtonText) {
      if (currentButtonText.match(new RegExp(previousTerm, "g")).length > 1) {
        // The new term matches part of the button text and not just the search term, do not replace to avoid mistakes
        return;
      }
      const newButtonText = currentButtonText.replace(previousTerm, newTerm);
      searchForTextElement.innerText = newButtonText;
    }
  }

  switchOption(direction) {
    if (!this.getAttribute("open")) return;

    const moveUp = direction === "up";
    const selectedElement = this.querySelector('[aria-selected="true"]');

    // Filter out hidden elements (duplicated page and article resources) thanks
    // to this https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
    const allVisibleElements = [
      ...this.querySelectorAll("li, button.predictive-search__item"),
    ].filter((element) => element.offsetParent !== null);
    let activeElementIndex = 0;

    if (moveUp && !selectedElement) return;

    let selectedElementIndex = -1;
    let i = 0;

    while (selectedElementIndex === -1 && i <= allVisibleElements.length) {
      if (allVisibleElements[i] === selectedElement) {
        selectedElementIndex = i;
      }
      i++;
    }

    this.statusElement.textContent = "";

    if (!moveUp && selectedElement) {
      activeElementIndex =
        selectedElementIndex === allVisibleElements.length - 1
          ? 0
          : selectedElementIndex + 1;
    } else if (moveUp) {
      activeElementIndex =
        selectedElementIndex === 0
          ? allVisibleElements.length - 1
          : selectedElementIndex - 1;
    }

    if (activeElementIndex === selectedElementIndex) return;

    const activeElement = allVisibleElements[activeElementIndex];

    activeElement.setAttribute("aria-selected", true);
    if (selectedElement) selectedElement.setAttribute("aria-selected", false);

    this.input.setAttribute("aria-activedescendant", activeElement.id);
  }

  selectOption() {
    const selectedOption = this.querySelector(
      '[aria-selected="true"] a, button[aria-selected="true"]',
    );

    if (selectedOption) selectedOption.click();
  }

  getSearchResults(searchTerm) {
    this.isBusy = true;
    const queryKey = searchTerm.replace(" ", "-").toLowerCase();
    this.setLiveRegionLoadingState();

    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      this.isBusy = false;
      return;
    }

    const params = new URLSearchParams(new FormData(this));

    fetch(
      `${window.Shopify.routes.predictiveSearchUrl}?${params}&section_id=predictive-search`,
      {
        signal: this.abortController.signal,
      },
    )
      .then((response) => {
        if (!response.ok) {
          const error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(text, "text/html")
          .querySelector("#shopify-section-predictive-search").innerHTML;
        // Save bandwidth keeping the cache in all instances synced
        for (const predictiveSearchInstance of this
          .allPredictiveSearchInstances) {
          predictiveSearchInstance.cachedResults[queryKey] = resultsMarkup;
        }

        this.renderSearchResults(resultsMarkup);
        this.isBusy = false;
      })
      .catch((error) => {
        if (error?.code === 20) {
          // Code 20 means the call was aborted
          return;
        }
        this.close();
        this.isBusy = false;
        throw error;
      });
  }

  setLiveRegionLoadingState() {
    this.statusElement =
      this.statusElement || this.querySelector(".predictive-search-status");
    this.loadingText = this.loadingText || this.dataset.loadingText;

    this.setLiveRegionText(this.loadingText);
    this.setAttribute("loading", true);
  }

  setLiveRegionText(statusText) {
    this.statusElement.setAttribute("aria-hidden", "false");
    this.statusElement.textContent = statusText;

    setTimeout(() => {
      this.statusElement.setAttribute("aria-hidden", "true");
    }, 1000);
  }

  renderSearchResults(resultsMarkup) {
    this.predictiveSearchResults.innerHTML = resultsMarkup;
    this.setAttribute("results", true);

    this.setLiveRegionResults();
    this.open();
  }

  setLiveRegionResults() {
    this.removeAttribute("loading");
    this.setLiveRegionText(
      this.querySelector("[data-predictive-search-live-region-count-value]")
        .textContent,
    );
  }

  open() {
    this.setAttribute("open", true);
    this.input.setAttribute("aria-expanded", true);
    this.isOpen = true;
    this.searchOverlay.classList.remove("opacity-0");
  }

  close(clearSearchTerm = false) {
    if (this.isBusy) return;

    this.closeResults(clearSearchTerm);
    this.isOpen = false;
    if (window.innerWidth >= 768) {
      this.searchOverlay.classList.add("opacity-0");
    }
    document.documentElement.style.scrollPaddingTop = "";
  }

  closeResults(clearSearchTerm = false) {
    if (clearSearchTerm) {
      this.input.value = "";
      this.removeAttribute("results");
    }
    const selected = this.querySelector('[aria-selected="true"]');

    if (selected) selected.setAttribute("aria-selected", false);

    this.input.setAttribute("aria-activedescendant", "");
    this.removeAttribute("loading");
    this.removeAttribute("open");
    this.input.setAttribute("aria-expanded", false);
    this.resultsMaxHeight = false;
    this.predictiveSearchResults.removeAttribute("style");
  }

  mobileCloseHandler = (event: Event) => {
    if (
      !this.contains(event.target) &&
      !event.target.closest(`[href="/search"]`)
    ) {
      this.close();
      this.mobileToggle(false);
      document.removeEventListener("click", this.mobileCloseHandler);
    }
  };

  mobileToggle(force: boolean) {
    const isOpen = HeaderSearchForm.classList.toggle("is-visible", force);

    document.removeEventListener("click", this.mobileCloseHandler);

    if (isOpen) {
      this.searchOverlay.classList.remove("invisible");

      get("[name=q]", this)?.focus();
      setTimeout(() => {
        document.addEventListener("click", this.mobileCloseHandler);
      }, 200);
    } else {
      this.searchOverlay.classList.add("invisible");
    }

    return false;
  }
}

customElements.define("predictive-search", PredictiveSearch, {
  extends: "form",
});
