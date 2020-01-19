import {ComponentOptions} from "vue";
import {isFunction} from "ele-ui/src/utils/util"

export function vueBindEvents(component: ComponentOptions<any>, events: Record<string, Function>) {
    return {
        ...component,
        created() {
            Object.keys(events).filter(val => {
                const isFunc = val && isFunction(events[val]);
                !isFunc && console.warn(`scopeEvents' value Must be a function, otherwise invalid that key of ${val}`);
                return isFunc;
            }).forEach((val) => {
                // tslint:disable-next-line:no-invalid-this
                this.$on(val, events[val])
            });
            component.created && component.created();

        },
        destroyed() {
            Object.keys(events).forEach(val => {
                // tslint:disable-next-line:no-invalid-this
                val && this.$off(val)
            });
            component.destroyed && component.destroyed();
        },
    }
}
