import {Vue, Component, Prop} from "vue-property-decorator";

@Component({
    name: 'SnPageRender'
})

export default class SnPageRender extends Vue {
    @Prop({type: Object}) public data: any;

    private render() {
        const parent: any = this.$parent
        const tree: any = parent.tree

        return parent.pageRender ? parent.pargeRender({node: this.data}) :
            (tree.$scopedSlots.page ? tree.$scopedSlots.page({node: this.data}) : '')
    }

}