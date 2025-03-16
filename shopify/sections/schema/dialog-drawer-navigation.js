const brandLogos = require("./parts/brandLogos");
const { dialogSettings, dialogBlocks, dialogPresets } = require("./parts/dialog");
const megaMenu = require("./parts/megaMenu");
const icon = require("./parts/icon");

module.exports = {
  name: "Navigation Drawer",
  tag: "section",
  class: "shopify-section--dialog-drawer-navigation",
  ...dialogSettings({
    additional_settings: [
      {
        type: "header",
        content: "Menu",
      },
      {
        type: "link_list",
        id: "main_menu",
        label: "Main menu",
        default: "main-menu",
      },
      ...brandLogos(),
    ]
  }),
  ...dialogBlocks({
    blocks_main: [
      {
        type: "navigation",
        name: "Navigation",
        limit: 1,
      },
      ...megaMenu(),
    ],
    blocks_footer: [
      {
        type: "user-buttons",
        name: "User Buttons",
        limit: 1,
        settings: [
          {
            type: "header",
            content: "Left Button"
          },
          ...icon({
            default_icon: "user",
            id: "left_button_icon"
          }),
          {
            type: "text",
            id: "login_text",
            label: "'Login' Text",
            info: "Shows when the user is not logged in, and takes them to the login page",
            default: "Log In"
          },
          {
            type: "text",
            id: "account_text",
            label: "'Account' Text",
            info: "Shows when the user is logged in, and takes them to the account dashboard",
            default: "Account"
          },
          {
            type: "header",
            content: "Right Button"
          },
          ...icon({
            default_icon: "pen",
            id: "right_button_icon"
          }),
          {
            type: "text",
            id: "register_text",
            label: "'Register' Text",
            info: "Always visible, and takes the user to the register page",
            default: "Register"
          },
        ]
      },
    ]
  }),
  ...dialogPresets({
    presets_main: [
      {
        type: "navigation"
      },
      {
        type: "mega_menu"
      }
    ],
    presets_footer: [
      {
        type: "user-buttons"
      }
    ],
    name: "Navigation Drawer"
  })
};
