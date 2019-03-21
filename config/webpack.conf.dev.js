const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const htmlHandler = require('./html-handler')

function getEntriesWithHMR(globPath) {
  const entries = {}
  glob.sync(globPath).forEach(entry => {
    const tmp = entry.split('/').splice(-2)
    entries[tmp[0]] = ['eventsource-polyfill', entry]
  })
  return entries
}

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
]

module.exports = require('./webpack.conf.base')({
  mode: 'development',
  entry: getEntriesWithHMR(
    path.resolve(__dirname, '../src/*/main.js')
  ),
  output: {
    filename: '[name].js',
    chunkFilename: '[id].[name].js'
  },
  module: {
    rules: [
      {
        resource: {
          test(filePath) {
            return /\.css$/.test(filePath) && !/\.module\.css$/.test(filePath)
          }
        },
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        resource: {
          test: /\.module\.css$/
        },
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          }
        ]
      },
      {
        resource: {
          test: /\.vue$/
        },
        use: {
          loader: 'vue-loader',
          options: {
            loaders: {
              css: [
                'vue-style-loader',
                {
                  loader: 'css-loader'
                }
              ]
            }
          }
        }
      }
    ]
  },
  plugins: plugins.concat(
    htmlHandler({
      template: path.resolve(__dirname, "../public/temp.html"),
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
  devtool: 'cheap-module-eval-source-map',
  performance: {
    hints: false
  }
})
