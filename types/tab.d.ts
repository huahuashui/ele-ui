import {SnUIComponent} from "./component";

/** Tab Component External statement */
export declare interface SnTab extends SnUIComponent {
    /** 绑定值，选中选项卡的 name，默认第一个选项卡name */
    model: string | number;

    /** 不同风格选项卡  默认风格1--content标签内容撑开  风格2--average均分宽度 */
    type: string;

    /** 选项卡每项排列位置  left/center/right */
    align: string;

    /** 切换标签之前的钩子，若返回 false，则阻止切换 */
    beforeClick: (newName: string | number, oldName: string | number) => boolean;

}

/** Tab Component Internal statement */
export interface ISnTab extends SnTab {
    currentName: string | number;
}
