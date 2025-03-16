const sectionSettings = require("./parts/sectionSettings");
const facets = require("./parts/facets");
const aspectRatios = require("./parts/aspectRatios");
const gridSpacing = require("./parts/gridSpacing");
const gridItems = require("./parts/gridItems");
const pagination = require("./parts/pagination");

module.exports = {
  name: "Search Products",
  tag: "section",
  class: "o-row shopify-section--search-products",
  presets: [{ name: "Search Products" }],
  enabled_on: {
    templates: ["search"],
  },
  settings: [
    ...sectionSettings({
      width: false,
      default_spacing: "0"
    }),
    ...facets({
      template_search: true
    }),
    ...aspectRatios(),
    ...gridSpacing(),
    ...gridItems({
      item_title: "Products"
    }),
    ...pagination({
      default_pagination_amount: 16
    }),
  ],
};
