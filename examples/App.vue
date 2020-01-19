<template>
    <div>
        <div class="g-header">
            <router-link v-for="item in navList" :key="item.name" :to="item.path">
                <sn-button style="display:block">{{item.name}}</sn-button>
            </router-link>
        </div>
        <div class="g-container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
    import "../packages/theme-chalk";
    import "./style/index.scss";
    import {Vue, Component} from "vue-property-decorator";
    import {routerTree} from "./router/route-config";

    @Component({
        components: {}
    })
    export default class App extends Vue {
        protected navList: any[] = [];

        private created() {
            console.log(111, routerTree);
            this.navList = routerTree;
        }

        private mounted() {

        }
    }
</script>

<style lang="scss">
    html, body {
        position: relative;
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }
    
    body {
        font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", STHeiti, "Microsoft Yahei", Tahoma, Simsun, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        line-height: 1;
        color: #2c3e50;
        background-color: #fbf9fe;
    }
    
    .router-fade-enter-active, .router-fade-leave-active {
        transition: opacity .3s;
    }
    
    .router-fade-enter, .router-fade-leave-to {
        opacity: 0;
    }
    
    .g-header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 140px;
        background-color: #2c3e50;
        overflow-y: auto;
    }
    
    .g-container {
        position: absolute;
        top: 0;
        left: 140px;
        right: 0;
        bottom: 0;
        overflow-y: auto;
        background: #fff;
        .element-doc {
          width: 900px;
          margin: 0 auto;
          padding: 0 20px;
            h2 {
                font-size: 20px;
                padding: 20px 0 10px;
            }
            h3 {
                font-size: 16px;
                padding: 20px 0 10px;
            }
            & > table {
                border-collapse: collapse;
                width: 100%;
                background-color: #fff;
                font-size: 14px;
                margin-bottom: 45px;
                line-height: 1.5em;
                td, th {
                    color: #606266;
                    border-bottom: 1px solid #dcdfe6;
                    padding: 15px;
                    max-width: 250px;
                }
            }
            p {
                margin: 20px 0;
            }

            pre {
                margin: 0;
            }


            code.hljs {
                background-color: #fafafa;
                display: block;
                padding: 18px 24px;
                margin: 0;
                border: none;
                max-height: none;
                border-radius: 0;
                line-height: 1.8;
                &::before {
                    content: none;
                }
            }
        }
    }
</style>
