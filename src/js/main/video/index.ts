import { debounce, get, getAll } from "../../utils";

type VideoTypes = "html5" | "vimeo" | "youtube";
type VideoMap = Record<VideoTypes, HTMLElement[]>;

async function createVideos([type, elements]: [VideoTypes, HTMLElement[]]) {
  if (elements.length === 0) return;

  const createInstance = (
    e: HTMLElement,
    classInstance: new (arg0: HTMLElement) => unknown,
  ) => {
    e.dataset.interactive = "true";
    new classInstance(e);
  };

  for (const e of elements) {
    switch (type) {
      case "html5": {
        const { default: VideoInstance } = await import(
          /* webpackChunkName: "video-type-html5" */ "./types/html5"
        );
        createInstance(e, VideoInstance);
        break;
      }

      case "youtube": {
        const { default: VideoInstance } = await import(
          /* webpackChunkName: "video-type-youtube" */ "./types/youtube"
        );
        createInstance(e, VideoInstance);
        break;
      }

      case "vimeo": {
        const { default: VideoInstance } = await import(
          /* webpackChunkName: "video-type-vimeo" */ "./types/vimeo"
        );
        createInstance(e, VideoInstance);
        break;
      }
    }
  }
}

function bindVideos() {
  const elVideos = getAll(".js-video:not([data-interactive])");
  if (elVideos.length === 0) return;

  const videos: VideoMap = {
    html5: [],
    vimeo: [],
    youtube: [],
  };

  for (const elVideo of elVideos) {
    const type = elVideo.dataset.type as VideoTypes | null;
    if (type) videos[type].push(elVideo);
  }

  const videosMap = Object.entries(videos) as [VideoTypes, HTMLElement[]][];
  for (const video of videosMap) {
    createVideos(video).catch((error: unknown) => {
      console.log(error);
    });
  }
}

export default function videoController() {
  bindVideos();

  const mainContent = get("#MainContent");

  if (mainContent) {
    new MutationObserver(
      debounce(() => {
        bindVideos();
      }, 250),
    ).observe(mainContent, {
      childList: true,
      subtree: true,
    });
  }
}
