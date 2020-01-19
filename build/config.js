const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');

// 同步查询当前目录下所有文件
function readdirSync(str) {
    let fileList = fs.readdirSync(str);
    let ret = [];
    fileList.forEach(function (file) {
        const str2 = path.resolve(str, file);
        const stat = fs.lstatSync(str2);
        if (stat.isDirectory()) {
            const temp = readdirSync(str2);
            ret = ret.concat(temp);
        } else {
            // 去除后缀
            ret.push({
                path: str2,
                file: file
            });
        }
    });
    return ret;
}

// 同步查询当前目录下所有文件
function removeFileSuffix(file) {
    return file.split('.')[0];
}

// 分离的公共部分-打包入口配置
const utilsExternalsEntry = {};
const enumExternalsEntry = {};
const externals = {
    'vue': {
        root: 'Vue',
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue'
    },
    'vue-class-component': 'vue-class-component',
    'vue-property-decorator': 'vue-property-decorator'
};
const components = require('./components');
const utilsList = readdirSync(path.resolve(__dirname, '../src/utils'));
const enumList = readdirSync(path.resolve(__dirname, '../src/enum'));

Object.keys(components).forEach((k) => {
    externals[`ele-ui/packages/${k}/index`] = `ele-ui/lib/${k}`
});

utilsList.forEach(function (item) {
    const file = removeFileSuffix(item.file);
    externals[`ele-ui/src/utils/${file}`] = `ele-ui/lib/utils/${file}`;
    utilsExternalsEntry[file] = item.path;
});

enumList.forEach(function (item) {
    const file = removeFileSuffix(item.file);
    externals[`ele-ui/src/enum/${file}`] = `ele-ui/lib/enum/${file}`;
    enumExternalsEntry[file] = item.path;
});

console.log('externals', externals);

exports.externals = [externals, nodeExternals()];

exports.utilsExternalsEntry = utilsExternalsEntry;
exports.enumExternalsEntry = enumExternalsEntry;

exports.alias = {
    vue$: "vue/dist/vue.esm.js",
    // main: path.resolve(__dirname, '../src'),
    // packages: path.resolve(__dirname, '../packages'),
    // examples: path.resolve(__dirname, '../examples'),
    'ele-ui': path.resolve(__dirname, '../')
};

exports.vue = externals.vue;
