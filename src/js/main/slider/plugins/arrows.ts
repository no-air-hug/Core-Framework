import EmblaCarousel, { type EmblaCarouselType } from "embla-carousel";

import type { CreateOptionsType } from "embla-carousel/components/Options";
import type { CreatePluginType } from "embla-carousel/components/Plugins";

import "./arrows.scss";

type OptionsType = CreateOptionsType<Record<string, unknown>>;

type ArrowsType = CreatePluginType<Record<string, unknown>, OptionsType>;
type ArrowsOptionsType = Partial<OptionsType>;

const defaultOptions: OptionsType = {
  active: true,
  breakpoints: {},
};

function createArrows() {
  const elArrowLeft = document.createElement("button");
  elArrowLeft.type = "button";
  elArrowLeft.className = "slider-arrows__item slider-arrows__item--prev";
  elArrowLeft.ariaLabel = "Previous slide";
  elArrowLeft.insertAdjacentHTML(
    "afterbegin",
    `
    <svg role="presentation" xmlns="http://www.w3.org/2000/svg" fill="var(--arrow-color, currentcolor)" viewBox="0 0 24 24" width="32" height="32">
      <path d="M15.48 5.33 8 12l7.48 6.67L17.33 17 11.71 12l5.62-5.01-1.85-1.66Z"/>
    </svg>`
  );
  const elArrowRight = document.createElement("button");
  elArrowRight.type = "button";
  elArrowRight.className = "slider-arrows__item slider-arrows__item--next";
  elArrowRight.ariaLabel = "Next slide";
  elArrowRight.insertAdjacentHTML(
    "afterbegin",
    `
    <svg role="presentation" xmlns="http://www.w3.org/2000/svg" fill="var(--arrow-color, currentcolor)" viewBox="0 0 24 24" width="32" height="32">
      <path d="M9.85 18.67 17.33 12 9.85 5.33 8 7 13.63 12 8 17.01l1.85 1.66Z"/>
    </svg>`
  );

  return [elArrowLeft, elArrowRight];
}

export function Arrows(userOptions?: ArrowsOptionsType): ArrowsType {
  const optionsHandler = EmblaCarousel.optionsHandler();
  const optionsBase = optionsHandler.merge(
    defaultOptions,
    Arrows.globalOptions
  );

  let slider: EmblaCarouselType;
  let root: HTMLElement;
  let elArrowsContainer: HTMLElement;
  let elArrowLeft: HTMLButtonElement;
  let elArrowRight: HTMLButtonElement;

  function init(embla: EmblaCarouselType): void {
    slider = embla;
    root = slider.rootNode();

    [elArrowLeft, elArrowRight] = createArrows();

    elArrowLeft.addEventListener('click', () => { slider.scrollPrev(); });

    elArrowRight.addEventListener('click', () => {
      if (slider.scrollSnapList()[slider.selectedScrollSnap()] !== 1)
        slider.scrollNext();
    });

    elArrowsContainer = document.createElement("div");
    elArrowsContainer.className = "slider-arrows";
    elArrowsContainer.append(elArrowLeft, elArrowRight);

    toggleArrows();
    slider.on("resize", () => {
      toggleArrows();
    });

    // Append arrows
    let elContainer = root.parentElement as HTMLElement;
    const elSectionHeader = root
      .closest(".shopify-section")
      ?.querySelector(".section-header") as HTMLElement;

    if (elSectionHeader) {
      elContainer = elSectionHeader;
      elSectionHeader.classList.add("section-header--has-arrows");
    }

    if (elContainer) elContainer.append(elArrowsContainer);
  }

  function destroy(): void {
    elArrowsContainer.remove();
  }

  function toggleArrows() {
    if (!slider.canScrollNext() && !slider.canScrollPrev()) {
      elArrowsContainer.classList.add("invisible");
    } else {
      elArrowsContainer.classList.remove("invisible");
    }
  }

  return {
    name: "arrows",
    options: optionsHandler.merge(optionsBase, userOptions),
    init,
    destroy,
  };
}

Arrows.globalOptions = undefined as ArrowsOptionsType | undefined;
