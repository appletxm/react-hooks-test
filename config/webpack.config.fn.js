const path = require('path')
const fs = require('fs')
const TerserJSPlugin  = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin   = require('optimize-css-assets-webpack-plugin')
const HtmlWebPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true'

module.exports = {
  getEnvCfg: function (envKeyWord) {
    let envCfg, envFilePath

    if (envKeyWord === 'development') {
      envCfg = 'env-development'
    } else if (envKeyWord === 'mock') {
      envCfg = 'env-mock'
    } else if (envKeyWord === 'test') {
      envCfg = 'env-test'
    } else {
      if ((process.argv)[3] && ((process.argv)[3] === 'test' || (process.argv)[4] === 'current-branch')) {
        envCfg = 'env-test'
      } else if ((process.argv)[3] && (process.argv)[3] === 'pre') {
        envCfg = 'env-pre'
      } else {
        envCfg = 'env-production'
      }
    }

    envFilePath = path.join(__dirname, './' + envCfg + '.js')
    return envFilePath
  },

  getOutPutConfig: function (envKeyWord, env, webpackConfig) {
    const appJs = path.resolve(env.sourcePath + '/js/index.jsx')
    const loginJs = path.resolve(env.sourcePath + '/js/pages/login/index.jsx')
    const isDev = envKeyWord === 'development' || envKeyWord === 'mock'

    webpackConfig.output.publicPath = isDev ? '/' : env.publicPath

    if (isDev === true) {
      webpackConfig.entry.app = [hotMiddlewareScript, appJs]
      webpackConfig.entry.login = [hotMiddlewareScript, loginJs]
      webpackConfig.devtool = 'inline-source-map'
    } else {
      webpackConfig.entry.app = [appJs]
      webpackConfig.entry.login = [loginJs]
      // webpackConfig.devtool = 'cheap-source-map'
    }

    return webpackConfig
  },

  getOptimizationConfig: function (envKeyWord, env, webpackConfig) {
    const isDev = envKeyWord === 'development' || envKeyWord === 'mock'
    let optimization

    if (isDev === true) {
      optimization = {}
    } else {
      optimization = {
        minimize: true,
        minimizer: [
          new TerserJSPlugin({
            extractComments: '/@extract/i',
            sourceMap: true
          }),
          new OptimizeCSSAssetsPlugin()
        ],
        providedExports: true,
        usedExports: true,
        sideEffects: true,
        concatenateModules: true,
        emitOnErrors: true,
        splitChunks: {
          minSize: 30000,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          // name: true,
          chunks: 'all',
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.(scss|css)$/,
              chunks: 'all',
              enforce: true,
            },
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: -10
            }
          }
        },
        runtimeChunk: {
          name: 'runtime'
        }
      }
    }

    webpackConfig.optimization = optimization

    return webpackConfig
  },

  getPluginConfig: function (envKeyWord, webpack, webpackConfig, env) {
    let cssPath
    // let cssChunkPath
    const isDev = envKeyWord === 'development' || envKeyWord === 'mock'

    if (isDev === true) {
      cssPath = 'css/[name].css'
      // cssChunkPath = 'css/[id].css'
      webpackConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin()
      )
    } else {
      cssPath = 'css/[name].min.[contenthash:7].css'
      // cssChunkPath = 'css/[id].min.[chunkhash:7].css'

      // webpackConfig.plugins.push(
      //   new webpack.optimize.OccurrenceOrderPlugin()
      // )
    }

    webpackConfig.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(env.sourcePath + '/assets'),
            to: path.resolve(env.distPath + '/assets')
          }
        ],

        options: {
          concurrency: 100
        }
      }),

      new MiniCssExtractPlugin({
        filename: cssPath
        // chunkFilename: cssChunkPath
      })
    )

    return webpackConfig
  },

  getCssJsFile: function () {
    let css = []
    let javascript = []
    try {
      let filePath = path.resolve('./dependencies.json')
      let dep = fs.readFileSync(filePath)
      let depObj = JSON.parse(dep)['dependencies']
      let rawCss = depObj.css
      let rawJavascript = depObj.javascript
      Object.keys(rawCss).forEach(item => {
        if (rawCss[item] && rawCss[item]['dest']) {
          let dest = rawCss[item]['dest']
          dest = dest.replace('<%version%>', rawCss[item]['version'])
          dest = dest.replace('src/', '')
          css.push(dest)
        }
      })
      Object.keys(rawJavascript).forEach(item => {
        if (rawJavascript[item] && rawJavascript[item]['dest']) {
          let dest = rawJavascript[item]['dest']
          dest = dest.replace('<%version%>', rawJavascript[item]['version'])
          dest = dest.replace('src/', '')
          javascript.push(dest)
        }
      })

      // javascript.push('assets/third/ckeditor-4.14.1/ckeditor.js')
      // javascript.push('assets/third/ckeditor-4.14.1/editor-init.js')

      return {
        css, javascript
      }
    } catch (err) {
      console.info(err)

      return {
        css, javascript
      }
    }
  },

  generateHtmlPluginCfg: function(options) {
    const { bundleName, pageName, title, env,  envKeyWord} = options
    const { css, javascript } = this.getCssJsFile()
    var baseConfig = {
      // favicon: path.resolve('./src/assets/images/favicon.ico'),
      inject: 'body',
      publicPath: envKeyWord !== 'production' ? '/' : env.publicPath,
      favicon: '',
      libFiles: {
        css: css,
        js: javascript
      }
    }
    const mainJsFiles = javascript.concat([])
    const pageConfig = {
      title,
      filename: path.resolve(`${env.distPath}/${pageName}`),
      template: path.resolve(env.sourcePath + '/index.ejs'),
      chunks: ['styles', 'vendor', 'runtime', bundleName],
      needViewPort: false,
      libFiles: {
        css: css,
        js: mainJsFiles
      },
      inject: 'body'
    }

    return new HtmlWebPlugin(Object.assign(JSON.parse(JSON.stringify(baseConfig)), pageConfig))
  },

  getHtmlWebPluginConfig: function (envKeyWord, env, webpackConfig) {
    webpackConfig.plugins.push(
      this.generateHtmlPluginCfg({
        title: '首页',
        bundleName: 'app',
        pageName: 'index.html',
        envKeyWord, env
      }),

      this.generateHtmlPluginCfg({
        title: '请登录',
        bundleName: 'login',
        pageName: 'login.html',
        envKeyWord, env
      })

    )

    return webpackConfig
  },
  getFontPathConfig: function(envKeyWord, webpackConfig){
    let fontLoader = webpackConfig.module.rules[3]
    let isDev = envKeyWord !== 'production'

    if (isDev === true) {
      fontLoader['options']['name'] = '[path][name].[ext]'
      fontLoader['options']['outputPath'] = ''
    } else {
      fontLoader['options']['outputPath'] = ''
      fontLoader['options']['name'] = function(filename) {
        if ((/^.+element-icons\..+$/).test(filename) === true) {
          outPutUrl = 'assets/style/element-ui.2.12.0/font/'
        } else {
          outPutUrl = 'assets/font/'
        }
        outPutUrl = outPutUrl + '[name].[ext]'
        // console.info('******', outPutUrl)
        return outPutUrl
      }
    }

    return webpackConfig
  }
}
