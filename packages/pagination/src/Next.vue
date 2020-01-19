<template>
    <div class="sn-pagination__button"
         :class="{'is-disabled': disabled, 'is-background': background }"
         @click="handleClick">
        {{nextText}}
        <i class="next-btn" v-if="!nextText"></i>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component({
        name: 'Next'
    })
    export default class Next extends Vue {
        /** 是否禁用 */
        @Prop(Boolean)
        public disabled: boolean;

        /** 是否为分页按钮添加背景色 */
        @Prop(Boolean)
        public background: boolean;

        /** 替代图标显示的下一页文字 */
        @Prop(String)
        public nextText: string;

        protected handleClick() {
            this.$emit('next');
        }
    }
</script>
