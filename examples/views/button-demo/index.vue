<template>
    <sn-form class="m-top10" label-width="90px" :disabled="true">
        <sn-form-item label="基础用法">
            <div>
                <sn-button>默认按钮</sn-button>
                <sn-button type="primary">主要按钮</sn-button>
                <sn-button type="success">成功按钮</sn-button>
                <sn-button type="warning">警告按钮</sn-button>
                <sn-button type="danger">危险按钮</sn-button>
                <sn-button type="info">信息按钮</sn-button>
            </div>
            <div class="m-top10">
                <sn-button plain>朴素按钮</sn-button>
                <sn-button type="primary" plain>主要按钮</sn-button>
                <sn-button type="success" plain>成功按钮</sn-button>
                <sn-button type="warning" plain>警告按钮</sn-button>
                <sn-button type="danger" plain>危险按钮</sn-button>
                <sn-button type="info" plain>信息按钮</sn-button>
            </div>
        </sn-form-item>
        <sn-form-item label="禁用状态">
            <div>
                <sn-button disabled>默认按钮</sn-button>
                <sn-button type="primary" disabled>主要按钮</sn-button>
                <sn-button type="success" disabled>成功按钮</sn-button>
                <sn-button type="warning" disabled>警告按钮</sn-button>
                <sn-button type="danger" disabled>危险按钮</sn-button>
                <sn-button type="info" disabled>信息按钮</sn-button>
            </div>
            <div class="m-top10">
                <sn-button plain disabled>朴素按钮</sn-button>
                <sn-button type="primary" plain disabled>主要按钮</sn-button>
                <sn-button type="success" plain disabled>成功按钮</sn-button>
                <sn-button type="warning" plain disabled>警告按钮</sn-button>
                <sn-button type="danger" plain disabled>危险按钮</sn-button>
                <sn-button type="info" plain disabled>信息按钮</sn-button>
            </div>
        </sn-form-item>
        <sn-form-item label="文字按钮">
            <sn-button type="text">文本按钮</sn-button>
            <sn-button type="text" disabled>文本按钮</sn-button>
        </sn-form-item>
        <sn-form-item label="图标按钮">
            <sn-button type="primary" icon="sn-input-clear">文本按钮</sn-button>
            <sn-button type="primary" icon="sn-input-clear"></sn-button>
            <sn-button icon="sn-input-clear"></sn-button>
            <sn-button type="text" icon="sn-input-clear"></sn-button>
        </sn-form-item>
        <sn-form-item label="按钮组">
            <sn-button-group>
                <sn-button type="primary">按钮1</sn-button>
                <sn-button type="primary">按钮2</sn-button>
                <sn-button type="primary">按钮3</sn-button>
            </sn-button-group>
            <sn-button-group class="m-top10">
                <sn-button type="success">按钮1</sn-button>
                <sn-button type="success">按钮2</sn-button>
                <sn-button type="success">按钮3</sn-button>
            </sn-button-group>
            <sn-button-group class="m-top10">
                <sn-button>按钮1</sn-button>
                <sn-button>按钮2</sn-button>
                <sn-button>按钮3</sn-button>
            </sn-button-group>
            <sn-button-group class="m-top10">
                <sn-button type="text">按钮1</sn-button>
                <sn-button type="text">按钮2</sn-button>
                <sn-button type="text">按钮3</sn-button>
            </sn-button-group>
        </sn-form-item>
        <sn-form-item label="不同尺寸">
            <sn-button size="large">large</sn-button>
            <sn-button size="medium">medium</sn-button>
            <sn-button size="small">small</sn-button>
            <sn-button size="tiny">tiny</sn-button>
            <sn-button size="mini">mini</sn-button>
        </sn-form-item>
    </sn-form>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";

    @Component
    export default class ButtonDemo extends Vue {

        private created() {

        };

        private mounted() {

        };
    }
</script>

<style lang="scss">
    .m-top10 {
        margin-top: 10px;
    }
</style>
