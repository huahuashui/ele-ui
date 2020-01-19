<template>
    <div class="sn-scroll" ref="snScrollBox">
        <div
            class="sn-scroll-wrapper"
            :class="{'y-scroll': scrollY, 'x-scroll': scrollX }"
            ref="snScroll"
            @scroll="handleScroll"
        >
            <div
                :style="{'width': contentStyle.width}"
            >
                <slot></slot>
                <div class="loadMore" v-if="isLoading || finished">{{loadedText}}</div>
            </div>
        </div>
        <div
            v-if="scrollY && rate.y < 1"
            class="sn-scroll-bar"
            :style="{width: thumbThick + 'px'}"
        >
            <div
                class="sn-scroll-thumb"
                :style="{height: thumbH + 'px', top: thumbT + 'px', 'border-radius': thumbThick/2 + 'px'}"
                @mousedown="handleMousedown(true)"
            ></div>
        </div>
        <div
            v-if="scrollX && rate.x < 1"
            class="sn-scroll-bar_x"
            :style="{height: thumbThick + 'px'}"
        >
            <div
                class="sn-scroll-thumb"
                :style="{width: thumbW + 'px', left: thumbL + 'px', 'border-radius': thumbThick/2 + 'px'}"
                @mousedown="handleMousedown(false)"
            ></div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Emit, Model} from "vue-property-decorator";
    import {on, off, getStyle} from "ele-ui/src/utils/dom";
    import {debounce, throttle} from "ele-ui/src/utils/util";

    interface Axis {
        x: number;
        y: number
    }

    @Component({
        name: 'snScroll'
    })
    export default class SnScroll extends Vue {
        // 滚动条厚度
        @Prop({type: Number, default: 8}) public thumbThick: number;
        // 触发加载的距离阀值
        @Prop({type: Number, default: 10}) public offset: number;
        // 滚动方向 true为垂直滚动, false为横向
        @Prop({type: Boolean, default: true}) public scrollY: boolean;

        @Prop({type: Boolean, default: false}) public scrollX: boolean;
        // 是否开启无限滚动
        @Prop({type: Boolean, default: false}) public openLoaded: boolean;
        // 数据是否全部加载完
        @Prop({type: Boolean, default: false}) public finished: boolean;
        // 触发scroll事件节流延时
        @Prop({type: Number, default: 200}) public scrollDelay: number;
        // 是否正在加载数据
        @Model('change', {type: Boolean, default: false}) public isLoading: boolean;

        // 滑块长度
        private thumbH: number = 0;
        // 滑块距顶端距离
        private thumbT: number = 0;

        private thumbL: number = 0;

        private thumbW: number = 0;
        // 实际滚动与滑块滚动比例
        private rate: Axis = {x: 1, y: 1};
        // 鼠标是否在移动滑块
        private isDrag: boolean;
        // 当前移动的滑块是否是Y
        private isMoveY: boolean;
        // 记录鼠标移动滑块的距离
        private move: Axis = {x: null, y: null};
        // scroll节流函数
        private throttleEmit: (scroll: Axis) => void;
        // 防抖处理
        private refresh: () => void;
        // 滚动dom
        private $scrollRef: HTMLElement;
        // 最大滚动值
        private maxScroll: Axis;
        // 监听dom变化
        private observer: any;

        private contentStyle: { width: string, height: string } = {width: null, height: null};

        get loadedText() {
            return this.finished ? '没有更多了' : '正在加载...'
        }

        public scrollTo(val: number) {
            const isNumber = typeof val === 'number'
            if (!isNumber) {
                throw new Error('The scroll method should take a parameter of type number')
            }
            this.$scrollRef.scrollTop = val
            this.handleScroll()
        }

        public scrollToBottom() {
            this.scrollTo(this.maxScroll.y)
        }

        private mounted() {
            this.setContentW()
            on(window, 'mousemove', this.handleMousemove.bind(this))
            on(window, 'mouseup', this.handleMouseup.bind(this))
            this.init();
            this.mutationObserver()
            this.throttleEmit = throttle((scroll: Axis) => {
                this.scroll(scroll)
            }, this.scrollDelay, this)
            this.refresh = debounce(() => {
                console.log('update')
                this.init()
            }, 100, this)

        }

        private updated() {
            if (!window.MutationObserver) {
                this.refresh()
            }
        }

        private setContentW() {
            const snScroll = this.$refs.snScrollBox as HTMLElement
            this.contentStyle = {
                width: getStyle(snScroll, 'width'),
                height: getStyle(snScroll, 'height')
            }
        }

        private init() {
            this.$scrollRef = this.$refs.snScroll as HTMLElement

            // 滚动容器滚动高度
            const scrollElScroll = {
                x: this.scrollY && this.scrollX ? this.$scrollRef.scrollWidth - 30 : this.$scrollRef.scrollWidth,
                y: this.scrollY && this.scrollX ? this.$scrollRef.scrollHeight - 30 : this.$scrollRef.scrollHeight
            };
            // 滚动容器实际高度
            const scrollElClient = {
                x: this.scrollY && this.scrollX ? this.$scrollRef.clientWidth - 30 : this.$scrollRef.clientWidth,
                y: this.scrollY && this.scrollX ? this.$scrollRef.clientHeight - 30 : this.$scrollRef.clientHeight
            };
            // 最大滚动值
            this.maxScroll = {
                x: scrollElScroll.x - scrollElClient.x,
                y: scrollElScroll.y - scrollElClient.y
            };

            this.rate = {
                x: scrollElClient.x / scrollElScroll.x,
                y: scrollElClient.y / scrollElScroll.y
            };
            this.thumbH = this.rate.y * scrollElClient.y
            this.thumbT = this.$scrollRef.scrollTop * this.rate.y

            this.thumbW = this.rate.x * scrollElClient.x;
            this.thumbL = this.$scrollRef.scrollLeft * this.rate.x
        }

        private mutationObserver() {
            // 只兼容ie11 以下不兼容
            if (window.MutationObserver) {
                this.observer = new MutationObserver(this.init.bind(this))
                    .observe(this.$scrollRef, {
                        attributes: true,
                        childList: true,
                        subtree: true
                    })
            }
        }

        private handleScroll() {
            const scroll = {
                x: this.$scrollRef.scrollLeft,
                y: this.$scrollRef.scrollTop
            }
            this.thumbT = scroll.y * this.rate.y
            this.thumbL = scroll.x * this.rate.x
            this.eventTrigger(scroll)
        }

        private handleMousedown(flag: boolean) {
            this.isDrag = true
            this.isMoveY = flag
        }

        private handleMouseup() {
            this.isDrag = false
            this.move = {x: null, y: null}
            this.isMoveY = true
        }

        private handleMousemove(e: any) {
            if (!this.isDrag) return
            if (this.move.y && this.isMoveY) {
                const speedY: number = e.screenY - this.move.y
                const top = this.thumbT + speedY
                this.scrollThumbY(top)
            }
            if (this.move.x && !this.isMoveY) {
                const speedX: number = e.screenX - this.move.x;
                const left = this.thumbL + speedX;
                this.scrollThumbX(left);
            }
            this.move = {
                x: e.screenX,
                y: e.screenY
            }
            e.preventDefault();
        }

        private scrollThumbY(top: number) {
            if (top < 0) {
                top = 0
            }
            if (top > (this.maxScroll.y) * this.rate.y) {
                top = (this.maxScroll.y) * this.rate.y
            }
            this.thumbT = top
            this.$scrollRef.scrollTop = top / this.rate.y
        }

        private scrollThumbX(left: number) {
            if (left < 0) left = 0
            if (left > (this.maxScroll.x) * this.rate.x) left = this.maxScroll.x * this.rate.x
            this.thumbL = left;
            this.$scrollRef.scrollLeft = left / this.rate.x
        }

        private eventTrigger(scroll: Axis) {
            this.throttleEmit && this.throttleEmit(scroll)
            if (scroll.y === 0) {
                this.reachTop()
            }
            if (scroll.y === this.maxScroll.y && this.finished) {
                this.reachBottom()
            }
            if ((scroll.y >= this.maxScroll.y - this.offset) && !this.isLoading && this.openLoaded && !this.finished) {
                this.change(true)
                this.loaded()
            }

        }

        private beforeDestroy() {
            // 解绑事件
            off(window, 'mousemove', this.handleMousemove.bind(this))
            off(window, 'mouseup', this.handleMouseup.bind(this))
            if (this.observer) {
                // 停止观测
                this.observer.disconnect()
                this.observer = null
            }
        }

        @Emit()
        private scroll(scroll: { x: number, y: number }) {}

        @Emit()
        private change(change: boolean) {}

        @Emit()
        private loaded() {}

        @Emit()
        private reachBottom() {}

        @Emit()
        private reachTop() {}
    }
</script>

