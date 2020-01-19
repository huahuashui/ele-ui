import {SnUIComponent, SnUIComponentSize} from './component';
import {ValidField} from "./form";

/** FormItem Component 外部声明 */
export declare interface SnFormItem extends SnUIComponent {
    /** 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的 */
    prop: string;

    /** 表单验证规则-父子都有传，取子的值 */
    rules: any | any[];

    /** 验证触发方式-blur,change, ['blur','change'] 默认blur触发 */
    trigger: string | string[];

    /** 是否显示必填字段的标签旁边的红色星号-子优先级高于父-默认false */
    required: boolean;

    /** 行内表单模式-子优先级高于父-默认false */
    inline: boolean;

    /** 标签文本 */
    label: string;

    /** 表单域标签的的宽度，例如'50px' */
    labelWidth: string;

    /** 用于控制该表单内组件的尺寸 */
    size: SnUIComponentSize;

    /** 是否显示校验错误信息-子优先级高于父-默认true */
    showMessage: boolean;

    /** 以行内形式展示校验信息-子优先级高于父-默认false */
    inlineMessage: boolean;

    /** 是否展示验证状态图标-默认false */
    statusIcon: boolean;

    /** 对该表单项进行重置，将其值重置为初始值并移除校验结果 */
    resetField(): void;

    /** 移除该表单项的校验结果 */
    clearValidate(): void;
}

/** FormItem Component 内部类型限制 */
export interface ISnFormItem extends SnFormItem {
    /** 用于控制该表单内组件的尺寸 */
    sizeClass: SnUIComponentSize;

    /** 表单项验证结果 */
    validateState: string;

    /** 是否展示验证状态图标 */
    isStatusIcon: boolean;

    /** blur事件-验证触发方式 */
    onFieldBlur(val: string | number): void;

    /** change事件-验证触发方式 */
    onFieldChange(val: string | number): void;

    /** 初始化验证 */
    onFieldInit(val: string | number): void;

    /**
     * 内部主动触发，验证当前表单项，view样式必定变更
     */
    validateForInside(val: string | number): void;

    /**
     * 外部主动触发，验证当前表单项
     *
     * @param isView 是否触发界面样式变更
     */
    validateForOutside(isView?: boolean): Promise<ValidField>;
}
