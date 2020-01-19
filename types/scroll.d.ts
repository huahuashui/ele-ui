import {SnUIComponent} from './component';

/** Scroll Component */
export declare interface SnScroll extends SnUIComponent {
    /** 滚动条厚度 */
    thumbThick: number;

    /** 触发加载的距离阀值 */
    offset: number;

    /** 滚动方向 true为垂直滚动, false为横向 */
    scrollY: boolean;

    /** 滚动方向 */
    scrollX: boolean;

    /** 是否开启无限滚动 */
    openLoaded: boolean;

    /** 数据是否全部加载完 */
    finished: boolean;

    /** 触发scroll事件节流延时 */
    scrollDelay: number;

    /** 是否正在加载数据 */
    isLoading: boolean;
}
