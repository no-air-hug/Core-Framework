import { get, rIC } from "../../utils";

async function load(element: HTMLElement | null) {
  if (!element) return;
  const { Pagination } = await import("./pagination");
  new Pagination(element);
}

function paginationController() {
  const elPagination = get(".js-pagination");
  load(elPagination).catch((error: unknown) => {
    console.error(error);
  });
}

const index = () => rIC(paginationController);
export default index;
