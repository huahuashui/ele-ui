<!--
<template>
    <div class="u-paging" v-show="pageParams.totalCount > 0">
        <div class="u-paging-wrap">
            <ul class="u-paging-content">
                <li class="u-paging-item select"
                    v-if="!isHideSelect"
                    @mouseover="pagingShow"
                    @mouseleave="pagingHide">
                    <i>{{pageParams.pageSize}}</i>
                    <i class="select_icon i-select-down"></i>
                    <ul class="select_drop" v-show="selectPageFlag"
                        @mouseleave="pagingHide()">
                        <li class="select_drop_item"
                            v-for="(num,index) in selectPageNums"
                            :key="index"
                            @click="selectPageSize(num)"
                            :class="{'selected':pageParams.pageSize===num}"
                        >
                            {{num}}
                        </li>
                    </ul>
                </li>
                &lt;!&ndash;跳转到第一页&ndash;&gt;
                <li class="u-paging-item i-pading-first"
                    v-if="showTypeIsNormal"
                    :class="{'disabled':isFirstPage}"
                    @click="jumpPage(1)">
                </li>

                <li class="u-paging-item i-pading-up"
                    :class="{'disabled':isFirstPage}"
                    @click="jumpPrevPage()">
                </li>

                <li class="u-paging-item hover"
                    v-for="(page,$index) in pageNumBtns"
                    :key="$index"
                    :class="{'current': pageParams.currentPage === page.value}"
                    @click="jumpPage(page.value)"
                >
                    {{page.value}}
                </li>

                <li class="u-paging-item i-pading-down"
                    :class="{'disabled':isLastPage}"
                    @click="jumpNextPage()">
                </li>

                &lt;!&ndash;跳转到最后一页&ndash;&gt;
                <li class="u-paging-item i-pading-last"
                    v-if="showTypeIsNormal"
                    :class="{'disabled':isLastPage}"
                    @click="jumpPage(pageCount)">
                </li>

                <li class="u-paging-item count" v-if="!isHidePageCount">
                    共
                    <i>{{pageCount}}</i>
                    页
                </li>
            </ul>
            <div class="u-paging-jump" v-if="!isHideJump">
                <input class="p-size-input"
                       type="text"
                       v-model="inputPageNum"
                       @keyup="verifyInput()">
                &lt;!&ndash;跳转&ndash;&gt;
                <span class="p-size-btn"
                      @click="jumpPage(inputPageNum)"
                >
                    跳转
        </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Emit, Prop, Watch} from "vue-property-decorator";
    import PageParams, {PageStyleType} from "./page-params";
    import {PageUtil} from "./page.util";

    @Component({})
    export default class Pagination extends Vue {
        private name: "sn-page";
        @Prop({default: PageStyleType.normal})
        private showType: PageStyleType;
        @Prop({default: false})
        private isHideSelect: boolean;
        @Prop({default: false})
        private isHidePageCount: boolean;
        private inputPageNum: number = 1;
        private selectPageFlag: boolean = false;

        /**
         * 使用注意点:
         * 1.当currentPage,pageSize,totalCount发生变化时, 业务层需要调用pageParams.update来更新pageParams中的参数,
         *
         */
        @Prop({default: () => new PageParams()})
        private pageParams: PageParams;
        @Prop({default: () => [20, 50, 100]})
        private selectPageNums: number[];

        // events
        @Emit() public changePageSize(num: number) {
        }

        // events
        @Emit() public nextPage(num: number) {
        }

        // events
        @Emit() public prevPage(num: number) {
        }

        // events
        @Emit() public goPage(num: number) {
        }
        // input page number verify
        protected verifyInput() {
            // 验证数字
            const regNum: RegExp = /^[0-9]*$/;
            // 验证非数字
            const regNoNum: RegExp = /\D/g;
            const isNumber = regNum.test("" + this.inputPageNum);
            const num = parseInt(("" + this.inputPageNum).replace(regNoNum, ''));
            this.inputPageNum = num > 0 && this.pageCount > 0?
                num > this.pageCount ? this.pageCount : num
                : 1;
        }

        // 下拉框显示
        protected pagingShow() {
            this.selectPageFlag = true;
        }

        // 下拉框隐藏
        protected pagingHide() {
            this.selectPageFlag = false;
        }

        // 选择每页显示数据条数
        protected selectPageSize(num: number) {
            this.pagingHide();
            this.changePageSize(num);
        }

        //
        protected jumpPage(num: number): void {
            const {currentPage,} = this.pageParams;
            if (!num || num < 1
                || num > this.pageCount
                || num == currentPage
            ) {
                return;
            }
            this.goPage(num);
        }

        protected jumpPrevPage() {
            const {currentPage} = this.pageParams;
            if (currentPage <= 1) return;
            this.prevPage(currentPage - 1);
        };

        protected jumpNextPage() {
            const {currentPage, } = this.pageParams;
            if (currentPage >= this.pageCount) return;
            this.nextPage(currentPage + 1);
        }

        get isLastPage() {
            return this.pageParams.currentPage >= this.pageCount;
        }

        get pageCount() {
            const {
                totalCount = 0,
                pageSize = 0
            } = this.pageParams;
            let pageCount = 1;
            if (totalCount > 0) {
                pageCount = parseInt(totalCount / pageSize + "", 10);
                if (totalCount % pageSize !== 0) {
                    pageCount += 1;
                }
            }
            return pageCount;
        }

        get isFirstPage() {
            return this.pageParams.currentPage <= 1;
        }

        get isHideJump() {
            return this.showType !== PageStyleType.normal;
        }

        get pageNumBtns() {
            const {showType = PageStyleType.normal} = this;
            const {currentPage} = this.pageParams;
            const pageCount = this.pageCount;
            return PageUtil.getInstance().getPageBtns({pageCount, currentPage, pageStyleType: showType});
        }

        get showTypeIsNormal() {
            return this.showType === PageStyleType.normal
        }

        private changePageParams() {
            this.pageParams = PageUtil.getInstance().convertPageParams(this.pageParams);
            const {
                currentPage,
            } = this.pageParams;
            this.inputPageNum = currentPage;
            this.initSelectPageNums();
        }

        private initSelectPageNums() {
            if (this.pageParams && this.pageParams.pageSize) {
                const sizeNum = this.pageParams.pageSize;
                const isInclude = this.selectPageNums.find((val) => val == sizeNum);
                if (!isInclude) {
                    this.selectPageNums = ([sizeNum].concat(this.selectPageNums)).sort((index_1, index_2) => index_1 - index_2);
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    /*分页*/
    .u-paging {
        width: 100%;
        text-align: right;
    }

    .u-paging-wrap {
        display: inline-block;
        vertical-align: top;
        zoom: 1;

        &:after {
            content: '';
            display: block;
            height: 0;
            overflow: hidden;
            clear: both;
        }
    }

    .u-paging-content {
        float: left;
    }

    .u-paging-item {
        float: left;
        min-width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        padding: 0 8px;
        border: 1px solid #ddd;
        background-color: #fff;
        user-select: none;
        cursor: pointer;

        &:first-child {
            border-radius: 3px 0 0 3px;
        }

        &:last-child {
            border-radius: 0 3px 3px 0;
        }

        &:nth-child(2n) {
            border-left: none;
        }

        &.disabled {
            opacity: 0.8;
            cursor: not-allowed;
        }

        // 当前页
        &.current {
            border-color: #45a2ff;
            background-color: #45a2ff;
            color: #fff;
        }

        // 总数据条数
        &.count {
            border-radius: 0 3px 3px 0;
            color: #666;
        }

        //
        &.hover:hover {
            border-color: #45a2ff;
            background-color: #45a2ff;
            color: #fff;
        }
    }

    /*下拉框*/
    .u-paging-item.select {
        position: relative;
        padding: 0 25px 0 15px;
        color: #808080;
        background-color: #fff;
    }

    .u-paging-item .select_icon {
        position: absolute;
        top: 0;
        right: 0;
        width: 25px;
        height: 30px;
    }

    .u-paging-item .select_drop {
        position: absolute;
        left: 0;
        top: -91px;
        width: 100%;
        border-bottom: none;
        box-shadow: 0 0 2px #ccc;
        background-color: #fff;
        z-index: 9999;
    }

    .u-paging-item .select_drop_item {
        padding: 0 25px 0 15px;
        cursor: default;
    }

    .u-paging-item .select_drop_item.selected {
        color: #fff;
        background-color: rgba(63, 169, 254, 1);
    }

    .u-paging-item .select_drop_item:hover {
        color: #fff;
        background-color: rgba(63, 169, 254, .8);
    }

    // 页数跳转
    .u-paging-jump {
        float: left;
        margin-left: 15px;
        zoom: 1;

        &:after {
            content: '';
            display: block;
            height: 0;
            overflow: hidden;
            clear: both;
        }

        .p-size-input {
            float: left;
            width: 45px;
            height: 30px;
            border: 1px solid #ddd;
            border-radius: 3px 0 0 3px;
            padding: 0 4px;
            color: #666;
            text-align: center;
        }

        .p-size-btn {
            float: left;
            width: 45px;
            height: 30px;
            border: 1px solid #ddd;
            border-radius: 0 3px 3px 0;
            padding: 0 8px;
            color: #666;
            background-color: #f4f4f4;
            border-left: none;
            line-height: 30px;
            cursor: pointer;
        }
    }
</style>
-->
