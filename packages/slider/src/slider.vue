<template>
    <div class="sn-slider" ref="sliderRunway" @click.stop="handleClickBar">
        <div class="sn-slider__bar" :style="barStyle"></div>
        <!--滑块1-->
        <slider-button ref="button1"
                       :title="firstValue"
                       :value="firstValue"
                       @change="handleChangeFirst">
        </slider-button>
        <!--滑块2-->
        <slider-button v-if="range"
                       ref="button2"
                       :title="secondValue"
                       :value="secondValue"
                       @change="handleChangeSecond">
        </slider-button>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Model, Watch, Emit} from "vue-property-decorator";
    import SliderButton from "./slider-button.vue";

    import {ISnSliderButton} from "../../../types/Slider";

    @Component({
        name: 'SnSlider',
        components: {
            SliderButton
        }
    })
    export default class Slider extends Vue {
        /** 当前数值 */
        @Model('change')
        public model: number | number[];
        /** 是否为范围选择 */
        @Prop(Boolean)
        public range: boolean;
        /** 最小值 */
        @Prop({type: Number, default: 0})
        public min: number;
        /** 最大值 */
        @Prop({type: Number, default: 100})
        public max: number;
        /** 步数--可被max-min整除 */
        @Prop({type: Number, default: 1})
        public step: number;

        // 当为范围选择时-滑块1
        protected firstValue: number = null;
        // 当为范围选择时-滑块2
        protected secondValue: number = null;

        // 内部触发值变更
        private isInside: boolean = false;

        // 获取当前小数点后的长度
        get precision() {
            const precisions = [this.min, this.max, this.step].map(item => {
                const decimal = ('' + item).split('.')[1];
                return decimal ? decimal.length : 0;
            });
            return Math.max.apply(null, precisions);
        }

        get minValue() {
            return Math.min(this.firstValue, this.secondValue);
        }

        get maxValue() {
            return Math.max(this.firstValue, this.secondValue);
        }

        get barStyle() {
            let barSize = "0%";
            let barStart = "0%";
            const d = this.max - this.min;
            if (this.range) {
                barSize = `${100 * (this.maxValue - this.minValue) / d}%`;
                barStart = `${100 * (this.minValue - this.min) / d}%`;
            } else {
                barSize = `${100 * (this.firstValue - this.min) / d}%`;
            }
            return {
                width: barSize,
                left: barStart
            };
        }

        public getSliderDom() {
            return this.$refs.sliderRunway as HTMLDivElement;
        }

        // 点击位置-移动滑块
        protected handleClickBar(event: any) {
            const sliderWidth = this.getSliderDom().clientWidth;
            const sliderOffsetLeft = this.getSliderDom().getBoundingClientRect().left;
            const diff = (event.clientX - sliderOffsetLeft) / sliderWidth * (this.max - this.min);
            const newVal = this.min + parseFloat(diff.toFixed(this.precision));
            this.setPosition(newVal);
        }

        // 滑块1
        protected handleChangeFirst(val: number) {
            this.isInside = true;
            this.firstValue = val;
            if (this.range) {
                const minValue = Math.min(val, this.secondValue);
                const maxValue = Math.max(val, this.secondValue);
                this.transferValue([minValue, maxValue]);
            } else {
                this.transferValue(val);
            }
        }

        // 滑块2
        protected handleChangeSecond(val: number) {
            this.isInside = true;
            this.secondValue = val;
            if (this.range) {
                const minValue = Math.min(val, this.firstValue);
                const maxValue = Math.max(val, this.firstValue);
                this.transferValue([minValue, maxValue]);
            }
        }

        private getSliderButton1() {
            return this.$refs.button1 as ISnSliderButton;
        }

        private getSliderButton2() {
            return this.$refs.button2 as ISnSliderButton;
        }

        // 外部数据变化-根据当前是否范围选择-对应处理
        private setValueByType(val: number | number[], oldVal: number | number[]) {
            if (this.min > this.max) {
                console.error('[Error][SliderMap] min should not be greater than max.');
                return;
            }
            if (this.range) {
                this.setMultipleValue(val as number[], oldVal as number[]);
            } else {
                this.setSingleValue(val as number, oldVal as number);
            }
        }

        // 单独滑块
        private setSingleValue(val: number, oldVal: number) {
            if (val === oldVal) {return;}
            if (typeof val !== 'number' || isNaN(val)) {
                val = this.min;
            } else {
                val = Math.min(this.max, Math.max(this.min, val));
            }
            this.firstValue = val;
            // 传递数据
            this.transferValue(val);
        }

        // 双滑块-范围选择
        private setMultipleValue(val: number[], oldVal: number[]) {
            if (Array.isArray(val) &&
                Array.isArray(oldVal) &&
                val.length > 0 &&
                val.every((item: number, index: number) => item === oldVal[index])) {
                return;
            }
            let firstValue = this.min;
            let secondValue = this.max;
            if (Array.isArray(val)) {
                if (val[1] < this.min) {
                    firstValue = this.min;
                    secondValue = this.min;
                } else if (val[0] > this.max) {
                    firstValue = this.max;
                    secondValue = this.max;
                } else if (val[0] < this.min) {
                    firstValue = this.min;
                    secondValue = val[1];
                } else if (val[1] > this.max) {
                    firstValue = val[0];
                    secondValue = this.max;
                } else {
                    firstValue = val[0];
                    secondValue = val[1];
                }
            }
            this.firstValue = firstValue;
            this.secondValue = secondValue;
            // 传递数据
            this.transferValue([this.minValue, this.maxValue]);
        }

        // 更新滑块位置
        private setPosition(newVal: number) {
            if (!this.range) {
                this.getSliderButton1().setPosition(newVal);
                return;
            }
            let isButton1: boolean;
            if (Math.abs(this.minValue - newVal) < Math.abs(this.maxValue - newVal)) {
                isButton1 = this.firstValue < this.secondValue ? true : false;
            } else {
                isButton1 = this.firstValue > this.secondValue ? true : false;
            }
            if (isButton1) {
                this.getSliderButton1().setPosition(newVal);
            } else {
                this.getSliderButton2().setPosition(newVal);
            }
        }

        // 监听值变化
        @Watch('model', {deep: true, immediate: true})
        private watchValue(val: number | number[], oldVal: number | number[]) {
            // 内部滑动修改的值，已做了大小判断处理，故拦截掉
            if (this.isInside) {
                this.isInside = false;
                return;
            }
            this.setValueByType(val, oldVal);
        }

        // 数值双向绑定
        @Emit('change')
        private transferValue(val: number | number[]) {}
    }
</script>
