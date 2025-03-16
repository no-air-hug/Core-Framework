import { get, rIC } from "../../utils";

function shareController() {
  const elShareButton = get("[is=share-button]");
  if (!elShareButton) return;
  import("./share");
}

const index = () => rIC(shareController);
export default index;
