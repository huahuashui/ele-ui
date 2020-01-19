<template>
    <div class="sn-form-item"
         :class="[{'sn-form-item--inline': isInline},
                   labelPositionClass ? 'sn-form-item--label-'+labelPositionClass : '']"
    >
        <label v-if="label || $slots.label"
               class="sn-form-item__label" :style="labelStyle" :title="label"
               :class="{'is-required': isRequired}">
            <slot name="label">{{label}}</slot>
        </label>
        <div class="sn-form-item__content" :style="contentStyle">
            <slot></slot>
            <transition name="sn-zoom-in-top">
                <slot name="error" v-if="isShowMessage && validateState === 'error'">
                    <div class="sn-form-item__error"
                         :class="{'sn-form-item__error--inline': isInlineMessage}">
                        {{validateMessage}}
                    </div>
                </slot>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
    import AsyncValidator from 'async-validator';
    import {Vue, Component, Prop} from "vue-property-decorator";

    import {SnUIComponentSizeEnum} from "ele-ui/src/enum/component";
    import {getPropByPath} from "ele-ui/src/utils/util";

    import {SnUIComponentSize} from "../../../types";
    import {FormItemLabelPosition, FormRule, ISnForm, ValidField} from "../../../types/form";
    import {ISnFormItem} from "../../../types/form-item";

    @Component({
        name: 'SnFormItem'
    })
    export default class SnFormItem extends Vue {
        /** 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的 */
        @Prop(String)
        public prop: string;
        /** 表单验证规则-父子都有传，取子的值 */
        @Prop([Object, Array])
        public rules: FormRule | FormRule[];
        /** 验证触发方式-blur,change, ['blur','change'] 默认blur触发 */
        @Prop([String, Array])
        public trigger: string | string[];

        /** 标签文本 */
        @Prop(String)
        public label: string;
        /** 表单域标签的的宽度，例如'50px' */
        @Prop(String)
        public labelWidth: string;
        /** 用于控制该表单内组件的尺寸 */
        @Prop(String)
        public size: SnUIComponentSize;

        /** 是否显示必填字段的标签旁边的红色星号 */
        @Prop(Boolean)
        public required: boolean;
        /** 是否显示校验错误信息 */
        @Prop(Boolean)
        public showMessage: boolean;
        /** 以行内形式展示校验信息 */
        @Prop(Boolean)
        public inlineMessage: boolean;

        // 验证状态-validating/success/error
        public validateState: string = '';

        // 缓存初始值
        private initialValue: string | number = '';
        private initValidate = {} as ValidField;
        // 父节点是否为SnFormItem
        private isNested: boolean = false;
        // 有效验证标识-将最后一次触发的验证标为有效验证
        private validateMark: number = 0;
        // 是否触发了重置
        private validateReset: boolean = false;
        // 错误提示
        private validateMessage: string = '';

        // computed
        get snForm(): ISnForm {
            let parent: any = this.$parent;
            while (parent && parent.$options && parent.$options.name !== 'SnForm') {
                if (parent.$options.name === 'SnFormItem') {
                    this.isNested = true;
                }
                parent = parent.$parent;
            }
            return parent;
        }

        get isStatusIcon(): boolean {
            return this.snForm.statusIcon;
        }

        get isInline(): boolean {
            return this.snForm.inline;
        }

        get sizeClass(): SnUIComponentSize {
            return this.size || this.snForm.size || 'small';
        }

        get labelPositionClass(): FormItemLabelPosition {
            return this.snForm.labelPosition;
        }

        get labelStyle() {
            const ret = {} as { [key: string]: string };
            const size = this.sizeClass;
            ret.height = SnUIComponentSizeEnum[size] + 'px';
            ret.lineHeight = SnUIComponentSizeEnum[size] + 'px';
            if (this.labelPositionClass === 'top') return ret;
            const labelWidth = this.labelWidth || this.snForm.labelWidth;
            ret.width = labelWidth || null;
            return ret;
        }

        get contentStyle() {
            const ret = {} as { [key: string]: string };
            const label = this.label;
            if (this.labelPositionClass === 'top' || this.isInline) return ret;
            if (!label && !this.labelWidth && this.isNested) return ret;
            const labelWidth = this.labelWidth || this.snForm.labelWidth;
            ret.marginLeft = labelWidth || null;
            return ret;
        }

        get isRequired(): boolean {
            // let ret = this.snForm.required;
            // if (typeof this.required === 'boolean') {
            //     ret = this.required;
            // }
            return this.snForm.required || this.required;
        };

        get isShowMessage(): boolean {
            // let ret = this.snForm.showMessage;
            // if (typeof this.showMessage === 'boolean') {
            //     ret = this.showMessage;
            // }
            return this.snForm.showMessage || this.showMessage;
        }

        get isInlineMessage(): boolean {
            // let ret = this.snForm.inlineMessage;
            // if (typeof this.inlineMessage === 'boolean') {
            //     ret = this.inlineMessage;
            // }
            return this.snForm.inlineMessage || this.inlineMessage;
        }

        // 当前表单项的值
        get fieldValue(): string | number {
            const model = this.snForm.model;
            if (!model || !this.prop) {return;}
            return getPropByPath(model, this.prop).v;
        }

        // 当前表单项验证规则对象
        get fieldRuleList(): FormRule[] {
            const parentRules = this.snForm.rules as { [key: string]: FormRule[] };
            const selfRules = this.rules;
            const prop = this.prop || '';
            const currentFormRules = parentRules ? (parentRules[prop] || []) : [];
            return [].concat(selfRules || currentFormRules || []);
        }

        get fieldTrigger() {
            let ret = ['blur', 'change'] as string[];
            if (Array.isArray(this.trigger)) {
                if (this.trigger.indexOf('blur') === -1 && this.trigger.indexOf('change') !== -1) {
                    ret = ['change'];
                } else if (this.trigger.indexOf('blur') !== -1 && this.trigger.indexOf('change') === -1) {
                    ret = ['blur'];
                }
            } else {
                if (ret.indexOf(this.trigger) !== -1) {
                    ret = [this.trigger];
                }
            }
            return ret;
        }

        /**
         * 初始化验证
         * 保存初始值和初始验证结果，不更新验证状态
         * 假如存在交叉验证
         */
        public onFieldInit(filedValue: string | number) {
            this.initialValue = filedValue;
            this.validateV2(filedValue, false)
                .then((validRet: ValidField) => {
                    this.initValidate.valid = validRet.valid;
                    this.initValidate.message = validRet.message;
                    this.setValidateResult(validRet.valid, validRet.message);
                })
                .catch((e: any) => {})
        }

        /** Blur事件 */
        public onFieldBlur(filedValue: string | number): void {
            if (this.fieldTrigger.indexOf('blur') === -1) {return;}
            this.validateForInside(filedValue);
        };

        /** change事件-目前只监听界面操作触发的事件，不是界面操作，不会触发此事件 */
        public onFieldChange(filedValue: string | number): void {
            if (this.fieldTrigger.indexOf('change') === -1) {return;}
            this.validateForInside(filedValue);
        }

        /** 移除该表单项的校验结果 */
        public clearValidate(): void {
            // 样式重置
            this.setValidateState();
        }

        /** 对该表单项进行重置，将其值重置为初始值并移除校验结果 */
        public resetField(): void {
            this.validateReset = true;
            // 重置为初始值
            const model = this.snForm.model;
            const value = this.fieldValue;
            const path = this.prop;
            if (!model || !path) return;
            const propObj = getPropByPath(model, path, true);
            if (Array.isArray(value)) {
                propObj.o[propObj.k] = [].concat(this.initialValue);
            } else {
                propObj.o[propObj.k] = this.initialValue;
            }
            // 样式重置
            this.setValidateState();
            // 重置验证结果
            this.setValidateResult(this.initValidate.valid, this.initValidate.message);
        }

        /** 外部主动更改值触发 */
        public validateForOutside(isView: boolean = true): Promise<ValidField> {
            this.validateReset = false;
            return this.validateV2(this.fieldValue, isView)
                       // 将失效验证promise在此处拦截
                       .then(validRet => validRet)
                       .catch((e: any) => {return null})
        }

        /** 组件内部更改值触发-view样式必定变更 */
        public validateForInside(fieldValue: string | number) {
            this.validateReset = false;
            this.validateV2(fieldValue)
                .then(validRet => {
                    this.setValidateResult(validRet.valid, validRet.message);
                    this.snForm.formItemValidate(validRet.prop, validRet.valid, validRet.message)
                })
                .catch((e: any) => {})
        }

        private mounted() {
            if (this.prop) {
                this.snForm.addField(this as ISnFormItem);
            }
        };

        private beforeDestroy() {
            this.snForm.removeField(this as ISnFormItem);
        }

        /**
         * 验证处理
         * @param fieldValue 当前表单项的值
         * @param isView 是否触发界面样式变更
         * @return {Promise<ValidField>}
         */
        private validateV2(fieldValue: string | number, isView: boolean = true) {
            return new Promise((resolve: (data: ValidField) => void, reject: (data: ValidField) => void) => {
                const rules = this.fieldRuleList;
                // 无验证规则不触发验证
                if (!rules || rules.length <= 0) {
                    return reject(null);
                }
                // 触发验证时-生成一个新的有效验证的标识
                const currentMark = ++this.validateMark;
                // 更新验证状态-验证中
                isView && this.setValidateState('validating');
                // 重置验证结果
                this.setValidateResult(false, '');
                const descriptor = {
                    [this.prop]: rules
                } as { [key: string]: any };
                const model = {
                    [this.prop]: fieldValue
                } as { [key: string]: number | string };

                const validator = new AsyncValidator(descriptor);
                validator.validate(model, {firstFields: true}, (errors: any, invalidFields: any) => {
                    // 过滤重置前触发的验证，过滤无效验证结果
                    if (this.validateReset || currentMark !== this.validateMark) {
                        console.debug('过滤无效验证', this.prop);
                        return reject(null);
                    }
                    // 有效验证-更新验证状态、更新验证结果、重置有效表识
                    this.validateMark = 0;
                    const validateMessage = errors ? errors[0].message : '';
                    const validateState = !errors ? 'success' : 'error';
                    isView && this.setValidateState(validateState, validateMessage);
                    const validRet = {prop: this.prop, valid: !errors, message: validateMessage} as ValidField;
                    resolve(validRet);
                });
            })
        }

        // 更新验证状态-触发外部样式变化
        private setValidateState(validating?: string, message?: string) {
            // 修改校验状态-校验中
            this.validateState = validating || '';
            this.validateMessage = message || '';
        }

        // 缓存验证结果
        private setValidateResult(valid: boolean, message: string) {
            this.snForm.setFormValidateResult(this.prop, valid, message);
        }
    }
</script>
