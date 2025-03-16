import { get, rIC } from "../../utils";

function listCollectionsController() {
  if (get("address-directory")) {
    import(/* webpackChunkName: "address-directory" */ "./address-directory");
  }
}

const index = () => rIC(listCollectionsController);
export default index;
