import {SnUIComponent} from "./component";

/** Table Component */
export declare interface SnTable extends SnUIComponent {
    /** 数据源 */
    dataSource: any[];

    /** 无数据-文本提示 */
    noDataText: string;

    /** 展开/关闭-列表拓展项 */
    toggleExpand(payload: { data: any, isExpanded?: boolean, index: number }): void;

    /** 用于多选表格，切换某一行的选中状态 */
    toggleRowSelection(values: any[], key: string, checkboxStatus?: boolean): void;
}

/** Table Component Internal statement */
export interface ISnTable extends SnTable {
    /** 列表勾选 */
    tableAfterCheck(resultList: any[], isCheckAll: boolean): void;

    /** 列表项点击 */
    rowClick(row: any, index: number): void;
}
