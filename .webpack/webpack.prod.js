const { merge } = require("webpack-merge");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (baseConfig) => {
  /** @type {import("webpack/types").Configuration} */
  const prodConfig = {
    mode: "production",
    output: {
      clean: true, // Remove old files before build
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              comparisons: false,
              inline: 2,
              ecma: 2018,
            },
          },
        }),
        new CssMinimizerPlugin({
          minify: CssMinimizerPlugin.lightningCssMinify,
          minimizerOptions: {
            targets: require("lightningcss").browserslistToTargets(
              require("browserslist")(),
            ),
            preset: ["default", { discardComments: { removeAll: true } }],
            drafts: {
              customMedia: true,
            },
          },
        }),
      ],
    },
  };

  return merge(prodConfig, baseConfig);
};
