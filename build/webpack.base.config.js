const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const vueLoaderConfig = require('./vue-loader.conf')
const isProd = process.env.NODE_ENV === 'production'


exports.resolve = function(dir) {
    return path.join(__dirname, '..', dir)
}
const baseLoaders = [
    {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
    },
    {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [exports.resolve('src'), exports.resolve('test'), exports.resolve('node_modules/webpack-dev-server/client')]
    },
    {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
    },
    {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
    },
    {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
    }
];

module.exports = {
  devtool: isProd
    ? false
    : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      'static': path.resolve(__dirname, '../static')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: utils.styleLoaders({ sourceMap: true, usePostCSS: true }).concat(baseLoaders),
    // rules: [
    //       {
    //           test: /\.vue$/,
    //           loader: 'vue-loader',
    //           options: {
    //               compilerOptions: {
    //                   preserveWhitespace: false,
    //                   // enable CSS extraction
    //                   extractCSS: isProd
    //               }
    //           }
    //       },
    //       {
    //           test: /\.js$/,
    //           loader: 'babel-loader',
    //           exclude: /node_modules/
    //       },
    //       {
    //           test: /\.(png|jpg|gif|svg)$/,
    //           loader: 'url-loader',
    //           options: {
    //               limit: 10000,
    //               name: '[name].[ext]?[hash]'
    //           }
    //       },
    //       {
    //           test: /\.(styl(us)|css)$/,
    //           use: isProd
    //               ? ExtractTextPlugin.extract({
    //                   use: [
    //                       {
    //                           loader: 'css-loader',
    //                           options: { minimize: true, sourceMap: true }
    //                       },
    //                       'stylus-loader'
    //                   ],
    //                   fallback: 'vue-style-loader'
    //               })
    //               : ['vue-style-loader', 'css-loader', 'stylus-loader']
    //       },
    //
    //   ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: isProd
    ? [
        new VueLoaderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ExtractTextPlugin({
          filename: 'common.[chunkhash].css'
        })
      ]
    : [
        new VueLoaderPlugin(),
        new FriendlyErrorsPlugin(),
        new ExtractTextPlugin({
            filename: 'common.[chunkhash].css'
        })
      ]
}
