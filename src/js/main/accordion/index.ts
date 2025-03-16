import { getAll, rIC } from "../../utils";

async function load(elements: HTMLElement[]) {
  const { default: Accordion } = await import("./accordion");
  for (const el of elements) new Accordion(el);
}

function accordionController() {
  const elAccordion = getAll(".js-accordion");
  if (elAccordion.length > 0) {
    load(elAccordion).catch((error: unknown) => {
      console.error(error);
    });
  }
}

const index = () => rIC(accordionController);
export default index;
