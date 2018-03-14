const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const htmlHandler = require('./html-handler')
const glob = require('glob')

// globPath是以root为根路径的，因此只有一个'./'
function getEntries(globPath) {
  const entries = {}
  glob.sync(globPath).forEach(entry => {
    const tmp = entry.split('/').splice(-2)
    entries[tmp[0]] = ['eventsource-polyfill', entry]
  })
  return entries
}

const entries = getEntries('./src/*/main.js')

// plugins
const ExtractCss = new ExtractTextPlugin({
    filename: "css/common.css"
  })

const plugins = [
  ExtractCss
]

module.exports = (options = {}) => ({
  entry: entries,
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: 'js/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/app/'),
        exclude: path.resolve(__dirname, 'node_modules/'),
        loader: 'babel-loader'
      }
    ]
  },
  // plugins
  plugins: plugins.concat(
    htmlHandler({
      template: path.resolve(__dirname, '../public/temp.html'),
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
    })
  ),
  // devServer
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    host: '127.0.0.1',
    port: 8009,
    // proxy: {
    //   'api': {
    //     target: 'http://127.0.0.1:8009',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // },
    historyApiFallback: true
  }
})
