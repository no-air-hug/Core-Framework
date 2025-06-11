export namespace Observer {
  export type ObserverInstance = {
    inView: boolean;
    unobserve: () => void;
  };
}

export const observer = {
  observe(
    element: Element,
    callback: (inView: boolean) => void,
    options: IntersectionObserverInit = {},
  ): Observer.ObserverInstance {
    const instance: Observer.ObserverInstance = {
      inView: false,
      unobserve: () => void 0,
    };

    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      instance.inView = entry.isIntersecting;
      callback(entry.isIntersecting);
    }, options);

    io.observe(element);

    instance.unobserve = () => io.unobserve(element);

    return instance;
  },
};
