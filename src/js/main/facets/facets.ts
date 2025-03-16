import { EmblaCarouselType } from "embla-carousel";

import { debounce, get, getAll } from "../../utils";
import type { Dialog } from "../dialog/dialog";
import { Pagination } from "../pagination/pagination";

export class Facets {
  // Elements
  element!: HTMLElement;

  dropdowns!: HTMLDetailsElement[];
  desktopInputs!: HTMLInputElement[] | HTMLSelectElement[];
  mobileInputs!: HTMLInputElement[] | HTMLSelectElement[];

  form!: HTMLFormElement;
  priceRange!: HTMLElement;
  facetsDialogDrawer!: HTMLElement;
  facetsDialogDrawerMain!: HTMLElement;
  removeButtons!: HTMLAnchorElement[];

  section!: HTMLElement;
  facetsDialogSection!: HTMLElement;

  // Positional Elements (Elements set solely to have their positions reset)
  verticalFacets!: HTMLElement;
  activeFacetsScrollTrack!: HTMLElement;

  // Data
  sectionId: string;
  facetsDialogSectionId: string;
  idsOfSectionsToFetch: string[];
  mediaQueryList: MediaQueryList;

  // Positions
  bodyScrollPosition!: string;
  facetsDialogContentPosition!: number;
  verticalFacetsPosition!: number;
  activeFacetsSlideIndex!: number;
  lastRemovedActiveFacet!: HTMLElement;

  abortController = new AbortController();

  constructor() {
    this.setElements();

    // Data
    this.sectionId = this.section.id.replace("shopify-section-", "") ?? "";
    this.facetsDialogSectionId =
      this.facetsDialogSection.id.replace("shopify-section-", "") ?? "";
    this.idsOfSectionsToFetch = [this.sectionId, this.facetsDialogSectionId];
    this.mediaQueryList = matchMedia("(min-width: 1024px)");

    this.bindEvents();
  }

  /**
   * Binds initial events..
   */
  bindEvents() {
    this.handleInputs(true);
    this.handleDesktopDropdowns();
    this.handleResetButtons();
  }

  /**
   * Finds and attatches all the elements
   */
  setElements() {
    // Elements
    this.element = get(".js-facets") as HTMLElement; // Not using 'this' here because its definition is lost on fetch.

    // Section Elements
    this.section = this.element.closest("section") as HTMLElement;
    this.facetsDialogSection = get(".js-facets-dialog") as HTMLElement;

    // Elements
    this.dropdowns = getAll(
      ".js-facet-dropdown",
      this.element,
    ) as HTMLDetailsElement[];

    this.form = get(".js-facets-form", this.element) as HTMLFormElement;
    this.priceRange = get(".js-price-range", this.element) as HTMLElement;
    this.facetsDialogDrawer = get(".js-facets-dialog-drawer") as HTMLElement;
    this.facetsDialogDrawerMain = get(
      "[data-dialog-element=main]",
      this.facetsDialogDrawer,
    ) as HTMLElement;
    this.removeButtons = getAll(".js-facet-remove") as HTMLAnchorElement[];

    // Positional Elements (Elements set solely to have their positions reset)
    this.verticalFacets = get(".js-facets-vertical") as HTMLElement;
    this.activeFacetsScrollTrack = get(
      ".slider__track",
      this.element,
    ) as HTMLElement;
  }

  /**
   * Fires initial events again when the page is fetched
   */
  onReload() {
    this.setElements();
    this.handleInputs(false);
    this.handleResetButtons();
    this.resetPositions();

    // Reset the pagination based on the new content.
    new Pagination(get(".js-pagination") as HTMLElement);
  }

  /**
   * Attatches event listeners to all reset buttons, submits their
   * href attribute to fetchAndRenderProducts as a parameter.
   */
  handleResetButtons() {
    this.removeButtons.forEach((removeButton: HTMLAnchorElement) => {
      removeButton.addEventListener("click", (e: Event) => {
        e.preventDefault();
        this.fetchAndRenderProducts(removeButton.search);

        if (this.activeFacetsScrollTrack.contains(removeButton)) {
          const removeButtonItem = removeButton.closest("li") as HTMLElement;
          this.lastRemovedActiveFacet = removeButtonItem;
        }

        return;
      });
    });
  }

