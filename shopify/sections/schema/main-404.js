const sectionSettings = require("./parts/sectionSettings");
const content = require("./parts/content");

module.exports = {
  name: "404",
  tag: "section",
  class: "o-row shopify-section--four-zero-four",
  enabled_on: {
    templates: ["404"],
  },
  presets: [{ name: "404" }],
  settings: [
    ...sectionSettings({
      default_spacing: "0"
    }),
    ...content({
      color_scheme: false,
      multiple_ctas: true,
      default_position: "center",
      default_position_desktop: "center"
    })
  ]
};
