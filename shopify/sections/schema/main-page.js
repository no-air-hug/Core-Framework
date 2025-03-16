const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Page",
  tag: "section",
  class: "o-row shopify-section--page",
  templates: ["page", "password"],
  presets: [
    {
      name: "Page",
    },
  ],
  settings: [
    ...sectionSettings({
      default_width: 702
    }),
  ],
};
