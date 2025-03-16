import "./shop-the-look.scss";

import { get } from "../../utils";

class ShopLook extends HTMLElement {
  constructor() {
    super();
    this.element = this;
    this.trigger = get(".js-look-button", this.element);
    this.container = get(".js-look-products", this.element);
    if (this.trigger) this.bindEvents();
  }

  connectedCallback() {
    this.hidden = false;
  }

  bindEvents() {
    this.toggleModal();
  }

  toggleModal() {
    this.trigger.addEventListener("click", () => {
      this.trigger.classList.toggle("is-active");
      this.container.classList.toggle("is-active");
      this.toggleIcon();
    });
  }

  toggleIcon() {
    const currentIcon = document.querySelectorAll(".js-look-icon");
    if (currentIcon) {
      for (const getcurrentIcon of currentIcon) {
        getcurrentIcon.classList.toggle("hidden");
      }
    }
  }
}

customElements.define("shop-the-look", ShopLook);
