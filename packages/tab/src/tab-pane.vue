<template>
    <div class="sn-tab-pane"
         v-if="(!lazy || loaded) || active"
         :class="{'z-hide':!active}">
        <slot></slot>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {ISnTab} from "../../../types/tab";

    @Component({
        name: 'SnTabPane'
    })
    export default class SnTabPane extends Vue {
        /** 与选项卡model对应的标识符，表示选项卡别名 */
        @Prop([String, Number])
        public name: string | number;
        /** 选项卡标题 */
        @Prop(String)
        public label: string;
        /** 是否禁用 */
        @Prop(Boolean)
        public disabled: boolean;
        /** 标签是否延迟渲染- */
        @Prop({type: Boolean, default: true})
        public lazy: boolean;

        // 序号
        private index: number | null = null;
        private loaded: boolean = false;

        get snTab(): ISnTab {
            let parent: any = this.$parent;
            while (parent && parent.$options && parent.$options.name !== 'SnTab') {
                parent = parent.$parent;
            }
            return parent;
        }

        get currentName() {
            return this.snTab && this.snTab.currentName;
        }

        get paneName() {
            return this.name || this.index;
        }

        get active() {
            const ret = this.currentName === this.paneName;
            if (ret) {
                this.loaded = true;
            }
            return ret;
        }
    }
</script>
