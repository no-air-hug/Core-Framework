import { get } from "../../utils";
import { formatMoney } from "../../utils/shopify";

export type Variant = {
  id: number;
  title: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  sku: string;
  requires_shipping: boolean;
  taxable: boolean;
  featured_image: null | TODO;
  available: boolean;
  name: string;
  public_title: string;
  options: string[];
  price: number;
  weight: number;
  compare_at_price: number;
  inventory_management: string;
  barcode: string;
};

export class VariantOptions extends HTMLElement {
  element: this | HTMLElement;
  currentVariant?: Variant;
  quantityInput!: HTMLInputElement;
  quantityValue: number;
  abortController = new AbortController();
  elSection = this.closest(".shopify-section") as HTMLElement;

  constructor() {
    super();
    this.element = this;
    this.addEventListener("change", this.onVariantChange);
    this.quantityValue = 1;

    /**
     *  Ignore elements with aside parents to avoid this being applied to
     * 'Complementary products on the PDP'
     */
    if (this.elSection && !this.element.closest(".js-complementary-products")) {
      this.quantityInput = get(
        ".js-quantity-input input",
        this.elSection,
      ) as HTMLInputElement;
    }
  }

  onVariantChange(event: Event) {
    this.updateOptions();
    this.updateMasterId();
    this.updateSelectedValue(event.target);
    this.toggleAddButton(true, "");
    this.toggleButtonLoading();
    this.removeErrorMessage();
    this.updateVariantStatuses();

    if (this.currentVariant) {
      this.updateURL();
      this.updateVariantInput();
    } else {
      this.toggleAddButton(true, "");
      this.setUnavailable();
    }
    this.renderProductInfo();

    if (this.quantityInput)
      this.quantityValue = Number(this.quantityInput.value);
  }

  updateOptions() {
    const fieldsets = [...this.querySelectorAll("fieldset")];

    this.options = fieldsets.map((fieldset) => {
      return [...fieldset.querySelectorAll("input")].find(
        (radio) => radio.checked,
      ).value;
    });
  }

