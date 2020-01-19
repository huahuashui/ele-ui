<template>
    <sn-select-base ref="snSelectBase" :model="selectLabel" v-bind="$attrs">
        <slot></slot>
    </sn-select-base>
</template>

<script lang="ts">
    import {Vue, Component, Emit, Prop, Model, Watch} from "vue-property-decorator";
    import SnSelectBase from "ele-ui/packages/select-base/index";

    import {ISnSelectBase} from "../../../types/select-base";
    import {SelectValue} from "../../../types/select";
    import {ISnSelectOption} from "../../../types/select-option";

    @Component({
        name: 'SnSelect',
        inheritAttrs: false,
        components: {
            SnSelectBase
        }
    })
    export default class SnSelect extends Vue {
        @Model('change')
        public readonly model!: SelectValue | SelectValue[];

        /** 是否开启多选 默认false */
        @Prop(Boolean)
        public multiple: boolean;

        // 订阅者 缓存子组件数据更新方法
        private fields: ISnSelectOption[] = [];
        // 多选存放label
        private multipleLabels: (string | number)[] = [];
        // 选择器选中数据---label展示用
        private selectLabel: string | number | null = null;
        // 是否内部点击触发
        private isInsideClick: boolean = false;

        // computed
        get disabled() {
            return this.$attrs.disabled;
        }

        /** 注册子组件更新方法 */
        public addSubscriber(field: ISnSelectOption) {
            this.fields.push(field);
            field.updateHandle(this.model, true);
        }

        /** 移除子组件更新方法 */
        public removeSubscriber(field: ISnSelectOption) {
            this.fields.splice(this.fields.indexOf(field), 1);
            this.multipleLabels = [];
            this.selectLabel = null;
            this.fields.forEach(sub => sub.updateHandle(this.model))
        }

        /** 非点击触发--只更新label */
        public updateLabel(nextLabel: string | number) {
            if (this.multiple) {
                this.multipleLabels.push(nextLabel);
                nextLabel = this.multipleLabels.join('/');
                this.setSelectLabel(nextLabel)
            } else {
                this.setSelectLabel(nextLabel)
            }
        }

        /** 点击触发--更新model/label */
        public changeChoice(nextLabel: string | number, nextValue: SelectValue) {
            this.isInsideClick = true;
            if (this.multiple) {
                this.multipleChoice(nextLabel, nextValue)
            } else {
                // 单选
                this.singleChoice(nextLabel, nextValue)
            }
        }

        /** 单选--更新model/label */
        private singleChoice(nextLabel: string | number, nextValue: SelectValue) {
            this.setSelectLabel(nextLabel);
            this.modelChange(nextValue, nextLabel);
            this.validateModel(nextValue);
            this.selectBaseRef().hideDropDown();
            this.fields.forEach(sub => sub.updateHandle(nextValue))
        }

        /** 多选--更新model/label */
        private multipleChoice(nextLabel: string | number, nextValue: SelectValue) {
            let model: SelectValue[], multipleLabels: (string | number)[];
            if (Array.isArray(this.model)) {
                if (this.model.indexOf(nextValue) > -1) {
                    model = this.model.filter(v => v !== nextValue);
                    multipleLabels = this.multipleLabels.filter(v => v !== nextLabel)
                } else {
                    model = this.model.concat(nextValue);
                    multipleLabels = this.multipleLabels.concat(nextLabel)
                }
            } else {
                model = [nextValue];
                multipleLabels = [nextLabel];
            }
            model = model.filter(r => r !== undefined);
            const selectLabel = multipleLabels.join('/');
            this.setSelectLabel(selectLabel);
            this.modelChange(model, selectLabel);
            this.validateModel(model);
            this.multipleLabels = multipleLabels;
            this.fields.forEach(sub => sub.updateHandle(model))
        }

        /** 调用表单验证 */
        private validateModel(newVal: SelectValue | SelectValue[]) {
            // this.bubbling('SnFormItem', 'sn.form.item.change', newVal)
        }

        /** 设置label */
        private setSelectLabel(newVal: string | number) {
            this.selectLabel = newVal
        }

        /** ref */
        private selectBaseRef(): ISnSelectBase {
            return this.$refs.snSelectBase as ISnSelectBase;
        }

        /** 更新选中值 */
        @Emit('change')
        private modelChange(model: SelectValue | SelectValue[], label: string | number) {
        }

        /** 监听选中值变化 */
        @Watch('model', {immediate: true, deep: true})
        private watchModel() {
            // 组建内部点击拦截
            if (this.isInsideClick) {
                this.isInsideClick = false;
                return
            }
            // 组件外部主动触发修改，重置multipleLabels
            this.multipleLabels = [];
            this.selectLabel = null;
            if (this.fields.length > 0) {
                this.fields.forEach(sub => sub.updateHandle(this.model, true));
            }
        }
    }
</script>
