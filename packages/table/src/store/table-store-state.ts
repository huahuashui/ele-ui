

// import {TableStore} from "./table-store";

// export enum TableColumnType {
//     default = 'default',
//     expand = 'expand',
//     selection = 'selection'
// }
//
// // 列表-操作
// export enum TableStoreMutationEnum {
//     // removeColumn = "removeColumn",
//     // 切换列表项-选中状态
//     changeCheckboxStatus = "changeCheckboxStatus",
//     // 切换列表全选状态
//     changeCheckboxAll = "changeCheckboxAll",
//     //
//     updateStates = "updateStates",
//     // 添加列表项
//     addColumnConfig = "addColumnConfig",
//     // 保存数据
//     setDataSource = "setDataSource",
//     // 切换可展开表格
//     toggleExpand = "toggleExpand",
//     // 批量切换列表项-选中状态
//     batchChangeCheckboxStatus = "batchChangeCheckboxStatus",
// }

// export interface ITableStoreState {
//     dataSource: any[];
//     checkboxAllStatus: 0 | 1 | -1;
//     hasCheck?: boolean;
//     hasSerial?: boolean;
//     columnConfigs?: IColumnConfig[];
//     renderExpandedFunc?: (h: any, data: IColumnSlotScope) => void | null;
//     isDisCheckFunc?: (data: any, index: number) => boolean | null;
//     expandRows: { [key: string]: boolean };
//     selections: any[]
// }
//
// export interface IColumnConfig {
//     columnClass?: string;
//     label?: string;
//     renderCell?: (h: any, opts: { row: any, index: number, column: IColumnConfig, store: TableStore }) => any;
//     renderHeader?: (h: any, opts: { column: IColumnConfig, store: TableStore }) => any;
//     renderExpanded?: (h: any, opts: IColumnSlotScope) => any;
//     type: TableColumnType;
//     disCheckFunc?: (data: any, $index: number) => boolean;
//     hasCheck: boolean;
//     hasSerial: boolean;
//     indexFormat: (data: any, $index: number) => string | number;
//     prop: string;
// }
//
// export interface IColumnSlotScope {
//     row: any,
//     index: number,
//     column: IColumnConfig,
//     store: TableStore
// }
