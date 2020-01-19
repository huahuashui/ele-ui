/** 列表项类型 */
export enum TableColumnType {
    /** 默认 */
    default = "default",

    /** 列表扩展项 */
    expand = "expand",

    /** 显示勾选框 */
    selection = "selection"
}

/** 列表操作 */
export enum TableStoreMutationEnum {
    /** 切换列表项-选中状态 */
    changeCheckboxStatus = "changeCheckboxStatus",

    /** 切换列表全选状态 */
    changeCheckboxAll = "changeCheckboxAll",

    /** 更新状态 */
    updateStates = "updateStates",

    /** 添加列表项 */
    addColumnConfig = "addColumnConfig",

    /** 保存数据 */
    setDataSource = "setDataSource",

    /** 切换可展开表格 */
    toggleExpand = "toggleExpand",

    /** 批量切换列表项-选中状态 */
    batchChangeCheckboxStatus = "batchChangeCheckboxStatus",
}
