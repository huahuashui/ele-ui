import {Vue, Prop, Watch, Component} from "vue-property-decorator";

import PopupManager from 'ele-ui/src/utils/popup/popup-manager';
import Popper from 'ele-ui/src/utils/popper';

const PopperJS: any = Vue.prototype.$isServer ? function () {} : Popper;
const stop = (event: Event) => event.stopPropagation();

interface popperOptionsModel {
    boundariesElement: string;
    gpuAcceleration: boolean;
};

@Component
export default class VuePopper extends Vue {
    @Prop({type: [Boolean, String], default: true})
    public transformOrigin: boolean | string;

    @Prop({type: String, default: 'bottom'})
    public placement: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';

    @Prop({type: Number, default: 5})
    public boundariesPadding: number;

    @Prop()
    public reference: any;

    @Prop()
    public popper: any;

    @Prop({type: Number, default: 0})
    public offset: number;

    @Prop(Boolean)
    public value: boolean;

    @Prop({type: Boolean, default: true})
    public visibleArrow: boolean;

    @Prop({type: Number, default: 0})
    public arrowOffset: number;

    @Prop({type: Boolean, default: true})
    public appendToBody: boolean;

    @Prop({
        default: () => {
            return {
                gpuAcceleration: false
            }
        }
    })
    public popperOptions: popperOptionsModel;

    public currentPlacement: string = '';
    public showPopper: boolean = false;

    /************************************************************/
    public referenceElm: Node;

    public popperElm: Element;

    public popperJS: any;

    public appended: boolean;

    /************************************************************/
    /* 同名的变量 */
    @Prop({type: Boolean, default: false})
    public disabled: boolean;

    /************************************************************/

    protected updatePopper() {
        const popperJS = this.popperJS;
        if (popperJS) {
            popperJS.update();
            if (popperJS._popper) {
                popperJS._popper.style.zIndex = PopupManager.nextZIndex();
            }
        } else {
            this.createPopper();
        }
    }

    @Watch('value', {immediate: true})
    protected watchValue(newVal: boolean) {
        // this.showPopper = newVal;
        // this.$emit('input', newVal);
        // trigger = 'manual' 时， this.$slots.reference[0].elm 会出现 undefined
        setTimeout(() => {
            this.showPopper = newVal;
            this.$emit('input', newVal);
        }, 0);
    }

    @Watch('showPopper', {immediate: true})
    protected watchShowPopper(newVal: boolean) {
        if (this.disabled) return;
        newVal ? this.updatePopper() : this.destroyPopper();
        newVal ? this.$emit('show') : this.$emit('hide');
        this.$emit('input', newVal);
    }

    protected doDestroy(forceDestroy: boolean = false) {
        /* istanbul ignore if */
        if (!this.popperJS || (this.showPopper && !forceDestroy)) return;
        this.popperJS.destroy();
        this.popperJS = null;
    }

    private createPopper() {
        if (this.$isServer) return;
        this.currentPlacement = this.currentPlacement || this.placement;
        if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
            return;
        }

        const options = this.popperOptions as any;
        const popper = this.popperElm = this.popperElm || this.popper || this.$refs.popper;
        let reference = this.referenceElm = this.referenceElm || this.reference || this.$refs.reference;

        if (!reference &&
            this.$slots.reference &&
            this.$slots.reference[0]) {
            reference = this.referenceElm = this.$slots.reference[0].elm;
        }

        if (!popper || !reference) return;
        if (this.visibleArrow) this.appendArrow(popper);
        if (this.appendToBody) document.body.appendChild(this.popperElm);
        if (this.popperJS && this.popperJS.destroy) {
            this.popperJS.destroy();
        }

        options.placement = this.currentPlacement;
        options.offset = this.offset;
        options.arrowOffset = this.arrowOffset;
        this.popperJS = new PopperJS(reference, popper, options);
        this.popperJS.onCreate((_: any) => {
            this.$emit('created', this);
            this.resetTransformOrigin();
            this.$nextTick(this.updatePopper);
        });
        if (typeof options.onUpdate === 'function') {
            this.popperJS.onUpdate(options.onUpdate);
        }
        this.popperJS._popper.style.zIndex = PopupManager.nextZIndex();
        this.popperElm.addEventListener('click', stop);
    }

    // private updatePopper() {
    //     const popperJS = this.popperJS;
    //     if (popperJS) {
    //         popperJS.update();
    //         if (popperJS._popper) {
    //             popperJS._popper.style.zIndex = PopupManager.nextZIndex();
    //         }
    //     } else {
    //       this.createPopper();
    //     }
    // }

    private destroyPopper() {
        if (this.popperJS) {
            this.resetTransformOrigin();
        }
    }

    private resetTransformOrigin() {
        if (!this.transformOrigin) return;
        const placementMap = {
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left'
        } as any;
        const placement = this.popperJS._popper.getAttribute('x-placement').split('-')[0];
        const origin = placementMap[placement];
        this.popperJS._popper.style.transformOrigin = typeof this.transformOrigin === 'string'
            ? this.transformOrigin
            : ['top', 'bottom'].indexOf(placement) > -1 ? `center ${origin}` : `${origin} center`;
    }

    private appendArrow(element: Element) {
        let hash;
        if (this.appended) {
            return;
        }

        this.appended = true;

        for (const item in element.attributes) {
            if (/^_v-/.test(element.attributes[item].name)) {
                hash = element.attributes[item].name;
                break;
            }
        }

        const arrow = document.createElement('div');

        if (hash) {
            arrow.setAttribute(hash, '');
        }
        arrow.setAttribute('x-arrow', '');
        arrow.className = 'popper__arrow';
        element.appendChild(arrow);
    }

    private beforeDestroy() {
        this.doDestroy(true);
        if (this.popperElm && this.popperElm.parentNode === document.body) {
            this.popperElm.removeEventListener('click', stop);
            document.body.removeChild(this.popperElm);
        }
    }

    // call destroy in keep-alive mode
    private deactivated() {
        (this.$options.beforeDestroy as any)[0].call(this);
    }
}
