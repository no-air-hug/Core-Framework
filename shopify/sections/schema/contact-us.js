const content = require("./parts/content");
const buttonStyles = require("./parts/buttonStyles");
const sectionSettings = require("./parts/sectionSettings");
const media = require("./parts/media");

module.exports = {
  name: "Contact Us",
  tag: "section",
  class: "o-row shopify-section--contact-us",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Contact Us",
      blocks: [
        {
          type: "form",
        },
        {
          type: "media",
        },
      ],
    },
  ],
  settings: [
    ...sectionSettings({
      color_scheme: false
    })
  ],
  blocks: [
    {
      type: "form",
      name: "Form",
      limit: 1,
      settings: [
        ...content({
          default_heading: "Contact us",
          default_content_width: 580,
          default_heading_size_dsk: "5xl",
          multiple_ctas: true,
          cta_alignment: true,
          color_scheme: true,
          default_position_desktop: "center"
        }),
        ...buttonStyles({
          id: "form_submit_style",
          label: "Submit Button Style",
          default_style: "primary"
        }),
        {
          type: "header",
          content: "Call us",
        },
        {
          type: "checkbox",
          id: "show_call_us",
          label: "Show call us?",
          default: true,
          info: "Call us content is managed in translations.",
        },
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
          // Image Settings
          image_overlay: true
        }),
        ...content({
          default_vertical_position: "center",
          default_heading_size_dsk: "8xl",
          default_text_size_dsk: "2xl",
          default_heading: "Find Us",
          default_text: "We're available to take your queries...",
          color_scheme: true
        })
      ],
    },
  ],
};
