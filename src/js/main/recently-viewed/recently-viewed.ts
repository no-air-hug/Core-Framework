import { get } from "../../utils";

// !IMPORTANT: ensure that the ProductForm class is up to date, and contains this.storeProductHistory();

class RecentlyViewed extends HTMLElement {
  element: this;

  // Elements
  section: HTMLElement;
  slider: HTMLElement;
  productsContainer: HTMLUListElement;

  // Data
  observer: IntersectionObserver | null;
  localStorageName: string;
  recentlyViewedProducts: string[];
  currentProductHandle: string | undefined;
  limit: number;

  constructor() {
    super();

    this.element = this;

    // Elements
    this.section = this.element.closest("section") as HTMLElement;
    this.slider = get(".slider", this.element) as HTMLElement;
    this.productsContainer = get(
      ".js-recently-viewed-products-container"
    ) as HTMLUListElement;

    // Data
    this.observer = null;
    this.localStorageName = "CUSTOMER_PRODUCT_HISTORY";
    this.recentlyViewedProducts = [];
    this.currentProductHandle = this.element.dataset.productHandle ?? "";
    this.limit = Number(this.element.dataset.limit);

    // Begin observing section...
    this.observeSection();
  }

  /**
   * Observe the section to trigger events when it becomes visible.
   */
  observeSection() {
    this.observer = new IntersectionObserver(this.handleIntersection, {
      root: null, // Use the viewport as the root
      rootMargin: "0px", // No margin
      threshold: 0.1, // Trigger when at least 10% of the element is visible
    });

    if (this.section) {
      this.observer.observe(this.section);
    }
  }

  /**
   * Intersection Observer callback function.
   */
  handleIntersection = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      // Section is in view, execute bindEvents
      this.bindEvents();
      // Stop observing after the first trigger if needed
      this.observer?.disconnect();
    }
  };

  /**
   * Bind initial events.
   */
  bindEvents() {
    this.getProductHistory();
    this.renderProducts();
  }

  /**
   * Render product cards
   */
  renderProducts() {
    const productCardPromises = [];
    for (let i = 0; i < this.recentlyViewedProducts.length; i++) {
      const product = this.recentlyViewedProducts[i];
      if (product === this.currentProductHandle || i >= this.limit) continue;

      productCardPromises.push(
        fetch(`/products/${product}?view=ajax-card`)
          .then((response) => response.text())
          .then((data) => {
            const sliderItemFramework = document.createElement("li");
            sliderItemFramework.className = "slider__item";

            const parsedHTML = new DOMParser().parseFromString(
              data,
              "text/html"
            );
            const parsedListItemElement = get(
              ".js-product-card",
              parsedHTML
            ) as HTMLElement;

            sliderItemFramework.append(parsedListItemElement);

            if (parsedListItemElement)
              this.productsContainer.append(sliderItemFramework);
          })
          .catch((error) => { console.error(error); })
      );
    }

    Promise.allSettled(productCardPromises).then(() => { this.reInitSlider(); });
  }

  /**
   * Reinitialises the current slider.
   */
  reInitSlider() {
    this.slider.dispatchEvent(new CustomEvent("EmblaSlider:ReInit"));
  }

  /**
   * Looks for the 'Recently Viewed Products' local storage item, whether
   * it exists or not. If we're on a product page then the currently viewed
   * product will be added to the local storage item, or it'll create a new one.
   */
  getProductHistory() {
    const productHistoryName = "CUSTOMER_PRODUCT_HISTORY";
    const productHistoryStorage = localStorage.getItem(productHistoryName);

    if (productHistoryStorage) {
      // Reverse the product history so the most recent item appears first.
      const parsedStorage = JSON.parse(productHistoryStorage);
      this.recentlyViewedProducts = parsedStorage.reverse();
    } else {
      // There's no recently viewed storage item, and there's
      // no current product - remove the section entirely..
      this.removeSection();
      return;
    }
  }

  removeSection() {
    console.warn(
      "The recently-viewed section has been removed because there are no products to generate."
    );

    this.section.remove();
  }
}

customElements.define("recently-viewed", RecentlyViewed);
