<template>
    <span>
        <transition
            :name="transition"
            @after-enter="handleAfterEnter"
            @after-leave="handleAfterLeave">
            <div
                class="sn-popover sn-popper"
                :class="[popperClass, content && 'sn-popover--plain']"
                ref="popper"
                v-show="!disabled && showPopper"
                :style="{ width: width + 'px' }"
                role="tooltip"
                :aria-hidden="(disabled || !showPopper) ? 'true' : 'false'"
            >
                <div class="sn-popover__title" v-if="title" v-text="title"></div>
                <slot>{{ content }}</slot>
            </div>
        </transition>
        <slot name="reference"></slot>
    </span>
</template>

<script lang="ts">
    import {Component, Prop} from "vue-property-decorator";
    import {on, addClass, removeClass} from "ele-ui/src/utils/dom";
    import VuePopper from "ele-ui/src/utils/vue-popper";
    
    @Component({
        name: 'SnPopover',
        // mixins: [VuePopper]
    })
    export default class SnPopover extends VuePopper {
        /*  参数  说明  类型  可选值  默认值  */

        /** trigger 触发方式  String  click/focus/hover/manual    click **/
        @Prop({type: String, default: 'click'})
        public trigger: 'click' | 'focus' | 'hover' | 'manual';

        /** title    标题    String    —    — **/
        @Prop(String)
        public title: string;

        /** content    显示的内容，也可以通过slot传入DOM    String    —    — **/
        @Prop(String)
        public content: string;

        /** width    宽度    String, Number    —    最小宽度 150px **/
        @Prop({type: [String, Number], default: '150'})
        public width: string | number;

        /** disabled  Popover是否可用  Boolean  —  false **/
        @Prop({type: Boolean, default: false})
        public disabled: boolean;

        /** transition    定义渐变动画    String    —    fade-in-linear **/
        @Prop({type: String, default: 'fade-in-linear'})
        public transition: string;

        /** popper-class    为 popper 添加类名    String    —    — **/
        @Prop(String)
        public popperClass: string;

        /** open-delay    触发方式为 hover 时的显示延迟，单位为毫秒    Number    —    — } **/
        @Prop({type: Number, default: 0})
        public openDelay: number;

        /** close-delay    触发方式为 hover 时的隐藏延迟，单位为毫秒    number    —    200 } **/
        @Prop({type: Number, default: 200})
        public closeDelay: number;

        /** tabindex    Popover 组件的 tabindex    number    —    0 } **/
        @Prop({type: Number, default: 0})
        public tabindex: number;

        private _timer: number;

        // 实例销毁之前调用。在这一步，实例仍然完全可用。
        // private beforeDestroy() {
        //     this.cleanup();
        // }

        // Vue 实例销毁后调用
        // private deactivated() {
        //     this.cleanup();
        // }

        private mounted() {
            let reference = this.referenceElm = this.reference || this.$refs.reference;
            const popper = this.popper || this.$refs.popper;
            if (!reference && this.$slots.reference && this.$slots.reference[0]) {
                reference = this.$slots.reference[0].elm;
            }

            // 可访问性
            if (reference) {
                addClass(reference, 'sn-popover__reference');
                //   reference.setAttribute('aria-describedby', this.tooltipId);
                reference.setAttribute('tabindex', this.tabindex); // tab序列
                popper.setAttribute('tabindex', String(0));

                if (this.trigger !== 'click') {
                    on(reference, 'focusin', () => {
                        this.handleFocus();
                        const instance = reference.__vue__;
                        if (instance && typeof instance.focus === 'function') {
                            instance.focus();
                        }
                    });
                    on(popper, 'focusin', this.handleFocus);
                    on(reference, 'focusout', this.handleBlur);
                    on(popper, 'focusout', this.handleBlur);
                }
                on(reference, 'keydown', this.handleKeydown);
                on(reference, 'click', this.handleClick);
            }

            if (this.trigger === 'click') {
                on(reference, 'click', this.doToggle);
                on(document, 'click', this.handleDocumentClick);
            } else if (this.trigger === 'hover') {
                on(reference, 'mouseenter', this.handleMouseEnter);
                on(popper, 'mouseenter', this.handleMouseEnter);
                on(reference, 'mouseleave', this.handleMouseLeave);
                on(popper, 'mouseleave', this.handleMouseLeave);
            } else if (this.trigger === 'focus') {
                if (this.tabindex < 0) {
                    console.warn('[Element Warn][Popover]a negative taindex means that the element cannot be focused by tab key');
                }
                if (reference.querySelector('input, textarea')) {
                    on(reference, 'focusin', this.doShow);
                    on(reference, 'focusout', this.doClose);
                } else {
                    on(reference, 'mousedown', this.doShow);
                    on(reference, 'mouseup', this.doClose);
                }
            }
        }

        private handleAfterEnter() {
            this.$emit('after-enter');
        }

        private handleAfterLeave() {
            this.$emit('after-leave');
            this.doDestroy();
        }

        private doToggle() {
            this.showPopper = !this.showPopper;
        }

        private doShow() {
            this.showPopper = true;
        }

        private doClose() {
            this.showPopper = false;
        }

        private handleFocus() {
            addClass(this.referenceElm, 'focusing');
            if (this.trigger === 'click' || this.trigger === 'focus') this.showPopper = true;
        }

        private handleClick() {
            removeClass(this.referenceElm, 'focusing');
        }

        private handleBlur() {
            removeClass(this.referenceElm, 'focusing');
            if (this.trigger === 'click' || this.trigger === 'focus') this.showPopper = false;
        }


        private handleDocumentClick(event: Event) {
            let reference = this.reference || this.$refs.reference;
            const popper = this.popper || this.$refs.popper;

            if (!reference && this.$slots.reference && this.$slots.reference[0]) {
                reference = this.referenceElm = this.$slots.reference[0].elm;
            }
            if (!this.$el ||
                !reference ||
                this.$el.contains(event.target as Node) ||
                reference.contains(event.target) ||
                !popper ||
                popper.contains(event.target)) return;
            this.showPopper = false;
        }


        private handleMouseEnter() {
            clearTimeout(this._timer);
            if (this.openDelay) {
                this._timer = window.setTimeout(() => {
                    this.showPopper = true;
                }, this.openDelay);
            } else {
                this.showPopper = true;
            }
        }

        private handleKeydown(ev: any) {
            if (ev.keyCode === 27 && this.trigger !== 'manual') { // esc
                this.doClose();
            }
        }

        private handleMouseLeave() {
            clearTimeout(this._timer);
            if (this.closeDelay) {
                this._timer = window.setTimeout(() => {
                    this.showPopper = false;
                }, this.closeDelay);
            } else {
                this.showPopper = false;
            }
        }

        private cleanup() {
            if (this.openDelay || this.closeDelay) {
                clearTimeout(this._timer);
            }
        }
    }
</script>
