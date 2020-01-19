<template>
    <div>
        <sn-tree-node
            v-if="data && data.length"
            v-for="(item, index) in treeState.children"
            :data="item"
            :key="item.nodeKey"
            :children-key="childrenKey"
            :tree-key-name="treeKeyName"
            :show-checkbox="showCheckbox"
            :label-icon-class="labelIconClass"
            :expand-icon-class="expandIconClass"
            :pack-up-class="packUpClass"
            :render="render"
            :default-expand-all="defaultExpandAll"
        >
        </sn-tree-node>
        <div class="sn-tree__empty" v-if="!(data && data.length)">
            <span class="sn-tree__empty-text">{{emptyText}}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Watch, Emit, Provide} from "vue-property-decorator";
    import SnTreeNode from "./sn-tree-node.vue"
    import {INode} from "./store/tree-store-state"

    import TreeState from "./store/tree-store"

    @Component({
        name: 'SnTree',
        components: {
            SnTreeNode
        }
    })
    export default class SnTree extends Vue {
        @Prop({
            type: Array, default(): Array<any> {
                return []
            }
        }) public data: Array<any>;
        // 定义子节点key
        @Prop({type: String, default: 'children'})
        public childrenKey: string;

        @Prop({type: String, default: 'Name'})
        public treeKeyName: string;

        // 是否显示复选框
        @Prop({type: Boolean, default: false})
        public showCheckbox: boolean;

        @Prop({type: Boolean, default: false}) public defaultExpandAll: boolean;

        // select是否多选
        @Prop({type: Boolean, default: false})
        public multiple: boolean;

        // 自定义树节点渲染function
        @Prop({type: Function}) public render: (h: any, params: { data: any, node: any, map: any, root: any }) => HTMLElement;
        @Prop({type: Function}) public pageRender: (h: any, params: { data: any }) => HTMLElement;
        // 节点图标
        @Prop({type: String}) public labelIconClass: string;
        @Prop({type: String}) public expandIconClass: string;
        @Prop({type: String}) public packUpClass: string;

        // 异步加载
        @Prop({type: Function}) public loadData: () => void;

        // 默认选择
        @Prop({type: String}) public defaultCheckedKey: string;
        @Prop({type: String}) public defaultSelectKey: string;
        @Prop({type: Boolean, default: false}) public isDefaultSelected: boolean;
        @Prop({type: String}) public nodeKey: string;

        // 父子不相关联
        @Prop({type: Boolean, default: false}) public checkStrictly: boolean;

        @Prop({type: Number, default: 0}) public defaultExpandLevel: number;

        @Prop({type: String, default: '暂无数据'}) public emptyText: string;

        @Prop({type: Boolean, default: false}) public isSimpleData: boolean;
        @Prop({default: 'treeParentId'})
        public readonly treePidKey: string;
        @Prop({default: 'treeID'})
        public readonly treeIdKey: string;
        // 不支持 绑定异步函数
        @Prop({default: () => (event: Event, treeId: string, treeNode: INode) => true})
        public readonly beforeCheck: (event: Event, treeId: string, treeNode: INode) => boolean;

        @Provide() public SnTreeInstance = this;

        public store = new TreeState({
            data: this.data,
            childrenKey: this.childrenKey,
            treeKeyName: this.treeKeyName,
            showCheckbox: this.showCheckbox,
            defaultExpandAll: this.defaultExpandAll,
            multiple: this.multiple,
            defaultCheckedKey: this.defaultCheckedKey,
            defaultSelectKey: this.defaultSelectKey,
            isDefaultSelected: this.isDefaultSelected,
            nodeKey: this.nodeKey,
            checkStrictly: this.checkStrictly,
            defaultExpandLevel: this.defaultExpandLevel,
            isSimpleData: this.isSimpleData,
            treePidKey: this.treePidKey,
            treeIdKey: this.treeIdKey,
        });

        public treeState: INode = this.store && this.store.treeState;

        private isTree: boolean;

        private loadingState: boolean = false;


        public setCheckedNodeAll(state: boolean, k?: string) {
            return this.store.setCheckedNodeAll(state, k)
        }

        public getCheckedNodes(flag: boolean, k?: string) {
            return this.store.getCheckedNodes(flag, k)
        }

        public getSelectedNode() {
            return this.store.getSelectedNode()
        }

        public getIndeterminateNode() {
            return this.store.getIndeterminateNode()
        }


        private created() {
            this.isTree = true
            this.setDefault()

        }

        private mounted() {
            this.$on('on-checked-change', this.handleCheck)
            this.$on('on-selected-change', this.handleSelect)
            this.$on('toggle-expand', this.handleExpand)
        }

        private setDefault() {
            this.store.setChecked(this.defaultCheckedKey, this.nodeKey, true)
            this.store.setSelect(this.defaultSelectKey, this.nodeKey, true)

            if (!this.defaultSelectKey && !this.defaultCheckedKey && this.isDefaultSelected) {
                this.store.setDefaultSelected()
            }
            const selectNodes = this.store.getSelectedNode()
            const checkedNodes = this.store.getCheckedNodes(true)
            if (selectNodes && selectNodes.length) this.$emit('on-select', selectNodes[0], selectNodes)
            if (checkedNodes && checkedNodes.length) this.$emit('on-check', checkedNodes[0].checked, checkedNodes[0].node, checkedNodes)
        }


        private handleSelect(data: INode) {
            this.$emit('on-select', data.node, this.store.handleSelect(data))
        }

        private handleCheck(data: INode) {
            this.$emit('on-check', data.checked, data.node, this.store.handleCheck(data))
        }


        private handleExpand(data: any) {
            this.$emit('on-toggle-expand', data, data.node)
        }


        @Watch('data')
        private onData(val: Array<any>) {
            if (val === this.store.states.data) {
                this.treeState.updateChildren()
            } else {
                this.store.states.data = val
                this.store.setTreeSate(val)
                this.store.cacheSelected = {}
                this.treeState = this.store.treeState
                this.setDefault()
            }
        }

        @Watch('defaultExpandAll')
        private onDefaultExpandAll() {
            this.store.setDefaultExpandAll()
        }
    }
</script>
