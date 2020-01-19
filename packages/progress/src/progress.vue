<template>
    <div class="sn-progress" :style="progressStyle">
        <canvas ref="canvasOuter" class="progress-circle_outer"></canvas>
        <canvas ref="canvasInner" class="progress-circle_inner"></canvas>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Watch} from "vue-property-decorator";
    import {ActiveColorObject, ActiveColor} from "../../../types/progress";

    @Component({
        name: "SnProgress"
    })
    export default class SnProgress extends Vue {
        // 文本高度
        private static readonly textHeight = 12;

        /** 进度条类型 直线：line / 环形：circle / 仪表盘：dashboard */
        @Prop({type: String, default: 'line', validator: val => (['line', 'circle', 'dashboard'].indexOf(val) > -1)})
        public type: 'line' | 'circle' | 'dashboard';

        /** 百分比 0-100 默认0 */
        @Prop({type: Number, default: 0, validator: val => (val >= 0 && val <= 100)})
        public percent: number;

        /** 进度条长度 百分比或数值 默认350px */
        @Prop({type: String, default: '350px'})
        public strokeWidth: string;

        /** 进度条宽度 默认6px */
        @Prop({type: String, default: '6px'})
        public strokeHeight: string;

        /** 仅type="line"有效，进度条显示文字内置在进度条内 默认false (内显注意进度条高度不能小于12px) */
        @Prop(Boolean)
        public textInside: boolean;

        /** 是否显示进度条文字内容 默认true */
        @Prop({type: Boolean, default: true})
        public showText: boolean;

        /** 自定义进度条背景颜色 */
        @Prop({type: String, default: '#e6ebf5'})
        public backgroundColor: string;

        /** 自定义进度条激活时的背景颜色 */
        @Prop({type: [String, Array, Function], default: '#4394ff'})
        public activeColor: ActiveColor;

        // 直线图/环形图-激活位置
        protected activePathStyle: Record<string, string | number> = null;

        // 防止初始化未挂载dom-报错
        private isnInit: boolean = true;
        // 记录进度条数值
        private startPercent: number = 0;
        // 定时器id
        private timer: number;

        get progressStyle() {
            const height = parseInt(this.strokeHeight.split('px')[0]);
            return {
                width: this.strokeWidth,
                height: this.type === 'line' ?
                    (height > SnProgress.textHeight ? this.strokeHeight : `${SnProgress.textHeight}px`)
                    : this.strokeWidth,
            }
        }

        get percentInt() {
            return Math.round(this.percent || 0);
        }

        // 激活状态颜色
        get activeColorStyle() {
            if (typeof this.activeColor === 'function') {
                return this.activeColor(this.percentInt);
            } else if (typeof this.activeColor === 'string') {
                return this.activeColor;
            } else {
                return this.getLevelColor();
            }
        }

        private mounted() {
            this.isnInit = false;
            this.onResize();
            this.drawBgByType();
            this.animate(this.startPercent, this.percentInt);
        }

        private beforeDestroy() {
            window.removeEventListener('resize', this.handleResize);
        }

        // 监听resize事件
        private onResize() {
            window.addEventListener('resize', this.handleResize);
        }

        // resize
        private handleResize() {
            this.throttle(this.resizeProgress, this);
        }

        // 重置进度刻画
        private resizeProgress() {
            this.drawBgByType();
            this.drawBgActiveType(this.percentInt);
        }

        // 函数防抖-防止频繁触发验证
        private throttle(method: any, context: any) {
            window.clearTimeout(method.tId);
            method.tId = setTimeout(() => {
                method.call(context);
            }, 300);
        }

        // 画进度条背景
        private drawBgByType() {
            const canvas = this.$refs.canvasOuter as HTMLCanvasElement;
            if (!canvas.getContext) {return}
            const rect = this.$el.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            const lineWidth = parseInt(this.strokeHeight.split('px')[0]);
            const ctx = canvas.getContext('2d');
            ctx.lineWidth = lineWidth;
            ctx.lineCap = "round";
            ctx.font = "12px serif";
            ctx.strokeStyle = this.backgroundColor;
            if (this.type === 'line') {
                // 间距
                const textMargin = this.showText ? 2 : 0;
                const textW = this.showText ? ctx.measureText('100%').width : 0;
                const start_x = lineWidth / 2;
                const end_x = rect.width - textW - textMargin - start_x;
                const line_y = lineWidth > SnProgress.textHeight ? lineWidth / 2 : SnProgress.textHeight / 2;
                ctx.beginPath();
                ctx.moveTo(start_x, line_y);
                ctx.lineTo(end_x, line_y);
                ctx.stroke();
                ctx.closePath();
            } else {
                const isDashboard = this.type === 'dashboard';
                const x = rect.width / 2;
                const radius = x - lineWidth / 2;
                // 偏移缺口高度的一半，保持居中
                const y = isDashboard ? x + x * (1 - 1.4142 / 2) / 2 : x;
                const start = isDashboard ? Math.PI * 3 / 4 : 0;
                const end = isDashboard ? Math.PI / 4 : Math.PI * 2;
                ctx.beginPath();
                ctx.arc(x, y, radius, start, end);
                ctx.stroke();
                ctx.closePath();
            }
        }

        // 进度条激活状态画图
        private drawBgActiveType(percent: number) {
            percent = percent >= 100 ? 100 : (percent <= 0 ? 0 : percent);
            const canvas = this.$refs.canvasInner as HTMLCanvasElement;
            if (!canvas.getContext) {return}
            const rect = this.$el.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            const lineWidth = parseInt(this.strokeHeight.split('px')[0]);
            const ctx = canvas.getContext('2d');
            ctx.lineWidth = lineWidth;
            ctx.lineCap = "round";
            ctx.font = "12px serif";
            ctx.strokeStyle = percent > 0 ? this.activeColorStyle : this.backgroundColor;
            if (this.type === 'line') {
                // 间距
                const textMargin = this.showText ? 2 : 0;
                const text_w = this.showText ? ctx.measureText('100%').width : 0;
                const start_x = lineWidth / 2;
                let end_x = (rect.width - text_w - textMargin - start_x) * percent / 100;
                const line_y = lineWidth > SnProgress.textHeight ? lineWidth / 2 : SnProgress.textHeight / 2;
                let text_x = rect.width - text_w;
                let textAlign = "start";
                if (this.showText && this.textInside) {
                    const inner = (rect.width - start_x) * percent / 100;
                    end_x = inner;
                    if (inner >= text_w) {
                        text_x = inner;
                        textAlign = "end";
                    } else {
                        text_x = start_x;
                    }
                }
                // 因为有圆角-存在基本值，所以需判断一遍
                end_x = end_x < start_x ? start_x : end_x;
                ctx.beginPath();
                ctx.lineWidth = lineWidth;
                ctx.moveTo(start_x, line_y);
                ctx.lineTo(end_x, line_y);
                ctx.stroke();
                ctx.closePath();
                // 开始绘制变动的数字
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = this.textInside ? "#fff" : "#666";
                ctx.textBaseline = "middle";
                ctx.textAlign = textAlign as CanvasTextAlign;
                ctx.strokeText(`${percent}%`, text_x, line_y);
                ctx.stroke();
                ctx.closePath();
            } else {
                const isDashboard = this.type === 'dashboard';
                const x = rect.width / 2;
                const radius = x - lineWidth / 2;
                // 偏移缺口高度的一半，保持居中
                const y = isDashboard ? x + x * (1 - 1.4142 / 2) / 2 : x;
                const start = isDashboard ? Math.PI * 0.75 : Math.PI * 1.5;
                const end = isDashboard ? Math.PI * (0.75 + 1.5 * percent / 100) : Math.PI * (1.5 + 2 * percent / 100);
                ctx.beginPath();
                ctx.arc(x, y, radius, start, end);
                ctx.stroke();
                ctx.closePath();
                // 开始绘制变动的数字
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#666";
                ctx.textBaseline = "middle";
                const textW = ctx.measureText(`${percent}%`).width;
                ctx.strokeText(percent + '%', x - textW / 2, y);
                ctx.stroke();
                ctx.closePath();
            }
        }

        // js动画
        private animate(startVal: number, endVal: number) {
            // 先清除历史定时器
            this.clearTimerAndUpdate(endVal);
            let start = startVal;
            const dv = Math.abs(endVal - startVal) / 50;
            this.timer = window.setInterval(() => {
                if (startVal < endVal) {
                    start += dv;
                    if (start >= endVal) {
                        start = endVal;
                        this.clearTimerAndUpdate(endVal);
                    }
                } else if (startVal > endVal) {
                    start -= dv;
                    if (start <= endVal) {
                        start = endVal;
                        this.clearTimerAndUpdate(endVal);
                    }
                }
                this.drawBgActiveType(parseInt(start.toString()))
            }, dv)
        }

        // 清除定时器-且更新初始计算值
        private clearTimerAndUpdate(endVal: number) {
            if (this.timer != null) {
                window.clearInterval(this.timer);
                this.timer = null;
                this.startPercent = endVal;
            }
        }

        // 根据不同百分比得出颜色值
        private getLevelColor() {
            const colorArray: ActiveColorObject[] = this.getColorArray().sort((a: ActiveColorObject, b: ActiveColorObject) => a.percent - b.percent);
            const target = colorArray.find(item => item.percent > this.percentInt);
            if (target) {
                return target.color;
            } else {
                return colorArray[colorArray.length - 1].color;
            }
        }

        // 根据不同百分比得出颜色值
        private getColorArray() {
            const colorList = this.activeColor as any[];
            const num = 100 / colorList.length;
            return colorList.map((item: any, index: number) => {
                if (typeof item === 'string') {
                    return {
                        color: item,
                        percent: (index + 1) * num
                    } as ActiveColorObject;
                } else {
                    return item as ActiveColorObject;
                }
            });
        }

        @Watch('percent')
        private watchPercent() {
            if (this.isnInit || this.startPercent === this.percentInt) {return;}
            this.animate(this.startPercent, this.percentInt);
        }
    }
</script>
