const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const path  = require('path');

module.exports = {
  context: path.join(__dirname, "src"),
  devtool:  "source-map",
  entry: {
    app:["./client.js"],
    // main:"./js/containers/MainContainer.js"
  }, 
  output: {
    path: path.resolve(__dirname, 'dist'),
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
        include: path.join(__dirname, "src"),
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
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  plugins: [
    new WorkboxPlugin.InjectManifest({
      swSrc: path.resolve(__dirname,"service-worker.js"),
      swDest: "service-worker.js",
      exclude: [
        /\.map$/,
        /manifest$/,
        /\.htaccess$/,
        /service-worker\.js$/,
        /sw\.js$/,
      ],
    }),
    new HtmlWebpackPlugin({
        template:  path.resolve(__dirname, 'index.html'),
      }),
  ],
};
