import {Component, Vue} from "vue-property-decorator";


/** 运用此工具，组件必须命名 eg: @Component({name: '组件名'}) */
@Component
export default class EmitterMixin extends Vue {
    /**
     * 事件冒泡
     * @param componentName 目标组件name
     * @param eventName     事件名
     * @param params        数据
     */
    public bubbling(componentName: string, eventName: string, params?: any) {
        let parent: any = this.$parent || this.$root;
        let name = parent.$options && parent.$options.name;
        while (parent && (!name || name !== componentName)) {
            parent = parent.$parent;
            if (parent) {
                name = parent.$options.name;
            }
        }

        if (parent) {
            parent.$emit.apply(parent, [eventName].concat(params));
        }
    }

    /**
     * 事件广播
     * @param componentName 目标组件name
     * @param eventName     事件名
     * @param params        数据
     */
    public broadcast(componentName: string, eventName: string, params?: any) {
        this._broadcast.call(this, componentName, eventName, params);
    }

    private _broadcast(componentName: string, eventName: string, params: any) {
        this.$children.forEach((child: any) => {
            const name = child.$options && child.$options.name;
            if (name === componentName) {
                child.$emit.apply(child, [eventName].concat(params));
            } else {
                this._broadcast.apply(child, [componentName, eventName].concat([params]));
            }
        });
    }
}



