/**
 * Pagination
 * - The global part used to set consistent read more
 *   settings across the site.
 * -
 * Example:
 *  ...truncateText({
 *    default_max_words: 25
 *  })
 *
 */

module.exports = ({
  default_truncate_state = "false",
  default_max_words = 50,
  default_trigger_more_text = "Read More",
  default_trigger_less_text = "Read Less"
} = {}) => {
  return [
    {
      type: "header",
      content: "Text Truncation",
      info: "Allows you to cap the amount of text initially displayed, and add a trigger to read more."
    },
    {
      type: "select",
      id: "truncate",
      label: "Truncate?",
      options: [
        {
          label: "Don't truncate",
          value: "false",
        },
        {
          label: "Truncate",
          value: "true",
        },
      ],
      default: default_truncate_state,
    },
    {
      type: "number",
      id: "max_words",
      label: "Max Words",
      info: "The amount of words before the text is clamped",
      default: default_max_words
    },
    {
      type: "range",
      id: "line_clamp_mob",
      label: "Line Clamp",
      info: "Screen Width: < 1023px | How many lines to display when the text is clamped",
      min: 0,
      max: 12,
      default: 4,
      step: 1,
      unit: "row",
    },
    {
      type: "range",
      id: "line_clamp_dsk",
      label: "Line Clamp on Desktop",
      info: "Screen Width: 1024px > | How many lines to display when the text is clamped",
      min: 0,
      max: 12,
      default: 8,
      step: 1,
      unit: "row",
    },
    {
      type: "text",
      id: "trigger_more_text",
      label: "Trigger 'More' Text",
      default: default_trigger_more_text
    },
    {
      type: "text",
      id: "trigger_less_text",
      label: "Trigger 'Less' Text",
      default: default_trigger_less_text
    },
  ];
};
