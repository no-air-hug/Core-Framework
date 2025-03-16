const content = require("./parts/content");
const media = require("./parts/media");
const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Collection Banner",
  tag: "section",
  class: "o-row shopify-section--collection-banner",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Collection Banner",
      blocks: [
        {
          type: "text",
        },
        {
          type: "media",
        },
      ],
    },
  ],
  settings: [
    ...sectionSettings({
      default_text_color: "light"
    }),
  ],
  blocks: [
    {
      type: "text",
      name: "Text",
      limit: 1,
      settings: [
        {
          label: "Overlay Text",
          type: "checkbox",
          id: "overlay_text",
          default: false
        },
        ...content({
          heading_setting: false,
          text_setting: false,
          default_content_width: 580,
          default_heading_size_mob: "3xl",
          default_heading_size_dsk: "5xl",
          default_text_size_dsk: "lg",
          multiple_ctas: true,
          cta_alignment: true,
          color_scheme: false
        })
      ],
    },
    {
      type: "media",
      name: "Media",
      limit: 1,
      settings: [
        {
          type: "checkbox",
          id: "media_first",
          label: "Force media first on mobile",
          default: true,
        },
        {
          type: "header",
          content: "Media Width Settings",
        },
        {
          type: "select",
          id: "media_width",
          label: "Media Width",
          options: [
            {
              value: "half",
              label: "Half",
            },
            {
              value: "two-thirds",
              label: "Two Thirds",
            },
            {
              value: "custom",
              label: "Custom",
            },
          ],
          default: "half",
        },
        {
          type: "range",
          id: "custom_media_width",
          label: "Custom Media Width",
          min: 0,
          max: 100,
          default: 33,
          step: 1,
          unit: "%",
          info: "(Advanced) Set a specific media width based on the screens width - 33% would mean a third of the screen, etc. Requires the media width setting above to be set to 'Custom'"
        },
        ...media({
          // Aspect Ratio Settings
          ar_default_ratio: "landscape-large",
          ar_default_ratio_mob: "landscape-large",
          // Image Settings
          image_overlay: true
        }),
      ],
    },
  ],
};
