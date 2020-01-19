import {SnUIComponent} from './component';

/** Radio Component */
export declare interface SnRadio extends SnUIComponent {
    /** 绑定值 */
    model: string | number | boolean;

    /** Radio 的 value */
    value: string | number | boolean;

    /** 是否禁用 */
    disabled: boolean;

    /** 是否自定自定义图标*/
    hasIconTags: boolean;
}
