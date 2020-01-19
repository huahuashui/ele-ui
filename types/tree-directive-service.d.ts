import {INode, ITreeStore} from "../packages/tree/src/store/tree-store-state";

/** TreeDirectiveService Component */
export declare interface TreeDirectiveService {
    // 根据属性查找节点信息 parentNode存在时在 parentNode范围内查找
    getNodeByParam(store: ITreeStore, key: string, value: any, parentNode?: INode): INode;

    getNodesByParam(store: ITreeStore, key: string, value: any, parentNode?: INode): INode[];

    // 获取 flag 状态的节点 列表 k为原数据节点属性，存在时返回k属性值的数组
    getCheckedNodes(store: ITreeStore, flag: boolean, k?: string): Array<any>;

    // 根据节点所在树 nodeKey 改变当前 勾选状态
    updateNodeChecked(store: ITreeStore, nodeKey: number, flag: boolean): boolean;

    // 重置全部节点勾选状态为 flag
    checkAllNodes(store: ITreeStore, flag: boolean, k?: string): boolean;

    // 反选全部节点勾选状态
    selectInvertNodes(store: ITreeStore): void;

    getSelectedNodes(store: ITreeStore, k?: string): Array<any>;

    // 过滤显示结果， cb为过滤函数
    filterShowNodes(store: ITreeStore, cb: (data: any) => boolean): void;

    getNodes(store: ITreeStore): Array<INode>;

    /**
     * 根据id选中节点
     * @param {ITreeStore} store
     * @param {Array<string>} idsList 要选中id数组
     * @param {string} idKeyAlias id别名
     * @param {boolean} flag 设置节点状态
     * @returns {boolean}
     */
    checkNodesByIds(store: ITreeStore, idsList: Array<string>, idKeyAlias: string, flag: boolean): boolean;

    expandNodes(store: ITreeStore, keys: string[], keyAlias: string, isClose?: boolean): void;

    setChkDisabled(store: ITreeStore, keys: string[], keyAlias: string, disabled: boolean): void;

    setChildrenChkDisabled(store: ITreeStore, node: INode, disabled: boolean): void;
}
