import { get, rIC } from "../../utils";

async function load(element: HTMLElement | null) {
  if (!element) return;

  const { Facets } = await import("./facets");
  import("./price-range");
  new Facets();
}

function facetsController() {
  const elFacets = get(".js-facets");

  load(elFacets).catch((error: unknown) => {
    console.error(error);
  });
}

const index = () => rIC(facetsController);
export default index;
