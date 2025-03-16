const image = require("./parts/image");
const sectionSettings = require("./parts/sectionSettings");
const buttonStyles = require("./parts/buttonStyles");

module.exports = {
  name: "Reset Password",
  tag: "section",
  class: "o-row shopify-section--reset-password",
  enabled_on: {
    templates: ["customers/reset_password"]
  },
  presets: [
    {
      name: "Reset Password",
      blocks: [
        {
          type: "media"
        }
      ]
    },
  ],
  settings: [
    {
      type: "header",
      content: "Settings",
    },
    ...sectionSettings({
      default_spacing: "0"
    }),
    ...buttonStyles({
      id: "submit_button_style",
      label: "Submit Button Style",
      default_style: "primary"
    }),
    ...buttonStyles({
      id: "cancel_button_style",
      label: "Cancel Button Style",
      default_style: "underline"
    }),
  ],
  blocks: [
    {
      type: "media",
      name: "Media",
      limit: 1,
      settings: [
        {
          type: "checkbox",
          id: "mobile_hidden",
          label: "Hide Image on Mobile",
          default: true,
        },
        ...image(),
      ],
    },
  ],
};
