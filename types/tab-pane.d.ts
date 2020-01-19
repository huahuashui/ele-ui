import {SnUIComponent} from "./component";

/** TabPane Component External statement */
export declare interface SnTabPane extends SnUIComponent {
    /** 与选项卡model对应的标识符，表示选项卡别名 */
    name: string | number;

    /** 选项卡标题 */
    label: string;

    /** 是否禁用 */
    disabled: boolean;

    /** 标签是否延迟渲染- */
    lazy: boolean;
}

/** Tab Component Internal statement */
export interface ISnTabPane extends SnTabPane {
    index: number;

    active: boolean;
}
