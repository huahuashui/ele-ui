<template>
    <form class="sn-form">
        <slot></slot>
    </form>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Watch, Emit} from "vue-property-decorator";

    import {SnUIComponentSize} from "../../../types";
    import {
        FormItemLabelPosition,
        FormRule,
        FormValidateResult,
        ValidateFieldCallback,
        ValidField
    } from "../../../types/form";
    import {ISnFormItem} from "../../../types/form-item";

    @Component({
        name: 'SnForm'
    })
    export default class SnForm extends Vue {
        // '!'=>ts非空断言
        /** 行内表单模式 */
        @Prop(Boolean)
        public inline: boolean;
        /** 表单域标签的位置，right/left/top，如果值为left/right时，则需要设置label-width */
        @Prop({type: String, default: 'right'})
        public labelPosition: FormItemLabelPosition;
        /** 表单域标签的宽度，作为Form直接子元素的form-item会继承该值 */
        @Prop(String)
        public labelWidth: string;
        /** 用于控制该表单内组件的尺寸 */
        @Prop(String)
        public size: SnUIComponentSize;

        /** 是否显示必填字段的标签旁边的红色星号 */
        @Prop(Boolean)
        public required: boolean;
        /** 是否显示校验错误信息 */
        @Prop({type: Boolean, default: true})
        public showMessage: boolean;
        /** 以行内形式展示校验信息 */
        @Prop(Boolean)
        public inlineMessage: boolean;

        /** 是否展示验证状态图标 */
        @Prop(Boolean)
        public statusIcon: boolean;
        /** 表单数据对象 */
        @Prop(Object)
        public model: { [key: string]: any };
        /** 表单验证规则-父子都有传，取子的值 */
        @Prop(Object)
        public rules: { [key: string]: FormRule[] };

        /** 子组件集合 */
        private fields: ISnFormItem[] = [];

        /** form表单验证结果 */
        private formValidateResult = {
            valid: false,
            validFields: {}
        } as FormValidateResult;

        /** 注册子组件 */
        public addField(field: ISnFormItem) {
            if (field) {
                this.fields.push(field);
            }
        }

        /** 移除子组件 */
        public removeField(field: ISnFormItem) {
            if (field.prop) {
                this.fields.splice(this.fields.indexOf(field), 1);
                delete this.formValidateResult.validFields[field.prop];
            }
        }

        /**
         * 验证某些表单项
         * @param props 表单项的prop / [prop1,prop2] 如不传则校验整个表单
         * @param callback 回调以告知字段验证结果
         * @param isView 是否触发界面样式变更
         */
        public validateFields(props?: string | string[], callback?: ValidateFieldCallback, isView?: boolean) {
            if (!this.model) {
                console.warn('[Warn][Form]model is required for resetFields to work.');
                return;
            }
            const fields = props != null && props.length > 0 ?
                (typeof props === 'string'
                        ? this.fields.filter(field => props === field.prop)
                        : this.fields.filter(field => props.indexOf(field.prop) > -1)
                ) : this.fields;
            // 如果需要验证的fields为空，调用验证时立刻返回callback
            if (fields.length === 0) return;
            const promiseArr = [] as Promise<ValidField>[];
            fields.forEach(field => {
                promiseArr.push(field.validateForOutside(isView));
            });
            Promise.all(promiseArr)
                   .then((validRetArr: ValidField[]) => {
                       validRetArr.forEach(validRet => {
                           if (!validRet) return;
                           this.setFormValidateResult(validRet.prop, validRet.valid, validRet.message)
                       });
                       if (typeof callback === 'function') {
                           callback(this.formValidateResult)
                       }
                   })
                   .catch((e: any) => {
                       console.warn('[Warn][Form][validateFields]', e);
                   })
        }

        /**
         * 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
         */
        public resetFields() {
            if (!this.model) {
                console.warn('[Warn][Form]model is required for resetFields to work.');
                return;
            }
            this.fields.forEach(field => {
                field.resetField();
            });
        }

        /**
         * 根据props移除对应表单项的校验结果
         * 传入待移除的表单项的prop属性或者prop组成的数组，如不传则移除整个表单的校验结果
         * @param props 表单项的prop / [prop1,prop2]
         */
        public clearValidate(props: string | string[] = []) {
            const fields = props.length
                ? (typeof props === 'string'
                        ? this.fields.filter(field => props === field.prop)
                        : this.fields.filter(field => props.indexOf(field.prop) > -1)
                ) : this.fields;
            fields.forEach(field => {
                field.clearValidate();
            });
        }

        /** 缓存form表单验证结果 */
        public setFormValidateResult(prop: string, valid: boolean, message: string) {
            if (!prop) return;
            if (!this.formValidateResult.validFields[prop]) {
                this.formValidateResult.validFields[prop] = {} as ValidField;
            }
            this.formValidateResult.validFields[prop].prop = prop;
            this.formValidateResult.validFields[prop].valid = valid;
            this.formValidateResult.validFields[prop].message = message;
            const validFields = this.formValidateResult.validFields;
            let validRet = true;
            for (const key in validFields) {
                if (!validFields[key].valid) {
                    validRet = false;
                }
            }
            this.formValidateResult.valid = validRet;
        }

        /**
         * 任一表单项被校验后触发-只有界面操作才会触发
         * @param prop 表单域 model 字段，表单项的prop
         * @param valid 验证结果
         * @param message 错误消息，如果没有错误，它将是空的
         */
        @Emit('validate')
        public formItemValidate(prop: string, valid: boolean, message: string) {}

        /**
         * 整个表单验证状态-有变更就触发
         * @param valid 验证结果
         * @param validFields 表单项验证结果合集
         */
        @Emit('change')
        private validateChange(valid: boolean, validFields: { [key: string]: ValidField }) {}

        @Watch('formValidateResult.valid')
        private watchFormValid() {
            this.validateChange(this.formValidateResult.valid, this.formValidateResult.validFields)
        }
    }
</script>
