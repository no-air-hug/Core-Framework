import { rIC } from "../../../utils";
import Video from "../video";

type Source = {
  format: string;
  height: number;
  mime_type: string;
  url: string;
  width: number;
};

export default class HTML5Video extends Video {
  player!: HTMLVideoElement;

  createPlayer() {
    if (this.player) return;
    const { sources }: { sources: Source[] } = JSON.parse(
      this.container.dataset.sources ?? "[]",
    );

    this.container.innerHTML = `
    <video
      playsinline
      preload="${this.canAutoplay ? "auto" : "metadata"}"
      ${!this.canSound || this.canAutoplay ? "muted" : ""}
      ${this.canAutoplay ? "" : "controls"}
      ${this.canLoop ? "loop" : '"'}>
        ${[...new Set(sources.map((src) => src.format))]
          .map((format) => {
            const matchingSources = sources
              .filter((source) => source.format === format)
              .sort((a, b) => (a.width > b.width ? 1 : -1));

            const matchingSource =
              matchingSources.find(
                (source) => source.width >= window.innerWidth,
              ) ?? matchingSources[0];

            return `<source src="${matchingSource.url}" type="${matchingSource.mime_type}">`;
          })
          .join("\n")}
    </video>`;

    // @ts-expect-error TODO: types
    this.player = this.container.firstElementChild;
    // @ts-expect-error TODO: types
    this.player.element = this.container.firstElementChild;

    this.player.addEventListener("canplay", () => {
      this.onReady();
    });
    this.player.addEventListener("ended", () => {
      this.onStop();
    });
    this.player.addEventListener("play", () => {
      this.onPlay();
    });
    this.player.addEventListener("pause", () => this.pause());
  }

  playVideo() {
    this.player.play();
  }

  pauseVideo() {
    this.player.pause();
  }

  onReady() {
    if (this.isReady) return;
    this.isReady = true;

    if (!this.canAutoplay) {
      this.element.dataset.status = "loaded ready";
    }

    rIC(() => {
      this.flushQueue();
    });
  }
}
