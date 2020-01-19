import {Vue, Component, Prop} from "vue-property-decorator";
import {ISnTabPane} from "../../../types/tab-pane";


@Component({
    name: 'TabHeader'
})
export default class TabNav extends Vue {
    /** 选项卡头部项列表 */
    @Prop()
    public panes: ISnTabPane[];
    /** 与选项卡model对应的标识符，表示选项卡别名 */
    @Prop([String, Number])
    public name: string | number;
    /** 选项卡风格 */
    @Prop(String)
    public type: string;
    /** 选项卡点击触发 */
    @Prop(Function)
    public onTabClick: (pane: ISnTabPane, tabName: string | number, e: any) => void;

    private render(h: any) {
        const {
            type,
            panes,
            onTabClick,
        } = this;

        // 宽度
        const width = type === 'average' ? 100 / panes.length + '%' : null;

        const tabs = panes.map((pane: ISnTabPane, index: number) => {
            // 序号
            pane.index = index;
            // 标识
            const tabName = pane.name || index;
            // 选项卡label
            const tabLabelContent = pane.$slots.label || pane.label;

            return (
                <div class={[`sn-tabs__item ${type ? type : ''}`,
                    {
                        'is-active': pane.active,
                        'is-disabled': pane.disabled
                    }]}
                     style={{width: width}}
                     key={`tab-${tabName}`}
                     tabindex={index}
                     on-click={(e: any) => {onTabClick(pane, tabName, e);}}>
                    <span class='sn-tabs__text'>{tabLabelContent}</span>
                    <span class='sn-tabs__line'></span>
                </div>
            )
        });

        return (
            <div class='sn-tabs__nav'>{tabs}</div>
        )
    }
}
