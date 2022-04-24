const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const path  = require('path');

module.exports = {
  context: path.join(__dirname, "../src"),
  devtool:  "source-map",
  entry: {
    app:['babel-polyfill',"./js/client.js"],
    // main:"./js/containers/MainContainer.js"
  }, 
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    //libraryTarget: "umd", //uncomment this if you want to build in UMD
    filename: '[name].bundle.js',
    chunkFilename: '[id].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.join(__dirname, "../src"),
        options: {
          presets: [
            [
              '@babel/preset-react',
              {
                runtime: 'automatic',
              },
            ],
          ],
        },
      },
      {
        test: /\.svg$/,
        loader: '@svgr/webpack',
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'file-loader',
        options: {
          name: './assets/[name].[ext]'
        }
    
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },

  plugins: [
    new WorkboxPlugin.GenerateSW({
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 50000000
    }),
    new HtmlWebpackPlugin({
        template:  path.resolve(__dirname, '../index.html'),
    }),
  ],
};
