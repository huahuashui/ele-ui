<script lang="tsx">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {TableStore} from "./store/table-store";

    @Component
    export default class TableBody extends Vue {
        @Prop()
        public store: TableStore;

        get columnConfigs() {
            return this.store.states.columnConfigs;
        }

        get bodyTrList(): any[] {
            return this.store.states.dataSource || [];
        }

        private render(h: any) {
            const {bodyTrList, columnConfigs, store} = this;
            const tdCount = columnConfigs.length;
            const {rowClick, isRowExpanded} = this.store;
            const renderExpandedFunc = this.store.states.renderExpandedFunc;
            return (
                <table class="fn-table">
                    <colgroup>{columnConfigs.map(val => <col class={val.columnClass}/>)}</colgroup>
                    <tbody class="fn-tbody">{
                        bodyTrList.map((row, index) => {
                            const ret = [];
                            ret.push(
                                <tr class={index % 2 == 1 ? "tr-gray" : ""}
                                    onClick={($event: any) => {rowClick({$event, row, index});}}
                                    key={'table-tr-' + index}>
                                    {
                                        columnConfigs.map((column, columnIndex) =>
                                            <td key={`table-tr-${index}-td-${columnIndex}`}>{
                                                column.renderCell(h, {
                                                    row,
                                                    index,
                                                    column,
                                                    store
                                                })
                                            }</td>
                                        )
                                    }
                                </tr>
                            );
                            if (isRowExpanded(row, index)) {
                                ret.push(
                                    <tr>
                                        <td colspan={tdCount}>{
                                            renderExpandedFunc(h, {
                                                row,
                                                index,
                                                store,
                                                column: null
                                            })
                                        }</td>
                                    </tr>
                                )
                            }
                            return ret;
                        })
                    }</tbody>
                </table>
            )
        }
    }
</script>

