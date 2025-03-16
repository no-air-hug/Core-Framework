import { rIC } from "../../utils";

function productController() {
  import("./remove-button");
  import("./quantity-input");
  import("./product-form");
  import("./product-sku");
  import("./product-inventory");
  import("./variant-options");
  import("./product-recommendations");
  import("./pick-up");
}

const index = () => rIC(productController);
export default index;
