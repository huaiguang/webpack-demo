const path = require('path')
const defaults = require('lodash/defaults')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pageConfig = require('./page-config')

module.exports = options =>
  pageConfig.map(
    page =>
      new HtmlWebpackPlugin(
        defaults(
          {
            template: path.resolve(__dirname, '../public/temp.html'),
            favicon: path.resolve(__dirname, '../public/favicon.ico'),
            title: page.title,
            filename: `${page.path}/${page.name}.html`,
            chunks: options.chunks
            ? [...options.chunks, page.name]
            : [page.name],
            inject: 'body'
          },
          options
        )
      )
  )
