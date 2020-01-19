import {SnUIComponent} from './component';
import {SelectLabel, SelectValue} from "./select";

/** SelectOption Component */
export declare interface SnSelectOption extends SnUIComponent {
    /** 选项的值 */
    value: SelectValue;

    /** 选项的标签，若不设置则默认与 value 相同 */
    label: SelectLabel;

    /** 是否禁用该选项 */
    disabled: boolean;
}

/** SelectOption Component Internal statement */
export interface ISnSelectOption extends SnSelectOption {
    /**
     * 根据父组件model的值--更新展示
     * @param selectValue 选中值
     * @param isNoClick true标识为点击触发 false标识为非点击触发
     */
    updateHandle(selectValue: SelectValue | SelectValue[], isNoClick?: boolean): void;
}
