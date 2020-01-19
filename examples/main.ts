// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// declare let require: any;
import Vue from "vue";
import VueRouter from "vue-router";
import 'core-js/es6/promise';
import 'core-js/es6/array';
import App from "./App.vue";
import {routes} from "./router/route-config";
import hljs from 'highlight.js';
import demoBlock from './components/demo-block.vue'

import EleUi from "ele-ui/src";

console.log('EleUi', EleUi);
console.log('hljs', hljs);

// 插件注入
Vue.use(VueRouter);
Vue.use(EleUi);
Vue.component('demo-block', demoBlock)
// 插件实例化
const router = new VueRouter({
    mode: 'hash',
    base: __dirname,
    routes
});
router.afterEach(route => {
    // https://github.com/highlightjs/highlight.js/issues/909#issuecomment-131686186
    Vue.nextTick(() => {
        const blocks = document.querySelectorAll('pre code');
        console.log(blocks)
        Array.prototype.forEach.call(blocks, hljs.highlightBlock);
    });

});

// 项目启动
new Vue({
    router,
    render: h => h(App)
}).$mount('#app-box');

