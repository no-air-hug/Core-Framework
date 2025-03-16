import { debounce, get, throttle } from "../../utils";

export class Header {
  elNav: HTMLElement;
  elPromoBar: HTMLElement | null;
  elHeaderGroup: HTMLElement;

  headerHeight: number;
  promoBarHeight: number;
  headerGroupHeight: number;

  constructor(public elHeader: HTMLElement) {
    // Mainstay Elements
    this.elHeaderGroup = get(".js-header-group") as HTMLElement;
    this.elNav = get(".js-mobile-navigation", elHeader) as HTMLElement;

    // Optional Elements
    this.elPromoBar = get(".js-promo-bar");

    /* Data */
    this.headerHeight = this.elHeader.clientHeight;
    this.promoBarHeight = this.elPromoBar ? this.elPromoBar.clientHeight : 0;
    this.headerGroupHeight = this.elHeaderGroup.clientHeight;

    /**
     * Info:
     * --header-group-height: The height of the 'Header Group', all
     *   of the sections in the header group, does not include offset.
     * --header-height: The height of the 'Header' section.
     * --header-offset: 0px; The offset of the header, based on the height of the promo bar.
     *   On scroll, the promo bar is hidden by translating the header group up on the Y-axis, this
     *   value is set when the promo bar is hidden.
     */

    this.setVariables();
  }

  /**
   * Set global variables on document - these are always available, regardless of
   * promo bars presence so they can always be utilised in CSS docs.
   */
  setVariables() {
    this.setHeaderHeightVariable();
    this.setPromoBarHeightVariable();
    this.setHeaderOffset();

    // Set this last, when all of the internal section variables have been figured out...
    this.setHeaderGroupHeightVariable();
  }

  /**
   * Sets a variable with a height on the document, variableName
   * provides the name of the variable, and element provides the element
   * to retrieve the height from.
   *
   * @param element
   * @param variableName
   */
  getSetHeight(elementHeightVariable: number, variableName: string) {
    document.documentElement.style.setProperty(
      `--${variableName}`,
      `${elementHeightVariable}px`,
    );
  }

  /* Sets global header group height variable */
  setHeaderGroupHeightVariable = () => {
    this.getSetHeight(this.headerGroupHeight, "header-group-height");

    window.addEventListener(
      "resize",
      debounce(() => {
        this.headerGroupHeight = this.elHeaderGroup.clientHeight;
        this.getSetHeight(this.headerGroupHeight, "header-group-height");
      }, 250),
    );
  };

  /* Sets global header height variable */
  setHeaderHeightVariable = () => {
    this.getSetHeight(this.headerHeight, "header-height");

    window.addEventListener(
      "resize",
      debounce(() => {
        this.headerHeight = this.elHeader.clientHeight;
        this.getSetHeight(this.headerHeight, "header-height");
      }, 250),
    );
  };

  /**
   * Sets global header height variable
   *
   * @returns
   */
  setPromoBarHeightVariable = () => {
    if (!this.elPromoBar) return;

    this.getSetHeight(this.promoBarHeight, "promo-bar-height");

    window.addEventListener(
      "resize",
      debounce(() => {
        this.promoBarHeight = this.elPromoBar
          ? this.elPromoBar.clientHeight
          : 0;
        this.getSetHeight(this.promoBarHeight, "promo-bar-height");
      }, 250),
    );
  };

  /**
   * Creates the header-offset variable on the document element, which is based off of the promoBarEl's height, if
   * no promoBarEl is available then this offset will always be set to 0px.
   */
  setHeaderOffset() {
    let state = "visible";

    const offset = this.elHeader.clientHeight * 2;

    document.documentElement.style.setProperty("--header-offset", "0px");

    if (this.elPromoBar) {
      const onScroll = throttle(() => {
        if (scrollY > offset) {
          if (state == "hidden") return;

          // Determine if the promo bar is above or below the header.
          const headerGroupNodes = this.elHeaderGroup.childNodes;
          const targetNodeIndex = [...headerGroupNodes].indexOf(
            this.elPromoBar as HTMLElement,
          );
          const elHeaderIndex = [...headerGroupNodes].indexOf(this.elHeader);
          const promoBarPosition =
            targetNodeIndex < elHeaderIndex ? "Above" : "Below";

          if (promoBarPosition === "Above") {
            document.documentElement.style.setProperty(
              "--header-offset",
              `-${this.promoBarHeight}px`,
            );
          } else {
            document.documentElement.style.setProperty(
              "--header-offset",
              "0px",
            );
          }
        } else {
          if (state == "visible") return;
          document.documentElement.style.setProperty("--header-offset", "0px");
        }

        state = scrollY > offset ? "hidden" : "visible";
      }, 16);

      window.addEventListener("scroll", onScroll);
    }
  }
}
