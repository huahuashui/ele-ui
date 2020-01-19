import {VueConstructor} from "vue";
import {Vue} from "vue-property-decorator";
import {SimpleLayerOpts, SimpleLayerOptsOffset} from "../../../types/simple-layer";

import {getUUID} from "ele-ui/src/utils/util";
import {vueBindEvents} from "ele-ui/src/utils/vue-utils";

interface CntrScope {
    layerId: string;
    isShow: boolean;
    styles: { [key: string]: any };
}

type _SimpleLayerEventName = {
    close: string;
}

// 创建构造器
const $compile = (component: VueConstructor) => {
    return (propsData: any, events: Record<string, Function>) => {
        const params = vueBindEvents({
            propsData
        }, events);
        return new component(params);
    }
};

const defaultComponent = Vue.extend({
    template: `
        <div class="sn-simple-layer" :class="{'z-show': isShow}" :style="styles" :id="layerId">
            <i class="simple-layer-close-btn f-csp  sn-icon-close z-no-hover" @click="closeBtn"></i>
            <div class="simple-layer-cntr js-content"></div>
        </div>
    `,
    props: {
        styles: {
            default: () => {}
        },
        layerId: {
            default: ''
        },
        isShow: {
            default: true
        }
    },
    data: function () {
        return {}
    },
    methods: {
        closeBtn: function () {
            // tslint:disable-next-line:no-invalid-this
            this.$emit('close');
        }
    }
});

export class SimpleLayer {

    private layerId: string = null;

    private cntrScope: Vue = null;

    private contentScope: Vue = null;

    private callbackFuncs: { [key in keyof _SimpleLayerEventName]: (params: any) => void } = {} as { [key in keyof _SimpleLayerEventName]: () => void };

    constructor(private zIndex: number) {
        this.layerId = getUUID();
    }

    /**
     * 打开弹框
     * @param opts
     */
    public open(opts: SimpleLayerOpts) {
        const $cntr = this.getCntrDom(opts);
        document.getElementsByTagName("body")[0].append($cntr)
        document.getElementById($cntr.id).append(this.compileContent(opts.content, opts.scope, {close: () => this.emit("close")}))
        return this.layerId;
    }

    /**
     * 关闭弹框
     */
    public close() {
        this.destroy();
    }

    public getId() {
        return this.layerId;
    }

    public on(eventName: keyof _SimpleLayerEventName, func: (params: any) => void) {
        this.callbackFuncs[eventName] = func;
    }

    private emit(eventName: keyof _SimpleLayerEventName) {
        if (typeof this.callbackFuncs[eventName] === "function") {
            this.callbackFuncs[eventName].call(this, this.layerId);
        }
    }

    private compileContent(content: VueConstructor, prop: any, eventRecord: Record<string, Function>) {
        this.contentScope = $compile(content)(prop, eventRecord);
        return this.contentScope.$mount().$el
    }

    private getCntrDom(opts: SimpleLayerOpts) {
        const params = this.initCntrScope({} as CntrScope, opts);
        const callbacks = {close: () => this.emit("close")};
        this.cntrScope = $compile(defaultComponent)(params, callbacks);
        return this.cntrScope.$mount().$el;
    }

    private initCntrScope(scope: CntrScope, opts: SimpleLayerOpts) {
        scope.isShow = true;
        scope.layerId = this.layerId;
        scope.styles = {
            ...this.getWidthAndHeight(opts.area),
            ...this.getOffset(opts.offset)
        };
        return scope;
    }

    private getWidthAndHeight(area: string | string[]) {
        const isArray = Array.isArray(area);
        return {
            width: (isArray ? area[0] : area) || "auto",
            height: (isArray ? area[1] : "auto") || "auto"
        };
    }

    private getOffset(offset: SimpleLayerOptsOffset) {
        offset = offset || {} as SimpleLayerOptsOffset;
        return {
            left: offset.left || null,
            right: offset.right || null,
            bottom: offset.bottom || null,
            top: offset.top || null,
            zIndex: this.zIndex
        }
    }

    private destroy() {
        if (this.contentScope != null) {
            this.contentScope.$destroy();
            this.contentScope = null;
        }
        if (this.cntrScope != null) {
            this.cntrScope.$destroy();
            this.cntrScope = null;
        }
        this.callbackFuncs = null;
        this.removeLayerDom(this.layerId);
    }

    private removeLayerDom(layerId: string) {
        document.getElementById(layerId).remove()
    }
}
