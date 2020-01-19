import {INode, ITreeStore} from "./src/store/tree-store-state";

export interface ITreeDirectiveService {
    getNodeByParam: (store: ITreeStore, key: string, value: any, parentNode?: INode) => INode;

    getNodesByParam: (store: ITreeStore, key: string, value: any, parentNode?: INode) => Array<INode>;

    getCheckedNodes: (store: ITreeStore, flag: boolean, k?: string) => Array<any>;

    updateNodeChecked: (store: ITreeStore, nodeKey: number, flag: boolean) => boolean;

    checkAllNodes: (store: ITreeStore, flag: boolean, k?: string) => boolean;

    selectInvertNodes: (store: ITreeStore) => void;

    getSelectedNodes: (store: ITreeStore, k?: string) => Array<any>;

    getNodes: (store: ITreeStore) => Array<INode>;

    filterShowNodes: (store: ITreeStore, cb: (data: any) => boolean) => void;

    checkNodesByIds: (store: ITreeStore, idsList: Array<string>, idKeyAlias: string, flag: boolean) => boolean;

    expandNodes(store: ITreeStore, keys: string[], keyAlias: string, isClose: boolean): void;

    setChkDisabled(store: ITreeStore, keys: string[], keyAlias: string, disabled: boolean): void;

    setChildrenChkDisabled(store: ITreeStore, node: INode, disabled: boolean): void;
}

export class TreeDirectiveService implements ITreeDirectiveService {
    // 根据属性查找节点信息 parentNode存在时在 parentNode范围内查找
    public getNodeByParam(store: ITreeStore, key: string, value: any, parentNode?: INode): INode {
        if(!store) throw 'The store does not exist'
        if(parentNode) {
            for(let i = 0, len = parentNode.children.length; i < len; i ++) {
                if(parentNode.children[i].node[key] == value) {
                    return parentNode.children[i]
                }
            }
        } else {
            for(const k in store.treeStateMap) {
                if(store.treeStateMap.hasOwnProperty(k) && store.treeStateMap[k].node[key] == value) {
                    return store.treeStateMap[k]
                }
            }
        }
    }

    public getNodesByParam(store: ITreeStore, key: string, value: any, parentNode?: INode) {
        if(!store) throw 'The store does not exist'
        const result: Array<INode> = []
        if(parentNode) {
            for(let i = 0, len = parentNode.children.length; i < len; i ++) {
                if(parentNode.children[i].node[key] == value) {
                    result.push(parentNode.children[i])
                }
            }
        } else {
            for(const k in store.treeStateMap) {
                if(store.treeStateMap.hasOwnProperty(k) && store.treeStateMap[k].node[key] == value) {
                    result.push(store.treeStateMap[k])
                }
            }
        }
        return result
    }

    // 获取 flag 状态的节点 列表 k为原数据节点属性，存在时返回k属性值的数组
    public getCheckedNodes(store: ITreeStore, flag: boolean, k?: string): Array<any> {
        if(!store) throw 'The store does not exist'
        return store.getCheckedNodes(flag, k)
    }

    // 根据节点所在树 nodeKey 改变当前 勾选状态
    public updateNodeChecked(store: ITreeStore, nodeKey: number, flag: boolean) {
        if(!store) throw 'The store does not exist'
        const node = store.treeStateMap[nodeKey]
        if(!node) throw 'This node was not found'
        node.checked = flag;
        store.handleCheck(node)
        return true
    }

    // 重置全部节点勾选状态为 flag
    public checkAllNodes(store: ITreeStore, flag: boolean, k?: string): boolean {
        if(!store) {
            throw 'The store does not exist'
        }
        store.setCheckedNodeAll(flag, k)
        return true

    }

    // 反选全部节点勾选状态
    public selectInvertNodes(store: ITreeStore): void {
        if(!store) throw 'The store does not exist'
        store.checkedInvertNodes()
    }

    public getSelectedNodes(store: ITreeStore, k?: string): Array<any> {
        if(!store) throw 'The store does not exist'
        return store.getSelectedNode(k)
    }

    // 过滤显示结果， cb为过滤函数
    public filterShowNodes(store: ITreeStore, cb: (data: any) => boolean) {
        store.filterShowTreeNodes(cb)
    }

    public getNodes(store: ITreeStore): Array<INode> {
        if(!store) throw 'The store does not exist'
        return Object.keys(store.treeStateMap).map((nodeKey: any) => {
            return store.treeStateMap[nodeKey]
        })
    }


    /**
     * 根据id选中节点
     * @param {ITreeStore} store
     * @param {Array<string>} idsList 要选中id数组
     * @param {string} idKeyAlias id别名
     * @param {boolean} flag 设置节点状态
     * @returns {boolean}
     */
    public checkNodesByIds(store: ITreeStore, idsList: Array<string>, idKeyAlias: string, flag: boolean): boolean {
        if(!store) throw 'The store does not exist'
        store.setChecked(idsList.join(), idKeyAlias, flag)
        return true
    }

    public expandNodes(store: ITreeStore, keys: string[], keyAlias: string, isClose: boolean = false) {
        if(!store) throw 'The store does not exist'
        const nodes = keys.map((key: string) => {
            const node = this.getNodesByParam(store, keyAlias, key)
            return node && node[0]
        }).forEach((node: INode) => {
            node.expandNode(!isClose, false)
        })
    }

    public setChkDisabled(store: ITreeStore, keys: string[], keyAlias: string, disabled: boolean) {
        if(!store) throw 'The store does not exist'
        const nodes = keys.map((key: string) => {
            const node = this.getNodesByParam(store, keyAlias, key)
            return node && node[0]
        }).forEach((node: INode) => {
            node.disabled = disabled
        })
    }

    public setChildrenChkDisabled(store: ITreeStore, node: INode, disabled: boolean) {
        if(node.children.length) {
            node.children.forEach((child: INode) => {
                child.disabled = disabled
                this.setChildrenChkDisabled(store, child, disabled)
            })
        }
    }
}