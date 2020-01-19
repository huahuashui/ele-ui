<template>
    <div class="sn-badge">
        <div class="badge_external">
            <slot></slot>
        </div>
        <span class="badge_content" v-show="!hidden">{{showModel}}</span>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component({
        name: "SnBadge"
    })
    export default class SnBadge extends Vue {
        /** 显示值 默认最大99 */
        @Prop()
        public model: number | string;
        /** 最大值，超过最大值会显示 '{max}+'，要求 model 是 number 类型 */
        @Prop({type: Number, default: 99})
        public max: number;
        /** 是否隐藏badge 默认展示 */
        @Prop(Boolean)
        public hidden: boolean;

        get showModel() {
            if (typeof this.model === 'number') {
                return this.model > this.max ? `${this.max}+` : this.model;
            } else {
                return this.model;
            }
        }
    }
</script>
