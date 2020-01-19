import {VueConstructor} from "vue";

export interface SimpleLayerOpts {
    area: string | string[],
    offset: SimpleLayerOptsOffset,
    times?: number,
    scope?: any;
    content: VueConstructor;
    end?: () => void;
}

export interface SimpleLayerOptsOffset {
    left?: string;
    right?: string;
    bottom?: string;
    top?: string;
}

/** SimpleLayer Component */
export declare interface SnSimpleLayer {
    open(opts: SimpleLayerOpts): void;

    close(layerId: string): void;
}
