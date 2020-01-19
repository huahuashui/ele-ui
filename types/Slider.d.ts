import {SnUIComponent} from './component';

/** Slider Component External statement */
export declare interface SnSlider extends SnUIComponent {
    /** 当前数值 */
    model: number | number[];

    /** 是否为范围选择 */
    range: boolean;

    /** 最小值 */
    min: number;

    /** 最大值 */
    max: number;

    /** 步数--可被max-min整除 */
    step: number;
}

/** Slider Component Internal statement */
export interface ISnSlider extends SnSlider {
    /** 小数点后的长度 */
    precision: number;

    /** 容器dom */
    getSliderDom(): HTMLDivElement;
}

/** Slider Button Component Internal statement */
export interface ISnSliderButton extends SnUIComponent {
    /** 设置滑块位置 */
    setPosition(num: number): void;
}



