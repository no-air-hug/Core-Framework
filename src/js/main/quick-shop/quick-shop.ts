import { get } from "../../utils";

export class QuickShop {
  element: HTMLElement;
  modal: HTMLDialogElement;
  content: HTMLElement;
  currentView: string;

  constructor(element: HTMLElement) {
    this.element = element;
    this.modal = get(".js-quickshop-modal") as HTMLDialogElement;
    this.content = get(".js-quickshop-content") as HTMLElement;
    this.currentView = "";

    // Generates a element when the user checks the 'test mode' setting in the customiser.
    if (Object.hasOwn(this.element.dataset, "testing")) {
      this.renderProductHTML(
        this.element.dataset.testProductUrl as string,
        this.element.dataset.testVariantId as string,
      );
    }

    this.bindListener();
  }

  bindListener() {
    this.triggerListener();
  }

  triggerListener() {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLButtonElement;
      const { productHandle } = target.dataset;
      const { variantId } = target.dataset;

      const dialogSelector = target.getAttribute("dialog-selector");

      if (
        dialogSelector !== "#ModalQuickshop" ||
        this.currentView === variantId
      )
        return;

      this.renderProductHTML(productHandle as string, variantId as string);
    });
  }

  renderProductHTML(productUrl: string, variantId: string) {
    const productURLAjax = new URL(productUrl, location.origin);
    productURLAjax.searchParams.set("view", "ajax-quickshop");
    productURLAjax.searchParams.set("variant", variantId);

    // Trigger Dialog Load State
    const dialog = window.Shopify.theme.dialogs.find(
      (d) => d.id === "ModalQuickshop",
    );
    this.content.innerHTML = "";
    dialog.loading();

    fetch(productURLAjax.toString())
      .then((response) => response.text())
      .then((data) => {
        const parsedHTML = new DOMParser().parseFromString(data, "text/html");
        const parsedQuickshopElement = get(
          ".shopify-section--product-quickshop",
          parsedHTML,
        ) as HTMLElement;

        this.content.append(parsedQuickshopElement);
        this.currentView = variantId;
      })
      .finally(() =>
        setTimeout(() => {
          dialog.loading();
        }, 300),
      )
      .catch((error) => dialog.showError(error));
  }
}
