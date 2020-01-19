import {Vue, Component, Prop} from "vue-property-decorator";
import SnCheckbox from "ele-ui/packages/checkbox/index";
import {TableColumnType, TableStoreMutationEnum} from "ele-ui/src/enum/table-column";

import {TableStore} from "./store/table-store";
import {renderByProp} from "./util";

import {IColumnConfig, IColumnSlotScope} from "../../../types/table-column";

@Component({
    name: 'SnTableColumn',
    components: {
        SnCheckbox
    }
})
export default class SnTableColumn extends Vue {
    // 列表项类型
    @Prop({default: TableColumnType.default})
    public type: TableColumnType;

    // 数据-键值
    @Prop({default: ''})
    public prop: string;

    // 列表-表头name
    @Prop({default: null})
    public label: string;

    // 自定义类名
    @Prop({default: null})
    public columnClass: string;

    // 列表项类型为selection，多选框
    @Prop({default: true})
    public hasCheck: boolean;

    // 列表项类型为selection，序号
    @Prop({default: true})
    public hasSerial: boolean;

    // 列表项类型为selection，checkbox禁止状态-计算方法
    @Prop({default: () => () => false})
    public disCheckFunc: (data: any, index: number) => boolean;

    // 列表项类型为selection，列表序号-计算方法
    @Prop({default: () => (data: any, index: number) => index + 1})
    public indexFormat: (data: any, index: number) => number;

    // 列表项配置
    private columnConfig: IColumnConfig;

    get store(): TableStore {
        let parent = this.$parent as any;
        while (parent && !parent.tableId) {
            parent = parent.$parent as any;
        }
        return parent.store;
    }

    private created() {
        this.validProps();
        this.$options.render = h => h('div', this.$slots.default);

        const {type, label, disCheckFunc, hasCheck, hasSerial, indexFormat, prop} = this;

        let renderExpanded = null;
        let renderCell = null;
        let renderHeader = null;
        let columnClass = this.columnClass;

        if (type === TableColumnType.expand) {
            renderExpanded = (h: any, opts: IColumnSlotScope) => {
                return this.$scopedSlots.default ?
                    this.$scopedSlots.default(opts) : this.$slots.default;
            };
        } else if (type === TableColumnType.selection) {
            // 选择栏目 宽度
            columnClass = columnClass ? columnClass : 'ordinal-width';

            renderCell = (h: any, opts: IColumnSlotScope) => {
                const {
                    row, index, store,
                    column: {
                        disCheckFunc, hasCheck, hasSerial, indexFormat
                    }
                } = opts;

                return (
                    <div>
                        {
                            hasCheck ?
                                <sn-checkbox
                                    class="table-check-label"
                                    model={store.isSelected(row, index)}
                                    disabled={disCheckFunc.apply(null, [row, index])}
                                    onChange={
                                        () => {
                                            store.commit(TableStoreMutationEnum.changeCheckboxStatus, {
                                                row,
                                                index
                                            })
                                        }
                                    }>
                                    {hasSerial ? indexFormat(row, index) : ''}
                                </sn-checkbox> : ''
                        }
                        {!hasCheck && hasSerial ? <span>{indexFormat(row, index)}</span> : ''}
                    </div>
                )
            };

            renderHeader = (h: any, opts: IColumnSlotScope) => {
                const {column: {hasCheck, hasSerial, label}, store} = opts;

                return (
                    <div>
                        {
                            hasCheck ?
                                <sn-checkbox
                                    class="table-check-label is-bold"
                                    model={store.states.checkboxAllStatus === 1 ? true : false}
                                    indeterminate={store.states.checkboxAllStatus === -1}
                                    onChange={() => store.commit(TableStoreMutationEnum.changeCheckboxAll)}>
                                    {hasSerial ? (label || '序号') : ''}
                                </sn-checkbox> : ''
                        }
                        {!hasCheck && hasSerial ? <span title={label}>{label}</span> : ''}
                    </div>
                )
            };
        } else {
            renderCell = (h: any, {row, index, column, store}: IColumnSlotScope) => {
                return this.$scopedSlots.default ?
                    this.$scopedSlots.default({row, index}) : renderByProp({row, prop: column.prop});
            };

            renderHeader = (h: any, opts: { column: IColumnConfig, store: TableStore }) => {
                const {column: {label}} = opts;
                return (<span title={label}>{label}</span>)
            };
        }

        this.columnConfig = {
            renderExpanded,
            renderHeader,
            renderCell,
            type,
            label,
            columnClass,
            disCheckFunc,
            hasCheck,
            hasSerial,
            indexFormat,
            prop
        } as IColumnConfig;

        this.store.commit(TableStoreMutationEnum.addColumnConfig, this.columnConfig)
    }

    private validProps() {
        if (typeof this.indexFormat !== 'function') {
            console.error('column indexFormat must be type of function whose return the type of boolean string or number');
        }

        if (typeof this.disCheckFunc !== 'function') {
            console.error('column disCheckFunc must be type of function whose return the type of boolean value');
        }

        if (this.label === null && this.type === TableColumnType.default) {
            console.error("column label is empty !");
        }

        if (!(this.type === TableColumnType.default ||
            this.type === TableColumnType.expand ||
            this.type === TableColumnType.selection)) {
            console.error(`column type only value of the enum of TableColumnType !`, TableColumnType);
        }

        if (!this.hasSerial && !this.hasCheck) {
            console.error("both hasSerial and hasCheck is false, it is batter to remove this column !");
        }
    }
}

