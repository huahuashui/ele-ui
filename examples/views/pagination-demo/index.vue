<template>
    <div class="m-pagination-demo">
        <p class="margin-t20">基础用法</p>
        <sn-pagination class="margin-t20"
                       layout="prev, pager, next, sizes, jumper, total"
                       :current-page="pageParams.currentPage"
                       :page-size="pageParams.pageSize"
                       :total="pageParams.totalCount"
                       @page-change="handlePageChange"
                       @size-change="handleSizeChange">
        </sn-pagination>
        
        <sn-pagination class="margin-t20"
                       layout="prev, pager, next, sizes, jumper, total"
                       :background="true"
        
                       :current-page="pageParams.currentPage"
                       :page-size="pageParams.pageSize"
                       :total="pageParams.totalCount"
                       @page-change="handlePageChange"
                       @size-change="handleSizeChange">
        </sn-pagination>
        
        <p class="margin-t20">禁用</p>
        <sn-pagination layout="prev, pager, next, sizes, jumper, total"
                       :disabled="true"
                       :current-page="pageParams.currentPage"
                       :page-size="pageParams.pageSize"
                       :total="pageParams.totalCount"
                       @page-change="handlePageChange"
                       @size-change="handleSizeChange">
        </sn-pagination>
        
        <sn-pagination class="margin-t20"
                       layout="prev, pager, next, sizes, jumper, total"
                       :disabled="true"
                       :background="true"
        
                       :current-page="pageParams.currentPage"
                       :page-size="pageParams.pageSize"
                       :total="pageParams.totalCount"
                       @page-change="handlePageChange"
                       @size-change="handleSizeChange">
        </sn-pagination>
        
        <p class="margin-t20">自己选择展示项及顺序</p>
        <sn-pagination class="margin-t20"
                       layout="prev, pager, next, total"
                       :current-page="pageParams.currentPage"
                       :page-size="pageParams.pageSize"
                       :total="pageParams.totalCount"
                       @page-change="handlePageChange"
                       @size-change="handleSizeChange">
        </sn-pagination>
        
        <sn-pagination class="margin-t20"
                       layout="total, prev, pager, next"
                       :current-page="pageParams.currentPage"
                       :page-size="pageParams.pageSize"
                       :total="pageParams.totalCount"
                       @page-change="handlePageChange"
                       @size-change="handleSizeChange">
        </sn-pagination>
        
        <p class="margin-t20">控制按钮个数</p>
        <sn-pagination class="margin-t20"
                       layout="total, prev, pager, next"
                       :button-count="7"
                       :current-page="pageParams.currentPage"
                       :page-size="pageParams.pageSize"
                       :total="pageParams.totalCount"
                       @page-change="handlePageChange"
                       @size-change="handleSizeChange">
        </sn-pagination>
        
        <p class="margin-t20">单页小型分页</p>
        <sn-pagination class="margin-t20"
                       layout="total, prev, pager, next"
                       :single-page="true"
                       :hide-single-page="true"
                       :current-page="pageParams.currentPage"
                       :page-size="pageParams.pageSize"
                       :total="pageParams.totalCount"
                       @page-change="handlePageChange"
                       @size-change="handleSizeChange">
        </sn-pagination>
        
        <p class="margin-t20">当只有一页时隐藏分页</p>
        <sn-switch class="margin-t20" v-model="isOpen"></sn-switch>
        <sn-pagination class="margin-t20"
                       layout="total, prev, pager, next"
                       :single-page="true"
                       :hide-single-page="isOpen"
                       :current-page="1"
                       :page-size="10"
                       :total="1">
        </sn-pagination>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import SnPagination from "../../../packages/pagination";
    import SnSwitch from "../../../packages/switch/src/switch.vue";

    @Component({
        components: {
            SnSwitch,
            SnPagination
        }
    })
    export default class CopyTextDemo extends Vue {
        protected pageParams = {
            currentPage: 1,
            pageSize: 10,
            totalCount: 200
        };

        protected isOpen: boolean = false;

        protected handlePageChange(num: number) {
            // 更新分页对象
            this.pageParams.currentPage = num;

            console.log('handlePageChange', num);
        }

        protected handleSizeChange(num: number) {
            this.pageParams.currentPage = 1;
            this.pageParams.pageSize = num;

            console.log('handleSizeChange', num);
        }
    }
</script>

<style scoped lang="scss">
    .m-pagination-demo {
        margin: 20px;
        
        .margin-t20 {
            margin-top: 20px;
        }
    }
</style>
