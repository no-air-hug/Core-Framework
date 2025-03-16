import { type DialogElement } from "./dialog";

export function register(BaseDialog: DialogElement) {
  class DrawerFacets extends BaseDialog {}

  customElements.define("drawer-facets", DrawerFacets);
}
