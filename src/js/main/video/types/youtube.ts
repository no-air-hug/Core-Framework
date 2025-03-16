import { rIC } from "../../../utils";
import Video from "../video";

export type YtPlayer = YT.Player & {
  element: HTMLIFrameElement;
};

let youtubeApiCallbacks: (() => void)[] = [];
window.onYouTubeIframeAPIReady = () => {
  for (const callback of youtubeApiCallbacks) {
    callback();
  }
  youtubeApiCallbacks = [];
};

export default class YTVideo extends Video {
  player!: YtPlayer;
  static preconnected?: boolean;

  createPlayer() {
    if (this.player) return;
    YTVideo.warmConnections();

    const { Player: YoutubePlayer } = window.YT || {};
    if (!YoutubePlayer) {
      this.loadScript();
      return;
    }

    this.container.innerHTML = "<div></div>";
    this.player = new YoutubePlayer(
      this.container.firstElementChild as HTMLElement,
      {
        videoId: this.id,
        playerVars: {
          autoplay: +this.canAutoplay,
          controls: +!this.canAutoplay,
          loop: +this.canLoop,
          modestbranding: 1,
          playlist: this.id,
          playsinline: 1,
          rel: 0,
          color: "white",
        },
        events: {
          onReady: () => {
            this.onReady();
          },
          onStateChange: ({ data }) => {
            switch (data) {
              case YT.PlayerState.ENDED: {
                this.onStop();
                break;
              }
              case YT.PlayerState.PLAYING: {
                this.onPlay();
                break;
              }
              case YT.PlayerState.PAUSED: {
                this.pause();
                break;
              }
              default: {
                break;
              }
            }
          },
        },
      },
    );

    this.player.element = this.player.getIframe();

    if (this.playTrigger) {
      this.playTrigger.style.backgroundImage = `url("https://i.ytimg.com/vi/${this.id}/maxresdefault.jpg")`;
    }
  }

  async playVideo() {
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }

  onReady() {
    this.isReady = true;
    if (!this.canSound) this.player.mute();

    if (this.fit === "cover") {
      const { width, height } = this.player.element;
      this.watchResize(+width, +height);
    }

    this.element.dataset.status = "loaded paused";

    rIC(() => {
      this.flushQueue();
    });
  }

  loadScript() {
    youtubeApiCallbacks.push(() => {
      this.createPlayer();
    });
    const elScript = document.createElement("script");
    elScript.src = "https://www.youtube.com/player_api";
    document.head.append(elScript);
  }

  static warmConnections() {
    if (YTVideo.preconnected) return;

    // The iframe document and most of its subresources come right off youtube.com
    let elLink = document.createElement("link");
    elLink.rel = "preconnect";
    elLink.href = "https://www.youtube.com";
    elLink.crossOrigin = "anonymous";
    document.head.append(elLink);

    // The botguard script is fetched off from google.com
    elLink = document.createElement("link");
    elLink.rel = "preconnect";
    elLink.href = "https://www.google.com";
    elLink.crossOrigin = "anonymous";
    document.head.append(elLink);

    YTVideo.preconnected = true;
  }
}
