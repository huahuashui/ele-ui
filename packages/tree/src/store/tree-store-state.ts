export interface INode {
    node: any;
    nodeKey: number;
    children: Array<INode>;
    parentKey?: number;
    disabled: boolean;
    loading?: boolean;
    loadingState?: boolean;
    checked: boolean;
    selected: boolean;
    expand: boolean;
    isFirstExpand: boolean;
    indeterminate: boolean;
    level: number;
    isPage?: boolean;
    visible: boolean;
    store: any;
    updateChildren: () => void;
    removeNodeByData: (data: any) => void;
    expandNode: (expandFlag: boolean, sonSign: boolean) => void;
}

export interface ITreeStore {
    states: Record<string, any>;
    treeState: INode;
    treeStateMap: treeStateMapType;
    cacheSelected: treeStateMapType;

    // methods
    setTreeSate: (data: Array<any>) => void;
    setChecked: (data: string, keyAlias: string, flag: boolean) => void;
    setCheckedNodeAll: (state: boolean, k?: string) => Array<any>;
    checkedInvertNodes: () => void;
    getCheckedNodes: (flag: boolean, k?: string) => Array<any>;
    getSelectedNode: (k?: string) => Array<any>;
    getIndeterminateNode: (k?: string) => Array<any>;
    handleSelect: (node: INode) => void;
    handleCheck: (node: INode) => Array<any>;
    setSelect: (data: string, keyAlias: string, flag: boolean) => void;
    setDefaultExpandAll: () => void;
    filterShowTreeNodes: (cb: Function) => void;
    getNodesByParam: (key: string, value: any, parentNode?: INode) => Array<INode>;
    setDefaultSelected: () => void
}


export type treeStateMapType = {[key: number]: INode}


export function markData(node: INode, data: any) {
    Object.defineProperty(data, 'snTreeNodeId', {
        value: node.nodeKey,
        enumerable: false,
        configurable: false,
        writable: false
    })
}