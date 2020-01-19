<template>
    <button class="sn-button"
            :style="buttonStyle"
            :class="typeClasses"
            :disabled="disabled"
            :autofocus="autofocus"
            :type="nativeType"
            v-on="$listeners"
    >
        <i class="sn-button__icon" :class="icon" v-if="icon"></i>
        <span class="sn-button__text" :class="{'is-margin': icon}" v-if="$slots.default">
            <slot></slot>
        </span>
    </button>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {SnUIComponentSizeEnum} from "ele-ui/src/enum/component";

    import {SnUIComponentSize} from "../../../types/component";
    import {ISnFormItem} from "../../../types/form-item";
    import {ButtonNativeType, ButtonType} from "../../../types/button";

    @Component({
        inheritAttrs: false,
        name: 'SnButton'
    })
    export default class SnButton extends Vue {
        /** 类型 **/
        @Prop(String)
        public type: ButtonType;

        /** 原生type属性 */
        @Prop({type: String, default: 'button'})
        public nativeType: ButtonNativeType;

        /** 按钮大小 */
        @Prop(String)
        public size: SnUIComponentSize;

        /** 图标类名 */
        @Prop({default: null})
        public icon: string;

        /** 是否禁用 */
        @Prop({type: Boolean, default: false})
        public disabled: boolean;

        /** 是否朴素按钮 */
        @Prop(Boolean)
        public plain: boolean;

        /** 是否默认聚焦 */
        @Prop(Boolean)
        public autofocus: boolean;

        // computed
        get snFormItem() {
            let parent: any = this.$parent;
            while (parent && parent.$options && parent.$options.name !== 'SnFormItem') {
                parent = parent.$parent;
            }
            return parent as ISnFormItem;
        }

        get buttonStyle() {
            const size = this.size || (this.snFormItem && this.snFormItem.sizeClass) || 'small';
            const ret = {} as { [key: string]: string };
            ret.height = SnUIComponentSizeEnum[size] + 'px';
            ret.lineHeight = SnUIComponentSizeEnum[size] + 'px';
            return ret;
        }

        get typeClasses(): any[] {
            return [
                this.type ? `sn-button--${this.type}` : '',
                {
                    'is-disabled': this.disabled,
                    'is-plain': this.plain
                }
            ];
        }
    }
</script>
