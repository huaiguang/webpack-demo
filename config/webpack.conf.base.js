const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const htmlHandler = require('./html-handler')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

function getEntries(globPath) {
  const entries = {}
  glob.sync(globPath).forEach(entry => {
    const tmp = entry.split('/').splice(-2)
    entries[tmp[0]] = ['eventsource-polyfill', entry]
  })
  return entries
}

const ExtractCSS = new MiniCssExtractPlugin({
  filename: "./css/[name].[hash:7].css",
  chunkFilename: "./css/[id].[hash:7].css"
})

const plugins = [
  ExtractCSS,
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV),
    'process.env.API': JSON.stringify('/api/V4/')
  }),
  new webpack.ContextReplacementPlugin(/moment[\\]locale$/, /zh-cn/),
  new webpack.NamedModulesPlugin()
].concat(htmlHandler({
  chunks: ['vendor', 'common'],
  chunksSortMode: 'auto',
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
  }
}))

module.exports = options => ({
  mode: options.mode,
  entry: getEntries('./src/*/main.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: 'js/[name].[hash:7].js',
    chunkFilename: 'js/[id].[hash:7].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../src'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: '/\.css$/',
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          options.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'static/images/[name].[hash:7].[ext]'
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'static/fonts/[name].[hash:7].[ext]'
          }
        }
      }
    ].concat(options.module ? options.module.rules : [])
  },
  plugins: options.plugins.concat(plugins),
  resolve: {
    alias: {
      src: path.resolve(__dirname, '../src'),
      common: path.resolve(__dirname, '../src/common')
    },
    aliasFields: ['browser'],
    descriptionFiles: ['package.json'],
    enforceExtension: false,
    enforceModuleExtension: false,
    extensions: ['.js', '.vue', '.json'],
    mainFields: ['browser', 'module', 'main'],
    mainFiles: ['index'],
    modules: ['app', 'node_modules'],
    unsafeCache: true
  },
  resolveLoader: {
    modules: ['web_loaders', 'web_modules', 'node_loaders', 'node_modules'],
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js'],
    // packageMains: ['webpackLoader', 'webLoader', 'loader', 'main'],
    moduleExtensions: []
  },
  target: 'web',
  devtool: options.devtool,
  performance: options.performance || {}
})
