import { get, rIC } from "../../utils";

async function load(element: HTMLFormElement | null) {
  if (!element) return;

  const { HelpCenter } = await import("./help-center");
  new HelpCenter(element);
}

function helpCenterController() {
  const elHelpCenterForm = get(
    ".js-help-center-form",
  ) as HTMLFormElement | null;

  load(elHelpCenterForm).catch((error: unknown) => {
    console.error(error);
  });
}

const index = () => rIC(helpCenterController);
export default index;
