<template>
    <div class="sn-pagination__pager"
         :class="{'is-background': background, 'is-disabled': disabled}"
         @click="handlePager">
        <template v-if="singlePage">
            <div class="pager-item is-active">{{currentPage}}</div>
        </template>
        <template v-else>
            <div class="pager-item" :class="{'is-active': currentPage === 1 }" :data-page="1">1</div>
            <div class="pager-item is-quick-prev" v-if="showPrevMore" :data-page="0">
                <span class="quick-prev is-quick-prev" :data-page="0"></span>
                <span class="quick-text is-quick-prev" :data-page="0">•••</span>
            </div>
            <div class="pager-item"
                 v-for="item in pages"
                 :key="item"
                 :data-page="item"
                 :class="{'is-active': item === currentPage}">
                {{item}}
            </div>
            <div class="pager-item is-quick-next" v-if="showNextMore" :data-page="0">
                <span class="quick-next is-quick-next" :data-page="0"></span>
                <span class="quick-text is-quick-next" :data-page="0">•••</span>
            </div>
            <div class="pager-item"
                 :class="{'is-active': currentPage === pageCount }"
                 v-if="pageCount > 1"
                 :data-page="pageCount">
                {{pageCount}}
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component
    export default class Pager extends Vue {
        /** 当前页数 */
        @Prop(Number)
        public currentPage: number;

        /** 总页数 */
        @Prop(Number)
        public pageCount: number;

        /** 大于等于 3 且小于等于 21 的奇数 */
        @Prop({type: Number, default: 3})
        public buttonCount: number;

        /** 是否禁用 */
        @Prop(Boolean)
        public disabled: boolean;

        /** 是否为分页按钮添加背景色 */
        @Prop(Boolean)
        public background: boolean;

        /** 只展示一页 */
        @Prop(Boolean)
        public singlePage: boolean;

        private showPrevMore = false;
        private showNextMore = false;

        get pages(): number[] {
            // 只展示单页
            if (this.singlePage) {
                this.showPrevMore = false;
                this.showNextMore = false;
                return [];
            }
            const {
                currentPage,
                pageCount,
                buttonCount,
            } = this;
            const pages = [] as number[];
            let showPrevMore = false;
            let showNextMore = false;
            // 出现快速跳页-需总页数大于按钮数
            if (pageCount > buttonCount) {
                if (currentPage > buttonCount - 1) {
                    showPrevMore = true;
                }
                if (currentPage <= pageCount - buttonCount + 1) {
                    showNextMore = true;
                }
            }
            // 第一页和最后一页已存在，需过滤
            if (showPrevMore && !showNextMore) {
                // 处于尾页部分
                const startPage = pageCount - (buttonCount - 2);
                for (let i = startPage; i < pageCount; i++) {
                    pages.push(i);
                }
            } else if (!showPrevMore && showNextMore) {
                // 处于首页部分
                for (let i = 2; i < buttonCount; i++) {
                    pages.push(i);
                }
            } else if (showPrevMore && showNextMore) {
                const offset = Math.ceil((buttonCount - 2) / 2) - 1;
                for (let i = currentPage - offset; i <= currentPage + offset; i++) {
                    pages.push(i);
                }
            } else {
                for (let i = 2; i < pageCount; i++) {
                    pages.push(i);
                }
            }
            this.showPrevMore = showPrevMore;
            this.showNextMore = showNextMore;
            return pages;
        }

        // 点击页码
        protected handlePager(event: any) {
            if (this.disabled || this.singlePage) {return}
            const target = event.target;
            if (target.className.indexOf('sn-pagination__pager') !== -1) {return;}

            let newPage = Number(target.attributes['data-page'].value);
            const pageCount = this.pageCount;
            const currentPage = this.currentPage;
            const offset = this.buttonCount - 2;
            if (target.className.indexOf('is-quick-prev') !== -1) {
                newPage = currentPage - offset;
            } else if (target.className.indexOf('is-quick-next') !== -1) {
                newPage = currentPage + offset;
            }
            if (newPage < 1) {
                newPage = 1;
            }
            if (newPage > pageCount) {
                newPage = pageCount;
            }
            if (newPage !== currentPage) {
                this.$emit('jump', newPage)
            }
        }
    }
</script>
