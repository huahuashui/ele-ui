<template>
    <div class="m-popconfirm-demo">
        <sn-popconfirm
            title="这是一段内容确定删除吗？这是一段内容确定删除吗？这是一段内容确定删除吗？这是一段内容确定删除吗？"
            @onConfirm="onConfirm"
            @onCancel="onCancel"
        >
            <sn-button slot="reference">基础</sn-button>
        </sn-popconfirm>

        <sn-popconfirm
            confirmButtonText='好的'
            cancelButtonText='不用了'
            icon="sn-icon-info"
            iconColor="red"
            title="这是一段内容确定删除吗？"
            @onConfirm="onConfirm"
            @onCancel="onCancel"
        >
            <sn-button slot="reference">自定义</sn-button>
        </sn-popconfirm>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";

    @Component({
        name: "PopconfirmDemo",
        components: {

        }
    })
    export default class PopconfirmDemo extends Vue {
        private onConfirm() {
            console.log("onConfirm");
        }
        
        private onCancel() {
            console.log("onCancel");
        }
    }
</script>

<style lang="scss">
    .m-popconfirm-demo {
        box-sizing: border-box;
        padding: 20px;
        width: 100%;
        height: 100%;
        .popconfirm-content{
            width: 100%;
            margin-top: 200px;
            text-align: center;
        }
    }
</style>
