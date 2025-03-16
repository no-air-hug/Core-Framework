import { get, getAll, rIC } from "../../utils";

function tooltipController() {
  if (get("product-tooltip")) {
    import("./tooltip");
  }

  if (matchMedia("(hover: hover)").matches) {
    const elTooltips = getAll(".js-tooltip");
    if (elTooltips.length > 0) {
      import("./tooltip")
        .then(({ BasicTooltip }) => {
          for (const el of elTooltips) new BasicTooltip(el);
        })
        .catch((error: unknown) => {
          console.error(error);
        });
    }
  }
}

const index = () => rIC(tooltipController);
export default index;
