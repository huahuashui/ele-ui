var webpackConfig = require('../../build/webpack.test');
var getConfig = require("./karma-custom.config");

// no need for app entry during tests
// delete webpackConfig.entry;
// 基础配置, 使用时与karma-custom.config.js中的配置进行组合
var karmaConfig = {
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    // 使用的浏览器, 现在直接在package.json中作为环境变量设置
    // 测试框架
    frameworks: ['mocha', 'sinon-chai'],
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage'],
    files: ['./index.ts'],
    /**
     * 在处理files文件之前使用的预处理器
     */
    preprocessors: {
        './index.ts': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    // webpack中间件
    webpackMiddleware: {
        noInfo: true
    },
    // 测试完成后得测试用例覆盖率报告
    coverageReporter: {
        dir: './coverage',
        reporters: [
            {type: 'lcov', subdir: '.'},
            {type: 'text-summary'}
        ]
    },
    client: {
        mocha: {
            timeout: 10000
        }
    },
    proxies: {
        /**
         * 因为audio.spec.ts中需要引入声音文件, 但是当前karma没有试出来如何本地加载
         * 所在这里将examples/assets/music/这个文件夹借助nginx进行静态资源反向代理
         * 并配置下面的/music/, 当界面上请求的路径匹配/music/时, 自动代理到examples/assets/music/文件中
         * nginx配置如下
         server {
            listen 931;
            server_name 127.0.0.1;
            proxy_buffer_size 128k;
            proxy_buffers   32 128k;
            proxy_busy_buffers_size 128k;
            location ^~ /music/
            {
                alias E:/Work/sensenets-ui/examples/assets/music/;
            }
         }
         */
        "/music/": 'http://127.0.0.1:931/music/'
    }
};
module.exports = function (config) {

    // if (process.env.TRAVIS) {
        // configuration.browsers = ['OpearCustom'];
    // }
    config.set({
        ...karmaConfig,
        ...getConfig()
    });
};
