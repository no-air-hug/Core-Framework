import { rIC } from "../../utils";

function deliveryCountdownController() {
  import("./delivery-countdown");
}

const index = () => rIC(deliveryCountdownController);
export default index;
