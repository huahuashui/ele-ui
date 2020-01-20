import {SnUIComponent} from './component';
import {Prop} from "vue-property-decorator";

/** Pagination Component */
export declare interface SnPagination extends SnUIComponent {
    /** 组件布局，子组件名用逗号分隔 */
    layout: string;

    /** 大于等于 5 且小于等于 21 的奇数 */
    buttonCount: number;

    /** 替代图标显示的上一页文字 */
    prevText: string;

    /** 替代图标显示的下一页文字 */
    nextText: string;

    /** 总条目数 */
    total: number;

    /** 当前页数 */
    currentPage: number;

    /** 每页显示条目个数 */
    pageSize: number;

    /** 是否为分页按钮添加背景色 */
    background: boolean;

    /** 只展示一页 */
    singlePage: boolean;

    /** 是否禁用 */
    disabled: boolean;

    /** 只有一页时是否隐藏 */
    hideSinglePage: boolean;
}
