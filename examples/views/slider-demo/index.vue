<template>
    <div class="m-slider-demo">
        <div class="spacing">单滑块<i>&nbsp;</i>{{sliderVal}}</div>
        <sn-slider :min="10" :max="60" v-model="sliderVal"></sn-slider>
        
        <div class="spacing">双滑块<i>&nbsp;</i>:min:{{sliderValList[0]}} max{{sliderValList[1]}}</div>
        <sn-slider :min="10" :max="60" :range="true" v-model="sliderValList"></sn-slider>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";

    @Component({
        name: 'SliderDemo',
    })
    export default class SliderDemo extends Vue {
        protected sliderVal: number = 20;
        protected sliderValList: number = 30;

        private created() {

        };

        private mounted() {

        };
    }
</script>

<style lang="scss">
    .m-slider-demo {
        width: 300px;
        height: 100px;
        margin: 50px auto;
        
        .spacing {
            margin-top: 30px;
            margin-bottom: 10px;
        }
    }
</style>
