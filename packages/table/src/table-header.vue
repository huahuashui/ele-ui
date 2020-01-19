<script lang="tsx">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {ITableStore} from "../../../types/table-column";

    @Component({
        name: 'SnTableHeader',
        components: {}
    })
    export default class SnTableHeader extends Vue {
        @Prop()
        public store: ITableStore;

        private render(h: any) {
            const store = this.store;
            const columnConfigs = store.states.columnConfigs;
            return (
                <table class="fn-table">
                    <colgroup>
                        {
                            columnConfigs.map((val, index) => (
                                <col key={`head-col-${index}`} class={val.columnClass}/>
                            ))
                        }
                    </colgroup>
                    <thead class="fn-thead">
                    <tr>
                        {
                            columnConfigs.map((column, columnIndex) => (
                                <th key={`head-tr-${columnIndex}`}>
                                    {column.renderHeader(h, {column, store})}
                                </th>
                            ))
                        }
                    </tr>
                    </thead>
                </table>
            )
        }
    }
</script>
