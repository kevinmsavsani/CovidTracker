const Dotenv = require('dotenv-webpack');
const { merge } = require('webpack-merge');

const config = require('./webpack.config.js');

module.exports = merge(config, {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  devServer: {
    // historyApiFallback: true,
    compress:true,   //Good practice to add this to compress the files while sending.
    contentBase: './',
  },
  plugins: [new Dotenv()],
});
