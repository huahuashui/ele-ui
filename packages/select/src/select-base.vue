<template>
    <div class="sn-select" @mouseleave.stop="handleMouseleave">
        <div @click.stop="handleSelectClick">
            <sn-input
                ref="snInput"
                v-model="model"
                class="cursor-point"
                :class="[selectStyle,{ 'is-focus': isVisible }]"
                :size="selectSize"
                :placeholder="placeholder"
                :disabled="disabled"
                :suffix-icon="suffixIcon"
                readonly
                @suffix-click="handleSelectClick"
                :title="model">
            </sn-input>
        </div>
        <transition name="sn-zoom-in-top" @enter="handleAfterEnter">
            <div ref="snSelectDrop"
                 class="sn-select-dropDown"
                 :class="{'origin-cb': isTop, 'origin-ct': !isTop}"
                 v-show="isVisible">
                <iframe class="sn-select-iframe-layer" v-if="hasIframe"></iframe>
                <div class="sn-select-drop__list"
                     :class="{'border-top-none': !isTop,'border-bottom-none': isTop}"
                     :style="{'max-height': dropHeight + 'px'}">
                    <slot></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import SnInput from "ele-ui/packages/input/index";
    import {SnUIComponentSizeEnum} from "ele-ui/src/enum/component";
    
    import {SnUIComponentSize} from "../../../types";
    import {ISnFormItem} from "../../../types/form-item";

    @Component({
        name: 'SnSelectBase',
        components: {
            SnInput,
        }
    })
    export default class SnSelectBase extends Vue {
        /** 下拉框选中值 */
        @Prop()
        public model: string | number;

        /** 输入框尺寸 */
        @Prop(String)
        public size: SnUIComponentSize;

        /** 下拉框最大高度 默认300 */
        @Prop({type: Number, default: 300})
        public dropHeight: number;

        /** 动态计算下拉框位置 */
        @Prop(Boolean)
        public activeDrop: boolean;

        /** 占位符 */
        @Prop(String)
        public placeholder: string;

        /**
         * 选择器风格
         * normal:可选状态--输入框有边框及背景色，禁止状态-鼠标图标置为禁止，边框及背景色置灰
         * noBorderBg:可选状态--输入框无边框及背景色，禁止状态-鼠标图标置为禁止
         * button:可选状态--输入框边框及背景色-蓝色按钮样式，禁止状态-鼠标图标置为禁止 边框置灰-背景色置白
         * 默认normal
         */
        @Prop({type: String, default: 'normal'})
        public selectStyle: string;

        /** 禁用 */
        @Prop(Boolean)
        public disabled: boolean;

        /** 是否加载iframe 在列表中渲染的数据 不加载iframe可以极大加快渲染速度 */
        @Prop({type: Boolean, default: false})
        public hasIframe: boolean;

        // 下拉框--true-展开 false-收起
        private isVisible: boolean = false;
        // 下拉框是否在上方
        private isTop: boolean = false;

        // computed
        get snFormItem(): ISnFormItem {
            let parent: any = this.$parent;
            while (parent && parent.$options && parent.$options.name !== 'SnFormItem') {
                parent = parent.$parent;
            }
            return parent;
        }

        get selectSize() {
            return this.size || (this.snFormItem && this.snFormItem.sizeClass) || 'small';
        }

        get inputHeight() {
            const size = this.selectSize;
            return SnUIComponentSizeEnum[size];
        }

        get suffixIcon() {
            return {
                open: 'drop-pull pull-down',
                close: 'drop-pull',
            }[this.isVisible ? 'open' : 'close']
        }

        /** 隐藏-下拉框 */
        public hideDropDown() {
            this.isVisible = false;
            this.snInputRef().blur();
        }

        // 鼠标mouseleave
        protected handleMouseleave(event: any) {
            if (event.relatedTarget || event.toElement) {
                this.hideDropDown();
            }
        }

        /** 点击切换展开/收起 */
        protected handleSelectClick() {
            if (this.disabled) return;
            if (this.isVisible) {
                this.hideDropDown();
            } else {
                this.showDropDown();
            }
        }

        // 进入过渡动画-重新计算位置
        protected handleAfterEnter(el: any, done: () => void) {
            this.setDropDownPosition(this.$el);
            // done();
        }

        private snInputRef() {
            return this.$refs.snInput as any;
        }

        private snSelectDropRef() {
            return this.$refs.snSelectDrop as HTMLDivElement;
        }

        /** 显示-下拉框 */
        private showDropDown() {
            this.isVisible = true;
            this.snInputRef().focus();
        }

        /**
         * 递归查找当前选择器样式overflow/overflow-y:hidden的父容器
         * 动态设置下拉框位置
         */
        private setDropDownPosition(targetDom: Element) {
            if (!this.activeDrop) {return;}
            const parentDom = targetDom.parentElement;
            if (!parentDom) {return;}
            const styleStr1 = this.getStyle(targetDom.parentElement).getPropertyValue('overflow');
            const styleStr2 = this.getStyle(targetDom.parentElement).getPropertyValue('overflow-y');
            if (styleStr1 === 'hidden' || styleStr2 === 'hidden' || parentDom.tagName === 'BODY') {
                // 计算选择器dom相对于外部hidden的容器dom的偏移量 30为选择器中类名为select-input高度
                const targetDomRect = this.$el.getBoundingClientRect();
                const parentDomRect = parentDom.getBoundingClientRect();
                const top_h = targetDomRect.top - parentDomRect.top;
                const bottom_h = parentDomRect.height - top_h - this.inputHeight;
                const dropDown_h = this.snSelectDropRef().offsetHeight;
                // 满足条件 下拉框显示在上方 否则就在下方
                if (dropDown_h > bottom_h && dropDown_h <= top_h) {
                    this.isTop = true;
                    this.snSelectDropRef().style.top = -dropDown_h + 'px';
                } else {
                    this.isTop = false;
                    this.snSelectDropRef().style.top = '100%';
                }
            } else {
                this.setDropDownPosition(parentDom);
            }
        }

        // 获取样式
        private getStyle(ele: Element & { currentStyle?: any }) {
            let style = null;
            if (window.getComputedStyle) {
                style = window.getComputedStyle(ele, null);
            } else {
                style = ele.currentStyle;
            }
            return style;
        }
    }
</script>
