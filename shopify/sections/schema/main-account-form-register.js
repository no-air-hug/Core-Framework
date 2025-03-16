const image = require("./parts/image");
const sectionSettings = require("./parts/sectionSettings");
const buttonStyles = require("./parts/buttonStyles");

module.exports = {
  name: "Register",
  tag: "section",
  class: "o-row shopify-section--register",
  enabled_on: {
    templates: ["customers/register"]
  },
  presets: [
    {
      name: "Register",
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
      id: "login_button_style",
      label: "Login Button Style",
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
