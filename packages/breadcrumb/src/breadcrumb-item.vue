<template>
    <div class="sn-breadcrumb-item">
        <span class="breadcrumb_inner" :class="[to ? 'is-link' : '']" @click.stop="handleClick">
            <slot></slot>
        </span>
        <span class="breadcrumb_icon" :class="separatorClass" v-if="separatorClass"></span>
        <span class="breadcrumb_separator" v-else>{{separator}}</span>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {ISnBreadcrumb} from "../../../types/breadcrumb";

    @Component({
        name: "SnBreadcrumbItem"
    })
    export default class SnBreadcrumbItem extends Vue {
        /** 在使用 to 进行路由跳转时，启用 replace 将不会向 history 添加新记录 */
        @Prop(Boolean)
        public replace: boolean;

        /** 路由跳转对象，同 vue-router 的 to */
        @Prop(Object)
        public to: object;

        // vue-router实例
        public $router: any;
        public separator: string = null;
        public separatorClass: string = null;

        // computed
        get snBreadcrumb(): ISnBreadcrumb {
            let parent: any = this.$parent;
            while (parent && parent.$options && parent.$options.name !== 'SnBreadcrumb') {
                parent = parent.$parent;
            }
            return parent;
        }

        /** 跳转路由 */
        protected handleClick(e: Event) {
            const {to, $router} = this;
            if (!to || !$router) {return;}
            this.replace ? $router.replace(to) : $router.push(to);

            this.$emit('click', e)
        }

        private mounted() {
            if (!this.snBreadcrumb) {
                console.error("SnBreadcrumbItem must be SnBreadcrumb 's child");
                return;
            }
            this.separator = this.snBreadcrumb.separator;
            this.separatorClass = this.snBreadcrumb.separatorClass;
        }
    }
</script>