  /**
   * Handles the opening and closing of details elements,
   * for instance preventing multiple being [open] at the
   * same time
   */
  handleDesktopDropdowns = () => {
    document.addEventListener("click", (e) => {
      if (!this.mediaQueryList.matches) return;

      for (const dropdown of this.dropdowns) {
        const target = e.target as HTMLElement;

        if (e.target !== dropdown && !dropdown.contains(target)) {
          const index = dropdown.dataset.index as string;
          this.removeOpen(index);
        }
      }
    });
  };

  /**
   * Removes the open attribute from a specified
   * details element.
   */
  removeOpen = (index: string) => {
    for (const dropdown of this.dropdowns) {
      if (index === dropdown.dataset.index) dropdown.removeAttribute("open");
    }
  };

  /**
   * Pushes a new URL / state to the browser history.
   *
   * @param {String} url - the URL to push.
   */
  pushState(url: string) {
    if (!url) return;
    window.history.pushState({}, "", url);
  }

  /**
   * Gets Form data and returns it as a string.
   *
   * @param {HTMLElement} - the form element.
   * @return {String} - the form data as a string.
   */
  getFormSearchParams(form: HTMLFormElement) {
    if (!form) return;

    let formData = new FormData(form);
    formData = this.processPriceData(formData);

    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        params.append(key, value);
      }
    }

    return params.toString();
  }

  /**
   * Prevents the price-range data from being submitted as a value when
   * the price-range max value is equal to the max price range, and the min
   * value is equal to to the minimum price range.
   *
   * @param {*} formData
   * @returns
   */
  processPriceData(formData: FormData) {
    const filteringDisabled = Boolean(this.form.dataset.filtering);
    const deletePriceData = () => {
      formData.delete("filter.v.price.gte");
      formData.delete("filter.v.price.lte");
    };

    if (this.priceRange) {
      const minPriceInput = get(
        ".js-price-input-gte",
        this.priceRange,
      ) as HTMLInputElement;
      const maxPriceInput = get(
        ".js-price-input-lte",
        this.priceRange,
      ) as HTMLInputElement;

      const min = Number(minPriceInput.min);
      const max = Number(maxPriceInput.max);

      const minPrice = Number(formData.get("filter.v.price.gte"));
      const maxPrice = Number(formData.get("filter.v.price.lte"));

      if (minPrice === min && maxPrice === max) deletePriceData();
    } else if (filteringDisabled) {
      deletePriceData();
    }

    return formData;
  }

  /**
   * Fetches products from a specified (or non-specificed)
   * set of search parameters
   * @param {String} - the search parameters
   */
  fetchAndRenderProducts(searchParams?: string) {
    this.abortController.abort();
    this.abortController = new AbortController();

    let queryURL: string; // For fetch
    let pushURL: string; // For history (browser)

    /* If searchParams (URL) has been provided, we'll use these. */
    if (searchParams) {
      /* Stitch a query (?) in to the URL if one isn't present, so the URL continues to work. */
      searchParams.includes("?")
        ? (queryURL = searchParams)
        : (queryURL = `?${searchParams}`);
      pushURL = searchParams;
    } else {
      /* Otherwise, we'll use the Params from the form element. */
      searchParams = this.getFormSearchParams(this.form);
      if (searchParams) searchParams = `&${searchParams}`;

      queryURL = `${window.location.pathname}?${searchParams}`;
      pushURL = `${window.location.pathname}?${searchParams}`;
    }

    fetch(`${queryURL}&sections=${this.idsOfSectionsToFetch.join(",")}`, {
      signal: this.abortController.signal,
    })
      .then((res) => res.json())
      .then((fetchedSections) => {
        /* Create an HTML element to contain the response */
        const parsedCollectionHTML = new DOMParser().parseFromString(
          fetchedSections[this.sectionId],
          "text/html",
        );
        const parsedFacetDialogDrawerHTML = new DOMParser().parseFromString(
          fetchedSections[this.facetsDialogSectionId],
          "text/html",
        );

        /* Find elements we need to update in the returned HTML */
        const fetchedSection = get(
          `#shopify-section-${this.sectionId}`,
          parsedCollectionHTML,
        ) as HTMLElement;
        const fetchedfacetsDialogDrawer = get(
          `#shopify-section-${this.facetsDialogSectionId} .js-facets-dialog-drawer`,
          parsedFacetDialogDrawerHTML,
        ) as HTMLElement;

        // Re-opens the fetched facets dialog drawer.
        const facetHidden = this.facetsDialogDrawer.getAttribute("aria-hidden");
        if (facetHidden === "false") {
          document.body.addEventListener(
            "Dialog:Loaded",
            (e: Event | any) => {
              const dialogInstance: Dialog | undefined =
                e.detail.dialogInstance;
              const dialogSelector = e.detail.dialogSelector;

              // Now you can use dialogInstance to call functions
              if (dialogInstance && dialogSelector === "DrawerFacets")
                dialogInstance.show(false);
            },
            {
              once: true,
            },
          );
        }

        // Prepare the currently open Facet, and reopen it in the fetched facets section.
        const currentOpenDropdown = this.dropdowns.find(
          (dropdown) => dropdown.open,
        ) as HTMLDetailsElement;

        if (currentOpenDropdown) {
          const dropdownToReopen = get(
            `.js-facet-dropdown[data-index="${currentOpenDropdown.dataset.index}"]`,
            fetchedSection,
          ) as HTMLDetailsElement;

          if (dropdownToReopen) dropdownToReopen.open = true;
        }

        /**
         * Gets and sets all the relevant element position data on the current session,
         * this will be used when the fetch is complete and applied back onto the relative elements.
         */
        this.setPositionData();

        // Apply the fetched HTML to it's respective sections.
        this.section.innerHTML = fetchedSection.innerHTML;
        this.facetsDialogDrawer.outerHTML = fetchedfacetsDialogDrawer.outerHTML;

        // Reapply any lost functionality to the new content.
        this.onReload();

        /* Push the url, remove the loading state */
        this.pushState(pushURL);
        document.dispatchEvent(new CustomEvent("Facets:Update"));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Syncs the currently clicked or interacted with the counterpart input,
   * so if the user clicked an input on desktop, this will go and match
   * it's current checked status with it's matching input inside of
   * this.facetsDialog.
   *
   * @param event
   * @returns
   */
  syncCounterpart = (event: Event) => {
    const inputHandler = debounce(() => {
      this.fetchAndRenderProducts();
    }, 0);

    const input = event.target as HTMLInputElement;

    const counterpart = get(
      `[disabled][data-facets-identifier="${input.dataset.facetsIdentifier}"]`,
    ) as HTMLInputElement;

    if (!counterpart) {
      console.error("Counterpart not found...");
      return;
    }

    if (
      !input.classList.contains("js-price-input") &&
      !input.classList.contains("js-range-input") &&
      input.name !== "sort_by"
    ) {
      counterpart.checked = input.checked;
    } else {
      counterpart.value = input.value;
    }

    inputHandler();
  };

  /**
   * Handles event changes on inputs, and runs the render
   * method accordingly, based on the type of input
   */
  handleInputs = (setMediaQueryEvent: boolean) => {
    this.setDesktopInputs();
    this.setMobileInputs();

    // Disable and enable the inputs based on our current viewport.
    this.setInputStatusBasedOnViewport();

    if (!setMediaQueryEvent) return;
    this.mediaQueryList.addEventListener(
      "change",
      this.setInputStatusBasedOnViewport,
    );
  };

  /**
   * Applys a "input" event listened to inputs that the
   * user interacts with on Desktop.
   */
  setDesktopInputs() {
    this.element.addEventListener("input", this.syncCounterpart); // Desktop Inputs
  }

  /**
   * Applys a "input" event listened to inputs that the
   * user interacts with on Mobile.
   */
  setMobileInputs() {
    this.facetsDialogDrawer.addEventListener("input", this.syncCounterpart); // Mobile Inputs
  }

  /**
   * Enables or disables mobile and desktop inputs based on the current viewport.
   * @param event
   */
  setInputStatusBasedOnViewport = (event?: MediaQueryListEvent) => {
    this.mobileInputs = getAll(".js-facet-input-mobile") as
      | HTMLInputElement[]
      | HTMLSelectElement[]; // Inputs to be submitted when viewing on mobile.
    this.desktopInputs = getAll(".js-facet-input-desktop") as
      | HTMLInputElement[]
      | HTMLSelectElement[]; // Inputs to be submitted when viewing on desktop.

    if (this.mediaQueryList.matches || event?.matches) {
      // We're on Desktop
      for (const input of this.mobileInputs) input.disabled = true; // Disable Mobile Inputs
      for (const input of this.desktopInputs) input.disabled = false; // Enable Desktop Inputs
    } else {
      // We're on Mobile
      for (const input of this.mobileInputs) input.disabled = false; // Enable Mobile Inputs
      for (const input of this.desktopInputs) input.disabled = true; // Disable Desktop Inputs
    }
  };

  /**
   * Sets element position data objects.
   */
  setPositionData() {
    // BSL Body Scroll Positioning
    this.bodyScrollPosition = String(document.body.dataset.bslScrollPosition);

    // Facets Drawer Content Scroll
    this.facetsDialogContentPosition = this.facetsDialogDrawerMain.scrollTop;

    // Vertical Facets Scroll
    if (this.verticalFacets)
      this.verticalFacetsPosition = this.verticalFacets.scrollTop;

    // Active Facets Slider Positioning
    if (this.activeFacetsScrollTrack && this.lastRemovedActiveFacet) {
      this.activeFacetsSlideIndex = Number(
        this.lastRemovedActiveFacet.dataset.slideIndex,
      );
    }
  }

  /**
   * Resets the positioning of elements that are fetched.
   */
  resetPositions() {
    this.resetBSLBodyPosition();
    this.resetfacetsDialogPosition();
    this.resetVerticalFacetsPosition();
    this.resetActiveFacetsSlideIndex();
  }

  resetBSLBodyPosition() {
    document.body.dataset.bslScrollPosition = this.bodyScrollPosition;
  }

  /**
   * Maintains the facet drawers's scroll position after a fetch.
   */
  resetfacetsDialogPosition() {
    if (!this.mediaQueryList.matches)
      this.facetsDialogDrawerMain.scrollTop = this.facetsDialogContentPosition;
  }

  /**
   * Maintains the vertical facet's scroll position after a fetch.
   */
  resetVerticalFacetsPosition() {
    if (this.mediaQueryList.matches && this.verticalFacets)
      this.verticalFacets.scrollTop = this.verticalFacetsPosition;
  }

  /**
   * Maintains the active facet's scroll position after a fetch.
   */
  resetActiveFacetsSlideIndex() {
    if (!this.activeFacetsScrollTrack) return;

    document.body.addEventListener(
      "EmblaSlider:Loaded",
      (e) => {
        const { detail } = e as any;
        const loadedSlider = detail.slider as HTMLElement;
        const loadedSlideAPI = detail.sliderAPI as EmblaCarouselType;

        if (loadedSlider.contains(this.activeFacetsScrollTrack)) {
          const newIndex =
            this.activeFacetsSlideIndex === 0
              ? 0
              : this.activeFacetsSlideIndex - 1;

          if (!isNaN(newIndex)) loadedSlideAPI.scrollTo(newIndex, true);
        }
      },
      {
        once: true,
      },
    );
  }
}
