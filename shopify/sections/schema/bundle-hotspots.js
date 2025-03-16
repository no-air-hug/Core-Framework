const media = require("./parts/media");
const sectionHeader = require("./parts/sectionHeader");
const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Bundle Hotspots",
  tag: "section",
  class: "o-row shopify-section--bundle-hotspots",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Bundle Hotspots",
      blocks: [
        {
          type: "section_header",
        },
        {
          type: "media",
        },
        {
          type: "product",
        },
      ],
    },
  ],
  settings: [
    ...sectionSettings(),
    {
      type: "select",
      id: "layout",
      label: "Layout",
      options: [
        {
          value: "auto",
          label: "Image | Products",
        },
        {
          value: "reversed",
          label: "Products | Image",
        },
      ],
      default: "auto",
    },
  ],
  blocks: [
    ...sectionHeader(),
    {
      type: "media",
      name: "Media",
      limit: 1,
      settings: [
        ...media({
          // Aspect Ratio Settings
          ar_default_ratio: "portrait",
          ar_default_ratio_mob: "portrait",
          // Video Settings
          video_url: false
        })
      ],
    },
    {
      type: "product",
      name: "Product",
      limit: 4,
      settings: [
        {
          type: "product",
          id: "product",
          label: "Product",
        },
        {
          type: "paragraph",
          content: "Marker",
        },
        {
          type: "checkbox",
          id: "show_marker",
          label: "Show media marker",
          default: true,
        },
        {
          type: "range",
          id: "marker_x",
          default: 30,
          min: 0,
          max: 100,
          label: "Horizontal position",
          unit: "%",
        },
        {
          type: "range",
          id: "marker_y",
          default: 40,
          min: 0,
          max: 100,
          label: "Vertical position",
          unit: "%",
        },
      ],
    },
  ],
};
