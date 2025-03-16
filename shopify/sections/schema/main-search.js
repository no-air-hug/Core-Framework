const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Search",
  tag: "section",
  class: "o-row shopify-section--search",
  presets: [{ name: "Search" }],
  enabled_on: {
    templates: ["search"],
  },
  settings: [
    ...sectionSettings({
      secondary_bg: true,
      default_spacing: "sm"
    }),
  ],
};
