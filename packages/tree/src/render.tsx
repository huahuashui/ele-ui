import {Vue, Component, Prop} from "vue-property-decorator";

@Component({
    name: 'render'
})
export default class Render extends Vue {
    @Prop({type: Function}) private renderFn: (h: any, params: {data: any,node: any, map: any, root: any}) => HTMLElement;
    @Prop({type: Array}) private node: any;
    @Prop({type: Object}) private data: any;

    private render(h: any) {
        const params = {
            data: this.data,
            node: this.node[1],
            map: this.node[0],
            root: this.node[2]
        }
        const parent: any = this.$parent
        const tree: any = parent.tree
        return this.renderFn ? this.renderFn(h, params) : (
            tree.$scopedSlots.default ? tree.$scopedSlots.default(params) : ''
        )
    }
}