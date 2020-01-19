import {SnUIComponent, SnUIComponentSize} from './component';
import {SnAutocompleteBase} from "./ele-ui";

/** Autocomplete Component */
export declare interface SnAutocomplete {
    /** 绑定值 */
    readonly model: string;
    /**
     * 是否允许输入框中的值为空,
     * 设置为true以后, 当输入框中的值为空时, 返回触发getAutocompleteSelect, 返回一个null
     */
    allowNull: boolean;
    /**
     * 自动完成组件初始化默认展示的数据
     * 接收的数据格式为: {
     *     [valueKey]: string;
     *     [textKey]: string;
     *     // 这个对象里面可以加其他多余的业务数据属性, 当前组件不会修改
     * }
     */
    defaultSelect: SnAutocompleteBase['defaultSelect'];
    /** 指定下拉容器中用于展示的文字属性名, 只用于界面展示逻辑 */
    textKey: SnAutocompleteBase['textKey'];
    /** 指定下拉容器中文字对应的value, 用于判断是否是当前选中项逻辑 */
    valueKey: SnAutocompleteBase['valueKey'];
    /** 去业务层拿去下拉展示的数据, 通过cb返回, 达到异步展示的效果 */
    fetchData: SnAutocompleteBase['fetchData'];
    /** 主动清空清空内部的缓存数据 */
    clear(): void;
}
/** SelectBase Component Internal statement */
export interface ISnAutocomplete extends SnAutocomplete {

}
