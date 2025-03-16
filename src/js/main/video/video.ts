import { attachEvent, device, get } from "../../utils";
import type { VimeoPlayer } from "./types/vimeo";
import type { YtPlayer } from "./types/youtube";

type Task = "play" | "pause";

abstract class Video {
  canAutoplay: boolean;
  canLoop: boolean;
  canSound: boolean;
  canPlayOnMobile: boolean;
  fit: "cover" | "contain" = "contain";
  element: HTMLElement;
  container: HTMLElement;
  playTrigger: HTMLElement | null;
  id: string;
  isPlaying = false;
  isReady = false;
  queue: Set<Task> = new Set();
  abstract player: VimeoPlayer | YtPlayer | HTMLVideoElement;
  playPromise?: Promise<any>;

  constructor(element: HTMLElement) {
    this.element = element;
    this.container = get(".js-video-container", element)!;
    this.id = element.dataset.id!;
    this.playTrigger = get(".js-video-trigger", element);

    const settings = element.dataset.settings ?? "";
    this.fit = settings.includes("cover") ? "cover" : "contain";
    this.canAutoplay = settings.includes("autoplay");
    this.canLoop = settings.includes("loop");
    this.canSound = !settings.includes("mute");
    this.canPlayOnMobile = settings.includes("canPlayOnMobile");

    // Check if browser supports autoplay
    device.isAutoplaySupported((supports) => {
      if (this.canSound) this.canSound = supports;
    });

    this.observeElement();
  }

  abstract createPlayer(): void;
  abstract playVideo(): void;
  abstract pauseVideo(): void;

  play() {
    if (this.isPlaying) return;
    if (!this.isReady) {
      this.createPlayer();
      this.queueTask("play");
      return;
    }

    this.playPromise = Promise.resolve(this.playVideo());
  }

  async pause() {
    if (!this.isPlaying) return;
    if (!this.isReady || this.playPromise === undefined) {
      this.queueTask("pause");
      return;
    }

    await this.playPromise;
    this.pauseVideo();
    this.onStop();
  }

  onPlay() {
    this.element.dataset.status = "loaded playing";
    this.isPlaying = true;
  }

  onStop() {
    this.element.dataset.status = "loaded paused";
    this.isPlaying = false;
  }

  watchResize(videoWidth: number, videoHeight: number) {
    const updateSize = () => {
      const widthScale = this.container.clientWidth / videoWidth,
        heightScale = this.container.clientHeight / videoHeight;

      let multiplier = 1;

      if (widthScale >= heightScale) {
        multiplier = heightScale;

        if (this.container.clientWidth > videoWidth * heightScale) {
          multiplier = widthScale;
        }
      } else {
        multiplier = widthScale;

        if (this.container.clientHeight > videoHeight * widthScale) {
          multiplier = heightScale;
        }
      }

      this.player.element.style.width = `${videoWidth * multiplier}px`;
      this.player.element.style.height = `${videoHeight * multiplier}px`;
    };

    requestAnimationFrame(() => {
      updateSize();
      this.player.element.style.position = "relative";
      this.player.element.style.top = "50%";
      this.player.element.style.transform = "translateY(-50%)";
    });
    new ResizeObserver(() => {
      updateSize();
    }).observe(this.container);
  }

  flushQueue() {
    for (const command of this.queue) this[command]();
    this.queue.clear();
  }

  queueTask(command: Task) {
    this.queue.add(command);
  }

  observeElement() {
    if (this.playTrigger) {
      attachEvent("click", this.playTrigger, (event) => {
        event.stopPropagation();
        this.play();
        this.playTrigger?.remove();
      });
    }

    new IntersectionObserver(
      ([entry]) => {
        if (!this.canPlayOnMobile && window.innerWidth < 680) return;

        if (entry.isIntersecting) {
          this.canAutoplay ? this.play() : this.createPlayer();
        } else if (this.isReady) {
          this.pause();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-100px 0px -50px 0px",
      },
    ).observe(this.container);
  }
}

export default Video;
