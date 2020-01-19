import {SnUIComponent} from './component';

/** Badge Component External statement */
export declare interface SnBadge extends SnUIComponent {
    /** 显示值 默认最大99 */
    model: number | string;

    /** 最大值，超过最大值会显示 '{max}+'，要求 model 是 number 类型 */
    max: number;

    /** 是否隐藏badge 默认展示 */
    hidden: boolean;
}
