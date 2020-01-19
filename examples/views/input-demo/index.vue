<template>
    <sn-form class="m-input-demo">
        <sn-form-item label="基础用法">
            <sn-input placeholder="请输入内容"
                      v-model="input">
            </sn-input>
        </sn-form-item>
        <sn-form-item label="禁用状态">
            <sn-input placeholder="请输入内容"
                      :disabled="true"
                      v-model="input">
            </sn-input>
        </sn-form-item>
        <sn-form-item label="可清空">
            <sn-input placeholder="请输入内容"
                      :clearable="true"
                      v-model="input">
            </sn-input>
        </sn-form-item>
        <sn-form-item label="密码框">
            <sn-input placeholder="请输入密码"
                      :show-password="true"
                      v-model="input">
            </sn-input>
        </sn-form-item>
        <sn-form-item label="带icon的输入框">
            <sn-input placeholder="请选择日期"
                      prefix-icon="sn-input-clear"
                      v-model="input">
            </sn-input>
            <sn-input class="m-top10"
                      placeholder="请输入内容"
                      v-model="input">
                <i slot="suffix" class="sn-input__icon sn-input-clear"></i>
            </sn-input>
        </sn-form-item>
        <sn-form-item label="尺寸">
            <sn-input class="m-top10"
                      size="large"
                      placeholder="请输入内容"
                      v-model="input">
            </sn-input>
            <sn-input class="m-top10"
                      size="medium"
                      placeholder="请输入内容"
                      v-model="input">
            </sn-input>
            <sn-input class="m-top10"
                      size="small"
                      placeholder="请输入内容"
                      v-model="input">
            </sn-input>
            <sn-input class="m-top10"
                      size="tiny"
                      placeholder="请输入内容"
                      v-model="input">
            </sn-input>
            <sn-input class="m-top10"
                      size="mini"
                      placeholder="请输入内容"
                      v-model="input">
            </sn-input>
        </sn-form-item>
    </sn-form>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component({
        name: 'InputDemo',
        components: {}
    })
    export default class InputDemo extends Vue {
        protected input: string = '';

        public created() {

        };

        public mounted() {

        };
    }
</script>

<style lang="scss">
    .m-input-demo {
        width: 300px;
        margin: 50px;
        
        .m-top10 {
            margin-top: 10px;
        }
    }
</style>
