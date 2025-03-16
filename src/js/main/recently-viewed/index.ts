import { get, rIC } from "../../utils";

function recentlyViewedController() {
  if (get("recently-viewed")) {
    import(/* webpackChunkName: "recently-viewed" */ "./recently-viewed");
  }
}

const index = () => rIC(recentlyViewedController);
export default index;
