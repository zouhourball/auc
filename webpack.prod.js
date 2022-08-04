const merge = require('webpack-merge')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safeParser = require('postcss-safe-parser')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const CssReversePlugin = require('./webpack.css.reverse')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
  bail: true,
  mode: 'production',
  devtool: false,

  output: {
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].chunk.[chunkhash:8].min.js',
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          ExtractCssChunks.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          // 'postcss-loader',
        ],
      },
      {
        test: /\.s(a|c)ss$/i,
        use: [
          ExtractCssChunks.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          //   'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },

  plugins: [
    new ExtractCssChunks({
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[id].[hash:8].css',
      hot: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: {
          output: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            quote_style: 3,
          },
        },
        minifyCSS: true,
        minifyURLs: true,
        removeAttributeQuotes: true,
      },
    }),
    new CssReversePlugin(),
    new CompressionPlugin({
      test: /\.(html|css|js|eot|ttf|woff|svg|txt)$/i,
    }),
    new CopyPlugin([{ from: 'src/manifest.json', to: 'manifest.json' }]),
    new CopyPlugin([{ from: 'src/robots.txt', to: 'robots.txt' }]),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          comments: false,
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safeParser,
          discardComments: {
            removeAll: true,
          },
        },
      }),
    ],

    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|sass|scss)$/i,
          chunks: 'all',
          enforce: true,
          priority: 100,
        },
        vendors: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
        },
        default: {
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
})
