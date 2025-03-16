import { KlevuTypeOfRecord } from "@klevu/core";

const { klevuSettings } = window;

export const config: ExtendedKlevuConfig = {
  apiKey: `${klevuSettings?.global.apiKey}`,
  url: `${klevuSettings?.url.search}`,
  searchRecords: [
    /**
     * Notes:
     *  - Record: The KlevuTypeOfRecord that's relevant to the content to show.
     *  - Label: Naming for the relevant content's tab.
     */
    {
      record: KlevuTypeOfRecord.Product,
      label: "Products",
    },
    // TODO: Tabs work, and generate fine but need to actually filter out the content based on the selected tab.
    // {
    //   record: KlevuTypeOfRecord.Cms,
    //   label: "Content",
    // },
    // {
    //   record: KlevuTypeOfRecord.Category,
    //   label: "Categories",
    // },
  ],
  eventsApiV1Url: "https://stats.ksearchnet.com/analytics/",
  eventsApiV2Url: "https://stats.ksearchnet.com/analytics/collect",
  visitorServiceUrl: "https://visitor.service.ksearchnet.com/public/1.0",
  viewports: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    "4xl": "1680px",
  },
  grid: {
    columns: {
      views: {
        small: {
          sm: 1,
          md: 1,
          lg: 2,
          "4xl": 2,
        },
        large: {
          sm: 2,
          md: 2,
          lg: 3,
          "4xl": 3,
        },
      },
    },
  },
};
