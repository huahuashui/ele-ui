<template>
    <div class="sn-switch" :class="{'is-disabled': disabled}" @click="handleClick">
        <span class="sn-switch__label is-left"
              :class="{'is-active': !isActive}"
              v-if="inactiveText">
            {{inactiveText}}
        </span>
        <span class="sn-switch__core"
              :style="isActive ? activeColorStyle : inactiveColorStyle"
              :class="{'is-active': isActive}">
        </span>
        <span class="sn-switch__label is-right"
              :class="{'is-active': isActive}"
              v-if="activeText">
            {{activeText}}
        </span>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Emit, Model} from "vue-property-decorator";
    
    @Component({
        name: 'SnSwitch'
    })
    export default class SnSwitch extends Vue {
        /** 绑定值 */
        @Model('change')
        public model: boolean | string | number;

        /** 是否禁用 */
        @Prop(Boolean)
        public disabled: boolean;

        /** switch 关闭时的文字描述 */
        @Prop(String)
        public inactiveText: string;

        /** switch 打开时的文字描述 */
        @Prop(String)
        public activeText: string;

        /** switch 关闭时的值 */
        @Prop({default: false})
        public inactiveValue: string | number | boolean;

        /** switch 打开时的值 */
        @Prop({default: true})
        public activeValue: string | number | boolean;

        /** switch 关闭时的值背景色 */
        @Prop(String)
        public inactiveColor: string;

        /** switch 打开时的背景色 */
        @Prop(String)
        public activeColor: string;

        get isActive() {
            return this.model === this.activeValue;
        }

        get activeColorStyle() {
            const ret = this.activeColor ? this.activeColor : '';
            return {
                backgroundColor: ret,
                color: ret
            }
        }

        get inactiveColorStyle() {
            const ret = this.inactiveColor ? this.inactiveColor : '';
            return {
                backgroundColor: ret,
                color: ret
            }
        }

        protected handleClick() {
            if (this.disabled) {return}
            const val = !this.isActive ? this.activeValue : this.inactiveValue;
            this.$emit('change', val);
        }

        @Emit()
        private change(val: string | number | boolean) {}
    }
</script>
