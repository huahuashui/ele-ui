<template>
    <div class="sn-pagination__button"
         :class="{'is-disabled': disabled, 'is-background': background}"
         @click="handleClick">
        {{prevText}}
        <i class="prev-btn" v-if="!prevText"></i>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component({
        name: 'Prev'
    })
    export default class Prev extends Vue {
        /** 是否禁用 */
        @Prop(Boolean)
        public disabled: boolean;

        /** 是否为分页按钮添加背景色 */
        @Prop(Boolean)
        public background: boolean;

        /** 替代图标显示的上一页文字 */
        @Prop(String)
        public prevText: string;

        protected handleClick() {
            this.$emit('prev');
        }
    }

</script>
