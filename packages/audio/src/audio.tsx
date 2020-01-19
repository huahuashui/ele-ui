import {Vue, Component, Prop, Watch} from "vue-property-decorator";
import {convertString2Num, stringInterception, throttle} from "ele-ui/src/utils/util";

/**
 * 声音播放控件
 *
 * @param playOnceUseTime 播放一次的时间, 默认2.5秒
 * @param settingSeconds 触发播放以后声音的持续时长
 * @param musicUrl 声音文件路径(当前支持mp3和wav格式)
 * 不支持直接实时修改声音地址, 需要先将sn-audio控件销毁, 再创建一个新实例, 可以通过v-if来实现
 */

@Component({
    name: "SnAudio"
})
export default class SnAudio extends Vue {
    // 播放一次的时间, 默认2.5秒
    @Prop()
    protected playOnceUseTime: number | string;
    // 触发播放以后声音的持续时长
    @Prop()
    protected settingSeconds: number | string;
    // 声音文件路径(当前支持mp3和wav格式)
    @Prop()
    protected musicUrl: string;

    protected localPlayOnceUseTime: number = 2.5;
    protected localSettingSeconds: number = 10;
    private loopTimer: any = null;
    private throttlePlay = throttle(this.localPlay, 1000, this);

    public play() {
        this.throttlePlay();
    }

    /**
     * 停止声音播放
     */
    public stop() {
        this.stopMusic();
    }

    /**
     * 获取audio原生控件实例
     */
    get audioDomRef() {
        return (this.$refs.audioDom as HTMLMediaElement);
    }

    /**
     * 可能从外部传入的值是字符串, 这里做容错处理, 转换成number
     */
    @Watch('playOnceUseTime')
    public playOnceUseTimeChange(val: number | string) {
        this.localPlayOnceUseTime = convertString2Num(val, 2.5) as number;
    }

    /**
     * 可能从外部传入的值是字符串, 这里做容错处理, 转换成number
     */
    @Watch('settingSeconds')
    public settingSecondsChange(val: number | string) {
        this.localSettingSeconds = convertString2Num(val, 0) as number;
    }

    protected mounted() {
        // 初始化赋值
        this.localPlayOnceUseTime = convertString2Num(this.playOnceUseTime, 2.5) as number;
        this.localSettingSeconds = convertString2Num(this.settingSeconds, 0) as number;
    }

    protected render(h: any) {
        const musicType = this.getAudioType(this.musicUrl);
        return (
            <div className="u-audio-control" style="position: relative; display: none;">
                <audio
                    ref="audioDom"
                    preload="auto"
                    controls="false"
                    onPlay={this.onPlay}
                    onError={this.onError}
                    onWaiting={this.onWaiting}
                    onPause={this.onPause}
                    height="0"
                    width="0"
                    autostart="0"
                >
                    <source src={this.musicUrl} type={musicType}/>
                </audio>
            </div>
        )
    }

    protected beforeDestroy() {
        this.stopInterval();
    }

    // 当音频暂停
    protected onPause(e: any) {
    }

    // 当发生错误, 就出现loading状态
    protected onError(e: any, msg: any) {
        console.error('loading audio file fail, please check the url ')
    }

    // 当音频开始等待
    protected onWaiting(e: any) {
    }

    // 当音频开始等待
    protected onPlay(e: any) {
    }

    /**
     * 触发声音播放
     */
    private localPlay() {
        // 移除上历史
        this.stopMusic();
        // 重新获取当前设置的播放时间
        const settingSeconds = this.localSettingSeconds;
        // 声音为0, 则不响
        if (settingSeconds === 0) return;

        // 重新计算需要播放的次数
        const playCount = Math.round(settingSeconds / this.localPlayOnceUseTime);
        this.playMusic();
        // 若只播放一次, 则不进入下面的setInterval
        if (playCount <= 1) return;

        this.loopTimer = this.startInterval(playCount, this.localPlayOnceUseTime);
    };

    /**
     * 获取当前播放的声音
     */
    private getAudioType(musicUrl: string) {
        let musicType = stringInterception(musicUrl, ".", {subMode: true, useFirst: false, isSaveKey: false});
        let result = "audio/mp3";
        musicType = musicType && musicType.toUpperCase();
        switch (musicType) {
            case "MP3":
                break;
            case "WAV":
                result = "audio/wav";
                break;
        }
        return result;
    }

    /**
     * 开始循环播放
     * @param needCount 循环多少次
     * @param intervalTime 多少秒循环一次
     */
    private startInterval(needCount: number, intervalTime: number) {
        let count = 1;
        return setInterval(() => {
            this.playMusic();
            count += 1;
            // 超过播放的次数了
            if (count >= needCount) {
                this.stopInterval();
            }
        }, intervalTime * 1000);
    }

    /**
     * 播放声音
     */
    private async playMusic() {
        try {
            (this.$refs.audioDom as HTMLMediaElement).muted = false;
            (this.$refs.audioDom as HTMLMediaElement).currentTime = 0.0;
            this.audioDomRef.play()
        } catch (e) {
            console.error("playMusic error: ", e);
        }
    }

    /**
     * 停止轮询
     */
    private stopInterval() {
        if (this.loopTimer) {
            clearInterval(this.loopTimer);
            this.loopTimer = null;
        }
    }

    /**
     * 停止声音播放
     */
    private stopMusic() {
        this.stopInterval();
        try {
            this.audioDomRef.pause();
        } catch (e) {
            console.error("stopMusic error: ", e);
            console.error(e);
        }
    }
}
