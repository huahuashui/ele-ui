import {SnUIComponent, SnUIComponentSize} from './component';

/** Input Component */
export declare interface SnInput extends SnUIComponent {
    /** 绑定值 */
    readonly model: string | number | null;

    /** Placeholder */
    placeholder: string;

    /** 输入框尺寸 */
    size: SnUIComponentSize;

    /** 类型-原生属性 */
    type: string;

    /** 禁用 */
    disabled: boolean;

    /** 只读 */
    readonly: boolean;

    /** 是否可清空 */
    clearable: boolean;

    /** 是否显示密码图标 */
    showPassword: boolean;

    /** 输入框头部图标 */
    prefixIcon: string;

    /** 输入框尾部图标 */
    suffixIcon: string;

    /** 输入时是否触发表单的校验 */
    validateEvent: boolean;

    /** 输入值是否需转化为number */
    isNumber: boolean;

    /** 初次加载的时候是否自动获得焦点 */
    autofocus: boolean;

    /** 获取焦点 */
    focus(): void;

    /** 失去焦点 */
    blur(): void;
}
