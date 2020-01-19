<template>
    <div>
        <button v-on:click="showLayer()">弹框-简版</button>
        <button v-on:click="showLayerWithParams()" style="margin: 0 50px">弹框带参数-简版</button>
        <button v-on:click="showLayerWithCallBack()">弹框带回调-简版</button>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import simpleLayer from "../../../packages/simple-layer/index"
    import PopTest from "./service/popTest.vue"
    @Component
    export default class FormDemo extends Vue {

        private created() {

        };

        private mounted() {
        };
        private showLayer() {
            simpleLayer.open({
                area: ["200px", "100px"],
                content: PopTest,
                offset: {
                    left: "200px",
                    top: "192px",
                }
            })
        }
        private showLayerWithParams() {
            simpleLayer.open({
                area: ["200px", "100px"],
                content: PopTest,
                scope: {
                    model: 'this is params model'
                },
                offset: {
                    left: "400px",
                    top: "192px",
                },
            })
        }
        private showLayerWithCallBack() {
            simpleLayer.open({
                area: ["200px", "100px"],
                content: PopTest,
                scope: {
                    model: 'this is callback model'
                },
                offset: {
                    left: "600px",
                    top: "192px",
                },
                end: ()=> {
                    alert("this is callback")
                }
            })
        }
    }
</script>

<style lang="scss">

</style>
