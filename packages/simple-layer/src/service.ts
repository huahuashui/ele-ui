import {SimpleLayer} from "./simple-layer";
import {SimpleLayerOpts} from "../../../types/simple-layer";

interface LayerModel {
    layer: SimpleLayer;
    funcs: { [key: string]: any };
}

export class SimpleLayerService {
    // zIndexNumber, 每弹一个窗zIndex+1
    private zIndexNumber = 20190505;
    private layerMap: { [key: string]: LayerModel } = {};

    public open(opts: SimpleLayerOpts) {
        opts = opts || {} as SimpleLayerOpts;
        const layer = new SimpleLayer(this.zIndexNumber++);
        this.bindEvent(layer);
        this.cacheLayer(layer, opts);
        this.autoCloseLayer(layer, opts.times);
        layer.open(opts);
        return layer.getId();
    }

    public close(layerId: string) {
        this._close(layerId);
    }

    private autoCloseLayer(layer: SimpleLayer, times: number) {
        if (times == null) return;
        let layerId = layer.getId();
        setTimeout(() => {
            this._close(layerId);
            layerId = null;
        }, times);
    }

    private _close(layerId: string) {
        const layerModel = this.layerMap[layerId];
        if (layerModel) {
            layerModel.layer.close();
            this.triggerEvent(layerModel, "end");
            this.removeCache(layerId);
        }
    }

    private bindEvent(layer: SimpleLayer) {
        layer.on("close", (layerId: string) => {
            this._close(layerId);
        })
    }

    private cacheLayer(layer: SimpleLayer, opts: SimpleLayerOpts) {
        this.layerMap[layer.getId()] = {
            layer,
            funcs: {
                end: opts.end
            }
        };
    }

    private removeCache(layerId: string) {
        if (this.layerMap[layerId] != null) {
            this.layerMap[layerId].layer = null;
            this.layerMap[layerId].funcs = null;
            this.layerMap[layerId] = null;
            delete this.layerMap[layerId];
        }
    }

    private triggerEvent(layerModel: LayerModel, eventName: string) {
        if (layerModel == null) return;
        typeof layerModel.funcs[eventName] === "function" && layerModel.funcs[eventName]();
    }
}
