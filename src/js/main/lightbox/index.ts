import { get, rIC } from "../../utils";

async function load() {
  const { Lightbox } = await import("./lightbox");
  new Lightbox();
}

function lightboxController() {
  const hasTriggers = get("[data-lightbox]");
  const testing = get("#ModalLightbox")?.hasAttribute("data-testing");
  if (!hasTriggers && !testing) return;

  load().catch((error: unknown) => {
    console.error(error);
  });
}

const index = () => rIC(lightboxController);
export default index;
