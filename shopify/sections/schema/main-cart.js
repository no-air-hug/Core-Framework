const sectionSettings = require("./parts/sectionSettings");
const cta = require("./parts/cta");
const buttonStyles = require("./parts/buttonStyles");

module.exports = {
  name: "Cart",
  tag: "section",
  class: "o-row shopify-section--cart",
  enabled_on: {
    templates: ["cart"],
  },
  presets: [
    {
      name: "Cart",
      blocks: [
        {
          type: "text"
        },
        {
          type: "subtotal"
        },
        {
          type: "buttons"
        }
      ]
    }
  ],
  settings: [
    {
      type: "header",
      content: "Settings",
    },
    ...sectionSettings({
      default_width: 1180,
      default_spacing: "0",
      padding: false
    }),
    {
      type: "color",
      id: "summary_background_color",
      label: "Summary Background Color",
      default: "#f7f7f7"
    },
    {
      type: "select",
      id: "summary_text_color",
      label: "Summary Text Color",
      options: [
        { value: "dark", label: "Dark" },
        { value: "light", label: "Light" },
      ],
      default: "dark",
    },
    ...cta({
      header: "Empty Cart 'Continue' CTA",
      default_text: "Continue shopping",
      default_icon: "none"
    })
  ],
  blocks: [
    {
      type: "subtotal",
      name: "Subtotal",
      limit: 1,
    },
    {
      type: "buttons",
      name: "Buttons",
      limit: 1,
      settings: [
        ...buttonStyles({
          id: "checkout_button_style",
          label: "Checkout Button Style",
          default_style: "primary"
        })
      ]
    },
    {
      type: "free_delivery",
      name: "Free delivery",
      limit: 1,
      settings: [
        {
          type: "paragraph",
          content: "The free delivery threshold can be updated in the global theme settings.",
        },
      ],
    },
    {
      type: "text",
      name: "Text",
      settings: [
        {
          type: "richtext",
          id: "text",
          label: "Text",
        },
      ],
    },
    {
      type: "@app",
    },
  ],
};
