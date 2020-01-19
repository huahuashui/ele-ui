/**
 * 除vue外，公共部分分离出去，单独打包
 */
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HappyPack = require('happypack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const config = require('./config');
const tsConfig = require.resolve('../tsconfig.build.json');

module.exports = {
    mode: 'production',
    entry: {
        app: ['./src/index.ts']
    },
    output: {
        path: path.resolve(process.cwd(), './lib'),
        publicPath: '/',
        filename: 'ele-ui.common.js',
        chunkFilename: '[id].js',
        library: 'eleUi',
        libraryTarget: 'commonjs2',
        libraryExport: 'default',
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
        alias: config.alias,
    },
    externals: config.externals,
    optimization: {
        minimize: true,
        minimizer: [
            // new TerserPlugin({
            //     terserOptions: {
            //         output: {
            //             comments: false
            //         }
            //     }
            // }),
            new MiniCssExtractPlugin({
                filename: 'theme-chalk/ele-ui.css',
            }),
        ],
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
                    // 'vue-style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: (loader) => [
                                require('postcss-import')({root: loader.resourcePath}),
                                require('autoprefixer')(),
                            ]
                        },
                    },
                    'sass-loader',
                ]
            },
            {
                test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: path.posix.join('theme-chalk/images', '[name].[hash:7].[ext]')
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
            tslint: true,
            checkSyntacticErrors: true,
            tsconfig: tsConfig
        }),
        new ProgressBarPlugin(),
        new VueLoaderPlugin(),
    ],
};
