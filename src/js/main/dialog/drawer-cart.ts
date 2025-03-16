import { get, getAll, rIC } from "../../utils";
import { type DialogElement } from "./dialog";

export async function register(BaseDialog: DialogElement) {
  class DrawerCart extends BaseDialog {
    drawerCartSection = this.closest("drawer-cart") as HTMLElement;

    connectedCallback() {
      this.prepareComponents();
    }

    prepareComponents() {
      this.getElements();

      const productRecommendations = get("product-recommendations", this);
      productRecommendations?.addEventListener(
        "ProductRecommendations:Loaded",
        () => {
          this.getElements();
        },
        {
          once: true,
        },
      );
    }

    renderContents(parsedState: Record<string, any>) {
      for (const section of this.getSectionsToRender()) {
        const selector = section.selector ? section.selector : section.id;

        const sectionElements = getAll(selector).filter(
          Boolean,
        ) as HTMLElement[];
        if (!sectionElements && sectionElements.length > 0) continue;

        const newHTML = this.getSectionInnerHTML(
          parsedState.sections[section.section],
          selector,
        );
        if (!newHTML) continue;

        for (const sectionElement of sectionElements) {
          sectionElement.outerHTML = newHTML;
        }
      }

      this.prepareComponents();

      rIC(() => this.show());
    }

    getSectionInnerHTML(html: string, selector = ".shopify-section") {
      return (
        new DOMParser()
          .parseFromString(html, "text/html")
          .querySelector(selector)?.outerHTML ?? ""
      );
    }

    getSectionsToRender() {
      return [
        {
          selector: "#DrawerCart .js-delivery-progress",
          section: this.drawerCartSection.dataset.id as string,
        },
        {
          selector: "#DrawerCart [data-dialog-element=main]",
          section: this.drawerCartSection.dataset.id as string,
        },
        {
          selector: "#DrawerCart [data-dialog-element=footer]",
          section: this.drawerCartSection.dataset.id as string,
        },
        {
          selector: ".js-cart-item-count",
          section: "cart-item-count",
        },
      ];
    }
  }

  customElements.define("drawer-cart", DrawerCart);

  const { CartItems } = await import("../product/cart-items");
  class DrawerCartItems extends CartItems {
    getSectionsToRender() {
      const drawerCartSection = this.closest("drawer-cart") as HTMLElement;

      return [
        {
          selector: "#DrawerCart .js-delivery-progress",
          section: drawerCartSection.dataset.id as string,
        },
        {
          selector: "#DrawerCart [data-dialog-element=main]",
          section: drawerCartSection.dataset.id as string,
        },
        {
          selector: "#DrawerCart [data-dialog-element=footer]",
          section: drawerCartSection.dataset.id as string,
        },
        {
          selector: ".js-cart-item-count",
          section: "cart-item-count",
        },
      ];
    }
  }

  customElements.define("drawer-cart-items", DrawerCartItems);
}
