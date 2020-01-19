import {SnUIComponent} from "./component";

/** Switch Component */
export declare interface SnSwitch extends SnUIComponent {
    /** 绑定值 */
    model: boolean | string | number;

    /** 是否禁用 */
    disabled: boolean;

    /** switch 关闭时的文字描述 */
    inactiveText: string;

    /** switch 打开时的文字描述 */
    activeText: string;

    /** switch 关闭时的值 */
    inactiveValue: string | number | boolean;

    /** switch 打开时的值 */
    activeValue: string | number | boolean;

    /** switch 关闭时的值背景色 */
    inactiveColor: string;

    /** switch 打开时的背景色 */
    activeColor: string;
}
