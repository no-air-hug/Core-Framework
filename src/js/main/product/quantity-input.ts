export class QuantityInput extends HTMLElement {
  element: HTMLElement | this;
  input: HTMLInputElement;
  changeEvent = new Event("change", { bubbles: true });

  constructor() {
    super();

    this.element = this;
    this.input = this.querySelector("input") as HTMLInputElement;

    for (const elButton of this.querySelectorAll("button")) {
      elButton.type = "button";
      elButton.addEventListener("click", this.onButtonClick);
    }
  }

  onButtonClick = (event: MouseEvent) => {
    const previousValue = this.input.value;

    (event.currentTarget as HTMLButtonElement).name === "plus"
      ? this.input.stepUp()
      : this.input.stepDown();

    this.element.dispatchEvent(
      new CustomEvent("Quantity:Changed", {
        detail: {
          name: (event.currentTarget as HTMLButtonElement).name,
          previousValue: previousValue,
          newValue: this.input.value,
        },
      })
    );

    if (previousValue !== this.input.value) {
      this.input.dispatchEvent(this.changeEvent);
    }
  };
}

customElements.define("quantity-input", QuantityInput);
