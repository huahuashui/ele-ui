import {SnUIComponent} from './component';

/** Popconfirm Component */
export declare interface SnPopconfirm extends SnUIComponent {
    /** title    标题    String    —    — **/
    title: string;

    /** confirmButtonText    确认按钮文字    String    —    — **/
    confirmButtonText: string;

    /** cancelButtonText    取消按钮文字    String    —    — **/
    cancelButtonText: string;

    /** confirmButtonType    确认按钮类型    String    —    Primary **/
    confirmButtonType: string;

    /** cancelButtonType    取消按钮类型    String    —    Text **/
    cancelButtonType: string;

    /** icon    Icon    String    —     sn-icon-question **/
    icon: string;

    /** iconColor     Icon  颜色     String     —  #f90 **/
    iconColor: string;

    /** hideIcon    是否隐藏 Icon    Boolean    —    false **/
    hideIcon: boolean;
}
