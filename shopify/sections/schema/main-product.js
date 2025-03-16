const sectionSettings = require("./parts/sectionSettings");
const icon = require("./parts/icon");
const buttonStyles = require("./parts/buttonStyles");

module.exports = {
  name: "Product Information",
  tag: "section",
  class: "o-row shopify-section--product",
  enabled_on: {
    templates: ["product"],
  },
  presets: [
    {
      name: "Product Information",
      blocks: [
        {
          type: "stickers",
        },
        {
          type: "header_start",
        },
        {
          type: "title",
        },
        {
          type: "rating",
        },
        {
          type: "price",
        },
        {
          type: "header_end",
        },
        {
          type: "box_start",
        },
        {
          type: "variant_picker",
        },
        {
          type: "quantity_selector",
        },
        {
          type: "estimated_delivery",
        },
        {
          type: "box_end",
        },
        {
          type: "buy_buttons",
        },
        {
          type: "pickup_availability",
        },
        {
          type: "sku",
        },
        {
          type: "inventory",
        },
        {
          type: "description",
        },
      ],
    },
  ],
  settings: [
    ...sectionSettings({
      padding: false,
      secondary_bg: true,
    }),
    {
      type: "checkbox",
      id: "enable_sticky_info",
      default: true,
      label: "Enable sticky content on desktop",
    },
    {
      type: "header",
      content: "Media",
      info: "Learn more about [media types.](https://help.shopify.com/manual/products/product-media)",
    },
    {
      type: "checkbox",
      id: "constrain_to_viewport",
      default: false,
      label: "Constrain media to screen height",
      info: "Forces media height to fit within viewport",
    },
    {
      type: "select",
      id: "media_fit",
      options: [
        {
          value: "contain",
          label: "Original",
        },
        {
          value: "cover",
          label: "Fill",
        },
      ],
      default: "contain",
      label: "Media fit",
    },
    {
      type: "checkbox",
      id: "hide_variants",
      default: false,
      label: "Hide other variants’ media after selecting a variant",
    },
    {
      type: "checkbox",
      id: "hide_variants_by_alt",
      default: false,
      label: "Use alt to assign media to product variants",
    },
  ],
  blocks: [
    {
      type: "@app",
    },
    {
      type: "box_start",
      name: "[---- Box start ----]",
      limit: 1,
    },
    {
      type: "box_end",
      name: "[---- Box end ----]",
      limit: 1,
    },
    {
      type: "header_start",
      name: "[---- Header start ----]",
      limit: 1,
    },
    {
      type: "header_end",
      name: "[---- Header end ----]",
      limit: 1,
    },
    {
      type: "divider",
      name: "---- Divider ----",
      settings: [],
    },
    {
      type: "stickers",
      name: "Stickers",
      limit: 1,
      settings: [
        {
          type: "paragraph",
          content:
            "To display sticker badges, add a tag that starts with `badge_` e.g. `badge_Hello World` to the product.",
        },
      ],
    },
    {
      type: "title",
      name: "Title",
      limit: 1,
    },
    {
      type: "price",
      name: "Price",
      limit: 1,
    },
    {
      type: "variant_picker",
      name: "Variant picker",
      limit: 1,
      settings: [
        {
          type: "select",
          id: "picker_type_default",
          label: "Default type",
          options: [
            {
              value: "button",
              label: "Button",
            },
          ],
          default: "button",
        },
        {
          type: "text",
          id: "picker_type_swatch",
          label: "Swatch type",
          default: "color, colour",
          info: "Selected variant options to display as swatch, comma separated list of option names.",
        },
        {
          type: "header",
          content: "Size guide",
        },
        {
          type: "page",
          id: "size_guide_page",
          label: "Size guide page",
        },
      ],
    },
    {
      type: "estimated_delivery",
      name: "Estimated delivery",
      limit: 1,
    },
    {
      type: "buy_buttons",
      name: "Buy buttons",
      limit: 1,
      settings: [
        {
          type: "checkbox",
          id: "show_dynamic_checkout",
          default: false,
          label: "Show dynamic checkout buttons",
          info: "Using the payment methods available on your store, customers see their preferred option, like PayPal or Apple Pay. [Learn more](https://help.shopify.com/manual/using-themes/change-the-layout/dynamic-checkout)",
        },
      ],
    },
    {
      type: "pickup_availability",
      name: "Pickup Availability",
      limit: 1,
    },
    {
      type: "sku",
      name: "SKU",
      limit: 1,
    },
    {
      type: "rating",
      name: "Star Rating",
      limit: 1,
      settings: [
        {
          type: "header",
          content: "Star Rating",
          info: "The star rating is generated from either Yotpo or Shopify reviews, the Yotpo rating will only show if a valid value is set inside of the 'Star rating instance ID' under the global theme settings for Yotpo, and will overwrite the Shopify Product Reviews rating"
        }
      ]
    },
    {
      type: "inventory",
      name: "Inventory",
      limit: 1,
      settings: [
        {
          type: "range",
          id: "inventory_threshold",
          label: "Low inventory threshold",
          min: 0,
          max: 100,
          step: 1,
          info: "Choose 0 to always show in stock if available.",
          default: 10
        },
        {
          type: "checkbox",
          id: "show_inventory_quantity",
          label: "Show inventory count",
          default: true
        }
      ]
    },
    {
      type: "quantity_selector",
      name: "Quantity selector",
      limit: 1,
    },
    {
      type: "usps",
      name: "USPs",
      limit: 1,
      settings: [
        {
          type: "text",
          id: "title_1",
          label: "1) Title",
        },
        {
          type: "image_picker",
          id: "image_1",
          label: "1) Image",
        },
        {
          type: "text",
          id: "title_2",
          label: "2) Title",
        },
        {
          type: "image_picker",
          id: "image_2",
          label: "2) Image",
        },
        {
          type: "text",
          id: "title_3",
          label: "3) Title",
        },
        {
          type: "image_picker",
          id: "image_3",
          label: "3) Image",
        },
      ],
    },
    {
      type: "description",
      name: "Description",
      limit: 1,
      settings: [
        {
          type: "text",
          id: "title",
          label: "Title",
          default: "Description",
        },
        {
          type: "richtext",
          id: "text",
          label: "Text",
          info: "Defaults to product description, fill in this field or connect dynamic source to override",
        },
      ],
    },

    {
      type: "text",
      name: "Text",
      limit: 1,
      settings: [
        {
          type: "text",
          id: "title",
          label: "Title",
        },
        {
          type: "richtext",
          id: "text",
          label: "Text",
        },
      ],
    },
    {
      type: "custom_liquid",
      name: "Custom liquid",
      settings: [
        {
          type: "liquid",
          id: "custom_liquid",
          label: "Custom liquid",
        },
      ],
    },
    {
      type: "popup",
      name: "Pop-up",
      settings: [
        ...icon(),
        {
          type: "text",
          id: "title",
          label: "Title",
        },
        {
          id: "page",
          type: "page",
          label: "Page",
        },
      ],
    },

    {
      type: "share",
      name: "Share",
      limit: 1,
      settings: [
        {
          type: "text",
          id: "title",
          label: "Title",
          default: "Share on",
        },
        {
          type: "paragraph",
          content:
            "If you include a link in social media posts, the page's featured image will be shown as the preview image. [Learn more](https://help.shopify.com/manual/online-store/images/showing-social-media-thumbnail-images).",
        },
        {
          type: "paragraph",
          content:
            "A store title and description are included with the preview image. [Learn more](https://help.shopify.com/manual/promoting-marketing/seo/adding-keywords#set-a-title-and-description-for-your-online-store).",
        },
      ],
    },
    {
      type: "complementary",
      name: "Complementary products",
      limit: 1,
      settings: [
        {
          type: "text",
          id: "title",
          label: "Title",
          default: "Complete the package",
        },
        {
          type: "select",
          id: "implementation",
          label: "Implementation",
          options: [
            {
              value: "api",
              label: "API",
            },
            {
              value: "meta",
              label: "Metafields",
            },
          ],
          default: "api",
        },
        {
          type: "product_list",
          id: "products",
          label: "Products",
          limit: 10,
          info: "Use metafields to populate products instead of API",
        },
        {
          type: "range",
          id: "limit",
          min: 1,
          max: 10,
          step: 1,
          default: 2,
          label: "Maximum products to show",
        },
        {
          type: "paragraph",
          content:
            "To select complementary products, add the Search & Discovery app. [Learn more](https://help.shopify.com/manual/online-store/search-and-discovery/product-recommendations)",
        },
        ...buttonStyles({
          id: "buy_button_style",
          label: "Buy Button Style",
          default_style: "primary"
        }),
      ],
    },
    {
      type: "collapsible_tab",
      name: "Collapsible row",
      settings: [
        {
          type: "text",
          id: "title",
          default: "Collapsible row",
          info: "Include a heading that explains the content.",
          label: "Title",
        },
        ...icon(),
        {
          type: "richtext",
          id: "text",
          label: "Row content",
        },
        {
          type: "page",
          id: "page",
          label: "Row content from page",
        },
      ],
    },
  ],
};
