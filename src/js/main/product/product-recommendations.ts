export class ProductRecommendations extends HTMLElement {
  loaded = false;

  connectedCallback() {
    if (this.loaded) return;
    this.loaded = true;

    fetch(this.dataset.url)
      .then((response) => response.text())
      .then((text) => {
        const html = new DOMParser().parseFromString(text, "text/html");
        const recommendations = html.querySelector("product-recommendations");

        if (recommendations && recommendations.innerHTML.trim().length > 0) {
          this.innerHTML = recommendations.innerHTML;

          this.dispatchEvent(
            new CustomEvent("ProductRecommendations:Loaded", {
              bubbles: true,
            }),
          );

          // @ts-expect-error TODO
          this.closest("embla-slider")?.reload();

          window.yotpoWidgetsContainer?.initWidgets();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

customElements.define("product-recommendations", ProductRecommendations);
