<template>
    <ul class="sn-tree-children" v-show="data.visible">
        <li>
            <div class="sn-tree-node__content">
                <span class="tree-arrow" @click="handleExpand" >
                    <i class="tree-node__expand-icon"
                       v-if="(data.children && data.children.length ) || (data.loading === false && data.loadingState)"
                       v-show="data.expand"
                       :class="expandIconClass || 'expand-true'"
                    ></i>
                    <i class="tree-node__expand-icon"
                       v-if="(data.children && data.children.length ) || (data.loading === false && data.loadingState)"
                       v-show="!data.expand"
                       :class="packUpClass || 'expand-false'"
                    ></i>
                    <spiner v-if="data.loading"></spiner>
                </span>
                <sn-checkbox
                        v-if="showCheckbox"
                        :model="data.checked"
                        @change="handleCheck"
                        :indeterminate="data.indeterminate"
                        :disabled="data.disabled"
                ></sn-checkbox>
                <span class="label-icon" v-if="nodeData.iconSkin || labelIconClass"><i :class="nodeData.iconSkin || labelIconClass" ></i></span>
                <span
                        class="sn-tree-node__label"
                        :class="{'selected': data.selected, 'disabled': data.disabled}"
                        @click="handleSelect"
                        v-if="!(nodeData.render || tree.$scopedSlots.default || render)"
                >
                    {{nodeData[treeKeyName]}}
                </span>
                <render
                        :renderFn="nodeData.render || render"
                        :node="node"
                        :data="nodeData"
                        v-else></render>
            </div>
            <sn-tree-node
                    v-if="data.children && !data.isFirstExpand"
                    v-show="data.expand"
                    v-for="(item, index) in data.children"
                    :key="item.nodeKey"
                    :data="item"
                    :children-key="childrenKey"
                    :tree-key-name="treeKeyName"
                    :show-checkbox="showCheckbox"
                    :label-icon-class="labelIconClass"
                    :render="render"
                    :default-expand-all="defaultExpandAll"
            >
            </sn-tree-node>
            <pageRender v-if="data.isPage" v-show="data.expand" :data="data"></pageRender>

        </li>
    </ul>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Watch, Emit, Inject, Mixins} from "vue-property-decorator";
    import {INode} from "./store/tree-store-state";
    import SnCheckbox from "ele-ui/packages/checkbox/index";
    import Emitter from "ele-ui/src/utils/emitter";
    import spiner from "ele-ui/packages/spiner/index";
    import render from "./render";

    import pageRender from "./page-render";

    @Component({
        name: 'SnTreeNode',
        mixins: [Emitter],
        components: {
            SnCheckbox,
            spiner,
            render,
            pageRender
        }
    })
    export default class SnTreeNode extends Mixins(Emitter) {
        @Prop({type: Object, default ():object {
                return {}
            }}) public data: INode;

        @Prop({type: String}) public labelIconClass: string;

        @Prop({type: String, default: 'children'})
        public childrenKey: string;

        @Prop({type: String, default: 'name'})
        public treeKeyName: string;

        @Prop({type: Boolean, default: true})
        public showCheckbox: boolean;

        @Prop({type: Boolean, default: false}) public defaultExpandAll: boolean;

        @Prop({type: String}) public expandIconClass: string;
        @Prop({type: String}) public packUpClass: string;

        @Prop({type: Function}) public render: (h: any, params: {data: any,node: any, map: any, root: any}) => HTMLElement;
        @Prop({type: Function}) public pageRender: (h: any, params: {data: any,node: any, root: any}) => HTMLElement;
        @Inject() public SnTreeInstance!: any;

        private loadingState = true;

        private tree: any = null;

        get nodeData () {
            return this.data.node || {}
        }

        get node() {
            const treeStateMap = this.SnTreeInstance.store.treeStateMap
            const root = this.SnTreeInstance.store.treeState
            return [
                treeStateMap,
                treeStateMap[this.data.nodeKey],
                root
            ]
        }

        private created() {
            const parent: any = this.$parent;
            if(parent.isTree) {
                this.tree = parent
            } else {
                this.tree = parent.tree
            }
            if (!this.tree) {
                console.warn('Can not find node\'s tree.');
            }
            this.$watch(`data.node.${this.childrenKey}`, (newVal, oldVal) => {

                this.data.updateChildren()
            })
        }
        private mounted() {
        }

        private handleExpand() {
            const item: INode = this.data
            if(item.isFirstExpand) item.isFirstExpand = false
            // 异步加载
            if(item.loading != undefined && (!item.children || item.children.length === 0)) {
                const snTree = this.SnTreeInstance, loadDataFn: Function = snTree && snTree.loadData || item.node.loadData
                if(loadDataFn) {
                    this.$set(this.data, 'loading', true)
                    loadDataFn(this.data, (children: Array<any>) => {
                        this.$set(this.data, 'loading', false)
                        if(children && children.length) {
                            this.$set(this.data.node, this.childrenKey, children)
                            this.$nextTick(() => {this.handleExpand()})
                        } else {

                            this.data.loadingState = false
                        }

                    })
                }
            }
            if(item.children && item.children.length && !item.loading) {
                this.$set(this.data, 'expand', !this.data.expand)
                this.bubbling('SnTree', 'toggle-expand', this.data)
            }
        }

        private handleCheck(val: boolean) {
            if(this.data.disabled) return
            if(!this.SnTreeInstance.beforeCheck()) return
            this.$set(this.data, 'checked', val)
            this.bubbling('SnTree', 'on-checked-change', this.data)
        }

        private handleSelect() {
            if(this.data.disabled) return;
            this.bubbling('SnTree', 'on-selected-change', this.data)
        }

    }
</script>
