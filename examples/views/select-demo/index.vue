<template>
    <div class="m-select-demo">
        <div class="bottom10">基础下拉: {{selectVal1}}</div>
        <div>
            <sn-select-base class="bottom10"
                            size="large"
                            placeholder="请选择想展示文本"
                            :model="selectVal1">
                <p class="h30" @click="selectVal1='自定义内容1'">自定义内容1</p>
            </sn-select-base>
            <sn-select-base class="bottom10"
                            size="medium"
                            placeholder="请选择想展示文本"
                            :model="selectVal1">
                <p class="h30" @click="selectVal1='自定义内容2'">自定义内容2</p>
            </sn-select-base>
            <sn-select-base class="bottom10"
                            size="small"
                            placeholder="请选择想展示文本"
                            :model="selectVal1">
                <p class="h30" @click="selectVal1='自定义内容3'">自定义内容3</p>
            </sn-select-base>
            <sn-select-base class="bottom10"
                            size="tiny"
                            placeholder="请选择想展示文本"
                            :model="selectVal1">
                <p class="h30" @click="selectVal1='自定义内容4'">自定义内容4</p>
            </sn-select-base>
            <sn-select-base class="bottom10"
                            size="mini"
                            placeholder="请选择想展示文本"
                            :model="selectVal1">
                <p class="h30" @click="selectVal1='自定义内容5'">自定义内容5</p>
            </sn-select-base>
        </div>
        
        <div class="top20 bottom10">基础下拉框: {{selectVal2}}</div>
        <div>
            <sn-select class="bottom10"
                       size="large"
                       placeholder="请选择"
                       v-model="selectVal2">
                <sn-select-option v-for="item in selectList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  :disabled="item.disabled">
                </sn-select-option>
            </sn-select>
            <sn-select class="bottom10"
                       size="medium"
                       placeholder="请选择"
                       v-model="selectVal2">
                <sn-select-option v-for="item in selectList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  :disabled="item.disabled">
                </sn-select-option>
            </sn-select>
            <sn-select class="bottom10"
                       size="small"
                       placeholder="请选择"
                       v-model="selectVal2">
                <sn-select-option v-for="item in selectList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  :disabled="item.disabled">
                </sn-select-option>
            </sn-select>
            <sn-select class="bottom10"
                       size="tiny"
                       placeholder="请选择"
                       v-model="selectVal2">
                <sn-select-option v-for="item in selectList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  :disabled="item.disabled">
                </sn-select-option>
            </sn-select>
            <sn-select class="bottom10"
                       size="mini"
                       placeholder="请选择"
                       v-model="selectVal2">
                <sn-select-option v-for="item in selectList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  :disabled="item.disabled">
                </sn-select-option>
            </sn-select>
        </div>
        
        <div class="top20 bottom10">下拉框-多选: {{selectVal3}}</div>
        <div>
            <sn-select class="bottom10"
                       :multiple="true"
                       placeholder="请选择"
                       v-model="selectVal3">
                <sn-select-option v-for="item in selectList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  :disabled="item.disabled">
                </sn-select-option>
            </sn-select>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";

    @Component({
        name: 'SelectDemo',
    })
    export default class SelectDemo extends Vue {
        // 下拉数据
        protected selectList = [
            {
                label: '选项1',
                value: '1',
                disabled: false,
            },
            {
                label: '选项2',
                value: '2',
                disabled: false,
            },
            {
                label: '选项3',
                value: '3',
                disabled: false,
            },
            {
                label: '选项4',
                value: '4',
                disabled: false,
            },
            {
                label: '选项5',
                value: '5',
                disabled: true,
            }
        ];
        protected selectVal1: string = '';
        protected selectVal2: string = '';
        protected selectVal3: string[] = [];
    }
</script>

<style lang="scss">
    .m-select-demo {
        width: 300px;
        margin: 20px;
        
        .top20 {
            margin-top: 20px;
        }
        
        .bottom10 {
            margin-bottom: 10px;
        }
        
        .h30 {
            height: 30px;
            line-height: 30px;
            text-align: center;
        }
    }
</style>
