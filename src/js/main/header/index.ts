import { get, rIC } from "../../utils";

async function load(element: HTMLElement | null) {
  if (!element) return;

  const { Header } = await import("./header");
  new Header(element);
}

function headerController() {
  const elHeader = get(".js-header");
  load(elHeader).catch((error: unknown) => {
    console.error(error);
  });
}

const index = () => rIC(headerController);
export default index;
