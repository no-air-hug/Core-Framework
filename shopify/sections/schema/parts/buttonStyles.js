/**
 * Button Styles
 * - The part used across most sections to generate
 *   consistent button styles.
 * -
 * Example:
 *  ...buttonStyles({
 *  id: "cta_styles",
 *  label: "CTA Styles",
 *  default_style: "underline"
 * }),
 */

module.exports = (
  {
    id = "button_style",
    label = "Button Styles",
    info = "",
    default_style = "primary"
  } = {}) => {
  return [
    info === "" ?
      {
        type: "select",
        id: id,
        label: label,
        options: [
          {
            value: "primary",
            label: "Primary",
          },
          {
            value: "secondary",
            label: "Secondary",
          },
          {
            value: "tertiary",
            label: "Tertiary",
          },
          {
            value: "underline",
            label: "Underline",
          },
        ],
        default: default_style,
      } :
      {
        type: "select",
        id: id,
        label: label,
        info: info,
        options: [
          {
            value: "primary",
            label: "Primary",
          },
          {
            value: "secondary",
            label: "Secondary",
          },
          {
            value: "tertiary",
            label: "Tertiary",
          },
          {
            value: "underline",
            label: "Underline",
          },
        ],
        default: default_style,
      }
  ].filter(Boolean)
};
