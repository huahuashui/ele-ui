## 播放控件
:::demo
```html
<template>
    <div>
        <h1 style="font-size: 20px; text-align: center; padding: 20px 0;">声音播放控件demo</h1>
        <h2>{{showAudioDom ? '当前控件已加载' : '当前控件未加载, 请点击显示按钮'}}</h2>
        <sn-audio
            v-if="showAudioDom"
            ref="audio"
            :play-once-use-time="singleTime"
            :settingSeconds="totalTime"
            :musicUrl="musicUrl"
        ></sn-audio>
        <sn-button @click="changeAudioDom(true)">加载控件</sn-button>
        <sn-button @click="changeAudioDom(false)">销毁控件</sn-button>
        <sn-button @click="openMusic">开启声音</sn-button>
        <sn-button @click="stopMusic">关闭声音</sn-button>
        <label>总播放时长:</label><sn-input style="width: 200px;" v-model="totalTime"></sn-input>
        <label>声音文件单次播放时长:</label><sn-input style="width: 200px;" v-model="singleTime"></sn-input>
        <label>声音文件路径:</label><sn-input style="width: 200px;" v-model="musicUrl"></sn-input>

    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import {ISnAudioRef} from "../../../src/types/audio";

    /**
     * 声音播放控件demo
     *
     * 不支持直接实时修改声音地址, 需要先将sn-audio控件销毁, 再创建一个新实例, 可以通过v-if来实现
     */


    @Component({
    })
    export default class AudioDemo extends Vue {

        protected totalTime: number = 12;
        protected singleTime: number = 3;
        protected musicUrl = "/music/alarm.mp3";
        protected showAudioDom: boolean = false;
        protected openMusic() {
            this.getAudioRef().play();
        }
        protected stopMusic() {
            this.getAudioRef().stop();
        }

        /**
         * 修改声音播放控件展示
         */
        protected changeAudioDom(flag: boolean) {
            this.showAudioDom = flag;
        }
        private getAudioRef(): ISnAudioRef {
            return this.$refs['audio'];
        }
    }
</script>
```
