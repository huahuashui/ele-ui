import { INode, ITreeStore, treeStateMapType, markData} from "./tree-store-state"
import SnTree from "../sn-tree.vue"
import { Node } from "./node"


function stateMap2Arr(stateMap: treeStateMapType) {
    return Object.keys(stateMap).map((k: any) => {
        return stateMap[k]
    })

}

export default class TreeStore implements ITreeStore {
    public states = {} as Record<string, any>;
    public treeState = {} as INode;
    public treeStateMap = {} as treeStateMapType;

    public cacheSelected: treeStateMapType = {};
    constructor(private initialState: Record<string, any> = {}) {

        for (const prop in initialState) {
            if (initialState.hasOwnProperty(prop)) {
                this.states[prop] = initialState[prop];
            }
        }

        this.setTreeSate(this.states.data)

    }

    public setTreeSate(data: Array<any>) {
        if(!data || !data.length) data = [];
        const treeState: INode = new Node(data, undefined, this)
        const treeStateMap: treeStateMapType = {};
        const childrenKey: string = this.states.childrenKey;
        const getTreeNode = (data: Array<any>, parent: any) => {
            data.forEach((item:any, index: number) => {
                const obj: INode = new Node(item, parent, this)
                if(item.snTreeNodeId === undefined) {
                    markData(obj, item)
                }
                if(this.states.defaultExpandAll || (obj.level <= this.states.defaultExpandLevel)) {
                    obj.expand = true
                    obj.isFirstExpand = false
                }
                if(!parent.children) parent.children = [];
                parent.children.push(obj)

                treeStateMap[obj.nodeKey] = obj
                if(item[childrenKey]) {
                    getTreeNode(item[childrenKey], obj)
                }
            })
        }

        if(this.states.isSimpleData) {
            data = this.convert2Ztree(data, this.states.treeIdKey, this.states.treePidKey, this.states.childrenKey)
        }

        getTreeNode(data, treeState)

        this.treeStateMap = treeStateMap
        this.treeState = treeState
    }

    // 设置checked项
    public setChecked(data: string, keyAlias: any, flag: boolean) {
        if(!data) return
        if(!keyAlias) throw '[Tree] nodeKey is required in setChecked'
        const newData: Array<string> = data.split(',')
        const stateMap = this.treeStateMap;
        const isMap = {} as {[key: string]: boolean};
        newData.forEach((val: any) => {
            isMap[val] = true
        })
        let flagCount = 0;
        for(const k in stateMap) {
            if(stateMap.hasOwnProperty(k) && isMap[stateMap[k].node[keyAlias]]) {
                stateMap[k].checked = flag;
                this.handleCheck(stateMap[k])
                flagCount ++;
            }
            if(flagCount === data.length) return;
        }
    }

    // 全选、反选
    public setCheckedNodeAll(state: boolean, k?: string) {
        const checkAll: any = [];
        const stateMap: treeStateMapType = this.treeStateMap
        this.traverseObj(stateMap, (item: INode) => {
            if(state) {
                checkAll.push(k? item.node[k] : item.node)
            }
            item.checked = state;
        })

        return checkAll
    }

    // 反选所有节点勾选状态
    public checkedInvertNodes() {
        this.traverseObj(this.treeStateMap, (item: INode) => {
            item.checked = !item.checked
        })
    }

    // 获取checked项, k为data属性, 当传k时 返回一个k值的数组, 不传返回当前data
    public getCheckedNodes(flag: boolean = true, k?: string) {
        const checkArr: any = []
        const stateMap: treeStateMapType = this.treeStateMap
        this.traverseObj(stateMap, (item: Node) => {
            if(item.checked == flag) {
                checkArr.push(k? item.node[k] : item)
            }
        })
        return checkArr
    }

    // 获取selected项
    public getSelectedNode(k?: string) {
        const selectArr: any = [];
        this.traverseObj(this.cacheSelected, (item: Node) => {
            if(item.selected) {
                selectArr.push(k? item.node[k] : item.node)
            }
        })
        return selectArr
    }

    // 获取半选项
    public getIndeterminateNode(k?: string) {
        const checkArr: any = []
        const stateMap: treeStateMapType = this.treeStateMap

        this.traverseObj(stateMap, (item: Node) => {
            if(item.indeterminate) {
                checkArr.push(k? item.node[k] : item.node)
            }
        })
        return checkArr
    }

    public handleSelect(node: INode) {
        if(!this.states.multiple) {
            Object.keys(this.cacheSelected).forEach((k: any) => {
                this.cacheSelected[k].selected = false
                delete this.cacheSelected[k]
            })
        }
        node.selected = !node.selected
        if(node.selected) this.cacheSelected[node.nodeKey] = node
        return this.getSelectedNode()
    }

    public handleCheck(node: INode) {
        if(this.states.checkStrictly) return

        this.updateTreeDown(node, {checked: node.checked, indeterminate: false})
        this.updateTreeUp(node)
        return this.getCheckedNodes(true)
    }

