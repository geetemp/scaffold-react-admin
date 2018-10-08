const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");
const path = require("path");
const paths = require("./config/paths");

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    const theme = fs.existsSync("./src/theme.js")
      ? require("./src/theme")()
      : {};
    const IS_NODE = target === "node",
      IS_DEV = dev;
    // styled-jsx webpack plugin config
    const postCssOptions = {
      ident: "postcss", // https://webpack.js.org/guides/migrating/#complex-options
      plugins: () => [
        autoprefixer({
          browsers: [
            ">1%",
            "last 4 versions",
            "Firefox ESR",
            "not ie < 9" // React doesn't support IE8 anyway
          ],
          flexbox: "no-2009"
        })
      ]
    };
    const scssRule = config.module.rules.filter(rule => {
      return (rule.test || {}).toString() == /\.scss$/;
    })[0];
    scssRule.use = [
      {
        loader: require.resolve("babel-loader")
      },
      {
        loader: require("styled-jsx/webpack").loader,
        options: { type: "scoped" }
      }
    ];

    config.module.rules.push({
      test: /\.less$/,
      exclude: [paths.appBuild],
      use: IS_NODE // Style-loader does not work in Node.js without some crazy
        ? // magic. Luckily we just need css-loader.
          [
            {
              loader: require.resolve("css-loader"),
              options: { importLoaders: 1 }
            },
            {
              loader: require.resolve("less-loader")
            }
          ]
        : IS_DEV
          ? [
              MiniCssExtractPlugin.loader,
              {
                loader: require.resolve("css-loader"),
                options: {
                  importLoaders: 1,
                  modules: false
                }
              },
              {
                loader: require.resolve("postcss-loader"),
                options: postCssOptions
              },
              {
                loader: require.resolve("less-loader"),
                options: {
                  modifyVars: theme,
                  javascriptEnabled: true
                }
              }
            ]
          : [
              MiniCssExtractPlugin.loader,
              {
                loader: require.resolve("css-loader"),
                options: {
                  importLoaders: 1,
                  modules: false,
                  minimize: true
                }
              },
              {
                loader: require.resolve("postcss-loader"),
                options: postCssOptions
              },
              {
                loader: require.resolve("less-loader"),
                options: {
                  modifyVars: theme,
                  javascriptEnabled: true
                }
              }
            ]
    });

    return config;
  }
};
