const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const proxy = require('./server/webpack-dev-proxy');

function getEntrySources(sources) {
  if (process.env.NODE_ENV !== 'production') {
    sources.push('webpack-hot-middleware/client');
  }

  return sources;
}

const basePlugins = [
  new webpack.DefinePlugin({
    __DEV__: process.env.NODE_ENV !== 'production',
    __PRODUCTION__: process.env.NODE_ENV === 'production',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
  new HtmlWebpackPlugin({
    template: './sample/index.html',
    inject: 'body',
  }),
];

const devPlugins = [
  new webpack.NoEmitOnErrorsPlugin(),
];

const prodPlugins = [
  new webpack.optimize.ModuleConcatenationPlugin(),
];

const plugins = basePlugins
  .concat(process.env.NODE_ENV === 'production' ? prodPlugins : [])
  .concat(process.env.NODE_ENV === 'development' ? devPlugins : []);

/* eslint max-len: "off" */
module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    app: getEntrySources(['./sample/index.js']),
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
    sourceMapFilename: '[name].[contenthash].js.map',
    chunkFilename: '[id].chunk.js',
    clean: true,
  },

  devtool: 'source-map',
  plugins,

  devServer: {
    historyApiFallback: { index: '/' },
    proxy: proxy(),
    hot: true,
  },

  module: {
    rules: [
      { test: /\.(js|jsx)$/, enforce: 'pre', loader: 'source-map-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(js|jsx)$/, use: ['babel-loader'], exclude: /node_modules/ },
      { test: /\.(png|jpg|jpeg|gif|svg)$/, type: 'asset/resource' },
      { test: /\.(eot|ttf|woff|woff2)$/, type: 'asset/resource' },
    ],
  },
};
