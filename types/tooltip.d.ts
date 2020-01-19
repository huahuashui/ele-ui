import {SnUIComponent} from "./component";

/** Tooltip Component */
export declare interface SnTooltip extends SnUIComponent {
    /** effect    默认提供的主题    String    dark/light    dark **/
    effect: 'dark' | 'light';

    /** content    显示的内容，也可以通过slot#content传入DOM    String    —    — **/
    content: string;

    /** disabled  Popover是否可用  Boolean  —  false **/
    disabled: boolean;

    /** visible-arrow    是否显示Tooltip箭头，更多参数可见Vue-popper    Boolean    —    true **/
    visibleArrow: boolean;

    /** open-delay    触发方式为 hover 时的显示延迟，单位为毫秒    Number    —    — } **/
    openDelay: number;

    /** close-delay    触发方式为 hover 时的隐藏延迟，单位为毫秒    number    —    200 } **/
    closeDelay: number;

    /** manual    手动控制模式，设置为true后，mouseenter和mouseleave事件将不会生效  Boolean  —  false } **/
    manual: boolean;

    /** transition    定义渐变动画    String    —    sn-fade-in-linear **/
    transition: string;

    /** popper-class  为Tooltip的popper添加类名  String  —  — } **/
    popperClass: string;

    /** enterable    鼠标是否可进入到 tooltip 中    Boolean    —    true } **/
    enterable: boolean;

    /** hide-after    Tooltip出现后自动隐藏延时，单位毫秒，为0则不会自动隐藏    number    —    0 } **/
    hideAfter: number;

    /** tabindex    Popover 组件的 tabindex    number    —    0 } **/
    tabindex: number;
}
