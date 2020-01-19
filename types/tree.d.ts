import {SnUIComponent} from "./component";

/** Tree Component */
export declare interface SnTree extends SnUIComponent {
    /** 数据源 */
    data: Array<any>;

    // 定义子节点key
    childrenKey: string;

    treeKeyName: string;

    // 是否显示复选框
    showCheckbox: boolean;

    defaultExpandAll: boolean;

    // select是否多选
    multiple: boolean;

    // 自定义树节点渲染function
    render: (h: any, params: { data: any, node: any, map: any, root: any }) => HTMLElement;

    pageRender: (h: any, params: { data: any }) => HTMLElement;

    // 节点图标
    labelIconClass: string;

    expandIconClass: string;

    packUpClass: string;

    // 异步加载
    loadData: () => void;

    // 默认选择
    defaultCheckedKey: string;

    defaultSelectKey: string;

    isDefaultSelected: boolean;

    nodeKey: string;

    // 父子不相关联
    checkStrictly: boolean;

    defaultExpandLevel: number;

    emptyText: string;

    isSimpleData: boolean;

    readonly treePidKey: string;

    readonly treeIdKey: string;

    // 不支持 绑定异步函数
    readonly beforeCheck: (event: Event, treeId: string, treeNode: any) => boolean;

    SnTreeInstance: SnTree;
}
