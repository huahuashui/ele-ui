import {SnUIComponent, SnUIComponentSize} from './component';
import {ISnFormItem} from "./form-item";

export type FormItemLabelPosition = 'left' | 'right' | 'top';

/** 表单验证规则 */
export interface FormRule {
    /** 此条规则-验证触发方式 blur/change */
    trigger?: string | string[];

    /** 验证器类型 */
    type?: string;

    /** rule属性指示字段必须存在于被验证的源对象上 */
    required?: boolean;

    /**
     * 最小值
     * 对于字符串类型和数组类型，将对长度进行比较，
     * 对于数字类型，该数字必须不小于最小值，也不大于最大值。
     */
    min?: number;

    /**
     * 最大值
     * 对于字符串类型和数组类型，将对长度进行比较，
     * 对于数字类型，该数字必须不小于最小值，也不大于最大值。
     */
    max?: number;

    /** 字符串长度或数值大小，len属性与最小和最大范围属性相结合，则len优先 */
    len?: number;

    /** 正则表达式 */
    pattern?: string;

    /** 提示信息 */
    message?: string;

    /** 提示信息类型-内部定制化的提示-不传，取message中文本 */
    messageType?: string;

    /** 自定义验证函数 回调中不携带错误提示，表示验证通过，message存在取message */
    validator?: (rule: any, value: any, callback: validatorCallback) => string | Error | null;

    /** 枚举 */
    enum?: (string | number)[];

    /** 转换函数 */
    transform?: <T>(value: T) => T;

    defaultField?: FormRule | FormRule[];
}

export interface validatorCallback {
    /** 回调中不携带数据，表示验证通过 */
    (msg: string | Error | null): void;
}

export interface ValidateFieldCallback {
    /**
     * 回调以告知字段验证结果
     *
     * @param data 表单验证结果
     */
    (data: FormValidateResult): void;
}

/** 表单验证结果 */
export interface FormValidateResult extends Record <string, any> {
    /** 表单域验证结果 */
    valid: boolean;

    /** 表单域每项详情 */
    validFields: { [key: string]: ValidField };
}

/** 表单域每项详情 */
export interface ValidField {
    /** 表单项验证结果 */
    valid: boolean;

    /** 错误提示 */
    message: string;

    /** 表单每项标识字段 */
    prop: string;
}

/** form Component */
export declare interface SnForm extends SnUIComponent {
    /**
     * 根据props移除对应表单项的校验结果
     * 传入待移除的表单项的prop属性或者prop组成的数组，如不传则移除整个表单的校验结果
     *
     * @param props 表单项的prop / [prop1,prop2]
     */
    clearValidate(props: string | string[]): void;

    /**
     * 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
     */
    resetFields(): void;

    /**
     * 验证某些表单项
     *
     * @param props 表单项的prop / [prop1,prop2]
     * @param callback 回调以告知字段验证结果
     * @param isView 是否触发界面样式变更-默认true-触发
     */
    validateFields(props?: string | string[] | null, callback?: ValidateFieldCallback, isView?: boolean): void;
}

/** form Component */
export interface ISnForm extends SnForm {
    /** 是否显示必填字段的标签旁边的红色星号 */
    required: boolean;

    /** 行内表单模式 */
    inline: boolean;

    /** 表单域标签的位置，如果值为left/right时，则需要设置label-width */
    labelPosition: FormItemLabelPosition;

    /** 表单域标签的宽度，作为Form直接子元素的form-item会继承该值 */
    labelWidth: string;

    /** 用于控制该表单内组件的尺寸 */
    size: SnUIComponentSize;

    /** 是否显示校验错误信息 */
    showMessage: boolean;

    /** 以行内形式展示校验信息 */
    inlineMessage: boolean;

    /** 是否展示验证状态图标 */
    statusIcon: boolean;

    /** 表单数据对象 */
    model: { [key: string]: any };

    /** 表单验证规则-父子都有传，取子的值 */
    rules: { [key: string]: any };

    /**
     * 保存表单域验证结果
     * @param prop 表单域 model 字段
     * @param valid 表单是否有效
     * @param message 错误消息，如果没有错误，它将是空的
     */
    setFormValidateResult(prop: string, valid: boolean, message: string): void;

    /**
     * 任一表单项被校验后触发 只有界面操作才会触发
     * @param prop 表单域 model 字段
     * @param valid 表单是否有效
     * @param message 错误消息，如果没有错误，它将是空的
     */
    formItemValidate(prop: string, valid: boolean, message: string): void;

    /**  注册子组件 */
    addField(field: ISnFormItem): void;

    /** 移除子组件 */
    removeField(field: ISnFormItem): void;
}
