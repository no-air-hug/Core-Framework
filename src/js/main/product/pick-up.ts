import { get } from "../../utils";

export class PickupAvailability extends HTMLElement {
  errorTemplate: HTMLTemplateElement | null;
  errorHtml!: HTMLElement;

  constructor() {
    super();

    this.errorTemplate = this.querySelector("template");

    if (!this.errorTemplate || !this.hasAttribute("available")) return;

    this.errorHtml = this.errorTemplate.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;

    this.onClickRefreshList = this.onClickRefreshList.bind(this);

    this.fetchAvailability(String(this.dataset.variantId));
    const section = this.closest("section") as HTMLElement;
    section.addEventListener("Variant:Changed", (e) => {
      this.dataset.variantId = e.detail.id;
      this.fetchAvailability(e.detail.id);
    });
  }

  fetchAvailability(variantId: string) {
    let rootUrl = window.Shopify.routes.root;
    if (!rootUrl.endsWith("/")) rootUrl = rootUrl + "/";

    const variantSectionUrl = `${rootUrl}variants/${variantId}/?section_id=pickup-availability`;

    fetch(variantSectionUrl)
      .then((response) => response.text())
      .then((text) => {
        const pickupSectionEl = new DOMParser()
          .parseFromString(text, "text/html")
          .querySelector(".shopify-section") as HTMLElement;
        this.renderPreview(pickupSectionEl);
      })
      .catch((error) => {
        const button = this.querySelector("button");
        if (button)
          button.removeEventListener("click", this.onClickRefreshList);
        this.renderError(error);
      });
  }

  onClickRefreshList() {
    this.fetchAvailability(String(this.dataset.variantId));
  }

  renderError(alternateError?: string) {
    if (alternateError) {
      const textEl = document.createElement("p");
      textEl.classList.add("text-validation-error", "text-sm");
      textEl.textContent = alternateError;
      this.append(textEl);
    } else {
      this.append(this.errorHtml);
    }

    this.querySelector("button")?.addEventListener(
      "click",
      this.onClickRefreshList,
    );
  }

  renderPreview(pickupSectionEl: HTMLElement) {
    if (!pickupSectionEl.querySelector(".js-availability-preview")) {
      this.innerHTML = "" as string;
      this.removeAttribute("available");
      return;
    }

    this.innerHTML = get(".js-availability-preview", pickupSectionEl)
      ?.outerHTML as string;
    this.setAttribute("available", "");

    const drawer = get(
      "#DrawerPickup [data-dialog-element=main]",
    ) as HTMLElement;
    const newDrawerContent = get(
      ".js-availability-drawer-content",
      pickupSectionEl,
    ) as HTMLElement;
    drawer.innerHTML = newDrawerContent.outerHTML;
  }
}

customElements.define("pickup-availability", PickupAvailability);
