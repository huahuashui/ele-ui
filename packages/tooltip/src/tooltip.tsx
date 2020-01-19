import {CreateElement} from "vue";
import {Vue, Component, Prop, Watch} from "vue-property-decorator";

import {on, off, addClass, removeClass} from "ele-ui/src/utils/dom";
import {debounce} from "ele-ui/src/utils/util";
import VuePopper from "ele-ui/src/utils/vue-popper";

@Component({
    name: 'SnTooltip'
})
export default class SnTooltip extends VuePopper {
    /*  参数  说明  类型  可选值  默认值  */

    /** effect    默认提供的主题    String    dark/light    dark **/
    @Prop({type: String, default: 'dark'})
    public effect: 'dark' | 'light';

    /** content    显示的内容，也可以通过slot#content传入DOM    String    —    — **/
    @Prop(String)
    public content: string;

    /** disabled  Popover是否可用  Boolean  —  false **/
    @Prop({type: Boolean, default: false})
    public disabled: boolean;

    /** visible-arrow    是否显示Tooltip箭头，更多参数可见Vue-popper    Boolean    —    true **/
    @Prop({type: Boolean, default: true})
    public visibleArrow: boolean;

    /** open-delay    触发方式为 hover 时的显示延迟，单位为毫秒    Number    —    — } **/
    @Prop({type: Number, default: 0})
    public openDelay: number;

    /** close-delay    触发方式为 hover 时的隐藏延迟，单位为毫秒    number    —    200 } **/
    @Prop({type: Number, default: 200})
    public closeDelay: number;

    /** manual    手动控制模式，设置为true后，mouseenter和mouseleave事件将不会生效  Boolean  —  false } **/
    @Prop({type: Boolean, default: false})
    public manual: boolean;

    /** transition    定义渐变动画    String    —    sn-fade-in-linear **/
    @Prop({type: String, default: 'sn-fade-in-linear'})
    public transition: string;

    /** popper-class  为Tooltip的popper添加类名  String  —  — } **/
    @Prop(String)
    public popperClass: string;

    /** enterable    鼠标是否可进入到 tooltip 中    Boolean    —    true } **/
    @Prop({type: Boolean, default: true})
    public enterable: boolean;

    /** hide-after    Tooltip出现后自动隐藏延时，单位毫秒，为0则不会自动隐藏    number    —    0 } **/
    @Prop({type: Number, default: 0})
    public hideAfter: number;

    /** tabindex    Popover 组件的 tabindex    number    —    0 } **/
    @Prop({type: Number, default: 0})
    public tabindex: number;

    public expectedState: boolean;
    public popperVM: any;
    public debounceClose: any;

    private timeout: number;

    private timeoutPending: number = null;
    private focusing: boolean = false;

    @Watch('focusing')
    protected watchFocusing(newVal: boolean) {
        if (newVal) {
            addClass(this.referenceElm, 'focusing');
        } else {
            removeClass(this.referenceElm, 'focusing');
        }
    }

    private beforeCreate() {
        if (this.$isServer) return;

        this.popperVM = new Vue({
            data: {node: ''},
            render(h) {
                return this.node;
            }
        }).$mount();

        // this.debounceClose = debounce(200, () => this.handleClosePopper());
        this.debounceClose = debounce(() => this.handleClosePopper(), 200);
    }

    private mounted() {
        this.referenceElm = this.$el;
        if (this.$el.nodeType === 1) {
            // this.$el.setAttribute('aria-describedby', this.tooltipId);
            this.$el.setAttribute('tabindex', String(this.tabindex));
            on(this.referenceElm, 'mouseenter', this.show);
            on(this.referenceElm, 'mouseleave', this.hide);
            on(this.referenceElm, 'focus', () => {
                if (!this.$slots.default || !this.$slots.default.length) {
                    this.handleFocus();
                    return;
                }
                // VueComponent
                const instance = this.$slots.default[0].componentInstance as any;
                if (instance && instance.focus) {
                    instance.focus();
                } else {
                    this.handleFocus();
                }
            });
            on(this.referenceElm, 'blur', this.handleBlur);
            on(this.referenceElm, 'click', this.removeFocusing);
        }
        // fix issue https://github.com/ElemeFE/element/issues/14424
        if (this.value && this.popperVM) {
            this.popperVM.$nextTick(() => {
                if (this.value) {
                    this.updatePopper();
                }
            });
        }
    }

