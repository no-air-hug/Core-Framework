

const { merge } = require("webpack-merge");

module.exports = (baseConfig) => {
  /**  @type {import('webpack/types').Configuration} */
  const devConfig = {
    mode: "development",
    // stats: "errors-only",
    stats: {
      all: false,
      errors: true,
      loggingDebug: ["sass-loader"],
    },
    watchOptions: {
      ignored: ["**/dist", "**/node_modules"],
    },
  };

  return merge(devConfig, baseConfig);
};
