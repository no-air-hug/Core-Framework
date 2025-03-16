/**
 * CTAs
 * - The global part used across most sections to generate
 *   consistent CTAs. Instructions can be fed into ...cta()
 *   to alter it's default settings based on the section
 *   it's featured in.
 *
 *   To generate multiple CTAs on a single section, use the
 *   index setting to give the CTA a unique id. By default,
 *   index is set to 1, giving you (cta_1_text).
 * -
 * Example:
 *  ...cta({
 *    index: 2,
 *    default_text: "Shop all",
 *  }),
 *
 */

const icon = require("./icon");
const buttonStyles = require("./buttonStyles");

module.exports = ({
  index = 1,
  header = `CTA #${index}`,
  default_text = "Shop Now",
  default_style = "primary",
  default_icon = "arrow-right",
  default_icon_position = "right",
} = {}) => {
  return [
    {
      type: "header",
      content: header,
    },
    default_text !== "" && {
      type: "text",
      id: `cta_${index}_text`,
      label: `CTA #${index} Text`,
      default: default_text,
    } || {
      type: "text",
      id: `cta_${index}_text`,
      label: `CTA #${index} Text`,
    },
    ...icon({
      id: `cta_${index}_icon`,
      label: `CTA #${index} Icon`,
      default_icon: default_icon,
    }),
    {
      type: "select",
      id: `cta_${index}_icon-position`,
      label: `CTA #${index} Icon Position`,
      default: default_icon_position,
      options: [
        {
          value: "left",
          label: "Icon | Text",
        },
        {
          value: "right",
          label: "Text | Icon",
        },
      ],
    },
    {
      type: "url",
      id: `cta_${index}_link`,
      label: `CTA #${index} Link`,
    },
    ...buttonStyles({
      id: `cta_${index}_link_style`,
      label: `CTA #${index} Link Style`,
      default_style: default_style
    }),
    {
      type: "checkbox",
      id: `cta_${index}_target`,
      label: `Open CTA #${index} in a new tab?`,
      default: false,
    },
  ].filter(Boolean);
};
