const sectionSettings = require("./parts/sectionSettings");
const content = require("./parts/content");
const media = require("./parts/media");
const sectionHeader = require("./parts/sectionHeader");

module.exports = {
  name: "Banner Collage",
  tag: "section",
  class: "o-row shopify-section--banner-collage",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [{ name: "Banner Collage" }],
  settings: [
    ...sectionSettings(),
    {
      type: "select",
      id: "section_position",
      label: "Section Position",
      options: [
        {
          label: "Left",
          value: "left",
        },
        {
          label: "Right",
          value: "right",
        },
      ],
      default: "left",
    },
  ],
  blocks: [
    ...sectionHeader(),
    {
      name: "Item",
      type: "item",
      limit: 3,
      settings: [
        ...media({
          // Aspect Ratio Settings
          ar_setting: false,
          // Image Settings
          image_overlay: true
        }),
        ...content({
          default_heading_size_dsk: "8xl",
          default_text_size_dsk: "lg",
          grow_content_setting: true,
          default_grow_content: "text",
          default_vertical_position: "bottom"
        })
      ],
    },
    {
      type: "list",
      name: "Product list",
      limit: 1,
      settings: [
        {
          type: "product_list",
          id: "list",
          label: "Products",
          limit: 3,
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
  ],
};
