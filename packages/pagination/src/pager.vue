<template>
    <div class="sn-pagination__pager"
         :class="{'is-background': background, 'is-disabled': disabled}"
         @click="handlePager">
        <div class="pager-item"
             v-for="item in pagers"
             :key="item"
             :data-page="item"
             :class="{'is-active': item === currentPage}">
            {{item}}
        </div>
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

        @Prop({type: Number, default: 5})
        public buttonCount: number;

        /** 是否禁用 */
        @Prop(Boolean)
        public disabled: boolean;

        /** 是否为分页按钮添加背景色 */
        @Prop(Boolean)
        public background: boolean;

        get pagers() {
            const pages = [] as number[];
            const {
                currentPage,
                pageCount,
                buttonCount,
            } = this;

            const middleCount = Math.ceil(buttonCount / 2);

            if (pageCount < buttonCount) {
                for (let i = 1; i <= pageCount; i++) {
                    pages.push(i);
                }
            } else if (currentPage >= middleCount && currentPage <= pageCount - middleCount) {
                for (let i = 1; i <= buttonCount; i++) {
                    pages.push(currentPage - middleCount + i);
                }
            } else if (currentPage > pageCount - middleCount && pageCount >= buttonCount) {
                for (let i = 1; i <= buttonCount; i++) {
                    pages.push(pageCount - buttonCount + i);
                }
            } else {
                for (let i = 1; i <= buttonCount; i++) {
                    pages.push(i);
                }
            }

            return pages;
        }

        // 点击页码
        protected handlePager(event: any) {
            const target = event.target;
            const tagName = target.tagName;
            const val = Number(target.attributes['data-page'].value);
            if (this.disabled || tagName === 'UL' || val === this.currentPage) {return;}
            this.$emit('jump', val)
        }
    }
</script>
