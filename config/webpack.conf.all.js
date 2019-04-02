const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const htmlHandler = require('./html-handler')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

// globPath是以root为根路径的，因此只有一个'./'
function getEntries(globPath) {
  const entries = {}
  glob.sync(globPath).forEach(entry => {
    const tmp = entry.split('/').splice(-2)
    entries[tmp[0]] = ['eventsource-polyfill', entry]
  })
  return entries
}

// plugins
const ExtractCSS = new MiniCssExtractPlugin({
  filename: "./css/[name].[chunkhash:7].css",
  chunkFilename: "./css/[name].chunk.css"
})

const plugins = [
  ExtractCSS
]

module.exports = (options = {}) => ({
  mode: 'development',
  entry: getEntries('./src/*/main.js'),
  output: {
    path: path.resolve(__dirname, '../dist/'),
    publicPath: '/',
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[name].chunk.js'
  },
  module: {
    rules: [
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
        test: /\.js$/,
        include: path.resolve(__dirname, '../src'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
    ]
  },
  // plugins
  plugins: plugins.concat(
    htmlHandler({
      template: path.resolve(__dirname, '../public/temp.html'),
      chunks: ['common', 'vendor'],
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
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'common',
          test: /\.css$/,
          chunks: 'initial',
          enforce: true
        },
        // 注意: priority属性
        // 其次: 打包业务中公共代码
        common: {
          name: "common",
          chunks: "initial",
          minSize: 1,
          priority: 0,
          minChunks: 1
        },
        // 首先: 打包node_modules中的文件
        vendor: {
          name: "vendor",
          test: /node_modules/,
          chunks: "initial",
          priority: 10,
          minChunks: 1,
          // enforce: true
        }
      }
    }
  },
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