    public setSelect(data: string, keyAlias: any, flag: boolean = true) {
        if(!data) return
        if(!keyAlias) throw '[Tree] nodeKey is required in setSelect'
        const newData = data.split(',')
        const stateMap = this.treeStateMap;
        let flagCount = 0;
        if(!this.states.multiple) {
            for(const k in stateMap) {
                if(stateMap.hasOwnProperty(k)) {
                    stateMap[k].selected = false
                    if(stateMap[k].node[this.states.nodeKey] == data[data.length-1]) {
                        stateMap[k].selected = true
                        this.cacheSelected[stateMap[k].nodeKey] = stateMap[k]
                    }
                }
            }
        } else {
            const isMap = {} as {[key: string]: any}
            newData.forEach((val: string) => {
                isMap[val] = true;
            })
            for(const k in stateMap) {
                if(stateMap.hasOwnProperty(k) && isMap[stateMap[k].node[keyAlias]]) {
                    flagCount ++
                    stateMap[k].selected = flag;
                    if(flag) {
                        this.cacheSelected[stateMap[k].nodeKey] = stateMap[k]
                    } else if(this.cacheSelected[stateMap[k].nodeKey]) {
                        delete this.cacheSelected[stateMap[k].nodeKey]
                    }
                }
                if(flagCount === data.length) return;
            }
        }

    }

    public setDefaultSelected() {
        const firstNode = this.treeState.children && this.treeState.children[0]
        if(!firstNode) return
        if(this.states.showCheckbox) {
            firstNode.checked = true
            this.handleCheck(firstNode)
        } else {
            this.handleSelect(firstNode)
        }
    }

    public setDefaultExpandAll() {

        this.traverseObj(this.treeStateMap, (item: INode) => {
            if(item.children) {
                item.expand = this.states.defaultExpandAll
                if(item.isFirstExpand) item.isFirstExpand = false
            }
        })

    }

    public filterShowTreeNodes(filterMethod: (data: INode) => boolean) {

        const traverse = (data: INode) => {

            const childrenNodes = data.children
            childrenNodes.forEach((item: INode) => {
                item.visible = filterMethod(item.node)
                traverse(item)
            })

            if(!data.visible && childrenNodes.length && data.level > -1) {
                data.visible = childrenNodes.some((item: INode) => item.visible)
            }

            if(data.visible) data.expand = true
        }

        traverse(this.treeState)

    }

    public getNodesByParam(key: string, value: any, parentNode?: INode) {
        const result = [] as INode[]
        if(parentNode) {
            parentNode.children.forEach((child: INode) => {
                if(child.node[key] === value) {
                    result.push(child)
                }
            })
        } else {
            this.traverseObj(this.treeStateMap, (node: INode) => {
                if(node.node[key] === value) {
                    result.push(node)
                }
            })
        }
        return result
    }

    private updateTreeUp(node: INode) {
        const parentKey = node.parentKey
        if(parentKey == undefined) return
        const parentNode: INode = this.treeStateMap[parentKey] || this.treeState

        // 与父节点状态相同,就不需要再往上遍历
        if (node.checked == parentNode.checked && node.indeterminate == parentNode.indeterminate && !parentNode.disabled) return;
        if(node.checked ) {

            parentNode.checked = parentNode.children.every((child: any) => {
                return child.checked
            })
            parentNode.indeterminate = !parentNode.checked
        } else  {
            parentNode.checked = false

            parentNode.indeterminate = parentNode.children.some((child: any) => {
                return child.checked || child.indeterminate
            })
        }

        this.updateTreeUp(parentNode)
    }

    private updateTreeDown(node: INode, change:{checked: boolean, indeterminate: boolean}) {

        if (!node.disabled) {
            node.checked = change.checked
            node.indeterminate = change.indeterminate
        }
        let flag: boolean = false

        if(node.children) {
            node.children.forEach((child: any) => {
                this.updateTreeDown(child, change)
            })
            if(change.checked) {
                flag = node.children.some((child: INode) => {
                    return !child.checked || child.indeterminate
                })
            } else {
                flag = node.children.some((child: INode) => {
                    return child.checked
                })
            }
        }
        if (!node.disabled) {
            node.indeterminate = flag
        }
    }

    private convert2Ztree = function (sNodes: any, idKey: string, parentKey: string, childKey: string) {
        var i, l,
            // tslint:disable-next-line:prefer-const
            key = idKey,
            // tslint:disable-next-line:prefer-const
            parentKey = parentKey,
            // tslint:disable-next-line:prefer-const
            childKey = childKey;
        // tslint:disable-next-line:prefer-const
        var r = [];
        // tslint:disable-next-line:prefer-const
        var tmpMap = [];
        for (i = 0, l = sNodes.length; i < l; i++) {
            tmpMap[sNodes[i][key]] = sNodes[i];
        }
        for (i = 0, l = sNodes.length; i < l; i++) {
            if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
                if (!tmpMap[sNodes[i][parentKey]][childKey])
                    tmpMap[sNodes[i][parentKey]][childKey] = [];
                tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
            } else {
                r.push(sNodes[i]);
            }
        }
        return r;
    };

    private traverseObj(obj: any, cb: Function) {
        for(const k in obj) {
            if(obj.hasOwnProperty(k)) {
                cb(obj[k])
            }
        }
    }
}