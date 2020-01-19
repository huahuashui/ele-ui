<template>
    <div class="sn-radio" @click="handleChange"
         :class="{'is-checked': isChecked,'is-disabled': isDisabled}">
        <div class="sn-radio__input">
            <span v-if="!hasIconTags" class="sn-radio__inner"></span>
            <template v-if="hasIconTags">
                <slot v-if="isChecked" name="full"></slot>
                <slot v-else name="none"></slot>
            </template>
        </div>
        <span class="sn-radio__label"
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
    import {ISnRadioGroup} from "../../../types/radio-group";

    @Component({
        name: "SnRadio"
    })
    export default class SnRadio extends Vue {
        /** 绑定值 */
        @Model('change')
        public model: string | number | boolean;

        /** Radio 的 value */
        @Prop()
        public value: string | number | boolean;

        /** 是否禁用 */
        @Prop(Boolean)
        public disabled: boolean;

        /** 是否自定自定义图标*/
        @Prop(Boolean)
        public hasIconTags: boolean;

        get snRadioGroup(): ISnRadioGroup {
            let parent: any = this.$parent;
            while (parent && parent.$options && parent.$options.name !== 'SnRadioGroup') {
                parent = parent.$parent;
            }
            return parent;
        }

        get isDisabled(): boolean {
            return (this.snRadioGroup && this.snRadioGroup.disabled) || this.disabled;
        }

        get modelVal() {
            return this.snRadioGroup ? this.snRadioGroup.model : this.model;
        }

        set modelVal(val: string | number | boolean) {
            if (this.snRadioGroup) {
                this.snRadioGroup.changeModel(val);
            } else {
                this.$emit('change', val);
            }
        }

        get isChecked(): boolean {
            return this.modelVal === this.value;
        }

        // 修改值-界面操作触发
        protected handleChange() {
            if (this.isDisabled || this.isChecked) {return;}
            this.modelVal = this.value;
        }
    }
</script>
