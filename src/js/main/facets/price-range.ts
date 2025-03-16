import { get, getAll } from "../../utils";

class PriceRange extends HTMLElement {
  elRangeInputs: HTMLInputElement[];
  elPriceInputs: HTMLInputElement[];
  elProgress: HTMLElement;

  get priceGap() {
    return +(this.getAttribute("price-gap") || 1);
  }

  constructor() {
    super();

    this.elRangeInputs = getAll(".js-range-input", this) as HTMLInputElement[];
    this.elPriceInputs = getAll(".js-price-input", this) as HTMLInputElement[];
    this.elProgress = get(".js-price-progress", this) as HTMLElement;
  }

  connectedCallback() {
    this.elProgress.style.left =
      (this.elPriceInputs[0].valueAsNumber / +this.elRangeInputs[0].max) * 100 +
      "%";
    this.elProgress.style.right =
      100 -
      (this.elPriceInputs[1].valueAsNumber / +this.elRangeInputs[1].max) * 100 +
      "%";

    for (const elPriceInput of this.elPriceInputs) {
      elPriceInput.addEventListener("input", this.onPriceInputChange);
    }

    for (const elRangeInput of this.elRangeInputs) {
      elRangeInput.addEventListener("input", this.onRangeInputChange);
    }
  }

  disconnectedCallback() {
    for (const elPriceInput of this.elPriceInputs) {
      elPriceInput.removeEventListener("input", this.onPriceInputChange);
    }

    for (const elRangeInput of this.elRangeInputs) {
      elRangeInput.removeEventListener("input", this.onRangeInputChange);
    }
  }

  onPriceInputChange = (event: Event) => {
    if (!(event.currentTarget instanceof HTMLInputElement)) return;

    const minPrice = this.elPriceInputs[0].valueAsNumber;
    const maxPrice = this.elPriceInputs[1].valueAsNumber;

    if (
      Number.isNaN(minPrice) ||
      Number.isNaN(maxPrice) ||
      !(maxPrice - minPrice >= this.priceGap &&
        maxPrice <= +this.elRangeInputs[1].max)
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    switch (event.currentTarget.dataset.input) {
      case "min": {
        this.elRangeInputs[0].value = minPrice.toString();
        this.elPriceInputs[1].min = (minPrice + this.priceGap).toString();
        this.elProgress.style.left =
          (minPrice / +this.elRangeInputs[0].max) * 100 + "%";
        break;
      }

      case "max": {
        this.elRangeInputs[1].value = maxPrice.toString();
        this.elPriceInputs[0].max = (maxPrice - this.priceGap).toString();
        this.elProgress.style.right =
          100 - (maxPrice / +this.elRangeInputs[1].max) * 100 + "%";
        break;
      }

      default: {
        break;
      }
    }

    this.elPriceInputs[0].reportValidity();
    this.elPriceInputs[1].reportValidity();
  };

  onRangeInputChange = (event: Event) => {
    if (!(event.currentTarget instanceof HTMLInputElement)) return;

    const minPrice = this.elRangeInputs[0].valueAsNumber;
    const maxPrice = this.elRangeInputs[1].valueAsNumber;

    if (maxPrice - minPrice < this.priceGap) {
      switch (event.currentTarget.dataset.range) {
        case "min": {
          this.elRangeInputs[0].value = (maxPrice - this.priceGap).toString();
          break;
        }

        case "max": {
          this.elRangeInputs[1].value = (minPrice + this.priceGap).toString();
          break;
        }

        default: {
          break;
        }
      }
    } else {
      this.elPriceInputs[0].value = minPrice.toString();
      this.elPriceInputs[1].value = maxPrice.toString();
      this.elPriceInputs[0].max = (maxPrice - this.priceGap).toString();
      this.elPriceInputs[1].min = (minPrice + this.priceGap).toString();
      this.elProgress.style.left =
        (minPrice / +this.elRangeInputs[0].max) * 100 + "%";
      this.elProgress.style.right =
        100 - (maxPrice / +this.elRangeInputs[1].max) * 100 + "%";
    }

    this.elPriceInputs[0].reportValidity();
    this.elPriceInputs[1].reportValidity();
  };
}

customElements.define("price-range", PriceRange);
