const content = require("./parts/content");
const sectionHeader = require("./parts/sectionHeader");
const sectionSettings = require("./parts/sectionSettings");
const aspectRatios = require("./parts/aspectRatios");
const slider = require("./parts/slider");
const media = require("./parts/media");

module.exports = {
  name: "Content Cards - Carousel",
  tag: "section",
  class: "o-row shopify-section--content-cards-carousel",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Content Cards - Carousel",
      blocks: [
        {
          type: "section_header",
        },
        {
          type: "card",
        },
        {
          type: "card",
        },
        {
          type: "card",
        },
        {
          type: "card",
        },
      ],
    },
  ],
  settings: [
    ...sectionSettings(),
    ...slider({
      dots: false
    }),
    ...aspectRatios()
  ],
  blocks: [
    ...sectionHeader(),
    {
      type: "card",
      name: "Card",
      settings: [
        ...content({
          color_scheme: false,
          vertical_position_setting: false
        }),
        ...media({
          // Aspect Ratio Settings
          ar_setting: false
        })
      ],
    },
  ],
};
