const path = require("node:path");
const { globSync } = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const AssetsSnippetPlugin = require("./plugins/AssetsSnippetPlugin");
const SectionsSchemaPlugin = require("./plugins/SectionsSchemaPlugin");
const DoNotEditNoticePlugin = require("./plugins/DoNotEditNotice");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");

const devSetup = require("./webpack.dev");

const WORK_DIR = process.env.GITHUB_WORKSPACE || path.resolve(__dirname, "../");
const themeRoot = process.env.SHOPIFY_FLAG_PATH || path.join(WORK_DIR, "dist");

/**  @type {import('webpack/types').Configuration} */
const baseConfig = () => ({
  cache: {
    buildDependencies: {
      config: [__filename],
      packageJson: [path.join(WORK_DIR, "package.json")],
    },
    type: "filesystem",
    version: "1",
  },
  context: WORK_DIR,
  entry: {
    main: ["./src/js/index.ts", "./src/scss/main.scss"],
    ...globSync(`${WORK_DIR}/src/scss/sections/*.scss`).reduce((acc, curr) => {
      acc[`section-${path.basename(curr, ".scss")}`] = curr;
      return acc;
    }, {}),
  },
  experiments: {
    futureDefaults: true,
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.([tj]sx?)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrc: false,
              cacheDirectory: true,
              assumptions: {
                noNewArrows: true,
                setPublicClassFields: true,
              },
              presets: [
                "@babel/preset-typescript",
                [
                  "@babel/preset-env",
                  {
                    bugfixes: true,
                  },
                ],
              ],
              plugins: [
                "@babel/plugin-transform-runtime",
                "@babel/plugin-transform-react-jsx",
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { url: false },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: {
                  tailwindcss: {},
                },
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              api: "modern",
            },
          },
        ],
      },
    ],
  },
  optimization: {
    moduleIds: "deterministic",
    splitChunks: {
      chunks: "all",
      automaticNameDelimiter: ".",
      minChunks: 2,
      cacheGroups: {
        vendors: false,
        framework: {
          test: /(?<!node_modules.)[\\\/]node_modules[\\\/](react|react-dom|scheduler)[\\\/]/,
          name: "framework",
          chunks: "all",
          priority: 40,
          enforce: true,
        },
        lib: {
          test: /[\\\/]node_modules[\\\/]/,
          name: "lib",
          chunks: "all",
        },
      },
    },
  },
  output: {
    filename: "assets/[name].min.js",
    module: true,
    path: themeRoot,
    publicPath: "",
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"],
  },
  externals: {
    jquery: "jQuery",
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "assets/[name].min.css" }),
    new AssetsSnippetPlugin({
      manifestFileName: process.env.BUILD_MANIFEST,
    }),
    new DoNotEditNoticePlugin(),
    new SectionsSchemaPlugin({
      sections: path.resolve(WORK_DIR, "./shopify/sections"),
      schema: path.resolve(WORK_DIR, "./shopify/sections/schema"),
    }),

    new CopyPlugin({
      patterns: [
        {
          from: "./shopify",
          to({ context, absoluteFilename }) {
            if (absoluteFilename.includes("snippets")) {
              return `snippets/${path
                .relative(context + "/snippets", absoluteFilename)
                .replace(/[\\\/]/g, "")}`;
            }
            return "./";
          },
          info: {
            minimized: true,
          },
          globOptions: {
            ignore: ["**/sections/**"],
          },
        },
        {
          from: "./src/js/jquery",
          to: "assets/jquery.js",
          transformAll: (assets) => Buffer.concat(assets.map((a) => a.data)),
          noErrorOnMissing: true,
        },
      ],
    }),

    new RemoveEmptyScriptsPlugin(),
  ],
});

module.exports = (env = {}) => {
  return devSetup(baseConfig());
};
