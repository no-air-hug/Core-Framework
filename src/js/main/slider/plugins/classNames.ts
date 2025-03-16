import EmblaCarousel, {
  type EmblaCarouselType,
  type EmblaEventType,
} from "embla-carousel";

import type { CreateOptionsType } from "embla-carousel/components/Options";
import type { CreatePluginType } from "embla-carousel/components/Plugins";

type OptionsType = CreateOptionsType<{
  selected: string;
  draggable: string;
  dragging: string;
}>;

const defaultOptions: OptionsType = {
  active: true,
  breakpoints: {},
  selected: "is-selected",
  draggable: "is-draggable",
  dragging: "is-dragging",
};

type ClassNamesOptionsType = Partial<OptionsType>;

declare module "embla-carousel/components/Plugins" {
  interface EmblaPluginsType {
    classNames?: ClassNamesType;
  }
}

type ClassNamesType = CreatePluginType<Record<string, unknown>, OptionsType>;

function removeClass(node: HTMLElement, className: string): void {
  const cl = node.classList;
  if (className && cl.contains(className)) cl.remove(className);
}

function addClass(node: HTMLElement, className: string): void {
  const cl = node.classList;
  if (className && !cl.contains(className)) cl.add(className);
}

function ClassNames(userOptions?: ClassNamesOptionsType): ClassNamesType {
  const optionsHandler = EmblaCarousel.optionsHandler();
  const optionsBase = optionsHandler.merge(
    defaultOptions,
    ClassNames.globalOptions
  );
  let options: ClassNamesType["options"];
  let carousel: EmblaCarouselType;

  let root: HTMLElement;
  let slides: HTMLElement[];
  const selectedEvents: EmblaEventType[] = ["select", "pointerUp"];
  const draggingEvents: EmblaEventType[] = ["pointerDown", "pointerUp"];

  function init(embla: EmblaCarouselType): void {
    carousel = embla;
    options = optionsHandler.atMedia(self.options);
    root = carousel.rootNode();
    slides = carousel.slideNodes();
    const isDraggable = carousel.internalEngine().options.draggable;

    if (isDraggable) {
      addClass(root, options.draggable);
    }
    if (options.dragging) {
      for (const evt of draggingEvents) carousel.on(evt, toggleDraggingClass);
    }
    if (options.selected) {
      for (const evt of selectedEvents) carousel.on(evt, toggleSelectedClass);
      toggleSelectedClass();
    }
  }

  function destroy(): void {
    removeClass(root, options.draggable);
    for (const evt of draggingEvents) carousel.off(evt, toggleDraggingClass);
    for (const evt of selectedEvents) carousel.off(evt, toggleSelectedClass);
    for (const slide of slides) removeClass(slide, options.selected);
  }

  function toggleDraggingClass(evt: EmblaEventType): void {
    if (evt === "pointerDown") addClass(root, options.dragging);
    else removeClass(root, options.dragging);
  }

  function toggleSelectedClass(): void {
    const inView = carousel.slidesInView(true);
    const notInView = carousel.slidesNotInView(true);
    for (const index of notInView) removeClass(slides[index], options.selected);
    for (const index of inView) addClass(slides[index], options.selected);
  }

  const self: ClassNamesType = {
    name: "classNames",
    options: optionsHandler.merge(optionsBase, userOptions),
    init,
    destroy,
  };
  return self;
}

ClassNames.globalOptions = undefined as ClassNamesOptionsType | undefined;

export default ClassNames;
