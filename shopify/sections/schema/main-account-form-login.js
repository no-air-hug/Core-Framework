const image = require("./parts/image");
const sectionSettings = require("./parts/sectionSettings");
const buttonStyles = require("./parts/buttonStyles");

module.exports = {
  name: "Login",
  tag: "section",
  class: "o-row shopify-section--login js-main-login",
  enabled_on: {
    templates: ["customers/login"]
  },
  presets: [
    {
      name: "Login",
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
    {
      type: "header",
      content: "Button Styles",
    },
    ...buttonStyles({
      id: "submit_button_style",
      label: "Submit Button Style",
      default_style: "primary"
    }),
    ...buttonStyles({
      id: "forgot_button_style",
      label: "Forgot Button Style",
      default_style: "underline"
    }),
    ...buttonStyles({
      id: "guest_button_style",
      label: "Guest Button Style",
      info: "Guest checkout must be enabled in order for this button to be visible",
      default_style: "tertiary"
    }),
    ...buttonStyles({
      id: "register_button_style",
      label: "Register Button Style",
      default_style: "secondary"
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
