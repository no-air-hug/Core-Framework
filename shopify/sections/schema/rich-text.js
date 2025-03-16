const sectionSettings = require("./parts/sectionSettings");
const position = require("./parts/position");
const cta = require("./parts/cta");
const ctaSettings = require("./parts/ctaSettings");

module.exports = {
  name: "Rich Text",
  tag: "section",
  class: "o-row shopify-section--rich-text",
  disabled_on: {
    groups: ["header", "footer", "custom.dialogs"],
  },
  presets: [
    {
      name: "Rich Text",
      blocks: [
        {
          type: "heading",
        },
        {
          type: "text",
        },
      ],
    },
  ],
  settings: [
    ...sectionSettings({
      default_width: 752
    }),
    ...position(),
  ],
  blocks: [
    {
      type: "overline",
      name: "Overline",
      settings: [
        {
          type: "inline_richtext",
          id: "text",
          label: "Overline",
        },
      ],
    },
    {
      type: "heading",
      name: "Heading",
      settings: [
        {
          type: "richtext",
          id: "title",
          label: "Heading",
          info: "Wrap text with [highlight]...[/highlight] to display it in highlight color",
        },
        {
          type: "select",
          id: "heading_size",
          label: "Heading size",
          options: [
            { value: "lg", label: "lg (18px)" },
            { value: "xl", label: "xl (20px)" },
            { value: "2xl", label: "2xl (24px)" },
            { value: "3xl", label: "3xl (28px)" },
            { value: "4xl", label: "4xl (32px)" },
            { value: "5xl", label: "5xl (36px)" },
            { value: "6xl", label: "6xl (40px)" },
            { value: "7xl", label: "7xl (56px)" },
            { value: "8xl", label: "8xl (64px)" },
            { value: "9xl", label: "9xl (72px)" },
          ],
          default: "2xl",
        },
        {
          type: "select",
          id: "heading_size_desktop",
          label: "Heading size on desktop",
          options: [
            { value: "", label: "as above" },
            { value: "lg", label: "lg (18px)" },
            { value: "xl", label: "xl (20px)" },
            { value: "2xl", label: "2xl (24px)" },
            { value: "3xl", label: "3xl (28px)" },
            { value: "4xl", label: "4xl (32px)" },
            { value: "5xl", label: "5xl (36px)" },
            { value: "6xl", label: "6xl (40px)" },
            { value: "7xl", label: "7xl (56px)" },
            { value: "8xl", label: "8xl (64px)" },
            { value: "9xl", label: "9xl (72px)" },
          ],
          default: "",
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
          info: "Wrap text with [highlight]...[/highlight] to display it in highlight color",
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
          default: "base",
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
          default: "",
        },
      ],
    },
    {
      type: "ctas",
      name: "CTAs",
      settings: [
        ...ctaSettings({
          cta_alignment: true,
          cta_spacing: false
        }),
        ...cta({
          default_text: "",
          default_icon: "none"
        }),
        ...cta({
          index: 2,
          default_text: "",
          default_style: "secondary",
          default_icon: "none"
        })
      ],
    },
  ],
};
