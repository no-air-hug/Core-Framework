import A11yDialog from "a11y-dialog";

import { attachEvent, get, getAll, lock, release } from "../../utils";

// Monkeypatch `hide` method
// eslint-disable-next-line @typescript-eslint/unbound-method
const originalHide = A11yDialog.prototype.hide;
A11yDialog.prototype.hide = function (): A11yDialog {
  // @ts-expect-error - private method being accessed outside of A11yDialog
  const $el = this.$el as HTMLElement;
  $el.classList.remove("no-animation");

  const removeEvent = attachEvent(
    "animationend",
    $el,
    () => {
      originalHide.call(this);
      $el.classList.remove("is-hiding");
      document.body.dispatchEvent(new CustomEvent("Dialog:Hiding"));
      clearTimeout(timeout);
    },
    { once: true },
  );

  const timeout = window.setTimeout(() => {
    removeEvent();
    originalHide.call(this);
    $el.classList.remove("is-hiding");
  }, 200);

  $el.classList.add("is-hiding");
  return this;
};

export interface DialogEventData {
  bubbles: boolean;
  detail: {
    dialogInstance: Dialog;
    dialogSelector: string;
  };
}

export type DialogElement = typeof Dialog;

export class Dialog extends HTMLElement {
  dialog?: A11yDialog;
  header?: HTMLElement;
  footer?: HTMLElement;
  loader?: HTMLElement;
  eventContent: DialogEventData;

  get testing() {
    return Object.hasOwn(this.dataset, "testing");
  }

  get shopper() {
    return Object.hasOwn(this.dataset, "shopper");
  }

  override get role() {
    return this.getAttribute("role");
  }

  get modalMode() {
    return this.getAttribute("modal-style");
  }

  get elDocument() {
    return get("[role=document]", this) as HTMLElement;
  }

  get elMain() {
    return get("[data-dialog-element=main]", this) as HTMLElement;
  }

  constructor() {
    super();

    this.dialog = new A11yDialog(this);
    this.header = get("[data-dialog-element=header]", this) as HTMLElement;
    this.footer = get("[data-dialog-element=footer]", this) as HTMLElement;
    this.loader = get("[data-dialog-element=loader]", this) as HTMLElement;

    if (typeof window.Shopify.theme.dialogs !== "object")
      window.Shopify.theme.dialogs = [];
    window.Shopify.theme.dialogs.push(this);

    this.eventContent = {
      bubbles: true,
      detail: {
        dialogInstance: this as Dialog,
        dialogSelector: String(this.id),
      },
    };

    this.dialog
      .on("show", () => {
        this.setAttribute("aria-hidden", "false");
        lock(this.elMain).catch((error: unknown) => {
          console.error(error);
        });

        document.body.dispatchEvent(
          new CustomEvent("Dialog:Show", this.eventContent),
        );
      })
      .on("hide", () => {
        this.setAttribute("aria-hidden", "true");
        release(this.elMain, true).catch((error: unknown) => {
          console.error(error);
        });

        document.body.dispatchEvent(
          new CustomEvent("Dialog:Hide", this.eventContent),
        );
      });

    this.setAttribute("aria-hidden", "true");
    this.removeAttribute("hidden");

    this.setupListeners();
    this.initResizeObservers();
  }

  private initResizeObservers() {
    if (this.header) {
      const headerResizeObserver = new ResizeObserver(() => {
        this.setHeaderHeight();
      });
      headerResizeObserver.observe(this.header);
    }

    if (this.footer) {
      const footerResizeObserver = new ResizeObserver(() => {
        this.setFooterHeight();
      });
      footerResizeObserver.observe(this.footer);
    }

    // Initial setup
    this.setHeaderHeight();
    this.setFooterHeight();
  }

  private setHeaderHeight() {
    this.style.setProperty(
      "--dialog-drawer-header-height",
      `${this.header?.clientHeight ?? 0}px`,
    );
  }

  private setFooterHeight() {
    this.style.setProperty(
      "--dialog-drawer-footer-height",
      `${this.footer?.clientHeight ?? 0}px`,
    );
  }

  loading() {
    if (!this.loader) return;

    this.loader.classList.toggle("opacity-0");
  }

  show(animate: boolean = true) {
    if (!animate) this.classList.add("no-animation");
    this.classList.remove("has-error");
    this.dialog?.show();

    (
      (get("[autofocus], button, input", this) ?? get("button", this)) as
        | HTMLButtonElement
        | HTMLInputElement
        | undefined
    )?.focus();

    return false;
  }

  showError(err: Error) {
    this.loading();

    this.classList.add("has-error");
    this.elDocument.innerHTML = String(err);
  }

  hide() {
    this.dialog?.hide();
  }

  toggle() {
    if (this.dialog?.shown) {
      this.hide();
    } else {
      this.show();
    }

    return false;
  }

  getElements() {
    this.header = get("[data-dialog-element=header]", this) as HTMLElement;
    this.footer = get("[data-dialog-element=footer]", this) as HTMLElement;
    this.loader = get("[data-dialog-element=loader]", this) as HTMLElement;

    this.initResizeObservers();
  }

  setupListeners() {
    const elOpeners = getAll(`[data-dialog-show="${this.id}"`);
    for (const elOpener of elOpeners) {
      attachEvent("click", elOpener, () => this.show());
    }

    // Testing State
    if (this.testing) {
      this.show();
      console.warn(
        `${this.id} is in a test state and is displaying on load. This can be changed in the section settings!`,
      );
    }

    //Shopper menu view
    if (this.shopper) this.show();

    // On Load Dialog Display
    const urlParams = new URLSearchParams(window.location.search);
    const dialogParam = urlParams.get("dialog");
    if (dialogParam === this.id) {
      this.show();
    }

    // Dialog Loaded Event
    document.body.dispatchEvent(
      new CustomEvent("Dialog:Loaded", this.eventContent),
    );

    // Close All Dialogs
    document.body.addEventListener(`Dialog:Close:${this.id}`, () => {
      this.hide();
    });
  }
}

customElements.define("dialog-element", Dialog);

customElements.define(
  "dialog-trigger",
  class DialogTrigger extends HTMLButtonElement {
    constructor() {
      super();
      this.type = "button";

      this.addEventListener("click", () => {
        const selector = this.getAttribute("dialog-selector");

        const dialog = selector
          ? (get(selector) as Dialog | null)
          : (this.closest(".dialog") as Dialog);

        if (!dialog) {
          console.error(
            "No dialog found. You may need to ensure that the dialog section is loaded in the customiser.",
          );
          return;
        }

        dialog.toggle();
      });
    }
  },
  { extends: "button" },
);
