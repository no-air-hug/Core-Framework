import type * as Vimeo from "@vimeo/player";

import { rIC } from "../../../utils";
import Video from "../video";

export type VimeoPlayer = Vimeo.Player & {
  element: HTMLIFrameElement;
};

export default class VimeoVideo extends Video {
  player!: VimeoPlayer;
  static preconnected?: boolean;

  createPlayer() {
    if (this.player) return;
    // VimeoVideo.warmConnections();

    const { Player: VimeoPlayer } = window.Vimeo || {};
    if (!VimeoPlayer) {
      this.loadScript();
      return;
    }

    this.player = new VimeoPlayer(this.container, {
      background: this.canAutoplay,
      byline: false,
      color: "ffffff",
      id: +this.id,
      url: this.container.dataset.url ?? "",
      loop: this.canLoop,
      // TODO: check sound
      muted: !this.canSound || true,
      portrait: false,
      title: false,
    });

    this.player.on("ended", () => { this.onStop(); });
    this.player.on("loaded", () => this.onReady());
    this.player.on("pause", () => this.pause());
    this.player.on("play", () => { this.onPlay(); });
  }

  playVideo() {
    this.player.play();
  }

  pauseVideo() {
    this.player.pause();
  }

  async onReady() {
    this.isReady = true;

    if (this.fit === "cover") {
      const [width, height] = await Promise.all([
        this.player.getVideoWidth(),
        this.player.getVideoHeight(),
      ]);
      this.watchResize(width, height);
    }

    rIC(() => { this.flushQueue(); });
  }

  loadScript() {
    const elScript = document.createElement("script");
    elScript.src = "https://player.vimeo.com/api/player.js";
    elScript.addEventListener('load', () => { this.createPlayer(); });
    document.head.append(elScript);
  }

  static warmConnections() {
    if (VimeoVideo.preconnected) return;

    renderElement(
      [
        // The iframe document and most of its subresources come right off player.vimeo.com
        {
          type: "link",
          props: {
            rel: "preconnect",
            href: "https://player.vimeo.com",
            crossOrigin: "anonymous",
          },
        },
        {
          type: "link",
          props: {
            rel: "preconnect",
            href: "https://i.vimeocdn.com",
            crossOrigin: "anonymous",
          },
        },
        {
          type: "link",
          props: {
            rel: "preconnect",
            href: "https://f.vimeocdn.com",
            crossOrigin: "anonymous",
          },
        },
        {
          type: "link",
          props: {
            rel: "preconnect",
            href: "https://fresnel.vimeocdn.com",
            crossOrigin: "anonymous",
          },
        },
      ],
      document.head,
    );

    VimeoVideo.preconnected = true;
  }
}
