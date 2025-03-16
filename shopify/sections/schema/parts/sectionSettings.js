/**
 * Spacing
 * - The global part used across most sections to generate
 *   consistent spacing. Instructions can be fed into
 *   ...sectionSettings() to alter the default spacing settings
 *   based on the section it's featured in.
 * -
 * Example:
 *  ...content({
*    default_width: 722
 *  })
 */

module.exports = (
  {
    spacing = true,
    padding = true,
    width = true,
    bg = true,
    secondary_bg = false,
    text_color = true,
    default_width = 0,
    default_bg = "transparent",
    default_secondary_bg = "#F7F7F7",
    default_spacing = "lg",
    default_padding = "contained",
    default_text_color = "dark"
  } = {}) => {
  return [
    {
      type: "header",
      content: "Section Settings",
    },
    spacing && {
      type: "select",
      id: "spacing",
      label: "Spacing",
      options: [
        { value: "0", label: "None" },
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
      ],
      default: default_spacing,
    },
    padding && {
      type: "select",
      id: "padding",
      label: "Container",
      options: [
        {
          value: "full",
          label: "Full",
        },
        {
          value: "contained",
          label: "Contained",
        },
        {
          value: "padded",
          label: "Padded", // TODO: Find better name
        },
      ],
      default: default_padding,
    },
    width && {
      type: "number",
      id: "width",
      label: "Width",
      info: "Uses px. Setting this value to 0 will set no max width.",
      default: default_width,
    },
    bg && {
      type: "color",
      id: "background_color",
      label: "Background Color",
      default: `${default_bg}`
    },
    spacing && {
      type: "checkbox",
      id: "color_spacing",
      label: "Apply Background Color to Spacing",
      info: "If checked, then the chosen background color option will be applied to the section spacing.",
      default: false
    },
    secondary_bg && {
      type: "color",
      id: "secondary_background_color",
      label: "Secondary Background Color",
      default: `${default_secondary_bg}`
    },
    text_color && {
      type: "select",
      id: "text_color",
      label: "Text Color",
      options: [
        { value: "dark", label: "Dark" },
        { value: "light", label: "Light" },
      ],
      default: default_text_color,
    }
  ].filter(Boolean);
};
