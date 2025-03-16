const sectionSettings = require("./parts/sectionSettings");
const facets = require("./parts/facets");
const aspectRatios = require("./parts/aspectRatios");
const gridSpacing = require("./parts/gridSpacing");
const gridItems = require("./parts/gridItems");
const pagination = require("./parts/pagination");

module.exports = {
  name: "Collection List Products",
  tag: "section",
  class: "o-row shopify-section--collection-products",
  presets: [{ name: "Collection List Products" }],
  enabled_on: {
    templates: ["collection"],
  },
  settings: [
    ...sectionSettings({
      width: false,
      default_spacing: "0",
    }),
    ...facets({
      template_collection: true,
    }),
    ...pagination({
      default_pagination_amount: 16,
    }),
  ],
};
