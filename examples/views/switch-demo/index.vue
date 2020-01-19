<template>
    <div class="m-switch-demo">
        <div class="top20">基本用法: {{checkVal1}}</div>
        <sn-switch class="top20" v-model="checkVal1"></sn-switch>
        
        <div class="top20">文字描述: {{checkVal2}}</div>
        <sn-switch class="top20"
                   active-color="#13ce66"
                   inactive-color="#ff4949"
                   inactive-text="关闭"
                   active-text="开始"
                   v-model="checkVal2">
        </sn-switch>
        
        <div class="top20">扩展的value类型: {{checkVal3}}</div>
        <sn-switch class="top20"
                   active-color="#13ce66"
                   inactive-color="#ff4949"
                   inactive-text="100"
                   active-text="0"
                   :active-value="100"
                   :inactive-value="0"
                   v-model="checkVal3">
        </sn-switch>
        
        <div class="top20">禁用</div>
        <sn-switch class="top20"
                   disabled
                   active-color="#13ce66"
                   inactive-color="#ff4949"
                   inactive-text="100"
                   active-text="0"
                   :active-value="100"
                   :inactive-value="0"
                   v-model="checkVal3">
        </sn-switch>
        
        <sn-switch class="top20 left10"
                   disabled
                   inactive-text="100"
                   active-text="0"
                   :active-value="100"
                   :inactive-value="0"
                   v-model="checkVal3">
        </sn-switch>
        
        <div class="top20">静态展示-不可操作</div>
        <sn-switch class="top20"
                   active-color="#13ce66"
                   inactive-color="#ff4949"
                   inactive-text="100"
                   active-text="0"
                   :active-value="100"
                   :inactive-value="0"
                   :model="100">
        </sn-switch>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component({
        name: "SwitchDemo",
        components: {}
    })
    export default class SwitchDemo extends Vue {
        protected checkVal1: boolean = false;
        protected checkVal2: boolean = false;
        protected checkVal3: number = 0;
    }
</script>

<style lang="scss">
    .m-switch-demo {
        height: 300px;
        margin: 20px;
        
        .top20 {
            margin-top: 20px;
        }
        
        .left10 {
            margin-left: 10px;
        }
    }
</style>
