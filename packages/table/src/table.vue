<template>
    <div class="sn-table" :table-id="tableId">
        <div class="hidden-columns">
            <slot></slot>
        </div>
        <div class="table-head">
            <table-header :store="store"></table-header>
        </div>
        <div class="table-body">
            <sn-scroll>
                <table-body :store="store"></table-body>
            </sn-scroll>
        </div>
        <div class="table-no-data" v-if="!hasData">{{noDataText}}</div>
    </div>
</template>
<script lang="ts">
    import {Component, Emit, Prop, Vue, Watch} from "vue-property-decorator";
    import TableHeader from "./table-header.vue";
    import TableBody from "./table-body.vue";
    import SnScroll from "ele-ui/packages/scroll/index";
    import {TableStoreMutationEnum} from "ele-ui/src/enum/table-column";

    import {TableStore} from "./store/table-store";

    let tableIdSeed = 0;

    @Component({
        name: 'SnTable',
        components: {
            TableHeader,
            TableBody,
            SnScroll
        }
    })
    export default class SnTable extends Vue {
        // 数据源
        @Prop({default: () => [] as any[]})
        public dataSource: any[];

        @Prop({default: '暂无数据'})
        public noDataText: string;

        // 列表id
        public tableId: string = "";
        // 列表-数据仓库
        public store = new TableStore(this, {});

        get hasData() {
            return Array.isArray(this.dataSource) && this.dataSource.length > 0;
        }

        // 列表勾选
        @Emit()
        public tableAfterCheck(resultList: any[], isCheckAll: boolean) {};

        // 列表项点击
        @Emit()
        public rowClick(row: any, index: number) {}

        // 展开/关闭-列表拓展项
        public toggleExpand(payload: { data: any, isExpanded?: boolean, index: number }) {
            this.store.commit(TableStoreMutationEnum.toggleExpand, payload);
        }

        // 用于多选表格，切换某一行的选中状态
        public toggleRowSelection(values: any[], key: string, checkboxStatus: boolean) {
            this.$nextTick(() => {
                if (values && values.length > 0) {
                    this.store.commit(TableStoreMutationEnum.batchChangeCheckboxStatus, {
                        values,
                        key,
                        checkboxStatus,
                        isCallback: false
                    })
                }
            })
        }

        private created() {
            this.tableId = 'sn-table_' + tableIdSeed++;
        }

        @Watch('dataSource', {immediate: true, deep: true})
        private watchDataSource() {
            this.store.commit(TableStoreMutationEnum.setDataSource, this.dataSource);
        }
    }
</script>

