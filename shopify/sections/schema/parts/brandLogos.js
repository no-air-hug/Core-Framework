/**
 * Brand Logos
 * - The global part used to display the brand logos.
 *   Allows you to easily switch between brand logos,
 *   and alter their colours.
 *
 * -
 * Example:
 *  ...brandLogos({
 *    default_logo: 'standard-logo'
 8  }),
 *
 */

const brandColors = require("./brandColors");

module.exports = (
  {
    id = "brand_logo",
    label = "Brand Logo",
    default_logo = "standard-logo"
  } = {}) => {
  return [
    {
      type: "select",
      id: id,
      label: label,
      default: default_logo,
      options: [
        {
          value: "none",
          label: "None",
        },
        {
          value: "standard-logo",
          label: "Standard Logo",
        }
      ]
    },
    ...brandColors("logo_colour", "Logo Colour", "#161616"),
    {
      type: "paragraph",
      content: "- OR -"
    },
    {
      type: "image_picker",
      id: "brand_image",
      label: "Brand Image",
    }
  ]
};
