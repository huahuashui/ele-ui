import simpleLayer from "../../../../packages/simple-layer/index"
import {VueConstructor} from "vue";
export class SimpleLayerDemo {
    private currentLayerId: string = null;
    private open (tpl: VueConstructor) {
        const scope = {
        };
        this.closeLayer();
        // 播放声音放这里, 因为closeLayer还会触发一次关闭声音
        this.currentLayerId = simpleLayer.open({
            area: ["auto", "auto"],
            content: tpl,
            scope: scope,
            // times: 5000,
            offset: {
                right: "0px",
                bottom: "192px",
            },
            end: () => {
                // 弹框关闭了
            }
        });
    }
    private closeLayer() {
        if (this.currentLayerId != null) {
            simpleLayer.close(this.currentLayerId);
            this.currentLayerId = null;
        }
    }
}
