<template>
    <div class="sn-breadcrumb">
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component({
        name: "SnBreadcrumb"
    })
    export default class SnBreadcrumb extends Vue {
        /** 分隔符 与separatorClass互斥 */
        @Prop({default: '/'})
        public separator: string;

        /** 图标分隔符class，如果传入图标class，将使separator设置失效 */
        @Prop({default: null})
        public separatorClass: string;
    }
</script>
