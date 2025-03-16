/**
 * Content
 * - The global part used across most sections to generate
 *   consistent content. Instructions can be fed into
 *   ...content() to alter it's default content settings
 *   based on the section it's featured in.
 * -
 * Example:
 *  ...content({
 *    multiple_ctas: true
 *  })
 */

const cta = require("./cta");
const ctaSettings = require("./ctaSettings");
const truncateText = require("./truncateText");
const position = require("./position");

module.exports = ({
  /* Setting Defaults */
  color_scheme = true, // Allows the user to toggle light/dark text
  offset_heading = true, // Allows the user to offset the heading from the content width
  /* Content Defaults */
  default_content_width = 0, // The maximum content width.
  // - Headings
  heading_setting = true, // The heading setting - disable if you want to parse in headings manually via the content snippet.
  default_heading = "", // The default heading.
  default_heading_offset = 0, // Offsets the heading from the content width, allows it to expand beyond the content width.
  default_heading_size_mob = "2xl", // The default heading text size on mobile.
  default_heading_size_dsk = "", // The default heading text size on desktop.
  // - Text
  text_setting = true, // The text setting - disable if you want to parse in text manually via the content snippet.
  default_text = "", // The default text.
  default_text_size_mob = "md", // The default description text size on mobile.
  default_text_size_dsk = "", // The default description text size on desktop.
  // - Positioning
  vertical_position_setting = true, // Adds setting to allow the content to be aligned vertically on desktop.
  default_vertical_position = "center", // the default vertical position on desktop
  default_position = "start", // Default positioning setting
  default_position_desktop = "", // Default positioning setting on desktop
  // - Truncation
  truncate_text_setting = false, //  Enables the 'object_truncate-text' module
  default_truncate_state = "false", // the default state of the 'object_truncate-text'
  default_max_words = 50, // the max words to display initially for 'object_truncate-text'
  default_trigger_more_text = "Read More", // the 'object_truncate-text' trigger more text
  default_trigger_less_text = "Read Less", // the 'object_truncate-text' trigger less text
  // - Other
  grow_content_setting = false, // Adds setting to apply a flex-grow to certain elements inside content.
  default_grow_content = "none", // the default spread content setting value
  /* CTA Defaults */
  ctas = true, // Enable/Disable all CTAS and CTA_related settings.
  multiple_ctas = false, // If CTA's are enabled, by default there's only one - this adds another.
  cta_settings_info = "Control the spacing and sizing of the CTAs.",
  cta_spacing = true, // Enable/Disable the CTA Spacing settings
  cta_sizes = true, // Enable/Disable the CTA Sizes settings
  cta_alignment = false, // Enable/Disable the CTA Alignment settings (only necesssary when generating multiple_ctas)
  default_cta_size = "full", // The default CTA size on mobile viewports.
  default_cta_size_desktop = "small", // The default CTA size on desktop viewports.
  default_cta_align = "vertical", // The default CTA alignment on mobile
  default_cta_align_desktop = "horizontal", // The default CTA alignment on desktop.
} = {}) => {
  return [
    {
      type: "header",
      content: "Content Settings",
    },
    {
      type: "number",
      id: "content_width",
      label: "Content Width on Desktop",
      info: "Set in px. 0 will set no fixed content width",
      default: default_content_width,
    },
    offset_heading && {
      type: "number",
      id: "offset_heading",
      label: "Offset Heading from Content Width",
      info: "Set in px. Allows you to expand the heading to be wider than the content width. 0 will set no heading offset.",
      default: default_heading_offset,
    },
    {
      type: "range",
      id: "content_gap",
      label: "Content Gap",
      min: 0,
      max: 48,
      default: 16,
      step: 4,
      unit: "px",
    },
    {
      type: "range",
      id: "content_gap_desktop",
      label: "Content Gap on Desktop",
      min: 0,
      max: 48,
      default: 16,
      step: 4,
      unit: "px",
    },
    ...(ctas
      ? ctaSettings({
          info: cta_settings_info,
          cta_alignment: multiple_ctas,
          cta_spacing: cta_spacing,
          cta_sizes: cta_sizes,
          cta_alignment: cta_alignment,
          default_cta_size: default_cta_size,
          default_cta_size_desktop: default_cta_size_desktop,
          default_cta_align: default_cta_align,
          default_cta_align_desktop: default_cta_align_desktop,
        })
      : []),
    {
      type: "header",
      content: "Typography Settings",
    },
    ...position({
      default_position: default_position,
      default_position_desktop: default_position_desktop,
    }),
    vertical_position_setting && {
      type: "select",
      id: "vertical_position",
      label: "Vertical position on desktop",
      options: [
        { value: "top", label: "Top" },
        { value: "center", label: "Center" },
        { value: "bottom", label: "Bottom" },
      ],
      default: default_vertical_position,
    },
    ...(grow_content_setting
      ? [
          {
            type: "select",
            id: "grow_content",
            label: "Grow Content",
            info: "Grows the height of a specific area of the content block to push other areas away from it",
            options: [
              {
                value: "none",
                label: "None",
              },
              {
                value: "overline",
                label: "Overline",
              },
              {
                value: "heading",
                label: "Heading",
              },
              {
                value: "text",
                label: "Text",
              },
            ],
            default: default_grow_content,
          },
        ]
      : []),
    color_scheme && {
      type: "paragraph",
      content: "Style",
    },
    color_scheme && {
      type: "select",
      id: "color",
      label: "Color",
      options: [
        { value: "dark", label: "Dark" },
        { value: "light", label: "Light" },
      ],
      default: "dark",
    },
    {
      type: "paragraph",
      content: "Heading",
    },
    {
      type: "select",
      id: "heading_size",
      label: "Heading size",
      options: [
        { value: "base", label: "base (16px)" },
        { value: "lg", label: "lg (18px)" },
        { value: "xl", label: "xl (20px)" },
        { value: "2xl", label: "2xl (24px)" },
        { value: "3xl", label: "3xl (28px)" },
        { value: "4xl", label: "4xl (32px)" },
        { value: "5xl", label: "5xl (36px)" },
        { value: "6xl", label: "6xl (40px)" },
        { value: "7xl", label: "7xl (48px)" },
        { value: "8xl", label: "8xl (64px)" },
        { value: "9xl", label: "9xl (72px)" },
      ],
      default: default_heading_size_mob,
    },
    {
      type: "select",
      id: "heading_size_desktop",
      label: "Heading size on desktop",
      options: [
        { value: "", label: "as above" },
        { value: "base", label: "base (16px)" },
        { value: "lg", label: "lg (18px)" },
        { value: "xl", label: "xl (20px)" },
        { value: "2xl", label: "2xl (24px)" },
        { value: "3xl", label: "3xl (28px)" },
        { value: "4xl", label: "4xl (32px)" },
        { value: "5xl", label: "5xl (36px)" },
        { value: "6xl", label: "6xl (40px)" },
        { value: "7xl", label: "7xl (48px)" },
        { value: "8xl", label: "8xl (64px)" },
        { value: "9xl", label: "9xl (72px)" },
      ],
      default: default_heading_size_dsk,
    },
    {
      type: "paragraph",
      content: "Text",
    },
    {
      type: "select",
      id: "text_size",
      label: "Text size",
      options: [
        { value: "2xs", label: "xs (10px)" },
        { value: "sm", label: "sm (12px)" },
        { value: "md", label: "md (14px)" },
        { value: "base", label: "base (16px)" },
        { value: "lg", label: "lg (18px)" },
        { value: "xl", label: "xl (20px)" },
        { value: "2xl", label: "2xl (24px)" },
      ],
      default: default_text_size_mob,
    },
    {
      type: "select",
      id: "text_size_desktop",
      label: "Text size on desktop",
      options: [
        { value: "", label: "as above" },
        { value: "2xs", label: "xs (10px)" },
        { value: "sm", label: "sm (12px)" },
        { value: "md", label: "md (14px)" },
        { value: "base", label: "base (16px)" },
        { value: "lg", label: "lg (18px)" },
        { value: "xl", label: "xl (20px)" },
        { value: "2xl", label: "2xl (24px)" },
      ],
      default: default_text_size_dsk,
    },
    ...(truncate_text_setting
      ? truncateText({
          default_truncate_state: default_truncate_state,
          default_max_words: default_max_words,
          default_trigger_more_text: default_trigger_more_text,
          default_trigger_less_text: default_trigger_less_text,
        })
      : []),
    {
      type: "header",
      content: "Content",
    },
    {
      type: "paragraph",
      content:
        "Wrap text with [highlight]...[/highlight] to display it in highlight color",
    },
    {
      type: "inline_richtext",
      id: "overline",
      label: "Overline",
    },
    heading_setting
      ? default_heading !== ""
        ? {
            type: "richtext",
            id: "heading",
            label: "Heading",
            info: "You can reference icons in your headings using [icon=icon_name]. Wrap text with [highlight]...[/highlight] to display it in highlight color",
            default: `<p>${default_heading}</p>`,
          }
        : {
            type: "richtext",
            id: "heading",
            info: "You can reference icons in your headings using [icon=icon_name]. Wrap text with [highlight]...[/highlight] to display it in highlight color",
            label: "Heading",
          }
      : null,
    text_setting
      ? default_text !== ""
        ? {
            type: "richtext",
            id: "text",
            label: "Description",
            default: `<p>${default_text}</p>`,
          }
        : {
            type: "richtext",
            id: "text",
            label: "Description",
          }
      : null,
    ...(ctas
      ? cta({
          default_text: "",
          default_icon: "none",
        })
      : []),
    ...(ctas && multiple_ctas
      ? cta({
          index: 2,
          default_text: "",
          default_style: "secondary",
          default_icon: "none",
        })
      : []),
  ].filter(Boolean);
};
