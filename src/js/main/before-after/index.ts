import { getAll, rIC } from "../../utils";

async function load(elements: HTMLElement[]) {
  const { default: BeforeAfter } = await import("./before-after");
  for (const el of elements) new BeforeAfter(el);
}

function beforeAfterController() {
  const elBeforeAfter = getAll(".js-before-after");
  if (elBeforeAfter.length > 0) {
    load(elBeforeAfter).catch((error: unknown) => {
      console.error(error);
    });
  }
}

const index = () => rIC(beforeAfterController);
export default index;
