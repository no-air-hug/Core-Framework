import { get, rIC } from "../../utils";

async function load(element: HTMLElement | null) {
  if (!element) return;
  const { QuickShop } = await import("./quick-shop");
  new QuickShop(element);
}

function quickShopController() {
  const elQuickShop = get(".js-quickshop-modal") as HTMLElement;
  load(elQuickShop).catch((error: unknown) => {
    console.error(error);
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const elButton = event.target.closest(".js-product-card-variant");
    if (!elButton) return;

    const elCard = elButton.closest(".js-product-card") as HTMLElement;

    // Show variant image
    const variantImage = elButton.querySelector("img")?.src;
    const elMedia = get(".js-product-card-media", elCard);

    if (elMedia && variantImage) {
      const img = document.createElement("img");
      img.src = variantImage
        .replace(/width=(\d+)/, "450")
        .replace(/height=(\d+)/, "450");
      img.addEventListener("load", () => {
        elMedia.classList.add("[&>*]:invisible");
        elMedia.style.backgroundImage = `url(${img.src})`;
      });
    }

    // Update quickshop variant
    const variantId = (elButton as HTMLButtonElement).dataset
      .variantId as string;
    const elQuickShopTrigger = elCard.querySelector(
      '[dialog-selector="#ModalQuickshop"]',
    );
    if (elQuickShopTrigger) {
      (elQuickShopTrigger as HTMLButtonElement).dataset.variantId = variantId;
    }
  });
}

const index = () => rIC(quickShopController);
export default index;
