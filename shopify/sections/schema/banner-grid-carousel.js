const content = require("./parts/content");
const media = require("./parts/media");
const sectionHeader = require("./parts/sectionHeader");
const sectionSettings = require("./parts/sectionSettings");
const slider = require("./parts/slider");
const aspectRatios = require("./parts/aspectRatios");

module.exports = {
  name: "Banner Grid - Carousel",
  tag: "section",
  class: "o-row shopify-section--banner-grid-carousel",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Banner Grid - Carousel",
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
      ],
    },
  ],
  settings: [
    ...sectionSettings(),
    {
      type: "liquid",
      id: "show_if",
      label: "Render condition",
      info: "Advanced: use liquid condition to show/hide this section, return `true|empty` to show or `false` to hide.",
    },
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
        {
          type: "header",
          content: "Content",
        },
        {
          type: "select",
          id: "width",
          label: "Card Width (Desktop)",
          options: [
            {
              value: "full",
              label: "Full",
            },
            {
              value: "two-thirds",
              label: "Two Thirds",
            },
            {
              value: "half",
              label: "Half",
            },
            {
              value: "one-third",
              label: "One Third",
            },
            {
              value: "quarter",
              label: "Quarter",
            },
            {
              value: "one-sixth",
              label: "One Sixth",
            },
          ],
          default: "quarter",
        },
        ...content(),
        {
          type: "header",
          content: "Background Color"
        },
        {
          type: "color_background",
          id: "background_color",
          label: "Background Color",
          info: "This will override any set image or video. Remove all gradients/css to utilise the image or video instead if the slide is current displaying a background colour."
        },
        ...media({
          // Aspect Ratio Settings
          ar_setting: false,
          // Image Settings
          image_info: "Requires no background color or video to be set",
          image_overlay: true,
          // Video Settings
          video_info: "Requires no background color to be set, if an image is set then the image will be utilised as the video's placeholder",
        })
      ],
    },
  ],
};
