const { fieldSize } = require("./formSettings");

/**
 * Form Field - Input
 * - The global part used across sections to generate
 *   consistent form field textarea settings.
 * -
 * Example:
 *  ...formFieldTextarea()
 */

module.exports = ({
  // Content Settings
  default_label_text = "Field Label",
  default_placeholder_text = "Field Placeholder",
  default_required_checkbox = true,
  // Advanced Settings
  advanced_settings = true,
  default_property = "",
  default_value = "",
} = {}) => {
  return [
    {
      type: "header",
      content: "Content Settings",
    },
    {
      type: "text",
      id: "label_text",
      label: "Label Text",
      default: default_label_text
    },
    {
      type: "text",
      id: "placeholder_text",
      label: "Placeholder Text",
      default: default_placeholder_text
    },
    {
      type: "checkbox",
      id: "required",
      label: "Required",
      default: default_required_checkbox
    },
    ...fieldSize(),
    advanced_settings && {
      type: "header",
      content: "Advanced Settings",
      info: "Requires knowledge of HTML"
    },
    advanced_settings && {
      type: "text",
      id: "property",
      label: "Input Property",
      info: "The input element's property for the value of it's name attribute, as in contact[{{ property }}]. This value must be unique when compared against any other property value in this section.",
      ...(default_property.length !== 0 ? { default: default_property } : false),
    },
    advanced_settings && {
      type: "liquid",
      id: "value",
      label: "Input Value",
      info: "The value of the input element's value attribute",
      ...(default_value.length !== 0 ? { default: default_value } : false),
    },
    advanced_settings && {
      type: "text",
      id: "dynamic_display",
      label: "Dynamic Display",
      info: "Specify the conditions for displaying this input by using the syntax: [select_block_type]:[select_block_option_index]. In this syntax, 'select_block_type' refers to the type value set within the custom select block, and 'select_block_option_index' represents the index of the option you want to associate this input with. i.e. if you have a select block with options 'Option 1, Option 2...' and you want this input to be visible only when 'Option 3' is chosen, you would enter 3"
    },
  ].filter(Boolean)
}
