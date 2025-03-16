import { get, rIC } from "../../utils";

function shopTheLookController() {
  if (get("shop-the-look")) {
    import(/* webpackChunkName: "shop-the-look" */ "./shop-the-look");
  }
}

const index = () => rIC(shopTheLookController);
export default index;
