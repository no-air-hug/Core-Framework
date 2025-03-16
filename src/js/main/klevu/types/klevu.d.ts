declare module "*.svg" {
  import * as React from "react";
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare const Klevu: {
  settings: {
    swatches: {
      utilisation: "variant-images" | "section-blocks" | "custom";
      limit: number;
    };
  };
  i18n: {
    quick_search: {
      triggers: {
        open: {
          accessibility: string;
          title: string;
        };
        close: {
          accessibility: string;
        };
      };
      input: {
        accessibility: string;
        placeholder: string;
      };
      submit: {
        accessibility: string;
      };
      results: {
        suggestions: {
          popular_suggestions: {
            title: string;
          };
          query_suggestions: {
            title: string;
          };
          no_results: string;
        };
        products: {
          trending_products: {
            title: string;
          };
          query_products: {
            title: string;
          };
          no_results: string;
        };
        view_all_results: string;
      };
    };
    search_landing: {
      no_results: string;
      facets: {
        results: {
          one: string;
          multiple: string;
        };
        filters: {
          title: string;
          clear_filters: string;
          dialog: {
            title: string;
            accessibility: {
              title: string;
              description: string;
            };
          };
          list: {
            price: {
              range: string;
            };
          };
        };
        sort_by: {
          title: string;
          options: {
            relevance: string;
            price_asc: string;
            price_desc: string;
            name_asc: string;
            name_desc: string;
            rating_asc: string;
            rating_desc: string;
            new_arrival_asc: string;
            new_arrival_desc: string;
            advanced_sort: string;
          };
        };
      };
      input: {
        heading: string;
        placeholder: string;
        accessibility: string;
      };
    };
    product_card: {
      pricing: {
        from_price: string;
      };
      swatches: {
        swatch_image_missing_error: string;
        more_options: string;
      };
    };
    view: {
      title: string;
    };
    pagination: {
      load_more: string;
      loaded: string;
    };
    debug: string;
  };
};

type KlevuRecordDetails = {
  record: KlevuTypeOfRecord;
  label: string;
};

type ExtendedKlevuConfig = {
  url: string;
  apiKey: string;
  searchRecords: KlevuRecordDetails[];
  eventsApiV2Url: string;
  eventsApiV1Url: string;
  visitorServiceUrl: string;
  viewports: Viewports;
  grid: {
    columns: {
      views: {
        small: {
          sm: number;
          md: number;
          lg: number;
          "4xl": number;
        };
        large: {
          sm: number;
          md: number;
          lg: number;
          "4xl": number;
        };
      };
    };
  };
};

type GridColumnView = "small" | "large";

type Viewports = {
  sm: string;
  md: string;
  lg: string;
  "4xl": string;
};

type Viewport = keyof Viewports;

type KlevuSwatchDetails = {
  id: string;
  colour: string;
  image?: string;
};

type KlevuSwatch = {
  [key: string]: SwatchDetails;
};

type KlevuSettings = {
  global: {
    apiKey: string | null;
  };
  search: {
    minChars: number | null;
    searchBoxSelector: string | null;
  };
  url: {
    search: string | null;
    landing: string | null;
  };
  powerUp: unknown;
};

interface Window {
  klevuSettings?: KlevuSettings;
}
