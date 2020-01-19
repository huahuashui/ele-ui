import {TableStoreMutationEnum, TableColumnType} from "ele-ui/src/enum/table-column";

import {ISnTable} from "../../../../types/table";
import {IColumnConfig, ITableStore, ITableStoreState} from "../../../../types/table-column";

export class TableStore implements ITableStore {
    // 列表仓库存储的数据资源
    public states: ITableStoreState;

    // 列表仓库操作集合
    private mutations: Record<TableStoreMutationEnum, Function> = {
        [TableStoreMutationEnum.setDataSource](states: ITableStoreState, dataSource: any[]) {
            const selections = [] as any[];
            const checkboxAllStatus = 0;
            const expandRows = {};
            this.states = updateObject<ITableStoreState>(states, {
                selections,
                checkboxAllStatus,
                expandRows,
                dataSource,
            } as ITableStoreState);
            this.excuseEmitAfterCheck();
        },
        [TableStoreMutationEnum.changeCheckboxStatus](states: ITableStoreState, {row, index, checkboxStatus, isCallback = true}: any) {
            const selectIndex = states.selections.indexOf(row);
            if (selectIndex > -1) {
                checkboxStatus !== true && states.selections.splice(selectIndex, 1)
            } else {
                checkboxStatus !== false && states.selections.push(row);
            }
            states.checkboxAllStatus = this.getCheckboxAllStatus();
            isCallback && this.excuseEmitAfterCheck();
        },
        [TableStoreMutationEnum.batchChangeCheckboxStatus](states: ITableStoreState, {values, key, checkboxStatus, isCallback = true}: { values: any[], key: string, checkboxStatus: boolean, isCallback: boolean }) {
            // 过滤掉禁用项
            states.dataSource.filter((val: any, index: number) => !this.isDisCheck(val, index)).forEach(row => {
                if (values.includes(row[key])) {
                    const selectIndex = states.selections.indexOf(row);
                    if (selectIndex > -1) {
                        checkboxStatus !== true && states.selections.splice(selectIndex, 1)
                    } else {
                        checkboxStatus !== false && states.selections.push(row);
                    }
                }
            });
            states.checkboxAllStatus = this.getCheckboxAllStatus();
            isCallback && this.excuseEmitAfterCheck();
        },
        [TableStoreMutationEnum.changeCheckboxAll](states: ITableStoreState) {
            const oldCheckboxAllStatus = states.checkboxAllStatus;
            if (oldCheckboxAllStatus == 0) {
                states.selections = states.dataSource.filter((val: any, index: number) => !this.isDisCheck(val, index));
            } else {
                states.selections = [];
            }
            states.checkboxAllStatus = this.getCheckboxAllStatus();
            this.excuseEmitAfterCheck();
        },
        [TableStoreMutationEnum.updateStates](states: ITableStoreState, newStates: ITableStoreState): void {
            states = updateObject(states, newStates);
        },
        [TableStoreMutationEnum.addColumnConfig](states: ITableStoreState, config: IColumnConfig): void {
            if (config.type === TableColumnType.expand) {
                states.renderExpandedFunc = config.renderExpanded;
            } else {
                if (config.type === TableColumnType.selection) {
                    states.isDisCheckFunc = config.disCheckFunc;
                }
                states.columnConfigs.push(config);
            }
        },
        [TableStoreMutationEnum.toggleExpand](states: ITableStoreState, payload: { data: any, isExpanded?: boolean, index: number }): void {
            if (!this.isHasExpand()) return;
            const {data, index, isExpanded} = payload;
            const expandIndex = states.expandRows[index];
            const oldIsExpanded = !!expandIndex;
            const _isExpanded = (typeof isExpanded === 'undefined') ? !oldIsExpanded : isExpanded;
            if (oldIsExpanded !== _isExpanded) {
                const newData = {...states.expandRows};
                newData[index] = _isExpanded;
                states.expandRows = newData;
            }
        }
    };

    constructor(private SnTable: ISnTable, private initialState: Record<string, any> = {}) {
        if (!SnTable) {
            throw new Error('Table is required.');
        }

        this.states = {
            expandRows: {},
            renderExpandedFunc: null,
            isDisCheckFunc: null,
            hasCheck: true,
            hasSerial: true,
            checkboxAllStatus: 0,
            dataSource: [],
            columnConfigs: [],
            selections: [],
        } as ITableStoreState;

        for (const prop in initialState) {
            if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
                this.states[prop] = initialState[prop];
            }
        }
    }

    // 列表额外项
    public isRowExpanded = (rowData: any, index: number) => {
        return this.isHasExpand() && this.states.expandRows[index];
    };

    // 获取列表项选中状态
    public isSelected(data: any, index: number) {
        return this.states.selections.indexOf(data) > -1;
    };

    // 列表项点击状态
    public rowClick = (opts: { $event: Event, row: any, index: number }) => {
        const {row, index} = opts;
        this.SnTable.rowClick(row, index)
    };

    // 提交修改操作
    public commit(name: TableStoreMutationEnum, ...args: any[]) {
        const mutations = this.mutations;
        if (mutations[name]) {
            mutations[name].apply(this, [this.states].concat(args));
        } else {
            throw new Error(`Action not found: ${name}`);
        }
    };

    // 列表项-禁选
    private isDisCheck(data: any, index: number) {
        return this.states && this.states.isDisCheckFunc && this.states.isDisCheckFunc.call(null, data, index)
    }

    // 根据选中项-计算出全选状态
    private getCheckboxAllStatus(): number {
        const {dataSource, selections} = this.states;
        const count = dataSource.length;
        if (count == 0 || selections.length == 0) {return 0;}
        let disCheckNum = 0;
        let checkNum = 0;
        let checkboxAllStatus = 0;

        dataSource.forEach((val, index) => {
            if (this.isDisCheck(val, index)) {
                disCheckNum++;
            } else if (selections.indexOf(val) > -1) {
                checkNum++;
            }
        });

        if (checkNum == 0) {
            checkboxAllStatus = 0
        } else if (checkNum > 0) {
            const noDisCheck = disCheckNum == 0;
            // 不存在不能选 且已选 等于 全部
            if (noDisCheck && checkNum === count) {
                checkboxAllStatus = 1;
            } else {
                checkboxAllStatus = -1;
            }
        }

        return checkboxAllStatus;
    }

    // 选中状态-冒泡到外部
    private excuseEmitAfterCheck() {
        const resultList = [...this.states.selections];
        const isCheckAll = this.states.checkboxAllStatus == 1;
        this.SnTable.tableAfterCheck(resultList, isCheckAll);
    }

    private isHasExpand(): boolean {
        return !!this.states && !!this.states.renderExpandedFunc;
    }
}

export function updateItemInArray<T = any>(array: T[], findFunc: (item: T) => boolean, updateItemCallback: (updateData: T) => T) {
    const updatedItems = array.map((item: T) => {
        if (!findFunc(item)) {
            // 因为我们只想更新一个项目，所以保留所有的其他项目
            return item
        }
        // 使用提供的回调来创建新的项目
        const updatedItem = updateItemCallback(item);
        return updatedItem
    });
    return updatedItems
}

export function updateObject<T = any>(oldObject: T, newValues: T): T {
    // 将空对象作为第一个参数传递给 Object.assign，以确保只是复制数据，而不是去改变数据
    return Object.assign({}, oldObject, newValues)
}
