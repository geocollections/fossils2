const path = require('path')
const glob = require('glob');
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const vueLoaderConfig = require('./vue-loader.conf')
const isProd = process.env.NODE_ENV === 'production'
// const PurifyCSSPlugin = require('purifycss-webpack');
// const PurifyCss = require('purify-css');

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

const webpackConfig = {
    devtool: 'cheap-module-source-map'
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
        rules: utils.styleLoaders({ sourceMap: true, extract: true, usePostCSS: true }).concat(baseLoaders),
    },
    performance: {
        maxEntrypointSize: 300000,
        hints: isProd ? 'warning' : false
    },
    plugins: isProd
        ? [
            new VueLoaderPlugin(),
            // new webpack.optimize.UglifyJsPlugin({
            //   compress: { warnings: false }
            // }),
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false
                    }
                },
                sourceMap: config.build.productionSourceMap,
                parallel: true
            }),
            new ExtractTextPlugin({
                filename: utils.assetsPath('css/[name].[contenthash].css'),
                // Setting the following option to `false` will not extract CSS from codesplit chunks.
                // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
                // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
                // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
                allChunks: true,
            }),
            new OptimizeCSSPlugin({
                cssProcessorOptions: config.build.productionSourceMap
                    ? { safe: true, map: { inline: false } }
                    : { safe: true }
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),

            // keep module.id stable when vendor modules does not change
            new webpack.HashedModuleIdsPlugin(),
            // new PurifyCSSPlugin({
            //     // Give paths to parse for rules. These should be absolute!
            //     paths: glob.sync(path.join(__dirname, '**/*.vue')),
            // }),
        ]
        : [
            new VueLoaderPlugin(),
            new FriendlyErrorsPlugin(),
            new ExtractTextPlugin({
                filename: 'common.[chunkhash].css'
            })
        ],

    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

module.exports = webpackConfig
