const sectionSettings = require("./parts/sectionSettings");
const sectionHeader = require("./parts/sectionHeader");
const buttonStyles = require("./parts/buttonStyles");
const gridSpacing = require("./parts/gridSpacing");
const formFieldInput = require("./parts/formFieldInput");
const formFieldSelect = require("./parts/formFieldSelect");
const formFieldTextarea = require("./parts/formFieldTextarea");
const position = require("./parts/position");

module.exports = {
  name: "Contact Us (Customisable)",
  tag: "section",
  class: "o-row shopify-section--contact-form",
  disabled_on: {
    groups: ["header", "custom.dialogs"],
  },
  presets: [
    {
      name: "Contact Us (Customisable)",
      blocks: [
        {
          type: "section_header"
        },
        {
          type: "field_name"
        },
        {
          type: "field_email"
        },
        {
          type: "field_phone"
        },
        {
          type: "field_type"
        },
        {
          type: "field_body"
        },
        {
          type: "field_order"
        },
        {
          type: "submit_button"
        },
        {
          type: "field_errors"
        },
      ]
    }
  ],
  settings: [
    ...sectionSettings({
      default_width: 500
    }),
    ...gridSpacing({
      header: "Form Spacing",
    })
  ],
  blocks: [
    ...sectionHeader({
      content_settings: {
        default_heading: "<p>Contact Us</p>",
        default_text: "<p>Send us your queries below!</p>",
        content_settings: {
          default_position: "center"
        }
      }
    }),
    {
      type: "field_name",
      name: "Field (Name)",
      limit: 1,
      settings: [
        ...formFieldInput({
          // Content Settings
          default_label_text: "Name",
          default_placeholder_text: "Enter your name",
          default_required_checkbox: true,
          // Advanced Settings
          default_type: "text",
          default_property: "name",
          default_value: "{%- if form.name -%}{{- form.name -}}{%- elsif customer -%}{{- customer.name -}}{%- endif -%}",
        })
      ]
    },
    {
      type: "field_email",
      name: "Field (Email)",
      limit: 1,
      settings: [
        ...formFieldInput({
          // Content Settings
          default_label_text: "Email address",
          default_placeholder_text: "Enter your email address",
          default_required_checkbox: true,
          // Advanced Settings
          default_type: "email",
          default_property: "email",
          default_value: "{% if form.email %}{{ form.email }}{% elsif customer %}{{ customer.email }}{% endif %}",
        })
      ]
    },
    {
      type: "field_phone",
      name: "Field (Phone)",
      limit: 1,
      settings: [
        ...formFieldInput({
          // Content Settings
          default_label_text: "Phone number",
          default_placeholder_text: "Enter your phone number",
          default_required_checkbox: true,
          // Advanced Settings
          default_type: "tel",
          default_property: "phone",
          default_value: "{% if form.phone %}{{ form.phone }}{% elsif customer %}{{ customer.phone }}{% endif %}",
        })
      ]
    },
    {
      type: "field_type",
      name: "Field (Type)",
      limit: 1,
      settings: [
        ...formFieldSelect({
          // Content Settings
          default_label_text: "Enquiry type",
          default_required_checkbox: true,
          // Advanced Settings
          default_property: "type",
        })
      ]
    },
    {
      type: "field_body",
      name: "Field (Body)",
      limit: 1,
      settings: [
        ...formFieldTextarea({
          // Content Settings
          default_label_text: "Message",
          default_placeholder_text: "Enter your message",
          default_required_checkbox: true,
          // Advanced Settings
          default_property: "body",
        })
      ]
    },
    {
      type: "field_order",
      name: "Field (Order)",
      limit: 1,
      settings: [
        ...formFieldInput({
          // Content Settings
          default_label_text: "Order Id",
          default_placeholder_text: "Enter your order id, if you have one",
          default_required_checkbox: false,
          // Advanced Settings
          default_type: "text",
          default_property: "order",
        })
      ]
    },
    {
      type: "field_custom-input",
      name: "Field (Custom Input)",
      settings: [
        ...formFieldInput()
      ]
    },
    {
      type: "field_custom-select",
      name: "Field (Custom Select)",
      settings: [
        ...formFieldSelect()
      ]
    },
    {
      type: "field_custom-textarea",
      name: "Field (Custom Textarea)",
      settings: [
        ...formFieldTextarea()
      ]
    },
    {
      type: "submit_button",
      name: "Submit Button",
      limit: 1,
      settings: [
        ...position({
          info: "Position the form's submission button.",
          default_position: "center"
        }),
        ...buttonStyles(),
        {
          type: "text",
          id: "text",
          label: "Button Text",
          default: "Send Message"
        },
      ]
    },
    {
      type: "field_errors",
      name: "Field (Errors)",
      limit: 1,
      settings: [
        {
          type: "header",
          content: "Success Messaging"
        },
        {
          type: "text",
          id: "success_message",
          label: "Success Message",
          default: "Thanks for contacting us. We'll get back to you as soon as possible."
        },
        {
          type: "checkbox",
          id: "preview_success",
          label: "Preview Success Content",
          info: "Only one preview (Success/Error) can be activate at a time",
          default: false
        },
        {
          type: "header",
          content: "Error Messaging"
        },
        {
          type: "text",
          id: "error_heading",
          label: "Error Content Heading",
          default: "Please adjust the following:"
        },
        {
          type: "checkbox",
          id: "preview_error",
          label: "Preview Error Message",
          info: "Only one preview (Success/Error) can be activate at a time",
          default: false
        }
      ]
    },
  ],
};
