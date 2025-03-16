const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Breadcrumbs",
  tag: "section",
  class: "o-row shopify-section--breadcrumbs",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [{ name: "Breadcrumbs" }],
  settings: [
    {
      type: "header",
      content: "Settings",
    },
    ...sectionSettings(),
  ],
};
