import {SnUIComponent, SnUIComponentSize} from './component';

/** Button Component */
export declare interface SnAudio extends SnUIComponent {
    /** 播放一次的时间, 默认2.5秒 */
    playOnceUseTime: number | string;

    /** 触发播放以后声音的持续时长 */
    settingSeconds: number | string;

    /** 声音文件路径(当前支持mp3和wav格式) */
    musicUrl: string;

    /** 开启声音 */
    play(): void;

    /** 停止声音 */
    stop(): void;
}
