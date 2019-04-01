const path = require('path')

module.exports = require('./webpack.conf.base')({
  mode: 'production',
  plugins: [],
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'common',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        },
        // 注意: priority属性
        // 其次: 打包业务中公共代码
        common: {
          name: "common",
          chunks: "all",
          minSize: 1,
          priority: 0,
          minChunks: 1
        },
        // 首先: 打包node_modules中的文件
        vendor: {
          name: "vendor",
          test: /node_modules/,
          chunks: "all",
          priority: 10,
          minChunks: 1,
          // enforce: true
        }
      }
    }
  }
})
