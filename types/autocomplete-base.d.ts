import {SnUIComponent, SnUIComponentSize} from './component';

/** AutocompleteBase Component */
export declare interface SnAutocompleteBase<T = any> extends SnUIComponent {
    /*绑定值*/
    readonly model: string;
    /** 输入框尺寸 */
    size: SnUIComponentSize;
    /** 输入框水印 */
    placeholder: string;
    /** 输入框是否只读, 默认为false */
    readonly: boolean;
    /**
     * 自动完成组件初始化默认展示的数据
     * 接收的数据格式为: {
     *     [valueKey]: string;
     *     [textKey]: string;
     *     // 下面可以加其他多余的业务数据属性
     * }
     */
    defaultSelect: T;
    /** 指定下拉容器中用于展示的文字属性名, 只用于界面展示逻辑 */
    textKey: string;
    /** 指定下拉容器中文字对应的value, 用于判断是否是当前选中项逻辑 */
    valueKey: string;
    /** 去业务层拿去下拉展示的数据, 通过cb返回, 达到异步展示的效果 */
    fetchData: (msg: string, cb: (data: T[]) => void) => void;
}

/** SelectBase Component Internal statement */
export interface ISnAutocompleteBase extends SnAutocompleteBase {

}
