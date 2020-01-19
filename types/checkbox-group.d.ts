import {SnUIComponent} from './component';

/** 绑定值model */
export interface CheckboxGroupModel {
    prop: string | number;

    value: number | string | boolean
}

/** CheckboxGroup Component */
export declare interface SnCheckboxGroup extends SnUIComponent {
    /** 绑定值 */
    model: CheckboxGroupModel[];

    /** 是否禁用 */
    disabled: boolean;
}

/** CheckboxGroup Component Internal statement */
export interface ISnCheckboxGroup extends SnCheckboxGroup {
    changeModel(value: number | string | boolean, prop: number | string): void;
}
