require('shelljs/global')
const fs = require('fs')
const path = require('path')
const ora = require('ora')
const webpack = require('webpack')
const webpackConfig = require('./webpack.conf.pro')

const spinner = ora('开始构建...')
spinner.start()

const rootPath = path.resolve(__dirname, '../dist')
rm('-rf', rootPath) && mkdir('-p', rootPath)

webpack(webpackConfig, (err, stats) => {
  spinner.stop()
  if (err) {
    throw err
  }

  // process.stdout.write(stats.toString({
  //   colors: true,
  //   modules: false,
  //   children: false,
  //   chunks: false,
  //   chunkModules: false
  // }) + '\n')
  //
  // const STATS_JSON_PATH = path.resolve(__dirname, 'debug/stats.json')
  // fs.writeFileSync(STATS_JSON_PATH, JSON.stringify(stats.toJson('verbose')))
})
