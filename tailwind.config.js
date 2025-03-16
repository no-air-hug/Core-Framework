/** @type {import('tailwindcss').Config} */
const preset = {
  theme: {
    screens: {
      "max-xs": { max: "413px" },
      xs: "414px",
      "max-sm": { max: "639px" },
      sm: "640px",
      "max-md": { max: "767px" },
      md: "768px",
      "max-xmd": { max: "819px" },
      xmd: "820px",
      "max-lg": { max: "1023px" },
      lg: "1024px",
      "max-xl": { max: "1279px" },
      xl: "1280px",
      "max-2xl": { max: "1439px" },
      "2xl": "1440px",
      "max-3xl": { max: "1535px" },
      "3xl": "1536px",
      "max-4xl": { max: "1679px" },
      "4xl": "1680px",
    },
    colors: {
      current: "currentColor",

      black: "#000",
      white: "#fff",
      transparent: "transparent",

      highlight: "var(--c-highlight)",

      // Text
      primary: "var(--c-primary)",
      "primary-inverse": "var(--c-primary-inverse)",
      secondary: "var(--c-secondary)",
      "secondary-inverse": "var(--c-secondary-inverse)",

      // Pricing
      sale: "var(--c-pricing-sale)",
      compare: "var(--c-pricing-compare)",
      "sale-inverse": "var(--c-pricing-sale-inverse)",
      "compare-inverse": "var(--c-pricing-compare-inverse)",

      // 'section_spacing-and-color' variables inherited from settings
      "section-primary": "var(--section-text-primary, var(--c-primary))",
      "section-secondary": "var(--section-text-secondary, var(--c-secondary))",
      "section-sale": "var(--section-sale-primary, var(--c-pricing-sale))",
      "section-compare":
        "var(--section-compare-primary, var(--c-pricing-compare))",
      "section-bg": "var(--bg)",

      brand: { 1: "#898D8D" },

      border: {
        light: "var(--c-border-light)",
        dark: "var(--c-border-dark)",
      },

      overlay: "rgb(0 0 0 / 50%)",

      citation: "#1A222C",

      red: {
        20: "#CF142B",
        50: "#B71C1C",
      },
      green: "#27ae60",
      grey: {
        0: "#000",
        10: "#191919",
        15: "#222",
        20: "#333",
        30: "#4d4d4d",
        40: "#666",
        50: "#808080",
        60: "#999999",
        70: "#b3b3b3",
        80: "#ccc",
        90: "#eee",
        100: "#f6f6f6",
      },
      validation: {
        success: "#5DCE71",
        processing: "#EDA44D",
        error: "#ED4D4D",
      },
      product: {
        blue: "#0000FF",
        red: "#FF0000",
        green: "#008000",
        brown: "#A52A2A",
        purple: "#800080",
        pink: "#FFC0CB",
        grey: "#ccc",
        black: "#000",
        yellow: "#ffd000",
      },
    },
    fontFamily: {
      body: ["var(--font-primary)", "sans-serif"],
      heading: ["var(--font-secondary)", "sans-serif"],
    },
    fontSize: {
      "2xs": "1rem",
      xs: "1.1rem",
      sm: "1.2rem",
      md: "1.4rem",
      base: "1.6rem",
      lg: "1.8rem",
      xl: "2rem",
      "2xl": "2.4rem",
      "3xl": "2.8rem",
      "4xl": "3.2rem",
      "5xl": "3.6rem",
      "6xl": "4rem",
      "7xl": ["5.6rem", { lineHeight: "1" }],
      "8xl": ["6.4rem", { lineHeight: "1" }],
      "9xl": ["7.2rem", { lineHeight: "1" }],
    },
    spacing: {
      unset: "unset",
      rem: "1rem",
      px: "1px",
      0: "0px",
      1: "0.4rem",
      2: "0.8rem",
      3: "1.2rem",
      4: "1.6rem",
      5: "2rem",
      6: "2.4rem",
      7: "2.8rem",
      8: "3.2rem",
      9: "3.6rem",
      10: "4.8rem",
      11: "5.6rem",
      12: "6.4rem",
      13: "7.2rem",
      14: "8rem",
      15: "9.6rem",
      16: "11.2rem",
      17: "12.8rem",
      18: "25.6rem",
      gap: "var(--gap)",
      row: "var(--row-space)",
      page: "var(--page-space)",
      promo: "var(--promo-bar-height)",
      header: "var(--header-height)",
      "header-group": "var(--header-group-height)",
      "block-padding": "var(--block-padding)",
      "screen-d": "100dvh",
      "screen-d-minus-gutter": "calc(100dvw - (var(--row-space) * 2))",
      "screen-d-minus-header":
        "calc(100dvh - var(--header-group-height) - var(--header-offset))",
    },
    aspectRatio: {
      auto: "auto",
      square: "1 / 1",
    },
    transition: {
      faster: "0.5s ease-in-out",
    },
    lineHeight: {
      none: "1",
      1: "1.1",
      base: "1.5",
      normal: "normal",
    },
    letterSpacing: {
      0: "0px",
      1: "0.01em",
      2: "0.02em",
    },
    borderRadius: {
      px: "1px",
      0: "0px",
      1: "0.4rem",
      2: "0.6rem",
      3: "0.8rem",
      full: "9999px",
    },
    boxShadow: {
      0: "none",
      1: "0px 1.1px 3.4px rgba(0, 0, 0, 0.1), 0px 6px 14px rgba(0, 0, 0, 0.12)",
      2: "0px 4px 14px rgba(0, 0, 0, 0.18), 0px 25px 57px rgba(0, 0, 0, 0.22)",
    },
    extend: {
      zIndex: {
        1: "1",
        2: "2",
        dialog: "100",
        "shopper-settings": "200",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 1s ease-in-out",
      },
      gap: {
        auto: "var(--gap)",
      },
      minWidth: ({ theme }) => theme("spacing"),
      minHeight: ({ theme }) => theme("spacing"),
      inset: {
        "header-group": "var(--header-group-height) 0 0 0",
      },
    },
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./{src,shopify}/**/*.{js,ts,jsx,tsx,liquid,json,scss}",
    "!./shopify/snippets/theme/_head.liquid",
  ],
  presets: [preset],
  safelist: [
    {
      pattern: /o-button-/,
    },
  ],
  corePlugins: {
    preflight: false,
  },
};
