require('shelljs/global')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('./webpack.conf.pro')
const ora = require('ora')

const spinner = ora('开始构建...')
spinner.start()

const rootPath = path.resolve(__dirname, '../dist')
rm('-rf', rootPath) && mkdir('-p', rootPath)

webpack(webpackConfig, (err, stats) => {
  spinner.stop()
  if (err) {
    throw err
  }

  process.stdout.write(stats.toString({
    colors: true,  // 让打包的时候有颜色
    modules: false,  // 去掉内置模块信息
    children: false,  // 去掉子模块
    chunks: false,  // 增加包信息（设置为 false 能允许较少的冗长输出）
    chunkModules: false  // 去除包里内置模块的信息
  }) + '\n')
  
  // const STATS_JSON_PATH = path.resolve(__dirname, 'debug/stats.json')
  // fs.writeFileSync(STATS_JSON_PATH, JSON.stringify(stats.toJson('verbose')))
})
