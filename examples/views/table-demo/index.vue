<template>
    <div class="m-table-demo">
        <sn-table ref="table"
                  :dataSource="dataSource"
                  @table-after-check="afterChangeCheck"
                  @row-click="rowClick">
            <sn-table-column type="selection"
                             :has-serial="true"
                             :has-check="true"
                             :dis-check-func="disCheckFunc"
                             :index-format="indexFormat">
            </sn-table-column>
            
            <sn-table-column prop="name" label="name"></sn-table-column>
            
            <sn-table-column prop="sex" label="sex"></sn-table-column>
            
            <sn-table-column prop="checked" label="checked">
                <template slot-scope="{row,index}">
                    <span @click="handleTableExpand(row,index)">
                       {{row.checked}}
                    </span>
                </template>
            </sn-table-column>
            
            <SnTableColumn type="expand">
                <template slot-scope="{row,index}">expand-内容</template>
            </SnTableColumn>
        </sn-table>
        
        <sn-button @click="toggleRowSelection">切换第二、第三行的选中状态</sn-button>
        <sn-button @click="toggleSelection">反选</sn-button>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component({
        name: "TableDemo",
        components: {}
    })
    export default class TableDemo extends Vue {
        protected dataSource: any[] = [];

        // 列表拓展项
        protected handleTableExpand(row: any, index: number) {
            this.tableRef().toggleExpand({data: row, index});
        }

        protected afterChangeCheck(checkList: Array<any>, isCheckAll: boolean) {
            console.log('afterChangeCheck', checkList, isCheckAll);
        }

        protected rowClick(row: any, index: number) {
            console.log('rowClick', row, index)
        }

        // checkbox禁止状态计算
        protected disCheckFunc(row: any, index: number) {
            return !!(index % 2)
        }

        // 序号计算
        protected indexFormat(row: any, index: number) {
            return index * 2
        }

        // 列表对应项-切换选中
        protected toggleRowSelection() {
            const values = this.dataSource.filter((item, index) => index >= 1 && index <= 2).map(item => item.id);
            this.tableRef().toggleRowSelection(values, 'id');
        }

        // 列表-反选
        protected toggleSelection() {
            const values = this.dataSource.map(item => item.id);
            this.tableRef().toggleRowSelection(values, 'id');
        }

        private created() {
            for (let i = 0; i < 10; i++) {
                this.dataSource.push({
                    id: i,
                    name: 111,
                    sex: 222,
                    checked: true
                },)
            }
        }

        private tableRef() {
            return this.$refs['table'] as any;
        }
    }
</script>

<style lang="scss">
    .m-table-demo {
        height: 300px;
        margin: 20px;
    }
</style>
