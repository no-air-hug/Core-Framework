import { get } from "../../utils";

export class ProductInventory extends HTMLElement {
  connectedCallback() {
    document.body.addEventListener("Variant:Changed", (e) => {
      const { variant } = e.detail;
      const { handle, section } = this.dataset;
      if (!variant || !handle) return;

      const contentEl = get(".js-inventory-content", this) as HTMLElement;
      const loader = get(".js-inventory-loader", this) as HTMLElement;
      contentEl.classList.add("opacity-0");

      fetch(`/products/${handle}?variant=${variant.id}&section_id=${section}`)
        .then((res) => res.text())
        .then((data) => {
          const html = new DOMParser().parseFromString(data, "text/html");
          const newContentEl = get(
            "product-inventory .js-inventory-content",
            html,
          ) as HTMLElement;

          contentEl.innerHTML = newContentEl.innerHTML;
        })
        .finally(() => { contentEl.classList.remove("opacity-0"); })
        .catch((error) => (contentEl.innerHTML = error));
    });
  }
}

customElements.define("product-inventory", ProductInventory);
