<template>
    <div class="sn-pagination__jumper">
        前往
        <sn-input class="editor"
                  :disabled="disabled"
                  v-model="inputPage"
                  @trigger-enter="handleEnter"
                  @change="handleChange">
        </sn-input>
        页
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Watch} from "vue-property-decorator";
    import SnInput from "ele-ui/packages/input/index";

    @Component({
        name: 'Jumper',
        components: {
            SnInput
        }
    })
    export default class Jumper extends Vue {
        /** 当前页数 */
        @Prop(Number)
        public currentPage: number;

        /** 总页数 */
        @Prop(Number)
        public pageCount: number;

        /** 是否禁用 */
        @Prop(Boolean)
        public disabled: boolean;

        // 输入页码
        private inputPage: number = this.currentPage;

        protected handleEnter() {
            this.handleChange();
        }

        protected handleChange() {
            if (this.disabled) {return}
            if (!this.inputPage || this.inputPage < 1) {
                this.inputPage = 1;
            } else if (this.inputPage > this.pageCount) {
                this.inputPage = this.pageCount;
            }
            if (this.inputPage === this.currentPage) {return;}
            this.$emit('jump', Number(this.inputPage));
        }

        @Watch('currentPage')
        private watchCurrentPage() {
            if (this.inputPage === this.pageCount) {return}
            this.inputPage = this.currentPage;
        }
    }
</script>
