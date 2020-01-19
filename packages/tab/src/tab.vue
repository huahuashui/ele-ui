<script lang="tsx">
    import {Vue, Component, Prop, Emit, Model} from "vue-property-decorator";
    import TabNav from "./tab-nav";
    import {ISnTabPane} from "../../../types/tab-pane";
    
    @Component({
        name: 'SnTab',
        components: {
            TabNav,
        }
    })
    export default class SnTab extends Vue {
        /** 绑定值，选中选项卡的 name，默认第一个选项卡name */
        @Model('change')
        public model: string | number;
        /** 不同风格选项卡  默认风格1--content标签内容撑开  风格2--average均分宽度 */
        @Prop(String)
        public type: string;
        /** 选项卡每项排列位置  left/center/right */
        @Prop(String)
        public align: string;
        /** 切换标签之前的钩子，若返回 false，则阻止切换 */
        @Prop(Function)
        public beforeClick: (newName: string | number, oldName: string | number) => boolean;

        /** 当前选中项key */
        private currentName: string | number = this.model || 0;
        /** 选项卡项集合 */
        private panes: ISnTabPane[] = [];

        private render(h: any) {
            const {
                align,
                type,
                currentName,
                panes,
                handleTabClick
            } = this;
            const alignClass = align ? `is-${align}` : '';

            const tabHeaderData = {
                props: {
                    currentName,
                    type,
                    panes,
                    onTabClick: handleTabClick
                },
                ref: 'tabHeader'
            };

            return (
                <div class='sn-tabs'>
                    <div class={[`sn-tabs__header`, alignClass]}>
                        <tab-nav {...tabHeaderData}></tab-nav>
                    </div>
                    <div class='sn-tabs__content'>
                        {this.$slots.default}
                    </div>
                </div>
            )
        }

        private mounted() {
            this.calcPaneInstances();
        }

        private calcPaneInstances() {
            const slots = this.$slots.default;
            if (slots) {
                const paneSlots = slots.filter(vNode => {
                    const ctor = (vNode.componentOptions ? vNode.componentOptions.Ctor : null) as any;
                    const name = ctor && ctor.options ? ctor.options.name : '';
                    return vNode.tag && name === 'SnTabPane';
                });
                // 确保确实有选项卡项变更
                const panes = paneSlots.map(({componentInstance}) => componentInstance) as ISnTabPane[];
                if (!(panes.length === this.panes.length && panes.every((pane, index) => pane === this.panes[index]))) {
                    this.panes = panes;
                }
            } else if (this.panes.length !== 0) {
                this.panes = [];
            }
        }

        /** tab项点击 */
        private handleTabClick(tab: ISnTabPane, tabName: string | number, event: any) {
            if (tab.disabled) return;
            this.setCurrentName(tabName);
        }

        /** 设置当前选中项-更新标识缓存 */
        private setCurrentName(newName: string | number) {
            const oldName = this.currentName;
            if (oldName === newName) return;
            let isContinue = true;
            if (typeof this.beforeClick === 'function') {
                isContinue = this.beforeClick(newName, oldName);
            }
            if (isContinue === false) return;
            this.currentName = newName;
            this.modelChange(newName);
        }

        @Emit('change')
        private modelChange(newName: string | number) {}
    }
</script>
