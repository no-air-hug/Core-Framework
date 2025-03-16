const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Spacer",
  tag: "section",
  class: "shopify-section--spacer",
  disabled_on: {
    groups: ["header", "custom.dialogs"],
  },
  presets: [{ name: "Spacer" }],
  settings: [
    ...sectionSettings({
      spacing: false,
      padding: false,
      width: false,
      text_color: false
    }),
    {
      type: "range",
      id: "spacer_mobile",
      min: 8,
      max: 800,
      step: 8,
      default: 48,
      label: "Spacer Height (Mobile)",
      info: "Viewport Width: 1023px and down"
    },
    {
      type: "range",
      id: "spacer_desktop",
      min: 8,
      max: 800,
      step: 8,
      default: 96,
      label: "Spacer Height (Desktop)",
      info: "Viewport Width: 1024px and up"
    },
  ],
};
