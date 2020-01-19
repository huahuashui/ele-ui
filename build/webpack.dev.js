const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');
const PostcssImport = require("postcss-import");
const Autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = require('./config');
const tsConfig = require.resolve('../tsconfig.dev.json');
/*
 * 这封装了一个函数，进行传参，获取绝对路径，方便对import时引入地址的方便填写，path.join()是对多个字符串进行拼接，
 * 此时__dirname是build文件路径..代表再出去一层，就是文件的根路径，
 * 那dir这个参数则是你要传的文件夹，如果我们传src的话就是从src目录开始找
 *
 * 其中：__dirname是当前文件所在项目的文件夹的绝对路径
 */
function resolve (dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        app: './examples/main.ts'
    },
    output: {
        path: path.resolve(process.cwd(), './dist'),
        publicPath: '/',
        filename: path.posix.join('js', '[name].[hash:7].js'),
        chunkFilename: path.posix.join('js', '[name].[chunkhash:7].js')
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.ts', '.tsx', '.md'],
        alias: config.alias,
    },
    devServer: {
        publicPath: '/',
        host: '127.0.0.1',
        port: 8085,
        hot: true,
        clientLogLevel: 'warning',
        compress: true,
        historyApiFallback: true,
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {}
    },
    optimization: {
        minimize: true,
        minimizer: [
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash].css',
            }),
        ],
        runtimeChunk: true,
    },
    performance: {
        hints: false
    },
    stats: {
        children: false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.vue.(tsx?)$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: ['happypack/loader?id=ts-lint-pack']
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ['happypack/loader?id=ts-pack']
            },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            transformAssetUrls: {
                                video: ['src', 'poster'],
                                source: 'src',
                                img: 'src',
                                image: ['xlink:href', 'href'],
                                use: ['xlink:href', 'href']
                            },
                            compilerOptions: {
                                // 放弃模板标签之间的空格
                                preserveWhitespace: false
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(scss|css)$/,
                exclude: /node_modules/,
                use: [
                    'vue-style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: (loader) => [
                                PostcssImport({root: loader.resourcePath}),
                                Autoprefixer(),
                            ]
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: path.posix.join('images', '[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            compilerOptions: {
                                preserveWhitespace: false
                            }
                        }
                    },
                    {
                        loader: path.resolve(__dirname, './md-loader/index.js')
                    }
                ]
            },
        ]
    },
    plugins: [
        /**** 使用HappyPack实例化 *****/
        new HappyPack({
            id: 'ts-lint-pack',
            threads: 2,
            use: [
                {
                    loader: 'vue-tslint-loader',
                    options: {
                        // tslint错误默认显示为警告
                        emitErrors: false,
                        // 默认情况下，tslint不会中断编译
                        failOnHint: false,
                    }
                }
            ]
        }),
        new HappyPack({
            id: 'ts-pack',
            threads: 2,
            use: [
                'babel-loader',
                {
                    loader: 'ts-loader',
                    options: {
                        happyPackMode: true,
                        transpileOnly: true,
                        appendTsSuffixTo: [/\.vue$/],
                        appendTsxSuffixTo: [/\.vue$/],
                        configFile: tsConfig,
                    }
                }
            ]
        }),
        /**** end *****/
        new ForkTsCheckerWebpackPlugin({
            vue: true,
            tslint: true,
            checkSyntacticErrors: true,
            tsconfig: tsConfig,
        }),
        new webpack.DefinePlugin({
            'process.env.FAAS_ENV': JSON.stringify(process.env.FAAS_ENV)
        }),
        new webpack.HotModuleReplacementPlugin(),
        // 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
        new webpack.NamedModulesPlugin(),
        // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。
        new webpack.NoEmitOnErrorsPlugin(),
        new CopyWebpackPlugin([
            {from: path.join(__dirname, '..', "./examples/assets/music/"), to: "music/"},
        ]),
        new HtmlWebpackPlugin({
            template: './examples/main.html',
            filename: './index.html',
            favicon: './examples/favicon.ico',
            minify: { // 压缩HTML代码的配置
                minifyCSS: true,
                minifyJS: true,
                collapseWhitespace: true
            }
        }),
        new ProgressBarPlugin(),
        new VueLoaderPlugin(),
    ],
    devtool: 'cheap-module-inline-source-map'
};
