const path = require('path')
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')

module.exports = function (envKeyWord, env) {
  const isDev = envKeyWord === 'development' || envKeyWord === 'mock'
  const mode = envKeyWord === 'test' || envKeyWord === 'production' ? 'production' : 'development'

  return {
    mode: mode,
    performance: {
      hints: isDev ? false : 'warning'
    },
    entry: {
      // vendor: ['axios']
    },
    output: {
      filename: isDev ? 'js/[name].js' : 'js/[name].min.[chunkhash:7].js',
      path: path.resolve(env.distPath),
      publicPath: env.publicPath,
      pathinfo: isDev
    },
    module: {
      rules: [
        // {
        //   enforce: 'pre',
        //   test: /\.(js|jsx)$/,
        //   loader: 'eslint-loader',
        //   options: {
        //     fix: true
        //   },
        //   exclude: /node_modules/
        // },

        {
          test: /\.(js|jsx)$/,
          use: 'babel-loader',
          include: [path.join(__dirname, '..', 'src'), path.join(__dirname, '..', 'test')]
        },

        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 4096,
            context: 'client',
            name: isDev ? '[path][name].[ext]' : 'assets/images/[name].[ext]',
            outputPath: '',
            publicPath: isDev ? '../' : '../'
          }
        },

        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 4096,
            context: 'client',
            // name: isDev ? '[path][name].[ext]' : 'assets/fonts/[name].[hash:7].[ext]',
            // outputPath: isDev ? '' : 'assets/fonts/',
            publicPath: '../'
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
              // options: {
              //   hmr: isDev,
              //   reloadAll: true
              // }
            },
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => [autoprefixer()]
              }
            },
            'sass-loader'
          ]
        },

        {
          test: /\.html$/,
          loader: 'html-loader',
          include: [path.join(__dirname, '..', 'src')]
        }
      ]
    },
    resolve: {
      extensions: ['.jsx', '.js', '.scss', '.css', '.html', '.json'],
      alias: {
        '@': path.join(__dirname, '../src/'),
        'env.cfg': '',
        'pages': path.join(__dirname, '../src/js/pages/'),
        'components': path.join(__dirname, '../src/js/components/'),
        'assets': path.join(__dirname, '../src/assets/'),
        'common': path.join(__dirname, '../src/js/common/'),
        'utils': path.join(__dirname, '../src/js/utils/'),
        'store': path.join(__dirname, '../src/js/store'),
        'hooks': path.join(__dirname, '../src/js/hooks'),
        'providers': path.join(__dirname, '../src/js/providers')
      }
    },
    plugins: [],
    optimization: {}
  }
}
