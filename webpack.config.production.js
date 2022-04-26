const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const CssNano = require('cssnano');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { resolve } = require('path');

const config = require('./webpack.config.js');
let package = require('./package.json');

function modify(buffer) {
   // copy-webpack-plugin passes a buffer
   var manifest = JSON.parse(buffer.toString());

   // make any modifications you like, such as
   manifest.version = package.version;

   // pretty print to JSON with two spaces
   manifest_JSON = JSON.stringify(manifest, null, 2);
   return manifest_JSON;
}

module.exports = merge(config, {
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'assets/js/[name].bundle.js',
    chunkFilename: `assets/js/[id].bundle.js`,
  },

  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  CssNano({
                    preset: 'default',
                  }),
                ],
              },
            },
          },
        ],
      },

      {
        test: /\.(woff2?|ttf|eot)(\?-.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'assets/fonts/[contenthash].[ext]',
          esModule: false,
        },
      },

      {
        test: /\.(png|jpe?g|ico|gif)(\?-.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]',
          esModule: false,
        },
    },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
      {
         from: "../manifest.json",
         to:   "./manifest.json",
         transform (content, path) {
          return modify(content)
        }
        }]
      }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css',
      chunkFilename: 'assets/css/[id].[contenthash].css',
    }),
    new Dotenv()
  ],

  optimization: {
    chunkIds: 'named',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
      },
    },
  },
});
