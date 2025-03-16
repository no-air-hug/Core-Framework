module.exports = {
  name: "Countdown",
  tag: "section",
  class: "shopify-section--utility-countdown",
  disabled_on: {
    groups: ["header", "custom.dialogs", "footer"]
  },
  presets: [
    {
      name: "Countdown",
      blocks: [
        {
          type: "text_countdown"
        }
      ]
    }
  ],
  blocks: [
    {
      type: "text_countdown",
      name: "Text Countdown",
      settings: [
        {
          type: "header",
          content: "Countdown",
          info: "To acquire unix timestamps for your desired start and end date, visit this [site](https://www.unixtimestamp.com/) to convert regular dates to unix timestamps."
        },
        {
          type: "number",
          id: "start_uts",
          label: "Start Unix Timestamp",
          info: "If set to 0, the current time will be used instead."
        },
        {
          type: "number",
          id: "end_uts",
          label: "End Unix Timestamp",
          default: 4130476091
        },
        {
          type: "text",
          id: "text_pattern",
          label: "Text Pattern",
          default: "// time //"
        }
      ]
    }
  ]
};
