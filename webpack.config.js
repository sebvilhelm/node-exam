const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const autoprefixer = require('autoprefixer');

const javascript = {
  test: /\.(js)$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: ['env'],
      },
    },
  ],
};

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins: () => [autoprefixer()],
  },
};

const styles = {
  test: /\.(s?[ac]ss)$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader', postcss, 'sass-loader'],
};

module.exports = {
  mode: 'production', // No need for development on this one
  entry: {
    app: './public/js/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js',
  },

  devtool: 'source-map',

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],

  module: {
    rules: [javascript, styles],
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
};
