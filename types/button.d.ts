import {SnUIComponent, SnUIComponentSize} from './component';

/** 类型 */
export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text';

/** 原生type属性 */
export type ButtonNativeType = 'button' | 'submit' | 'reset';

/** Button Component External statement */
export declare interface SnButton extends SnUIComponent {
    /** 类型 */
    type: ButtonType;

    /** 原生type属性 */
    nativeType: ButtonNativeType;

    /** 按钮大小 */
    size: SnUIComponentSize;

    /** 图标类名 */
    icon: string;

    /** 是否禁用 */
    disabled: boolean;

    /** 是否朴素按钮 */
    plain: boolean;

    /** 是否默认聚焦 */
    autofocus: boolean;
}
