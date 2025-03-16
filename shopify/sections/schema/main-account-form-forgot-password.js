const image = require("./parts/image");
const sectionSettings = require("./parts/sectionSettings");
const buttonStyles = require("./parts/buttonStyles");

module.exports = {
  name: "Forgot Password",
  tag: "section",
  class: "o-row shopify-section--forgot-password js-main-forgot",
  enabled_on: {
    templates: ["customers/login"]
  },
  presets: [
    {
      name: "Forgot Password",
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
    ...sectionSettings(),
    ...buttonStyles({
      id: "submit_button_style",
      label: "Submit Button Style",
      default_style: "primary"
    }),
    ...buttonStyles({
      id: "login_button_style",
      label: "Login Button Style",
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
