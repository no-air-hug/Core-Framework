module.exports = {
  name: "Shopper App Settings",
  tag: "section",
  class: "shopper-settings z-shopper-settings relative",
  presets: [{ name: "Shopper App Settings" }],
  settings: [
    {
      id: "show_visualisation",
      type: "checkbox",
      label: "Show Visualisation",
      default: false,
    },
    {
      type: "header",
      content: "Header and Footer settings",
    },
    {
      type: "textarea",
      id: "hidden_selector",
      label: "Selector for hidden elements",
      default: ".js-header-group, .js-footer-group",
    },
    {
      type: "text",
      id: "onboarding_hidden_selector",
      label: "Hide elements on onboarding screens",
      info: "Enter valid CSS selector to hide elements on onboarding and login screens",
    },
    {
      type: "header",
      content: "App Menu",
    },
    {
      type: "link_list",
      id: "main_menu",
      label: "App menu",
      default: "main-menu",
      info: "Select navigation you wish to display in the app",
    },
    {
      type: "header",
      content: "Swipe to like",
    },
    {
      type: "collection_list",
      id: "swipe_to_like",
      label: "Swipe to like collections",
      limit: 8,
    },
    {
      type: "header",
      content: "App Versions",
    },
    {
      type: "text",
      id: "ios_version",
      label: "iOS App Version",
      default: "1.0.0",
    },
    {
      type: "text",
      id: "android_version",
      label: "Android App Version",
      default: "1.0.0",
    },
    {
      type: "header",
      content: "Wishlist",
    },
    {
      type: "select",
      id: "wishlist_provider",
      label: "App Provider",
      options: [
        { value: "smart_wishlist", label: "Smart Wishlist" },
        { value: "wishlist_king", label: "Wishlist King" },
      ],
    },
  ],
  blocks: [
    {
      type: "market",
      name: "Market",
      limit: 10,
      settings: [
        {
          type: "text",
          id: "title",
          label: "Country",
          default: "United Kingdom",
        },
        {
          type: "text",
          id: "code",
          label: "Country Code",
          default: "GB",
        },
        {
          type: "url",
          id: "domain",
          label: "Market domain URL",
        },
      ],
    },
    {
      type: "account",
      name: "Account Links",
      limit: 10,
      settings: [
        {
          type: "text",
          id: "title",
          label: "Title",
          default: "Page Title",
        },
        {
          type: "select",
          id: "platform",
          label: "Platform",
          options: [
            { value: "both", label: "Both" },
            { value: "iso", label: "iOS" },
            { value: "android", label: "Android" },
          ],
          default: "both",
        },
        {
          type: "url",
          id: "url",
          label: "URL",
        },
      ],
    },
  ],
};
