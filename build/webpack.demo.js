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
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    mode: 'production',
    entry: {
        app: './examples/main.ts',
    },
    output: {
        path: path.resolve(process.cwd(), './dist'),
        publicPath: '/',
        filename: path.posix.join('js', '[name].[hash:7].js'),
        chunkFilename: path.posix.join('js', '[name].[chunkhash:7].js'),
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
        alias: {
            ...config.alias,
        },

    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false
                    }
                }
            })
        ],
        splitChunks: {
            chunks: "all", // 在做代码分割时，只对异步代码生效，写成all的话，同步异步代码都会分割
            minSize: 80000, // 引入的包大于80KB才做代码分割
            maxSize: 300000, // 限制包的大小
            minChunks: 1, // 当一个包至少被用了多少次的时候才进行代码分割
            maxAsyncRequests: 5, // 同时加载的模块数最多是5个
            maxInitialRequests: 3, // 入口文件做代码分割最多能分成3个js文件
            automaticNameDelimiter: '~', // 文件生成时的连接符
            name: true, // 让cacheGroups里设置的名字有效
            cacheGroups: { // 当打包同步代码时,上面的参数生效
                vendors: {
                    test: /[\\/]node_modules[\\/]/, // 检测引入的库是否在node_modlues目录下的
                    priority: -10, // 值越大,优先级越高.模块先打包到优先级高的组里
                    filename: 'common/vendors.js', // 把所有的库都打包到一个叫vendors.js的文件里
                },
                default: {
                    priority: -20,
                    reuseExistingChunk: true, // 如果一个模块已经被打包过了,那么再打包时就忽略这个上模块
                    filename: 'common/common.js',
                },
            }
        }
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
                exclude: /node_modules/,
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
        /****   使用HappyPack实例化    *****/
        new HappyPack({
            id: 'ts-lint-pack',
            threads: 2,
            use: [
                {
                    loader: 'vue-tslint-loader',
                    options: {
                        // tslint错误默认显示为警告
                        emitErrors: true
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
            tsconfig: tsConfig
        }),
        new webpack.DefinePlugin({
            'process.env.FAAS_ENV': JSON.stringify(process.env.FAAS_ENV)
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
        }),
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
        new CopyWebpackPlugin([
            {from: path.join(__dirname, '..', "./examples/assets/music/"), to: "music/"}
        ]),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ProgressBarPlugin(),
        new VueLoaderPlugin()
    ],
    devtool: 'none'
};
