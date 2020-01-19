// Polyfill fn.bind() for PhantomJS
/* eslint-disable no-extend-native */
Function.prototype.bind = require('function-bind');
// require('packages/theme-chalk/lib/index.css');

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec.ts$/);
testsContext.keys().forEach(testsContext);

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
// const srcContext = require.context('../../src', true, /^\.\/(?!main(\.js)?$)/);
// console.log("获取spec文件3", srcContext);
// srcContext.keys().forEach(srcContext);
