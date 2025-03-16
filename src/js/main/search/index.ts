import { rIC } from "../../utils";

function searchFormController() {
  import("./search");
}

const index = () => rIC(searchFormController);
export default index;
