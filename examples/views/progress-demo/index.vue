<template>
    <div class="m-progress-demo">
        <p>基本用法</p>
        <sn-button-group>
            <sn-button @click="percent = 0">0</sn-button>
            <sn-button @click="percent = 1">1</sn-button>
            <sn-button @click="percent = 20">20</sn-button>
            <sn-button @click="percent = 20.5">20.5</sn-button>
            <sn-button @click="percent = 40">40</sn-button>
            <sn-button @click="percent = 60">60</sn-button>
            <sn-button @click="percent = 60.5">60.5</sn-button>
            <sn-button @click="percent = 80">80</sn-button>
            <sn-button @click="percent = 100">100</sn-button>
            <sn-button @click="percent+=2">+</sn-button>
            <sn-button @click="percent-=2">-</sn-button>
        </sn-button-group>
        <sn-progress class="top10"
                     :show-text="true"
                     :text-inside="false"
                     stroke-height="10px"
                     :percent="percent">
        </sn-progress>
        <sn-progress class="top10"
                     :percent="percent"
                     background-color="#ccc"
                     :active-color="activeColor1">
        </sn-progress>
        <sn-progress class="top10"
                     :percent="percent"
                     :active-color="activeColor2"
                     stroke-height="20px">
        </sn-progress>
        <sn-progress class="top10"
                     :percent="percent"
                     stroke-width="200px"
                     stroke-height="20px">
        </sn-progress>
        <sn-progress class="top10"
                     :percent="percent"
                     stroke-width="200px"
                     stroke-height="20px">
        </sn-progress>
        <sn-progress class="top10"
                     :percent="percent"
                     stroke-width="200px"
                     stroke-height="20px"
                     :show-text="false">
        </sn-progress>
        <sn-progress class="top10"
                     type="dashboard"
                     :percent="percent"
                     stroke-width="350px"
                     stroke-height="8px">
        </sn-progress>
        <sn-progress class="top10"
                     type="circle"
                     :active-color="customColorMethod"
                     :percent="percent"
                     stroke-width="120px"
                     stroke-height="20px">
        </sn-progress>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";

    @Component({
        name: "ProgressDemo"
    })
    export default class ProgressDemo extends Vue {
        protected percent: number = 20;

        // 自定义颜色
        protected activeColor1: string[] = ['#909399', '#e6a23c', '#67c23a'];
        // 自定义颜色
        protected activeColor2: any[] = [
            {
                color: '#909399',
                percent: 30
            },
            {
                color: '#e6a23c',
                percent: 70
            },
            {
                color: '#67c23a',
                percent: 100
            }
        ];

        // 自定义颜色
        protected customColorMethod(percent: number) {
            if (percent < 30) {
                return '#909399';
            } else if (percent < 70) {
                return '#e6a23c';
            } else {
                return '#67c23a';
            }
        }
    }
</script>

<style lang="scss">
    .m-progress-demo {
        margin: 20px;
        /*width: 350px;*/
        
        .top10 {
            margin-top: 10px;
        }
    }
</style>
