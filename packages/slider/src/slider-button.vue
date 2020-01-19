<template>
    <div class="sn-slider__button sn-icon-slider" :style="buttonStyle"
         ref="sliderButton"
         @mousedown.stop="handleMouseDown">
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Emit, Prop} from "vue-property-decorator";
    import {ISnSlider} from "../../../types/Slider";

    @Component({
        name: 'SnSliderButton'
    })
    export default class SliderButton extends Vue {
        /** 当前数值 */
        @Prop({type: Number, default: 0})
        public value: number;

        // 是否启动拖动
        private dragging: boolean = false;
        // 拖动时开始坐标
        private startX: number = 0;
        // 拖动时开始位置
        private startValue: number = 0;

        get parent() {
            return this.$parent as ISnSlider;
        }

        get max() {
            return this.parent.max;
        }

        get min() {
            return this.parent.min;
        }

        get step() {
            return this.parent.step;
        }

        get precision() {
            return this.parent.precision;
        }

        get distance() {
            const sliderWidth = this.parent.getSliderDom().clientWidth;
            const d = 11 / sliderWidth * (this.max - this.min);
            return parseFloat(d.toFixed(this.precision));
        }

        get buttonStyle() {
            // 11px为滑块宽度
            const d = this.max - this.min;
            return {
                left: `${100 * (this.value - this.min) / d}%`,
                marginLeft: -11 / 2 + 'px'
            }
        }

        // 更新滑块值-关联滑块位置更新
        public setPosition(newVal: number) {
            if (newVal === null || isNaN(newVal)) return;
            if (newVal >= this.max) {
                newVal = this.max;
            } else if (newVal <= this.min) {
                newVal = this.min;
            }
            const stepNum = Math.round((newVal - this.min) / this.step);
            const ret = stepNum * this.step + this.min;
            // 出发数据变更
            this.transferValue(ret);
        }

        // 开启拖动
        protected handleMouseDown(event: any) {
            this.onDragStart(event);
            window.addEventListener('mousemove', this.onDragging);
            window.addEventListener('mouseup', this.onDragEnd);
            window.addEventListener('contextmenu', this.onDragEnd);
        }

        // 启动拖动
        private onDragStart(event: any) {
            this.dragging = true;
            this.startX = event.clientX;
            this.startValue = this.value;
        }

        // 拖动中
        private onDragging(event: any) {
            event.stopPropagation();
            if (!this.dragging) {return;}
            const sliderWidth = this.parent.getSliderDom().clientWidth;
            const diff = (event.clientX - this.startX) / sliderWidth * (this.max - this.min);
            const newVal = this.startValue + parseFloat(diff.toFixed(this.precision));
            this.setPosition(newVal);
        }

        // 取消拖动
        private onDragEnd(event: any) {
            event.stopPropagation();
            if (!this.dragging) {return;}
            this.dragging = false;
            window.removeEventListener('mousemove', this.onDragging);
            window.removeEventListener('mouseup', this.onDragEnd);
            window.removeEventListener('contextmenu', this.onDragEnd);
        }

        // 数值双向绑定
        @Emit('change')
        private transferValue(val: number) {}
    }
</script>
