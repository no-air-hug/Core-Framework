const sectionSettings = require("./parts/sectionSettings");
const facets = require("./parts/facets");
const aspectRatios = require("./parts/aspectRatios");
const gridSpacing = require("./parts/gridSpacing");
const gridItems = require("./parts/gridItems");
const pagination = require("./parts/pagination");

module.exports = {
  name: "Collection Products",
  tag: "section",
  class: "o-row shopify-section--collection-products",
  presets: [{ name: "Collection Products" }],
  enabled_on: {
    templates: ["collection"],
  },
  settings: [
    ...sectionSettings({
      width: false,
      default_spacing: "0"
    }),
    ...facets({
      template_collection: true
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
