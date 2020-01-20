import {Vue, Component, Prop} from "vue-property-decorator";
import Prev from "./Prev.vue";
import Next from "./Next.vue";
import Total from "./Total.vue";
import Pager from "./pager.vue";
import Jumper from "./Jumper.vue";
import Sizes from "./Sizes.vue";

@Component({
    name: 'SnPagination',
    components: {
        Prev,
        Next,
        Total,
        Pager,
        Jumper,
        Sizes
    }
})
export default class SnPagination extends Vue {
    /** 组件布局，子组件名用逗号分隔 */
    @Prop({type: String, default: 'sizes, prev, pager, next, jumper, total'})
    public layout: string;

    /** 大于等于 3 且小于等于 21 的奇数 */
    @Prop(Number)
    public buttonCount: number;

    /** 替代图标显示的上一页文字 */
    @Prop(String)
    public prevText: string;

    /** 替代图标显示的下一页文字 */
    @Prop(String)
    public nextText: string;

    /** 总条目数 */
    @Prop(Number)
    public total: number;

    /** 当前页数 */
    @Prop({type: Number, default: 1})
    public currentPage: number;

    /** 每页显示条目个数 */
    @Prop({type: Number, default: 10})
    public pageSize: number;

    /** 是否为分页按钮添加背景色 */
    @Prop(Boolean)
    public background: boolean;

    /** 只展示一页 */
    @Prop(Boolean)
    public singlePage: boolean;

    /** 是否禁用 */
    @Prop(Boolean)
    public disabled: boolean;

    /** 只有一页时是否隐藏 */
    @Prop(Boolean)
    public hideSinglePage: boolean;

    get internalTotal() {
        return isNaN(this.total) ? 0 : this.total;
    }

    // 每页显示条目个数
    get internalPageSize() {
        return isNaN(this.pageSize) ? 10 : this.pageSize;
    }

    // 总页数
    get pageCount() {
        return Math.ceil(this.internalTotal / this.internalPageSize);
    }

    // 页码
    get internalCurrentPage() {
        return isNaN(this.currentPage) ? 1 : this.currentPage;
    }

    private render(h: any) {
        if (!this.layout || this.hideSinglePage && (!this.pageCount || this.pageCount === 1)) {
            return null;
        }
        const {
            layout,
            buttonCount,
            prevText,
            nextText,
            background,
            disabled,
            singlePage,

            pageCount,
            internalTotal,
            internalCurrentPage,
            internalPageSize,
            handlePrev,
            handleNext,
            handleJump,
            handleSizeChange,
        } = this;
        const TEMPLATE_MAP = {
            prev: <prev prev-text={prevText}
                        background={background}
                        disabled={disabled || internalCurrentPage <= 1}
                        on-prev={handlePrev}>
            </prev>,
            next: <next next-text={nextText}
                        background={background}
                        disabled={disabled || internalCurrentPage === pageCount || pageCount === 0}
                        on-next={handleNext}>
            </next>,
            pager: <pager background={background}
                          disabled={disabled}
                          single-page={singlePage}
                          page-count={pageCount}
                          current-page={internalCurrentPage}
                          button-count={buttonCount}
                          on-jump={handleJump}>
            </pager>,
            sizes: <sizes disabled={disabled}
                          page-size={internalPageSize}
                          on-size-change={handleSizeChange}>
            </sizes>,
            jumper: <jumper disabled={disabled}
                            page-count={pageCount}
                            current-page={internalCurrentPage}
                            on-jump={handleJump}>
            </jumper>,
            total: <total total={internalTotal}>
            </total>,
        } as Record<string, any>;
        const layoutList = layout.split(',').map(item => item.trim());
        return (
            <div class={['sn-pagination', background ? 'is-background' : '']}>
                {
                    layoutList.map(key => TEMPLATE_MAP[key])
                }
            </div>
        )
    }

    // 上一页
    private handlePrev() {
        // 已是第一页
        if (this.disabled || this.internalCurrentPage <= 1) {return;}
        this.handleJump(this.internalCurrentPage - 1)
    }

    // 下一页
    private handleNext() {
        // 已是最后一页
        if (this.disabled || this.internalCurrentPage >= this.pageCount) {return;}
        this.handleJump(this.internalCurrentPage + 1)
    }

    // 跳页
    private handleJump(num: number) {
        this.$emit('page-change', num);
    }

    // 更改pageSize
    private handleSizeChange(val: number) {
        this.$emit('size-change', val);
    }
}

