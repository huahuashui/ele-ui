const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HappyPack = require('happypack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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
    mode: 'development',
    context: path.resolve(__dirname, '../'),
    // 不需要入口文件
    // entry: {
    //     app: ['./src/index.ts']
    // },
    devtool: "cheap-module-inline-source-map",
    output: {
        path: path.resolve(process.cwd(), './lib'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].js',
        libraryTarget: 'umd',
        libraryExport: 'default',
        library: 'SENSENETS',
        umdNamedDefine: true,
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
        alias: {
            ...config.alias,
            '@': resolve('src'),//用@来代替src目录的绝对路径,此时就绝对路径就定位到了src目录
        },
        // symlinks: true
        modules: ['node_modules']
    },
    optimization: {
        minimize: false,
        // minimizer: [
        //     new TerserPlugin({
        //         terserOptions: {
        //             output: {
        //                 comments: false
        //             }
        //         }
        //     }),
        //     new MiniCssExtractPlugin({
        //         filename: 'css/[name]-ele-ui.css',
        //     }),
        // ],
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
            // 在单元测试开始前的编译代码时, 如果使用下面写法, 编译会报错, 所以改为下面用style-loader来编译
            // {
            //     test: /\.(scss|css)$/,
            //     use: [
            //         'vue-style-loader',
            //         MiniCssExtractPlugin.loader,
            //         'css-loader',
            //         {
            //             loader: 'postcss-loader',
            //             options: {
            //                 ident: 'postcss',
            //                 plugins: (loader) => [
            //                     require('postcss-import')({root: loader.resourcePath}),
            //                     require('autoprefixer')(),
            //                 ]
            //             },
            //         },
            //         'sass-loader',
            //     ]
            // },
            {
                test: /\.css$/,
                loaders: ['vue-style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.scss$/,
                loaders: ['vue-style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: path.posix.join('images', '[name].[hash:7].[ext]')
                }
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
            // tslint: true,
            checkSyntacticErrors: true,
            tsconfig: tsConfig
        }),
        new ProgressBarPlugin(),
        // 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
        new webpack.NamedModulesPlugin(),
        new VueLoaderPlugin(),
    ],
};
