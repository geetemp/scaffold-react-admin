const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SpritesmithPlugin = require("webpack-spritesmith");
const fs = require("fs");
const path = require("path");
const paths = require("./config/paths");

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    const postCssOptions = {
      ident: "postcss",
      plugins: () => [
        autoprefixer(
          // https://webpack.js.org/guides/migrating/#complex-options
          {
            browsers: [
              ">1%",
              "last 4 versions",
              "Firefox ESR",
              "not ie < 9" // React doesn't support IE8 anyway
            ],
            flexbox: "no-2009"
          }
        )
      ]
    };

    //antd theme support
    const theme = fs.existsSync("./src/theme.js")
      ? require("./src/theme")()
      : {};
    const IS_NODE = target === "node",
      IS_DEV = dev;

    // less support
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
            require.resolve("style-loader"),
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

    //scss support
    config.module.rules.push({
      test: /\.scss$/,
      exclude: [paths.appBuild],
      use: IS_NODE // Style-loader does not work in Node.js without some crazy
        ? // magic. Luckily we just need css-loader.
          [
            {
              loader: require.resolve("css-loader")
            },
            { loader: require.resolve("sass-loader") }
          ]
        : IS_DEV
        ? [
            require.resolve("style-loader"),
            {
              loader: require.resolve("css-loader")
            },
            {
              loader: require.resolve("postcss-loader"),
              options: postCssOptions
            },
            { loader: require.resolve("sass-loader") }
          ]
        : [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve("css-loader"),
              options: {
                modules: false,
                minimize: true
              }
            },
            {
              loader: require.resolve("postcss-loader"),
              options: postCssOptions
            },
            { loader: require.resolve("sass-loader") }
          ]
    });

    //spritesmith support
    if (!IS_NODE) {
      const templateFunction = function(data) {
        var shared = ".icon {display:inline-block;background-image: url(I)}".replace(
          "I",
          "../imgs/" + data.spritesheet.image
        );

        var perSprite = data.sprites
          .map(function(sprite) {
            return ".N { width: Wpx; height: Hpx; background-position: Xpx Ypx;}"
              .replace("N", sprite.name)
              .replace("W", sprite.width)
              .replace("H", sprite.height)
              .replace("X", sprite.offset_x)
              .replace("Y", sprite.offset_y);
          })
          .join("\n");

        return shared + "\n" + perSprite;
      };
      config.plugins.push(
        new SpritesmithPlugin({
          src: {
            cwd: paths.appSrc + "/assets/imgs/icons",
            glob: "*.png"
          },
          target: {
            image: paths.appSrc + "/assets/imgs/icons.png",
            css: [
              [
                paths.appSrc + "/assets/styles/_icons.scss",
                { format: "function_based_template" }
              ]
            ]
          },
          apiOptions: {
            cssImageRef: "icons.png"
          },
          spritesmithOptions: {
            padding: 5
          },
          customTemplates: {
            function_based_template: templateFunction
          }
        })
      );
    }
    return config;
  }
};
