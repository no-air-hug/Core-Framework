const sectionHeader = require("./parts/sectionHeader");
const sectionSettings = require("./parts/sectionSettings");
const media = require("./parts/media");

module.exports = {
  name: "Media",
  class: "o-row shopify-section--media",
  tag: "section",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Media",
      blocks: [
        {
          type: "section_header",
        },
        {
          type: "media",
        }
      ],
    },
  ],
  settings: [
    ...sectionSettings()
  ],
  blocks: [
    ...sectionHeader({
      content_settings: {
        multiple_ctas: true,
        default_content_width: 624
      }
    }),
    {
      type: "media",
      name: "Media",
      settings: [
        {
          type: "header",
          content: "Max Width",
          info: "Setting this value to 100 will set no max width"
        },
        {
          type: "range",
          id: "media_width",
          min: 0,
          max: 100,
          step: 1,
          default: 100,
          unit: "%",
          label: "Media Width",
        },
        {
          type: "range",
          id: "media_width_dsk",
          min: 0,
          max: 100,
          step: 1,
          default: 100,
          unit: "%",
          label: "Media Width on Desktop",
        },
        ...media({
          // Aspect Ratio Settings
          ar_default_ratio_mob: "landscape-small",
          ar_default_ratio: "landscape-small"
        }),
      ],
    }
  ],
};
