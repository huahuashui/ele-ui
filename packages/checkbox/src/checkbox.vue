<template>
    <div class="sn-checkbox" @click="handleChange"
         :class="{
            'is-checked': isChecked,
            'is-disabled': isDisabled,
            'is-indeterminate': indeterminate,
         }">
        <div class="sn-checkbox__input">
            <span v-if="!hasIconTags" class="sn-checkbox__inner"></span>
            <template v-if="hasIconTags">
                <slot v-if="isChecked" name="full"></slot>
                <slot v-else name="none"></slot>
            </template>
        </div>
        <span class="sn-checkbox__label"
              :class="{
                    'is-line': !hasIconTags,
                    'is-padding': !hasIconTags || $slots.full || $slots.none
              }"
              v-if="$slots.default">
            <slot></slot>
        </span>
    </div>
</template>

<script lang="tsx">
    import {Component, Model, Prop, Vue} from "vue-property-decorator";
    import {CheckboxGroupModel, ISnCheckboxGroup} from "../../../types/checkbox-group";

    @Component({
        name: "SnCheckbox"
    })
    export default class SnCheckbox extends Vue {
        /** 绑定值 */
        @Model('change')
        public model: string | number | boolean;

        /** checkbox标识-与checkbox-group组件一起使用，必传 */
        @Prop(String || Number)
        public prop: string | number;

        /** checkbox 勾选的 value */
        @Prop({default: true})
        public trueValue: string | number | boolean;

        /** checkbox 未勾选的 value */
        @Prop({default: false})
        public falseValue: string | number | boolean;

        /** 是否禁用 */
        @Prop(Boolean)
        public disabled: boolean;

        /** 是否自定自定义图标*/
        @Prop(Boolean)
        public hasIconTags: boolean;

        /** 半选状态-只是样式变更 */
        @Prop(Boolean)
        public indeterminate: boolean;

        get SnCheckboxGroup(): ISnCheckboxGroup {
            let parent: any = this.$parent;
            while (parent && parent.$options && parent.$options.name !== 'SnCheckboxGroup') {
                parent = parent.$parent;
            }
            return parent;
        }

        get isDisabled(): boolean {
            return (this.SnCheckboxGroup && this.SnCheckboxGroup.disabled) || this.disabled;
        }

        get isChecked() {
            if (this.SnCheckboxGroup) {
                const checkedList: CheckboxGroupModel[] = Array.isArray(this.SnCheckboxGroup.model) ? this.SnCheckboxGroup.model : [];
                const model = checkedList.find(item => item.prop === this.prop);
                return model ? model.value === this.trueValue : false;
            } else {
                return this.model === this.trueValue;
            }
        }

        // 修改值-界面操作触发
        protected handleChange() {
            if (this.isDisabled) {return;}
            const val = !this.isChecked ? this.trueValue : this.falseValue;
            if (this.SnCheckboxGroup) {
                this.SnCheckboxGroup.changeModel(val, this.prop);
            } else {
                this.$emit('change', val);
            }
        }
    }
</script>
