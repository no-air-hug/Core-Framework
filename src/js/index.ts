import "./utils/public-path";
import "@ungap/custom-elements";

import accordion from "./main/accordion";
import addressDirectory from "./main/address-directory";
import beforeAfter from "./main/before-after";
import conditionalFormFields from "./main/conditional-form-fields";
import deliveryCountdown from "./main/delivery-countdown";
import dialog from "./main/dialog";
import facets from "./main/facets";
import header from "./main/header";
import helpCenter from "./main/help-center";
import klevu from "./main/klevu";
import lazyload from "./main/lazyload";
import lightbox from "./main/lightbox";
import pagination from "./main/pagination";
import product from "./main/product";
import tooltip from "./main/product-tooltip";
import quickShop from "./main/quick-shop";
import recentlyViewed from "./main/recently-viewed";
import search from "./main/search";
import share from "./main/share";
import shopTheLook from "./main/shop-the-look";
import slider from "./main/slider";
import truncate from "./main/truncate";
import video from "./main/video";
import { attachEvent, debounce, get, getAll, rIC } from "./utils";

const themeFunctions: (() => void)[] = [
  lazyload,
  header,
  search,
  klevu,
  dialog,
  slider,
  shopTheLook,
  conditionalFormFields,
  video,
  pagination,
  facets,
  truncate,
  recentlyViewed,
  quickShop,
  tooltip,
  accordion,
  beforeAfter,
  product,
  deliveryCountdown,
  lightbox,
  addressDirectory,
  share,
  helpCenter,
];

for (const themeFn of themeFunctions) {
  themeFn();
}

// Lazy CSS custom properties
rIC(() => {
  const html = document.documentElement;

  const htmlWidth = +html.getBoundingClientRect().width.toFixed(2);
  html.style.setProperty(
    "--scrollbar-width",
    `${window.innerWidth - htmlWidth}`,
  );

  const debouncedFn = debounce(() => {
    html.style.setProperty(
      "--vh",
      `${(visualViewport?.height ?? window.innerHeight) * 0.01}px`,
    );
  }, 32);
  // TODO: Resize observer?
  (visualViewport ?? window).addEventListener("resize", debouncedFn);
  debouncedFn();

  const inViewIO = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      entry.target.classList.toggle("in-view", entry.isIntersecting);
    }
  });
  for (const elSection of getAll("#MainContent .shopify-section")) {
    inViewIO.observe(elSection);
  }
}, 100);

// TODO: Remove the below
attachEvent(
  "load",
  window,
  (event) => {
    const isLoginPage = window.location.pathname.includes("account/login");
    // Toggle Login/ForgotPassword forms
    window.Shopify.theme.showLoginForm = () => {
      let forgotFormSelector = "form#ForgotPasswordForm";
      let loginFormSelector = "form#LoginForm";

      // Handle `/account/login` page
      if (isLoginPage) {
        forgotFormSelector = ".js-main-forgot";
        loginFormSelector = ".js-main-login";
      } else {
        event.preventDefault();
      }

      // Toggle forms
      const elforgotForm = get(forgotFormSelector) as
        | HTMLFormElement
        | undefined;
      if (elforgotForm) elforgotForm.hidden = true;

      const elLoginForm = get(loginFormSelector) as HTMLFormElement | undefined;
      if (elLoginForm) {
        elLoginForm.hidden = false;

        setTimeout(() => {
          elLoginForm.scrollIntoView({
            behavior: "instant",
            inline: "start",
            block: "start",
          });
        }, 10);
      }

      return isLoginPage;
    };

    window.Shopify.theme.showForgotPasswordForm = (event?: Event) => {
      let forgotFormSelector = "form#ForgotPasswordForm";
      let loginFormSelector = "form#LoginForm";

      // Handle `/account/login` page
      if (isLoginPage) {
        forgotFormSelector = ".js-main-forgot";
        loginFormSelector = ".js-main-login";
      } else {
        event?.preventDefault();
      }

      // Toggle forms
      const elLoginForm = get(loginFormSelector);
      if (elLoginForm) elLoginForm.setAttribute("hidden", "true");

      const elforgotForm = get(forgotFormSelector);
      if (elforgotForm) {
        elforgotForm.setAttribute("hidden", "false");

        setTimeout(() => {
          elforgotForm.scrollIntoView({
            behavior: "instant",
            inline: "start",
            block: "start",
          });
        }, 10);
      }

      return isLoginPage;
    };

    // Execute on `/account/login` page
    if (isLoginPage) {
      if (window.location.hash === "#recover") {
        window.Shopify.theme.showForgotPasswordForm();
      } else {
        window.Shopify.theme.showLoginForm();
      }
    }
  },
  { once: true },
);
