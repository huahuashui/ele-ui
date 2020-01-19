import {SnUIComponent} from './component';

/** Checkbox Component */
export declare interface SnCheckbox extends SnUIComponent {
    /** 绑定值 */
    model: string | number | boolean;

    /** checkbox标识-与checkbox-group组件一起使用，必传 */
    prop: string | number;

    /** checkbox 勾选的 value */
    trueValue: string | number | boolean;

    /** checkbox 未勾选的 value */
    falseValue: string | number | boolean;

    /** 是否禁用 */
    disabled: boolean;

    /** 是否自定自定义图标*/
    hasIconTags: boolean;

    /** 半选状态-只是样式变更 */
    indeterminate: boolean;
}
