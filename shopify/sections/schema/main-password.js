const sectionSettings = require("./parts/sectionSettings");
const buttonStyles = require("./parts/buttonStyles");

module.exports = {
  name: "Password",
  class: "o-row shopify-section--password",
  templates: ["password"],
  tag: "section",
  presets: [
    {
      name: "Password",
    },
  ],
  settings: [
    ...sectionSettings({
      default_width: 702,
      spacing: false
    }),
    ...buttonStyles({
      id: "login_button_style",
      label: "Login Button Style",
      default_style: "primary"
    }),
  ],
};
