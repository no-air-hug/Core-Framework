import { get } from "../../utils";

export default class Truncate {
  element: HTMLElement;
  trigger!: HTMLElement;
  trunText!: HTMLElement;
  fullText!: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;

    this.trigger = get(".js-truncate-trigger", element) as HTMLElement;
    this.trunText = get(".js-truncate-trun-text", element) as HTMLElement;
    this.fullText = get(".js-truncate-full-text", element) as HTMLElement;

    if (this.trigger && this.trunText && this.fullText) this.bindEvents();
  }

  bindEvents() {
    this.handleTruncate();
  }

  handleTruncate() {
    this.trigger.addEventListener("click", () => {
      this.trigger.innerText = this.trunText.classList.contains("!hidden") ? `${this.trigger.dataset.triggerMoreText}` : `${this.trigger.dataset.triggerLessText}`;

      this.trunText.classList.toggle("!hidden");
      this.fullText.classList.toggle("!hidden");
    });
  }
}
