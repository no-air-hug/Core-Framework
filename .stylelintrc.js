const { propertyGroups } = require("stylelint-config-clean-order");

const propertiesOrder = propertyGroups.map((properties) => ({
  noEmptyLineBetween: true,
  emptyLineBefore: "never", // Don't add empty lines between order groups.
  properties,
}));

/** @returns {import("stylelint").Config} */
module.exports = {
  ignoreFiles: ["node_modules", "dist", "shopify", "**/*.{js,ts,tsx,liquid}"],
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-clean-order/error",
  ],
  plugins: ["stylelint-order"],
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  rules: {
    // Core
    "declaration-no-important": true,
    "no-descending-specificity": null,
    "selector-class-pattern": null,
    "scss/no-global-function-names": null,
    "scss/dollar-variable-pattern": null,
    "scss/at-rule-no-unknown": null,
    "scss/operator-no-newline-after": null,
    // Order
    "order/properties-order": [
      propertiesOrder,
      {
        severity: "error",
        unspecified: "bottomAlphabetical",
      },
    ],
  },
};