    private handleAfterEnter() {
        this.$emit('after-enter');
    }

    private show() {
        this.setExpectedState(true);
        this.handleShowPopper();
    }

    private hide() {
        this.setExpectedState(false);
        this.debounceClose();
    }

    private handleFocus() {
        this.focusing = true;
        this.show();
    }

    private handleBlur() {
        this.focusing = false;
        this.hide();
    }

    private removeFocusing() {
        this.focusing = false;
    }

    private addTooltipClass(prev: string) {
        if (!prev) {
            return 'el-tooltip';
        } else {
            return 'el-tooltip ' + prev.replace('el-tooltip', '');
        }
    }

    private handleShowPopper() {
        if (!this.expectedState || this.manual) return;
        clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => {
            this.showPopper = true;
        }, this.openDelay);

        if (this.hideAfter > 0) {
            this.timeoutPending = window.setTimeout(() => {
                this.showPopper = false;
            }, this.hideAfter);
        }
    }

    private handleClosePopper() {
        if (this.enterable && this.expectedState || this.manual) return;
        clearTimeout(this.timeout);

        if (this.timeoutPending) {
            clearTimeout(this.timeoutPending);
        }
        this.showPopper = false;

        if (this.disabled) {
            this.doDestroy();
        }
    }

    private setExpectedState(expectedState: boolean) {
        if (expectedState === false) {
            clearTimeout(this.timeoutPending);
        }
        this.expectedState = expectedState;
    }

    private getFirstElement() {
        const slots = this.$slots.default;
        if (!Array.isArray(slots)) return null;
        let element = null;
        for (let index = 0; index < slots.length; index++) {
            if (slots[index] && slots[index].tag) {
                element = slots[index];
            }
            ;
        }
        return element;
    }

    // private beforeDestroy() {
    //     this.popperVM && this.popperVM.$destroy();
    // }

    private destroyed() {
        const reference = this.referenceElm;
        if (reference.nodeType === 1) {
            off(reference, 'mouseenter', this.show);
            off(reference, 'mouseleave', this.hide);
            off(reference, 'focus', this.handleFocus);
            off(reference, 'blur', this.handleBlur);
            off(reference, 'click', this.removeFocusing);
        }
    }

    /*
        如果将此render函数放在其他方法函数前面tslint将会报错：
            the "this" keyword is disallowed outside of a class body
    */

    private render(h: CreateElement) {
        const that: any = this;
        if (that.popperVM) {
            that.popperVM.node = (
                <transition name={that.transition}
                            onAfterLeave={that.doDestroy}>
                    <div
                        onMouseleave={() => {
                            that.setExpectedState(false);
                            that.debounceClose();
                        }}
                        onMouseenter={() => { that.setExpectedState(true); }}
                        ref="popper"
                        role="tooltip"
                        // id={this.tooltipId}
                        aria-hidden={(that.disabled || !that.showPopper) ? 'true' : 'false'}
                        v-show={!that.disabled && that.showPopper}
                        class={
                            ['sn-tooltip__popper', 'is-' + that.effect, that.popperClass]
                        }>
                        {that.$slots.content || that.content}
                    </div>
                </transition>);
        }

        {
            const firstElement = that.getFirstElement();
            if (!firstElement) return null;

            const data = firstElement.data = firstElement.data || {};
            data.staticClass = that.addTooltipClass(data.staticClass);

            return firstElement;
        }
    }
}
