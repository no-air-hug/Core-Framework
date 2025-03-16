const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Blog Title & Tags",
  tag: "section",
  class: "o-row shopify-section--blog-title-tags",
  enabled_on: {
    templates: ["blog"],
  },
  settings: [
    ...sectionSettings(),
  ],
};
