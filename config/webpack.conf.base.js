const path = require('path')
const webpack = require('webpack')

module.exports = options => ({
  mode: options.mode,
  entry: options.entry,
  output: Object.assign(
    {
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/'
    },
    options.output
  ),
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, '../src')],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1000,
            name: 'static/images/[name].[hash:7].[ext]'
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1000,
            name: 'static/fonts/[name].[hash:7].[ext]'
          }
        }
      }
    ].concat(options.module ? options.module.rules : [])
  },
  plugins: options.plugins.concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV),
      'process.env.API': JSON.stringify('/api/V4/')
    }),
    new webpack.ContextReplacementPlugin(/moment[\\]locale$/, /zh-cn/),
    new webpack.NamedModulesPlugin()
  ]),
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
