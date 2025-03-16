export class ProductSku extends HTMLElement {
  connectedCallback() {
    document.body.addEventListener("Variant:Changed", (e) => {
      const { variant } = e.detail;
      if (!variant) return;

      variant.sku.length === 0
        ? this.setAttribute("hidden", "")
        : this.removeAttribute("hidden");
      this.textContent = variant.sku;
    });
  }
}

customElements.define("product-sku", ProductSku);
