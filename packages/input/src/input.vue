<template>
    <div class="sn-input"
         :class="[{
             'sn-input--prefix': $slots.prefix || prefixIcon,
             'sn-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword || needStatusIcon}
         ]"
         @mouseenter="hovering = true"
         @mouseleave="hovering = false"
    >
        <input class="sn-input__inner ellipsis"
               :class="[{'is-error': validateState === 'error',
                         'is-validating': validateState === 'validating',
                         'is-success': validateState === 'success'}]"
               :placeholder="placeholder"
               :style="inputStyle"
               v-bind="$attrs"
               ref="input"
               :type="showPassword ? (passwordVisible ? 'text': 'password') : inputType"
               :value="nativeInputValue"
               :disabled="inputDisabled"
               :readonly="inputReadonly"
               @compositionstart="handleComposition"
               @compositionupdate="handleComposition"
               @compositionend="handleComposition"
               @input="handleInput"
               @focus="handleFocus"
               @blur="handleBlur"
               @change="handleChange"
               @keyup.enter="handleKeyUpEnter"
               @keyup="emitKeyUp"
               @keydown="emitKeyDown"
        />
        <!-- 前置图标 -->
        <span class="sn-input__prefix" v-if="$slots.prefix || prefixIcon">
            <slot name="prefix"></slot>
            <i class="sn-input__icon" :class="prefixIcon" v-if="prefixIcon"></i>
        </span>
        <!-- 后置图标 -->
        <span class="sn-input__suffix"
              v-if="$slots.suffix || suffixIcon || showClear || showPassword || showValidateIcon">
            <!-- 自定义图标 -->
            <template>
                <slot name="suffix"></slot>
                <i class="sn-input__icon" v-if="suffixIcon" :class="suffixIcon" @click.stop.self="suffixClick"></i>
            </template>
            <!-- 自带图标 -->
            <i v-if="showClear" class="sn-input__icon sn-input-clear" @click="handleClear"></i>
            <i v-if="showPwdVisible" class="sn-input__icon sn-input-view" @click="handlePasswordVisible"></i>
            <i v-if="showValidateIcon" class="sn-input__icon"
               :class="[{
                    'sn-input-error': validateState === 'error',
                    'sn-input-validating': validateState === 'validating',
                    'sn-input-success': validateState === 'success'
               }]">
            </i>
        </span>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Model, Prop, Emit} from "vue-property-decorator";
    import {SnUIComponentSizeEnum} from "ele-ui/src/enum/component";

    import {SnUIComponentSize} from "../../../types/component";
    import {ISnForm} from "../../../types/form";
    import {ISnFormItem} from "../../../types/form-item";

    @Component({
        name: 'SnInput',
        inheritAttrs: false
    })
    export default class SnInput extends Vue {
        @Model('input')
        public readonly model: string | number | null;
        @Prop(String)
        public placeholder: string;
        /** 输入框尺寸 */
        @Prop(String)
        public size: SnUIComponentSize;
        /** 类型-原生属性 */
        @Prop(String)
        public type: string;
        /** 禁用 */
        @Prop({type: Boolean, default: undefined})
        public disabled: boolean;
        /** 只读 */
        @Prop(Boolean)
        public readonly: boolean;
        /** 是否可清空 */
        @Prop(Boolean)
        public clearable: boolean;
        /** 是否显示密码图标 */
        @Prop(Boolean)
        public showPassword: boolean;
        /** 输入框头部图标 */
        @Prop(String)
        public prefixIcon: string;
        /** 输入框尾部图标 */
        @Prop(String)
        public suffixIcon: string;
        /** 输入时是否触发表单的校验 */
        @Prop({type: Boolean, default: true})
        public validateEvent: boolean;
        /** 输入值是否需转化为number */
        @Prop(Boolean)
        public isNumber: boolean;
        /** 初次加载的时候是否自动获得焦点 */
        @Prop({type: Boolean, default: false})
        public autofocus: boolean;

        // 是否hover状态
        private hovering: boolean = false;
        // 是否触发composition事件
        private isOnComposition: boolean = false;
        // 是否获取焦点
        private focused: boolean = false;
        // 是否显示密码
        private passwordVisible: boolean = false;

        // computed
        get snForm(): ISnForm {
            let parent: any = this.$parent;
            while (parent && parent.$options && parent.$options.name !== 'SnForm') {
                parent = parent.$parent;
            }
            return parent;
        }

        get snFormItem(): ISnFormItem {
            let parent: any = this.$parent;
            while (parent && parent.$options && parent.$options.name !== 'SnFormItem') {
                parent = parent.$parent;
            }
            return parent;
        }

        get needStatusIcon() {
            return this.snFormItem && this.snFormItem.isStatusIcon;
        }

        get validateState(): string {
            return this.snFormItem && this.snFormItem.validateState
        }

        get inputType(): string {
            return this.type || 'text'
        }

        get inputSizeClass(): SnUIComponentSize {
            return this.size || (this.snFormItem && this.snFormItem.sizeClass) || 'small';
        }

        get inputStyle() {
            const ret = {} as { [key: string]: string };
            const size = this.inputSizeClass;
            ret.height = SnUIComponentSizeEnum[size] + 'px';
            ret.lineHeight = SnUIComponentSizeEnum[size] + 'px';
            return ret;
        }

        get inputDisabled(): boolean {
            return this.disabled;
        }

        get inputReadonly(): boolean {
            return this.readonly;
        }

        // 验证状态图标
        get showValidateIcon() {
            return this.needStatusIcon &&
                !this.inputDisabled &&
                !this.inputReadonly &&
                !!this.validateState
        }

        // 切换密码显示隐藏
        get showPwdVisible() {
            return this.showPassword &&
                !this.inputDisabled &&
                !this.inputReadonly &&
                (!!this.nativeInputValue || this.focused)
        }

        // 清空图标
        get showClear() {
            return this.clearable &&
                !this.inputDisabled &&
                !this.inputReadonly &&
                !!this.nativeInputValue &&
                (this.focused || this.hovering)
        }

        get nativeInputValue() {
            return this.model == null ? '' : this.model;
        }

        /** 获取焦点 */
        public focus() {
            this.getInput().focus();
        }

        /** 失去焦点 */
        public blur() {
            this.getInput().blur();
        }

        private mounted() {
            if (this.validateEvent) {
                const newVal = this.formatInputValueForType(this.nativeInputValue);
                this.snFormItem && this.snFormItem.onFieldInit(newVal);
            }
            // @since 20190828 增加autofocus自动获得焦点配置
            if (this.autofocus) {
                this.getInput().focus();
            }
        }

        private getInput() {
            return this.$refs.input as HTMLInputElement;
        }

        // 输入开始时/选择字/词完成输入时/输入过程中每次击键时触发
        // Composition 事件以后触发 input 事件
        // 防止输入拼音时就触发了验证
        private handleComposition(event: any) {
            if (event.type === 'compositionstart') {
                this.isOnComposition = true;
            }
            if (event.type === 'compositionend') {
                this.isOnComposition = false;
                this.handleInput(event);
            }
        }

        private handleInput(event: any) {
            if (this.isOnComposition) return;
            // should remove the following line when we don't support IE
            if (event.target.value === this.nativeInputValue) return;
            this.emitInputForOutside(event.target.value);
            this.throttle(this.lazyHandleInput, this, event.target.value);
        }

        // focus事件
        private handleFocus(event: any) {
            this.focused = true;
            this.emitFocusForOutside(event);
        }

        // blur事件
        private handleBlur(event: any) {
            this.focused = false;
            this.emitBlurForOutside(event);
            if (this.validateEvent) {
                const newVal = this.formatInputValueForType(this.nativeInputValue);
                this.snFormItem && this.snFormItem.onFieldBlur(newVal);
            }
        }

        // change事件
        private handleChange(event: any) {
            const newVal = event.target.value;
            this.emitChangeForOutside(newVal);
        }

        // 清空
        private handleClear() {
            this.emitInputForOutside('');
            this.emitChangeForOutside('');
            this.emitClearForOutside();
            // 清空后-触发验证
            if (this.validateEvent) {
                this.snFormItem && this.snFormItem.validateForInside('');
            }
        }

        // 显示/隐藏密码
        private handlePasswordVisible() {
            this.passwordVisible = !this.passwordVisible;
            this.focus();
        }

        // 函数节流-防止频繁触发验证
        private throttle(method: any, context: any, val?: number | string) {
            window.clearTimeout(method.tId);
            method.tId = setTimeout(() => {
                method.call(context, val);
            }, 300);
        }

        /** 延迟触发-输入频繁 */
        private lazyHandleInput(val: string | number) {
            if (this.validateEvent) {
                const newVal = this.formatInputValueForType(val);
                this.snFormItem && this.snFormItem.onFieldChange(newVal);
            }
        }

        /** 输入值类型转换-根据isNumber */
        private formatInputValueForType(val: string | number) {
            if (this.isNumber) {
                const _val = parseFloat(val.toString());
                val = isNaN(_val) ? '' : _val;
            } else {
                val = val != null ? val.toString() : '';
            }
            return val
        }

        /**
         * 产生keyup回调事件 sn-autocomplete用
         * @auther wyr
         * @since 20190618
         */
        @Emit("keyup")
        private emitKeyUp(event: any) {}

        /**
         * 产生keydown回调事件 sn-autocomplete用
         * @auther wyr
         * @since 20190618
         */
        @Emit("keydown")
        private emitKeyDown(event: any) {}

        @Emit('input')
        private emitInputForOutside(newVal: string | number) {}

        @Emit('focus')
        private emitFocusForOutside(event: any) {}

        @Emit('blur')
        private emitBlurForOutside(event: any) {}

        @Emit('change')
        private emitChangeForOutside(newVal: string | number) {}

        @Emit('clear')
        private emitClearForOutside() {}

        @Emit('trigger-enter')
        private handleKeyUpEnter(event: any) {}

        @Emit()
        private suffixClick() {}
    }
</script>
