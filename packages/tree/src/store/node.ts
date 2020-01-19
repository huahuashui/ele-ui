import {INode, markData} from "./tree-store-state";

let keyCounter = 0;
export class Node implements INode {
    public node: any;
    public nodeKey: number;
    public children: Array<INode> = [];
    public parentKey?: number;
    public disabled: boolean = false;
    public loading?: boolean;
    public loadingState: boolean;
    public checked: boolean = false;
    public selected: boolean = false;
    public expand: boolean = false;
    public isFirstExpand: boolean = true;
    public indeterminate: boolean = false;
    public level: number = -1;
    public isPage: boolean;
    public visible: boolean = true;
    constructor(data: any, parent: INode, public store: any) {
        this.node = data;
        this.nodeKey = keyCounter ++;
        if(data.disabled) this.disabled = data.disabled;
        if(data.loading != undefined) {
            this.loading = data.loading;
            this.loadingState = true;
        }
        if(parent) {
            this.parentKey = parent.nodeKey;
            this.level = parent.level + 1;
        }
        if(data.isPage) this.isPage = data.isPage;
        if(!store) {
            throw new Error('[Node]store is required!');
        }
    }


    public updateChildren() {
        const newData: Array<any> = this.node[this.store.states.childrenKey] || this.node; // 当删除、增加的是根节点时节点数据是原始的数组
        const oldData: Array<any> = this.children.map((item: INode) => item.node);

        const newDataMap: {[key: number]: any} = {};
        const newNodes: Array<{data: any, index: number}> = [];
        newData.forEach((item: any, index: number) => {
            const key: number = item.snTreeNodeId;
            const oldIndex = oldData.findIndex((item: any) => item.snTreeNodeId === key);
            if(key != undefined && oldIndex > -1) {
                newDataMap[key] = {index, data: item}
            } else {
                this.insertChild(item, index)
            }

        })
        oldData.forEach((item: any, index: number) => {

            if(!newDataMap[item.snTreeNodeId]) this.removeNodeByData(item)
        })
    }


    public removeNodeByData(data: any) {
        const map = this.store.treeStateMap
        for(let i = 0, len = this.children.length; i < len; i ++) {
            if(this.children[i].node.snTreeNodeId === data.snTreeNodeId) {
                delete map[this.children[i].nodeKey]
                this.children.splice(i, 1)
                break;
            }
        }
    }

    public expandNode(expandFlag: boolean, sonSign: boolean = false) {
        this.expand = expandFlag;
        this.isFirstExpand = false;
        if(sonSign && this.children.length) {
            this.children.forEach((node: INode) => {
                this.expandNode(expandFlag, sonSign)
            })
        }
    }

    private insertChild(data: any, index: number) {
        const node = this.createNode(data);
        const children = this.children;
        if(children[index]) {
            children.splice(index, 0, node)
        } else {
            children.push(node)
        }
    }

    private createNode(child: any) {
        const map = this.store.treeStateMap
        let node: INode;
        if(! (child instanceof Node)) {
            node = new Node(child, this, this.store)
            if(child.snTreeNodeId === undefined) {
                markData(node, child)
            }
        } else {
            node = child;
        }
        if(!map[node.nodeKey]) {
            map[node.nodeKey] = node
        }
        return node
    }
}