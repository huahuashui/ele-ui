<template>
    <div class="m-tab-demo">
        <div class="left-title">align:</div>
        <div class="right-content">
            <sn-button-group>
                <sn-button @click="align='left'">left</sn-button>
                <sn-button @click="align='center'">center</sn-button>
                <sn-button @click="align='right'">right</sn-button>
            </sn-button-group>
            <sn-tab :model="tabVal" :align="align" :before-click="handleBeforeClick">
                <sn-tab-pane label="选项1" lazy>选项1</sn-tab-pane>
                <sn-tab-pane label="选项2" lazy>选项2</sn-tab-pane>
                <sn-tab-pane label="选项3-禁用" disabled lazy>选项3</sn-tab-pane>
                <sn-tab-pane label="选项4-不让跳转" lazy>选项4</sn-tab-pane>
            </sn-tab>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component({
        name: "TabDemo",
        components: {}
    })
    export default class TabDemo extends Vue {
        protected align: string = '';
        protected tabVal: number = 1;

        // 跳转前判断
        protected handleBeforeClick(newVal: number, oldVal: number): boolean {
            console.log('newVal-oldVal', newVal, oldVal);
            if (newVal === 3) {
                alert('条件不符合，无法跳转');
                return false;
            }
            return true;
        }
    }
</script>

<style lang="scss">
    .m-tab-demo {
        margin: 20px;
        
        &:after {
            overflow: hidden;
            clear: both;
        }
        
        .left-title {
            float: left;
            height: 30px;
            line-height: 30px;
        }
        
        .right-content {
            overflow: hidden;
            height: 200px;
        }
    }
</style>
