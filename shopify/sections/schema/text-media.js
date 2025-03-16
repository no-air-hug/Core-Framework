const content = require("./parts/content");
const media = require("./parts/media");
const shopTheLook = require("./parts/shopTheLook");
const sectionSettings = require("./parts/sectionSettings");

module.exports = {
  name: "Text Media",
  tag: "section",
  class: "o-row shopify-section--text-media",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Text Media",
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
    ...sectionSettings()
  ],
  blocks: [
    {
      type: "text",
      name: "Text",
      limit: 1,
      settings: [
        ...content({
          default_content_width: 580,
          default_heading_size_dsk: "5xl",
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
        ...media(),
        ...shopTheLook()
      ],
    },
  ],
};
