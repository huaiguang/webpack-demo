const path = require('path')
const webpack = require('webpack')

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
]

module.exports = require('./webpack.conf.base')({
  mode: 'production',
  plugins: plugins,
  devtool: 'cheap-module-eval-source-map',
  performance: {
    hints: false
  }
})
