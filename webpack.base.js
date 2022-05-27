const { resolve } = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin({
  branch: true,
  lightweightTags: true,
})

// if the size of resource is bigger than threshold,
// it will be splitted into additional file
// rather than bundle to javascript file
const resourceThreshold = 8192

module.exports = {
  entry: {
    app: ['@babel/polyfill', 'url-polyfill', './src/index.js'],
  },

  output: {
    path: resolve(__dirname, './dist'),
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.[tj]sx?$/i,
        include: [
          /\/node_modules\/js-utils/,
          /\/node_modules\/@target-energysolutions\/task-manager/,
          /\/node_modules\/@target-energysolutions\/toast/,
          /\/node_modules\/@target-energysolutions\/messenger/,
          /\/node_modules\/pdfjs-dist/,
          /\/node_modules\/@jitsi\/js-utils/,
          /\/src/,
        ],
        loader: 'babel-loader',
        options: {},
      },
      {
        test: /\.(graphql|gql)$/i,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },

      {
        test: /\.proto$/,
        loader: 'webpack-grpc-web-loader',
        options: {
          protoPath: resolve(__dirname, './src/protos'),
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|pdf|docx)$/i,
        loader: 'url-loader',
        options: {
          limit: resourceThreshold,
          name: 'images/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
        loader: 'url-loader',
        options: {
          limit: resourceThreshold,
          name: 'media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        loader: 'url-loader',
        options: {
          limit: resourceThreshold,
          name: 'fonts/[name].[hash:8].[ext]',
        },
      },
    ],
  },

  resolveLoader: {
    alias: {
      worker: 'workerize-loader?name=js/[hash:8]',
    },
  },

  resolve: {
    modules: [resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
  },

  plugins: [
    gitRevisionPlugin,
    new webpack.DefinePlugin(
      Object.assign(
        {},
        {
          DEBUG: process.env.NODE_ENV !== 'production',
        },
        {
          APP_VERSION: JSON.stringify(require('./package.json').dependencies),
          GIT_COMMIT_HASH: JSON.stringify(
            `${gitRevisionPlugin.version()} - ${gitRevisionPlugin.commithash()} - ${gitRevisionPlugin.branch()}`,
          ),
          // PRODUCT_APP_URL_PROFILE: require('./build-profile.js')
          //   .PRODUCT_APP_URL_PROFILE,
        },
      ),
    ),

    new CopyWebpackPlugin([
      {
        from: resolve(__dirname, './static'),
        to: 'static',
        ignore: ['.*'],
      },
      // {
      //   from: resolve(__dirname, './src/images/logo_elevate_blue.png'),
      //   to: 'images/logo_elevate_blue.png',
      //   ignore: ['.*'],
      // },
    ]),
  ],
}
