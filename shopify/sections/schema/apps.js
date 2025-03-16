const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "App Wrapper",
  tag: "section",
  class: "o-row shopify-section--app-wrapper",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [{ name: "App Wrapper" }],
  settings: [
    ...sectionSettings({
      default_width: 800,
      text_color: false
    }),
  ],
  blocks: [
    {
      type: "@app",
    },
  ],
};
