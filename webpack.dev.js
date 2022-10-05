const { posix } = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.base')
const proxyConfig = require('./dev-proxy')

const CONFIG = {
  port: 8000,
  host: '0.0.0.0',
}

baseConfig.module.rules.find(
  (rule) => rule.loader === 'babel-loader',
).options.cacheDirectory = true
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  watch: true,
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js',

    /**
     * TODO: this is a temporary fix for resolve bugs caused by webpack hot reload in web worker.
     * see this for more detail: https://github.com/webpack/webpack/issues/6642
     */
    globalObject: 'this',
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.s(a|c)ss$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },

  // resolve: {
  //   alias: {
  //     'react-dom': '@hot-loader/react-dom',
  //   },
  // },

  plugins: [
    new webpack.DefinePlugin(require(`./build-profile.js`)),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true,
    }),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          `Your application is running here: http://${CONFIG.host}:${CONFIG.port}`,
        ],
      },
    }),
  ],

  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: posix.join(baseConfig.output.publicPath, 'index.html'),
        },
      ],
    },
    hot: true,
    contentBase: false,
    compress: true,
    disableHostCheck: true,
    host: CONFIG.host,
    port: CONFIG.port,
    overlay: true,
    publicPath: baseConfig.output.publicPath,
    quiet: true,
    proxy: proxyConfig,
  },
})
