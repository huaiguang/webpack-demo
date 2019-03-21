const { resolve, join } = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const glob = require('glob')
const htmlHandler = require('./html-handler')

function getEntries(globPath) {
  const entries = {}
  glob.sync(globPath).forEach(entry => {
    const tmp = entry.split('/').splice(-2)
    entries[tmp[0]] = ['eventsource-polyfill', entry]
  })
  return entries
}

const ExtractCSS = new ExtractTextPlugin({
  filename: 'css/[name].[contenthash:7].css',
  allChunks: true
})

const plugins = [
  ExtractCSS
]

module.exports = require('./webpack.conf.base')({
  mode: 'production',
  entry: getEntries('./src/*/main.js'),
  output: {
    filename: 'js/[name].[chunkhash:7].js',
    chunkFilename: 'js/[id].[chunkhash:7].js'
  },
  module: {
    rules: [
      {
        resource: {
          test(filePath) {
            return /\.css$/.test(filePath) && !/\.module\.css$/.test(filePath)
          }
        },
        use: ExtractCSS.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            }
          ]
        })
      },
      {
        resource: {
          test: /\.module\.css$/
        },
        use: ExtractCSS.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                modules: true,
                camelCase: true,
                localIdentName: '[local]--[hash:base64:5]'
              }
            }
          ]
        })
      }
    ]
  },
  plugins: plugins.concat(
    htmlHandler({
      template: resolve(__dirname, '../public/temp.html'),
      chunks: ['vendor', 'manifest'],
      // If you use multiple chunks with commonChunksPlugin, this is the necessary
      // setting in order to put webpack runtime code (manifest) in front of
      // all chunks
      chunksSortMode: 'dependency',
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
  )
})
