import {SnUIComponent} from './component';

/** Popover Component */
export declare interface SnPopover extends SnUIComponent {
    /** trigger 触发方式  String  click/focus/hover/manual    click **/
    trigger: 'click' | 'focus' | 'hover' | 'manual';

    /** title    标题    String    —    — **/
    title: string;

    /** content    显示的内容，也可以通过slot传入DOM    String    —    — **/
    content: string;

    /** width    宽度    String, Number    —    最小宽度 150px **/
    width: string | number;

    /** disabled  Popover是否可用  Boolean  —  false **/
    disabled: boolean;

    /** transition    定义渐变动画    String    —    fade-in-linear **/
    transition: string;

    /** popper-class    为 popper 添加类名    String    —    — **/
    popperClass: string;

    /** open-delay    触发方式为 hover 时的显示延迟，单位为毫秒    Number    —    — } **/
    openDelay: number;

    /** close-delay    触发方式为 hover 时的隐藏延迟，单位为毫秒    number    —    200 } **/
    closeDelay: number;

    /** tabindex    Popover 组件的 tabindex    number    —    0 } **/
    tabindex: number;
}