  updateMasterId() {
    this.altVariant = undefined;

    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });

    if (!this.currentVariant) {
      const opts = [this.options[0]];
      this.altVariant = this.getVariantData().find((variant) => {
        return !variant.options
          .map((option, index) => {
            return opts[index] ? opts[index] === option : true;
          })
          .includes(false);
      });
    }
  }

  updateSelectedValue(elTarget: string) {
    const elSelectedValue = get(
      `[data-selected-option="${elTarget.name}"]`,
      this,
    );
    if (elSelectedValue) elSelectedValue.textContent = elTarget.value;
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === "false") return;
    window.history.replaceState(
      {},
      "",
      `${this.dataset.url}?variant=${this.currentVariant.id}`,
    );
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}`,
    );
    for (const productForm of productForms) {
      const input = productForm.querySelector(
        'input[name="id"]',
      ) as HTMLInputElement;
      input.value = String(this.currentVariant.id);
      input.dispatchEvent(
        new CustomEvent("Variant:Changed", {
          bubbles: true,
          detail: {
            variant: this.currentVariant,
          },
        }),
      );
    }
  }

  updateVariantStatuses() {
    const selectedOptionOneVariants = this.variantData.filter(
      (variant) => this.querySelector(":checked").value === variant.option1,
    );
    const inputWrappers = [...this.querySelectorAll("fieldset")];
    for (const [index, option] of inputWrappers.entries()) {
      if (index === 0) continue;
      const optionInputs = [
        ...option.querySelectorAll('input[type="radio"], option'),
      ];
      const previousOptionSelected =
        inputWrappers[index - 1].querySelector(":checked").value;
      const availableOptionInputsValue = selectedOptionOneVariants
        .filter(
          (variant) =>
            variant.available &&
            variant[`option${index}`] === previousOptionSelected,
        )
        .map((variantOption) => variantOption[`option${index + 1}`]);

      this.setInputAvailability(optionInputs, availableOptionInputsValue);
    }
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    for (const input of listOfOptions) {
      if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
        input.classList.remove("disabled");
      } else {
        input.classList.add("disabled");
      }
    }
  }

  removeErrorMessage() {
    const section = this.closest("section");
    if (!section) return;

    const productForm = section.querySelector("[is=product-form]");
    if (productForm) productForm.handleErrorMessage();
  }

  renderProductInfo() {
    this.abortController.abort();
    this.abortController = new AbortController();

    fetch(
      `${this.dataset.url}?variant=${
        this.currentVariant.id ?? this.altVariant.id
      }&view=ajax&section_id=${
        this.dataset.originalSection
          ? this.dataset.originalSection
          : this.dataset.section
      }`,
      { signal: this.abortController.signal },
    )
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");

        // Update media gallery
        const elNewMediaGallery = html.querySelector(
          ".product__media, .product-quickshop__column--media",
        );
        const elLiveMediaGallery = this.elSection.querySelector(
          ".product__media, .product-quickshop__column--media",
        );
        if (elNewMediaGallery && elLiveMediaGallery) {
          elLiveMediaGallery.innerHTML = elNewMediaGallery.innerHTML;
        }
        // Update media modal
        const elNewMediaModal = html.querySelector(".js-product-lightbox");
        const elLiveMediaModal = this.elSection.querySelector(
          ".js-product-lightbox",
        );

        if (elNewMediaModal && elLiveMediaModal) {
          elLiveMediaModal.innerHTML = elNewMediaModal.innerHTML;
        }

        // Update price
        {
          const priceDestination = document.getElementById(
            `price-${this.dataset.section}`,
          );
          const priceSource = html.getElementById(
            `price-${
              this.dataset.originalSection
                ? this.dataset.originalSection
                : this.dataset.section
            }`,
          );

          if (priceSource && priceDestination)
            priceDestination.innerHTML = priceSource.innerHTML;

          const price = document.getElementById(
            `price-${this.dataset.section}`,
          );
          if (price) price.classList.remove("visibility-hidden");
        }

        if (this.currentVariant) {
          this.toggleAddButton(
            !this.currentVariant.available,
            this.currentVariant.available
              ? window.Shopify.theme.i18n.addToCart.replace(
                  "{{ price }}",
                  formatMoney({
                    cents: this.currentVariant.price * this.quantityValue,
                  }),
                )
              : window.Shopify.theme.i18n.soldOut,
          );
        } else {
          this.setUnavailable();
        }
      })
      .catch(() => {
        // TODO: handle error
      })
      .finally(() => {
        this.toggleButtonLoading();
      });
  }

  toggleAddButton(disable = true, text: string) {
    const productForm = document.getElementById(
      `product-form-${this.dataset.section}`,
    );
    if (!productForm) return;

    const addButton = productForm.querySelector('[name="add"]');
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute("disabled", "disabled");
    } else {
      addButton.removeAttribute("disabled");
    }

    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (text && addButtonText) addButtonText.innerHTML = text;
  }

  setUnavailable() {
    const productForm = document.getElementById(
      `product-form-${this.dataset.section}`,
    );
    if (!productForm) return;

    const addButton = productForm.querySelector('[name="add"]');
    if (!addButton) return;

    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (addButtonText)
      addButtonText.textContent = window.Shopify.theme.i18n.unavailable;

    const price = get(`#price-${this.dataset.section}`);
    if (price) price.firstElementChild.classList.add("invisible");
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }

  toggleButtonLoading = () => {
    const elSubmitButton = document.querySelector(
      `#product-form-${this.dataset.section} [name="add"]`,
    );
    if (!elSubmitButton) return;

    for (const elChild of elSubmitButton.children) {
      elChild.classList.toggle("invisible");
    }
  };
}

customElements.define("variant-options", VariantOptions);
