import {SnUIComponent} from './component';

/** RadioGroup Component */
export declare interface SnRadioGroup extends SnUIComponent {
    /** 绑定值 */
    model: string | number | boolean;

    /** 是否禁用 */
    disabled: boolean;
}

/** RadioGroup Component Internal statement */
export interface ISnRadioGroup extends SnRadioGroup {
    changeModel(val: string | number | boolean): void;
}
