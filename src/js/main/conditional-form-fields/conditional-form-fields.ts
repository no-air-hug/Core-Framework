import { get } from "../../utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = object> = new (...args: any[]) => T;

const ConditionalMixin = <
  T extends Constructor<HTMLElement & { disabled?: boolean }>,
>(
  Base: T,
) =>
  class ConditionalFormField extends Base {
    connectedCallback() {
      const formEl = this.closest("form") as HTMLElement;
      const inputObjectEl = this.closest(".o-input") as HTMLElement;

      const { dependency } = this.dataset;
      const property = dependency?.split(":")[0]?.toLowerCase();
      const index = Number(dependency?.split(":")[1]);

      const dependencyEl = get(`[name="contact[${property}]"]`, formEl) as
        | HTMLSelectElement
        | undefined;

      if (!dependencyEl) {
        inputObjectEl.removeAttribute("hidden");
        inputObjectEl.classList.add("text-validation-error", "max-w-lg");
        inputObjectEl.innerHTML =
          "The 'Dynamic Display' settings for this block are invalid, no Field (Custom Select) block with a matching type and index were found. Either remove the value for 'Dynamic Display on this block, or correct the setting.";
        return;
      }

      const setVisibilityBasedOnDependencySelection = () => {
        // Index is a theme setting that starts counting from 1, rather than 0.
        if (dependencyEl.selectedIndex === index - 1) {
          inputObjectEl.removeAttribute("hidden");
          (this as HTMLElement & { disabled: boolean }).disabled = false;
        } else {
          inputObjectEl.setAttribute("hidden", "");
          (this as HTMLElement & { disabled: boolean }).disabled = true;
        }
      };

      setVisibilityBasedOnDependencySelection();
      dependencyEl.addEventListener(
        "change",
        setVisibilityBasedOnDependencySelection,
      );
    }
  };

// Extend HTMLInputElement with the ConditionalMixin
class ConditionalInput extends ConditionalMixin(HTMLInputElement) {}
class ConditionalSelect extends ConditionalMixin(HTMLSelectElement) {}
class ConditionalTextArea extends ConditionalMixin(HTMLTextAreaElement) {}

// Define custom elements
customElements.define("conditional-input", ConditionalInput, {
  extends: "input",
});
customElements.define("conditional-select", ConditionalSelect, {
  extends: "select",
});
customElements.define("conditional-textarea", ConditionalTextArea, {
  extends: "textarea",
});
