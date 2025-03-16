const content = require("./parts/content");
const shopTheLook = require("./parts/shopTheLook");
const sectionSettings = require("./parts/sectionSettings");
const slider = require("./parts/slider");
const media = require("./parts/media");
const aspectRatios = require("./parts/aspectRatios");

module.exports = {
  name: "Banner",
  tag: "section",
  class: "o-row shopify-section--hero-banner",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Banner",
      blocks: [
        {
          type: "slide",
        },
      ],
    },
  ],
  settings: [
    {
      type: "header",
      content: "Settings",
    },
    ...sectionSettings({
      text_color: false
    }),
    ...aspectRatios({
      default_ratio: 'landscape-small',
      default_ratio_mob: 'mobile-small'
    }),
    ...slider()
  ],
  blocks: [
    {
      type: "slide",
      name: "Slide",
      settings: [
        ...content({
          truncate_text_setting: true,
          grow_content_setting: true
        }),
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
          ar_setting: false, // This is on the section level.
          // Image Settings
          image_info: "Requires no background color or video to be set",
          image_overlay: true,
          // Video Settings
          video_info: "Requires no background color to be set, if an image is set then the image will be utilised as the video's placeholder",
        }),
        ...shopTheLook(),
      ],
    },
  ],
};
