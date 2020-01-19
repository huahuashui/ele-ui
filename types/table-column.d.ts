import {SnUIComponent} from "./component";

/** 列表仓库操作名 */
export type TableStoreMutationName = 'changeCheckboxStatus' | 'changeCheckboxAll' | 'updateStates'
    | 'addColumnConfig' | 'setDataSource' | 'toggleExpand' | 'batchChangeCheckboxStatus';

/** 列表项类型 */
export type TableColumnType = 'default' | 'expand' | 'selection';

/** 列表仓库存储的数据资源 */
export interface ITableStoreState {
    [key: string]: any;

    dataSource: any[];
    checkboxAllStatus: 0 | 1 | -1;
    hasCheck?: boolean;
    hasSerial?: boolean;
    columnConfigs?: IColumnConfig[];
    renderExpandedFunc?: (h: any, data: IColumnSlotScope) => void | null;
    isDisCheckFunc?: (data: any, index: number) => boolean | null;
    expandRows: { [key: string]: boolean };
    selections: any[]
}

/** 列表仓库操作集合 */
export interface ITableStore {
    states: ITableStoreState;

    // 列表额外项
    isRowExpanded(rowData: any, index: number): any;

    // 获取列表项选中状态
    isSelected(data: any, index: number): any;

    // 列表项点击状态
    rowClick(opts: { $event: Event, row: any, index: number }): any;

    // 提交修改操作
    commit(name: TableStoreMutationName, ...args: any[]): any;
}

/** 列表项-外部可获取资源 */
export interface IColumnSlotScope {
    row: any,
    index: number,
    column: IColumnConfig,
    store: ITableStore
}

/** 列表项配置 */
export interface IColumnConfig {
    columnClass?: string;
    label?: string;
    renderCell?: (h: any, opts: { row: any, index: number, column: IColumnConfig, store: ITableStore }) => any;
    renderHeader?: (h: any, opts: { column: IColumnConfig, store: ITableStore }) => any;
    renderExpanded?: (h: any, opts: IColumnSlotScope) => any;
    type: TableColumnType;
    disCheckFunc?: (data: any, $index: number) => boolean;
    hasCheck: boolean;
    hasSerial: boolean;
    indexFormat: (data: any, $index: number) => string | number;
    prop: string;
}

/** TableColumn Component */
export declare interface SnTableColumn extends SnUIComponent {
    /** 列表项类型 */
    type: string;

    /** 数据-键值 */
    prop: string;

    /** 列表-表头name */
    label: string;

    /** 自定义类名 */
    columnClass: string;

    /** 列表项类型为selection，多选框 */
    hasCheck: boolean;

    /** 列表项类型为selection，序号 */
    hasSerial: boolean;

    /** 列表项类型为selection，checkbox禁止状态-计算方法 */
    disCheckFunc: (data: any, index: number) => boolean;

    /** 列表项类型为selection，列表序号-计算方法 */
    indexFormat: (data: any, index: number) => number;
}
