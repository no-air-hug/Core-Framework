const content = require("./parts/content");
const sectionHeader = require("./parts/sectionHeader");
const sectionSettings = require("./parts/sectionSettings");
const media = require("./parts/media");
const gridSpacing = require("./parts/gridSpacing");

module.exports = {
  name: "Banner Grid",
  tag: "section",
  class: "o-row shopify-section--banner-grid",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Banner Grid",
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
    ...gridSpacing(),
  ],
  blocks: [
    ...sectionHeader(),
    {
      type: "card",
      name: "Card",
      settings: [
        {
          type: "header",
          content: "Card Styling",
        },
        {
          type: "range",
          id: "border_radius",
          min: 0,
          max: 100,
          unit: "px",
          label: "Border Radius",
          default: 0,
        },
        {
          type: "color",
          id: "border_color",
          label: "Border Color",
          default: "#eee"
        },
        {
          type: "select",
          id: "width",
          label: "Width (Desktop)",
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
        {
          type: "number",
          id: "minimum_height_mob",
          label: "Minimum Height (in px) (Mobile)",
          info: "Screen Width: < 767px",
          default: 0
        },
        {
          type: "number",
          id: "minimum_height_tab",
          label: "Minimum Height (in px) (Tablet)",
          info: "Screen Width: 768px > 1023px",
          default: 0
        },
        {
          type: "number",
          id: "minimum_height_dsk",
          label: "Minimum Height (in px) (Desktop)",
          info: "Screen Width: 1024px >",
          default: 0
        },
        {
          type: "header",
          content: "> > > > > > > >"
        },
        ...content({
          grow_content_setting: true,
          default_heading: "Heading",
          default_text: "Text"
        }),
        {
          type: "header",
          content: "> > > > > > > >"
        },
        {
          type: "header",
          content: "Background Color",
          info: "This will overwrite all other background settings. Only one background setting should be set at a time."
        },
        {
          type: "color_background",
          id: "background_color",
          label: "Background Color",
          info: "Can be used to set a gradient or solid colour as the background. This will override any set background image or video.",
          default: "linear-gradient(0deg, rgba(238, 238, 238, 1) 13%, rgba(255, 255, 255, 1) 86%)"
        },
        ...media({
          prefix: 'background_',
          // Aspect Ratio Settings
          ar_setting: false,
          // Image Settings
          image_header: 'Background Image',
          image_overlay: false,
          // Video Settings
          video_header: 'Background Video',
          video_info: "This will overwrite the image background settings, disable it to utilise a image background. Only one background setting should be set at a time.",
          video_url: false,
          video_autoplay: false,
          video_mute: false
        }),
        {
          type: "header",
          content: "> > > > > > > >"
        },
        ...media({
          // Aspect Ratio Settings
          ar_setting: false,
          // Image Settings
          image_header: "Foreground Image",
          image_info: "Requires no background color or video to be set",
          image_overlay: false,
          image_default_fit: "contain",
          // Video Settings
          video_header: "Foreground Video",
          video_info: "Requires no background color to be set, if an image is set then the image will be utilised as the video's placeholder",
        }),
      ],
    },
  ],
};
