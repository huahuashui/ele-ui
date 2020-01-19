<template>
    <div class="sn-autocomplete" :style="{'width': autoCompleteWidth}">
        <SnInput
            :size="size"
            :placeholder="placeholder"
            v-model="ngModel"
            @keyup="inputKeyUp"
            @keydown="inputKeydown"
            @blur="inputblur"
            @focus="inputFocus"
            :readonly="readonly"
        ></SnInput>
        <transition name="m-autocomplete-drop-fade">
            <div class="result-box"
                 ref="autocompleteResultBox"
                 @mouseover="isMouseOverAutocomplete = true"
                 @mouseleave="isMouseOverAutocomplete = false"
                 v-show="isShowDownDropBox">
                <div class="result-item"
                     @click="clickSelectAutocomplete(item)"
                     v-for="(item, index) in dataList"
                     :key='item[valueKey]'
                     :title="item[textKey]"
                     :class="{'active':activeIndex === index}"
                >{{item[textKey]}}
                </div>
            </div>
        </transition>
    </div>
</template>
<script lang="ts">
    /**
     * 自动完成组件基础组件, 不包含太多的符合业务的条件判断
     * 此组件只包含简单的输入，加载自动完成下拉框，选择, 返回选择的结果
     *
     * 一些为了满足业务的条件判断的组件请使用sn-autocomplete.component.vue
     */
    import {Vue, Component, Emit, Model, Prop, Watch} from "vue-property-decorator";
    import SnInput from "ele-ui/packages/input/index";
    import {SnUIComponentSizeEnum} from "ele-ui/src/enum/component";
    import {debounce, isEmptyString} from "ele-ui/src/utils/util";
    
    import {ISnAutocompleteBase} from "../../../types/autocomplete-base";

    @Component({
        name: "SnAutocompleteBase",
        components: {
            SnInput
        }
    })
    export default class SnAutocompleteBase extends Vue implements ISnAutocompleteBase {
        @Model('input') public readonly model: ISnAutocompleteBase['model'];
        @Prop({default: 'small'}) public size: ISnAutocompleteBase['size'];
        /**
         * 输入框水印
         */
        @Prop({default: ''}) public placeholder: ISnAutocompleteBase['placeholder'];
        /**
         * 输入框是否只读, 设置为true以后, 只做纯展示
         */
        @Prop({default: false}) public readonly: ISnAutocompleteBase['readonly'];
        /**
         * 自动完成组件初始化默认展示的数据
         * 接收的数据格式为: {
         *     [valueKey]: string;
         *     [textKey]: string;
         *     // 下面可以加其他多余的业务数据属性
         * }
         */
        @Prop({default: null}) public defaultSelect: ISnAutocompleteBase['defaultSelect'];
        /**
         * 指定下拉容器中用于展示的文字属性名, 只用于界面展示逻辑
         */
        @Prop({default: null}) public textKey: ISnAutocompleteBase['textKey'];
        /**
         * 指定下拉容器中文字对应的value, 用于判断是否是当前选中项逻辑
         */
        @Prop({default: null}) public valueKey: ISnAutocompleteBase['valueKey'];
        /**
         * 去业务层拿去下拉展示的数据, 通过cb返回, 达到异步展示的效果
         */
        @Prop({default: null}) public fetchData: ISnAutocompleteBase['fetchData'];
        /**
         * 用于在下拉展开的容器中展示的数据
         */
        protected dataList: Array<{ [key: string]: any }> = [] as Array<{ [key: string]: any }>;
        // sn-input中展示的文本信息
        protected ngModel: string = this.model;
        // 鼠标是否悬浮在autocomplete结果区域
        protected isMouseOverAutocomplete: boolean = false;
        // 是否展示自动补全数据
        protected isShowAutocompleteBox: boolean = false;
        // 自动补全数据循环索引
        protected activeIndex: number = -1;
        // 是否有权限去检索下拉列表数据
        // 为true时，搜索出来的结果才可以呼出下拉框
        // 为false时，不允许去检索和呼出下拉框
        private isAuthSearchForSelectList: boolean = false;
        /**
         * 定义防抖方法
         */
        private debounceSearchFoSelectList = debounce(this.searchFoSelectList, 300, null, false);

        protected get autoCompleteWidth(): number {
            return SnUIComponentSizeEnum[this.size];
        }

        protected get isShowDownDropBox() {
            return this.isShowAutocompleteBox && this.dataList && this.dataList.length > 0;
        }

        @Watch('model')
        protected modelChange(newVal: string, oldVal: string) {
            if (newVal !== oldVal) {
                this.ngModel = newVal;
            }
        }

        // 获取自动补全的数据
        // 会从外部回调调用
        @Watch("dataList")
        protected getAutocompleteData(data: Array<{ [key: string]: any }>) {
            // 已经不是搜索数据状态了, 则调用此数据无效, 不改变数据和不渲染出下拉框
            if (!this.isAuthSearchForSelectList) {
                return;
            }
            if (!Array.isArray(data) || !data) {
                this.dataList = [];
            }
            // 有数据, 显示下拉框
            // 没有数据, 不现实下拉框
            // 只要查询了数据, 都显示下拉框, 如果没数据, 也改变下标志
            this.isShowAutocompleteBox = true;
        }

        @Emit('input')
        protected changeOutModel(val: string) {
        }

        /**
         * 结果发生改变时触发, 返回整个选中的对象
         */
        @Emit()
        protected getSelected(item: { [key: string]: any }) {
        }

        protected mounted() {
            this.validateInit();
            this.changeSnInputShow(this.defaultSelect);
        }

        // 输入文字时触发
        protected inputKeyUp(event: any) {
            // 只读模式, 不弹出下拉框
            if (this.readonly) return;
            // 输入文本时触发检索
            // 上下按键, 直接返回
            if (event.which === 38 || event.which === 40) {
                return
            }
            // 输入回车, 会触发keydown事件, 这里不进行任何判断
            if (event.which === 13) {
                return
            }

            this.isAuthSearchForSelectList = true;
            this.debounceSearchFoSelectList();
        }

        // 点击上下或者回车键时触发
        protected inputKeydown(event: any) {
            // 只读模式, 不弹出下拉框
            if (this.readonly) return;
            if (this.isShowAutocompleteBox) {
                // todo 当直接使用此组件时, 输入一些东西立马按回车, 输入的信息会被清空, 这里还需要修改
                // 这里应该不自主清空, 如果没匹配上, 按了回车, 也啥事情都不做?
                if (event.which === 13) {
                    // 按回车, 则选中当前下标的值
                    this.enterSelectAutocomplete();
                } else if (event.which === 38 || event.which === 40) {
                    // 按向上或者向下
                    const activeIndex = event.which === 38 ? this.afterUpArrowSelectIndex() : this.afterDownArrowSelectIndex();
                    this.changeSnInputShow(this.getSelectItemByIndex(activeIndex));
                }
            }
        }

        /**
         * 失去焦点时触发
         * 当失去焦点时, 将currentSelectModel和ngModel值进行比较
         * 若相同, 则不进行任何处理
         * 若不同:
         * 1.与当前下拉列表进行判断, 如果ngModel与当前下拉列表中的值匹配, 则认为是用户选中了这个, 触发选择回调事件
         * 2.ngModel与当前下拉列表中的值不匹配, 则将ngModel的值的展示修改为与currentSelectModel一样
         */
        protected inputblur() {
            // 只读模式, 不弹出下拉框
            if (this.readonly) return;
            // 在鼠标还在面板上失去焦点, 说明是选中了下拉框中某个值, 所以此种情况不进行任何触发判断
            if (this.isMouseOverAutocomplete) {
                return;
            }
            // 失去焦点了, 不允许再去查询数据
            this.isAuthSearchForSelectList = false;
            if (this.isShowAutocompleteBox) {
                // 将下拉框关闭
                this.isShowAutocompleteBox = false;
            }
            this.updateNewSelectModel();
        }

        /**
         * 获得焦点, 调用一次查询
         */
        protected inputFocus(event: any) {
            // 只读模式, 不弹出下拉框
            if (this.readonly) return;
            this.isAuthSearchForSelectList = true;
            this.searchAutocompleteList();
        }

        /**
         * 鼠标点击选中了某一项
         */
        protected clickSelectAutocomplete(item: { [key: string]: any }) {
            this.changeSnInputShow(item);
            this.updateNewSelectModel();
            this.activeIndex = -1;
            this.isShowAutocompleteBox = false;
            this.isMouseOverAutocomplete = false;
        }

        /**
         * 输入框文字改变时, 触发外部进行搜索, 并通过回调函数返回数据
         */
        private searchAutocompleteList() {
            return typeof this.fetchData === "function" && this.fetchData(this.ngModel, (data) => {
                this.dataList = data;
            });
        }

        /**
         * 按回车选中了某一项
         * 与clickSelectAutocomplete的区别, 不需要改变输入框的值
         */
        private enterSelectAutocomplete() {
            this.updateNewSelectModel();
            this.activeIndex = -1;
            this.isShowAutocompleteBox = false;
            this.isMouseOverAutocomplete = false;
        }

        private searchFoSelectList() {
            if (this.isAuthSearchForSelectList) {
                this.searchAutocompleteList();
            }
        }

        // 向上
        private afterUpArrowSelectIndex() {
            // 已经到顶, 不做任何操作
            if (this.activeIndex <= 0) {
                return 0;
            }
            return --this.activeIndex;
        }

        // 向下
        private afterDownArrowSelectIndex() {
            // 下标已经指向数组最末尾了, 故不做处理
            if (this.dataList && this.dataList.length > 0 && this.activeIndex >= this.dataList.length - 1) {
                return this.dataList.length - 1;
            }
            return ++this.activeIndex;
        }

        private getSelectItemTextByIndex(index: number) {
            return this.dataList[index][this.textKey];
        }

        private getSelectItemByIndex(index: number) {
            return this.dataList[index];
        }

        /**
         * 按回车查找自动补全数据
         * 1.activeIndex下标不为-1
         * 2.activeIndex下标为-1
         */
        private getSelectAutocompleteResultByIndex(activeIndex: number) {
            let result = null;
            const datas = this.dataList || [] as Array<{ [key: string]: any }>;
            if (activeIndex >= 0 && datas.length > 0 && activeIndex < datas.length) {
                result = datas[activeIndex];
            }
            return result;
        }

        /**
         * 根据文字信息匹配下拉框中的结果
         * @return 返回匹配中的对象
         * @default null 没结果默认返回null
         */
        private getSelectAutocompleteResultByText(text: string) {
            if (isEmptyString(text)) return null;
            const data = this.dataList || [] as Array<{ [key: string]: any }>;
            const result = data.find((model, index) => {
                return this.getSelectItemTextByIndex(index) === text;
            });
            return result;
        }

        /**
         * 验证一下初始化参数, 在console中给出提示
         */
        private validateInit() {
            if (!this.textKey || !this.valueKey) {
                console.log("sn-autocomplete init error: textKey or valueKey is null");
            }
        }

        /**
         * 修改组件输入框文字
         */
        private changeSnInputShow(item: { [key: string]: any }) {
            this.ngModel = item && item[this.textKey];
        }

        /**
         * 更新与外部数据一一对应的缓存和触发外部选中回调
         * @param item
         */
        private updateNewSelectModel() {
            this.changeOutModel(this.ngModel);
            // 这里必须加setTimeout, 不然在getSelected修改ngModel的值, 当前this.ngModel不会联动修改
            // setTimeout(() => {
                this.getSelected(this.getSelectAutocompleteResultByText(this.ngModel));
            // });

        }
    }
</script>

