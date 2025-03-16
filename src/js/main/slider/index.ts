import { get, rIC } from "../../utils";

function sliderController() {
  if (get("embla-slider") || get(".js-quickshop-modal")) {
    import(/* webpackChunkName: "slider" */ "./slider");
  }
}

const index = () => rIC(sliderController);
export default index;
