import { rIC } from "../../utils";

function klevuController() {
  if (
    window.klevuSettings &&
    document.querySelector(
      "#klevu-react-root-quick-search, #klevu-react-root-search-landing",
    )
  ) {
    void import(/* webpackChunkName: "klevu" */ "./klevu");
  }
}

const index = () => rIC(klevuController);
export default index;
