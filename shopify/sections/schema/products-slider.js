const sectionHeader = require("./parts/sectionHeader");
const sectionSettings = require("./parts/sectionSettings");
const slider = require("./parts/slider");

module.exports = {
  name: "Products Slider",
  tag: "section",
  class: "o-row shopify-section--products-slider",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Products Slider",
      blocks: [
        {
          type: "section_header",
        },
        {
          type: "list",
        },
      ],
    },
  ],
  settings: [
    ...sectionSettings(),
    ...slider({
      dots: false
    })
  ],
  blocks: [
    ...sectionHeader(),
    {
      type: "list",
      name: "Product list",
      limit: 1,
      settings: [
        {
          type: "product_list",
          id: "list",
          label: "Products",
          limit: 8,
        },
      ],
    },
    {
      type: "collection",
      name: "Collection",
      limit: 1,
      settings: [
        {
          type: "collection",
          id: "collection",
          label: "Collection",
        },
      ],
    },
    {
      type: "recommended",
      name: "Recommended products",
      limit: 1,
      settings: [
        {
          type: "select",
          id: "intent",
          label: "Intent",
          default: "related",
          options: [
            {
              value: "complementary",
              label: "Complementary",
            },
            {
              value: "related",
              label: "Related",
            },
          ],
          info: "[Learn more](https://shopify.dev/themes/product-merchandising/recommendations)",
        },
        {
          type: "range",
          id: "limit",
          min: 0,
          max: 10,
          step: 1,
          label: "Limit",
          default: 10,
        },
      ],
    },
  ],
};
