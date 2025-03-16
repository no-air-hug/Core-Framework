/**
 * Section Header
 * - The global part used across most sections to generate
 *   a consistent header. Instructions can be fed into
 *   ...sectionHeader() to alter it's default content
 *   settings based on the section it's featured in.
 * -
 * Example:
 *  ...sectionHeader({
 *    content_settings: {
 *      default_heading: "Header",
 *      default_content_width: 600
 *    },
 *    additional_settings: [
 *      {
 *        type: "number",
 *        id: "header_count_cap",
 *        label: "Count Cap",
 *        info: "If '[[count']] if referenced inside of the section header, then it'll return the available product count for the assigned collection.",
 *        default: 90
 *      },
 *    ]
 *  }),
 */

const content = require("./content");

module.exports = (
  {
    info = "The section's header.",
    content_settings = {}, // Rename provided content_settings to avoid conflicts
    additional_settings = [],
  } = {}) => {

  // Define default content settings - this prevents them from being overwritten.
  const defaultContentSettings = {
    default_content_width: 0,
    default_heading_size_mob: "2xl",
    default_heading_size_dsk: "",
    default_heading: "Section Heading",
    vertical_position_setting: false,
    color_scheme: false,
    cta_settings_info: "Control the spacing and sizing of the CTAs. Spacing only works when the CTAs are stacked.",
    cta_spacing: true,
    offset_heading: false
  };

  // Merge provided content settings with default content settings
  content_settings = { ...defaultContentSettings, ...content_settings };

  return [
    {
      type: "section_header",
      name: "Section Header",
      limit: 1,
      settings: [
        {
          type: "header",
          content: "Section Header",
          info: info
        },
        {
          type: "checkbox",
          id: "aside_cta",
          label: "Aside CTA",
          info: "Positions the CTA to the right of the text. Note: Only applies on tablet and desktop, and this will disable position-relate, and spacing-related settings for those viewports. If slider arrows are present on the header, If slider arrows are enabled, then these will replace the CTA.",
          default: true
        },
        ...additional_settings,
        ...content({ content_settings })
      ],
    },
  ].filter(Boolean)
};
