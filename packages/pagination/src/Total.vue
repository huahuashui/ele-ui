<template>
    <div class="sn-pagination__total" v-if="total > 0">
        共 {{total}} 条
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component({
        name: 'Total'
    })
    export default class Total extends Vue {
        /** 数据总数 */
        @Prop({type: Number, default: 0})
        public total: number;
    }
</script>
