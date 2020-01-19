import {SnUIComponent} from './component';

export interface ActiveColorObject {
    /** 颜色 */
    color: string;

    /** 百分比 */
    percent: number;
}

export interface ActiveColorCallback {
    /** 根据不同百分比返回自定义颜色 */
    (percent: number): string;
}

export type ActiveColor = string | string[] | ActiveColorObject[] | ActiveColorCallback;

/** Progress Component External statement */
export declare interface SnProgress extends SnUIComponent {
    /** 进度条类型 直线：line / 环形：circle / 仪表盘：dashboard */
    type: 'line' | 'circle' | 'dashboard';

    /** 百分比 0-100 默认0 */
    percent: number;

    /** 进度条长度 百分比或数值 默认350px */
    strokeWidth: string;

    /** 进度条宽度 默认6px */
    strokeHeight: string;

    /** 仅type="line"有效，进度条显示文字内置在进度条内 默认false (内显注意进度条高度不能小于12px) */
    textInside: boolean;

    /** 是否显示进度条文字内容 默认true */
    showText: boolean;

    /** 自定义进度条背景颜色 */
    backgroundColor: string;

    /** 自定义进度条激活时的背景颜色 */
    activeColor: ActiveColor;
}


