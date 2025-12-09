import { get, getAll } from "../../utils";

class Pagination {
  constructor(element) {
    this.element = element;
    this.sectionElement = get(".js-paginatable");
    this.listElement = get(".js-paginatable-list");
    this.pagination = get(".js-pagination");
    this.text = get(".js-pagination-text");
    this.trigger = get(".js-pagination-trigger");

    this.updateCount();

    if (
      !this.trigger ||
      this.element.classList.contains("js-pagination-custom")
    )
      return;

    this.initialState = {
      itemClassName: ".js-paginatable-item",
      perPage: Number.parseInt(this.element.dataset.perPage),
      textTemplate: this.element.dataset.textTemplate,
      buttonTextTemplate: this.element.dataset.buttonTextTemplate,
      initialButtonTextTemplate: this.element.dataset.initialButtonTextTemplate,
      totalItems: Number.parseInt(this.element.dataset.totalItems),
      url: this.element.dataset.url,
    };

    this.bindEvents();
  }

  bindEvents() {
    this.trigger.addEventListener("click", () => {
      this.paginate();
    });
  }

  updateCount() {
    const externalResults = getAll(".js-pagination-external-results");
    if (externalResults.length === 0) return;

    const totalItems = get(".js-pagination").dataset.totalItems;

    for (const externalResult of externalResults) {
      let resultsText = externalResult.dataset.resultsTextNone;

      if (totalItems == 1) {
        resultsText = externalResult.dataset.resultsTextOne;
      } else if (totalItems > 1) {
        resultsText = externalResult.dataset.resultsTextOther;
      }

      externalResult.textContent = resultsText.replace("//count//", totalItems);
    }
  }

  paginate() {
    if (this.pagination == undefined) return;
    this.handleTriggerClick();
  }

  async handleTriggerClick() {
    this.pagination = get(".js-pagination"); // Capture latest instance of element.
    const shouldUpdateCurrentAmountViewed = this.text != undefined;

    this.sectionElement.classList.toggle(`js-pagination-loading`);
    let currentPage = Number.parseInt(this.pagination.dataset.currentPage);

    this.pagination.dataset.currentPage = currentPage + 1;
    currentPage = currentPage + 1;

    const parsedQueryString = new URLSearchParams(window.location.search);
    parsedQueryString.set("page", currentPage);

    await fetch(`${this.initialState.url}?${parsedQueryString}`)
      .then((response) => response.text())
      .then((data) => {
        const fragment = document.createDocumentFragment();
        const parsedHTML = new DOMParser().parseFromString(data, "text/html");
        const parsedListElement = get(".js-paginatable-list", parsedHTML);
        const newElements = getAll(
          this.initialState.itemClassName,
          parsedListElement,
        );

        for (const item of newElements) {
          fragment.append(item);
        }

        this.listElement.append(fragment);

        if (shouldUpdateCurrentAmountViewed) {
          this.setCurrentAmountViewed();
        }

        this.sectionElement.classList.toggle(`js-pagination-loading`);
        document.dispatchEvent(new CustomEvent("Pagination:Update"));
      });
  }

  setCurrentAmountViewed() {
    const currentTotal = getAll(".js-paginatable-item").length;
    const totalItems = Number.parseInt(get(".js-pagination")?.dataset.totalItems);
    const itemsWord = get(".js-pagination")?.dataset.itemsWord;

    this.text.innerText = this.initialState.textTemplate
      .replace(`{{ pagination_amount }}`, currentTotal)
      .replace(`{{ total_count }}`, totalItems)
      .replace(`{{ items_word }}`, itemsWord);

    if (currentTotal === totalItems) {
      this.trigger.disabled = true;
      this.trigger.textContent = this.initialState.buttonTextTemplate.replace(
        `{{ items_word }}`,
        itemsWord,
      );
    } else {
      this.trigger.disabled = false;
      this.trigger.textContent = this.initialState.initialButtonTextTemplate;
    }

    window.yotpoWidgetsContainer?.initWidgets();
  }
}

export { Pagination };
