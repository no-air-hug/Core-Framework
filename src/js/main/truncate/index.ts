import { getAll, rIC } from "../../utils";

async function load(elements: HTMLElement[]) {
  if (elements.length === 0) return;
  const { default: Truncate } = await import("./truncate");
  for (const el of elements) new Truncate(el);
}

function readMoreController() {
  const elTruncates = getAll(".js-truncate");
  load(elTruncates).catch((error: unknown) => {
    console.error(error);
  });
}

const index = () => rIC(readMoreController);
export default index;
