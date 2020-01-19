<template>
    <div class="sn-select-drop__item"
         :class="[{
            'is-selected': !isDisabled && isSelected,
            'is-disabled': isDisabled,
            'is-multiple': isMultiple}]"
         @click.stop="optionClick">
        <span :title="currentLabel">{{currentLabel}}</span>
        <span class="sn-select-drop__icon"
              v-if="isMultiple"
              v-show="!isDisabled && isSelected">
        </span>
        <slot name="endIcon"></slot>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {ISnSelect, SelectValue} from "../../../types/select";

    @Component({
        name: 'SnSelectOption'
    })
    export default class SnSelectOption extends Vue {
        /** 选项的值 string | number */
        @Prop()
        public value: SelectValue;

        /** 选项的标签，若不设置则默认与 value 相同 */
        @Prop()
        public label: string | number;

        /** 是否禁用该选项 */
        @Prop(Boolean)
        public disabled: boolean;

        // 当前项选中状态
        private isSelected: boolean = false;

        // computed
        get snSelect(): ISnSelect {
            let parent: any = this.$parent;
            while (parent && parent.$options && parent.$options.name !== 'SnSelect') {
                parent = parent.$parent;
            }
            return parent;
        }

        get isMultiple() {
            return this.snSelect && this.snSelect.multiple;
        }

        get isDisabled() {
            return this.disabled || (this.snSelect && this.snSelect.disabled);
        }

        get currentLabel() {
            return this.label || this.value;
        }

        public mounted() {
            this.snSelect.addSubscriber(this);
        }

        public destroyed() {
            this.snSelect.removeSubscriber(this);
        }

        /**
         * 根据父组件model的值--更新展示
         * @param selectValue 选中值
         * @param isNoClick true标识为非点击触发 false标识为点击触发
         */
        public updateHandle(selectValue: SelectValue | SelectValue[], isNoClick?: boolean) {
            let isSelected = false;
            if (this.isMultiple) {
                // 多选--传递的是value数组
                isSelected = Array.isArray(selectValue) && selectValue.indexOf(this.value) > -1;
            } else {
                // 单选--传递的是value
                isSelected = this.value === selectValue;
            }
            this.setSelected(isSelected);
            if (isNoClick && isSelected) {
                this.snSelect.updateLabel(this.label);
            }
        };

        /** 点击触发 */
        private optionClick() {
            if (this.isDisabled) return;
            this.snSelect.changeChoice(this.label, this.value);
        }

        /** 更新选中 */
        private setSelected(val: boolean) {
            this.isSelected = val;
        }
    }
</script>
