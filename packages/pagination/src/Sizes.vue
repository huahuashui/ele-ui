<template>
    <sn-select class="sn-pagination__sizes"
               :disabled="disabled"
               v-model="internalPageSize"
               @change="handleChange">
        <sn-select-option v-for="item in pageSizeList"
                          :key="item" 　
                          :label="item"
                          :value="item">
        </sn-select-option>
    </sn-select>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Watch} from "vue-property-decorator";
    import SnSelect from "ele-ui/packages/select/index";

    @Component({
        components: {
            SnSelect
        }
    })
    export default class ComponentName extends Vue {
        /** 每页显示条目个数 */
        @Prop(Number)
        public pageSize: number;

        /** 是否禁用 */
        @Prop(Boolean)
        public disabled: boolean;

        protected pageSizeList = [10, 20, 30, 40, 50, 100];
        protected internalPageSize: number = this.pageSize;

        protected handleChange() {
            this.$emit('size-change', this.internalPageSize)
        }

        @Watch('pageSize')
        private watchCurrentPage() {
            if (this.internalPageSize === this.pageSize) {return}
            this.internalPageSize = this.pageSize;
        }
    }
</script>
