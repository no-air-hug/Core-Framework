import { type DialogElement } from "./dialog";

export function register(BaseDialog: DialogElement) {
  class DrawerPickup extends BaseDialog {}

  customElements.define("drawer-pickup", DrawerPickup);
}
