import { debounce, get, getAll, lock, release } from "../../utils";
import { type DialogElement, type DialogEventData } from "./dialog";

export function register(BaseDialog: DialogElement) {
  class DrawerNavigation extends BaseDialog {
    element: this | HTMLElement;

    elDialogMain: HTMLElement;
    elCurrentHeader: HTMLElement;
    elPrevButton: HTMLElement;
    elSubmenus: HTMLElement[];
    elNavList: HTMLElement;
    elNavOpen: HTMLButtonElement;
    elNavClose: HTMLElement[];
    elMarketsTrigger: HTMLElement;

    constructor() {
      super();

      this.element = this;

      this.elDialogMain = get(
        "[data-dialog-element=main]",
        this.element,
      ) as HTMLElement;
      this.elCurrentHeader = get(
        ".js-nav-current",
        this.element,
      ) as HTMLElement;
      this.elPrevButton = get(".js-nav-prev", this.element) as HTMLElement;
      this.elSubmenus = getAll(".js-nav-submenu", this.element);
      this.elNavList = get(".js-nav-list", this.element) as HTMLElement;
      this.elNavOpen = get(".js-nav-open") as HTMLButtonElement;
      this.elNavClose = getAll("[data-a11y-dialog-hide]", this.element);
      this.elMarketsTrigger = get(
        ".js-nav-markets-trigger",
        this.element,
      ) as HTMLElement;

      this.bindEvents();
    }

    bindEvents() {
      this.elNavOpen.addEventListener("click", () => {
        this.toggleMobileNavigation(this.elNavList);
      });

      document.body.addEventListener("Dialog:Hide", (e) => {
        const { detail } = e as DialogEventData;

        if (detail.dialogSelector === "DrawerNavigation") {
          this.toggleMobileNavigation(this.elNavList);
          this.closeSubmenus(this.elSubmenus);
          this.onSubmenuClose();
        }
      });

      this.elPrevButton.addEventListener("click", () => {
        this.closeSubmenus(this.elSubmenus);
        this.onSubmenuClose();
      });

      for (const elSubmenu of this.elSubmenus) {
        const elSubmenuTrigger = get(".js-nav-submenu-open", elSubmenu);

        elSubmenuTrigger?.addEventListener("click", () => {
          this.toggleSubmenu(elSubmenu);
          this.onSubmenuOpen(elSubmenuTrigger.textContent);
        });
      }

      if (this.elNavList)
        this.handleNavListScroll(this.elNavList, this.element);

      if (this.elMarketsTrigger) {
        this.elMarketsTrigger.addEventListener("click", () => {
          document.body.dispatchEvent(
            new CustomEvent("Dialog:Close:DrawerNavigation", {
              bubbles: true,
            }),
          );
        });
      }
    }

    onSubmenuOpen(text: string | null) {
      this.elPrevButton.removeAttribute("aria-hidden");
      if (this.elCurrentHeader) {
        this.elCurrentHeader.setAttribute("aria-hidden", "false");
        this.elCurrentHeader.textContent = text;
      }
    }

    onSubmenuClose() {
      this.elPrevButton.setAttribute("aria-hidden", "true");
      if (this.elCurrentHeader) {
        this.elCurrentHeader.setAttribute("aria-hidden", "true");
        this.elCurrentHeader.textContent = "";
      }
    }

    toggleMobileNavigation(elNavList: HTMLElement) {
      const isOpen = document.body.classList.toggle("is-mobile-nav-open");

      if (isOpen) {
        lock(elNavList);
      } else {
        release(elNavList, true);
      }
    }

    closeSubmenus(elSubmenus: HTMLElement[]) {
      for (const el of elSubmenus) {
        el.classList.remove("has-nav-open");
      }
    }

    toggleSubmenu(el: HTMLElement) {
      const isOpen = el.classList.toggle("has-nav-open");
      const elSubmenu = get(".js-submenu", el);
      if (elSubmenu) {
        if (isOpen) lock(elSubmenu);
        else release(elSubmenu);
      }
    }

    handleNavListScroll(elNavList: HTMLElement, elNav: HTMLElement) {
      const onScroll = debounce(() => {
        elNav.style.setProperty("--nav-offset", `${elNavList.scrollTop}px`);
      }, 64);
      elNavList.addEventListener("scroll", onScroll);
    }
  }

  customElements.define("drawer-navigation", DrawerNavigation);
}
