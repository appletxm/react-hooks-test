const path = require('path')
const webpack = require('webpack')
const webpackFn = require('./webpack.config.fn')
const envConfig = require('./env')
const envKeyWord = (process.argv)[2]
const envPrefix = (process.argv)[3] || envKeyWord
const env = envConfig[envKeyWord]
let webpackConfig

process.env.NODE_ENV = envKeyWord

console.info(`***current env***`, envKeyWord, envPrefix)

webpackConfig = require('./webpack.config.base')(envKeyWord, env)
webpackConfig['resolve']['alias']['env.cfg'] = webpackFn.getEnvCfg(envKeyWord)
webpackConfig = webpackFn.getOutPutConfig(envKeyWord, env, webpackConfig)
webpackConfig = webpackFn.getOptimizationConfig(envKeyWord, env, webpackConfig)
webpackConfig = webpackFn.getPluginConfig(envKeyWord, webpack, webpackConfig, env)
webpackConfig = webpackFn.getHtmlWebPluginConfig(envKeyWord, env, webpackConfig)
// webpackConfig = webpackFn.getFontPathConfig(envKeyWord, webpackConfig)

module.exports = webpackConfig
