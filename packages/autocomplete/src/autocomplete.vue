<template>
    <sn-autocomplete-base
        ref="autocompleteBase"
        v-bind="$attrs"
        v-on="$listeners"
        v-model="ngModel"
        :text-key="textKey"
        :value-key="valueKey"
        :default-select="defaultSelect"
        :fetch-data="localFetchData"
    ></sn-autocomplete-base>
</template>
<script lang="ts">
    import {Vue, Component, Prop, Model, Watch, Emit} from "vue-property-decorator";
    import SnInput from "ele-ui/packages/input/index";
    import SnAutocompleteBase from "ele-ui/packages/autocomplete-base/index";
    import {isEmptyString} from "ele-ui/src/utils/util";

    import {ISnAutocomplete} from "../../../types/autocomplete";

    @Component({
        name: "SnAutocomplete",
        components: {
            SnAutocompleteBase,
            SnInput
        }
    })
    export default class SnAutocomplete extends Vue implements ISnAutocomplete {
        @Model('change') public readonly model: string;
        /**
         * 是否允许输入框中的值为空,
         * 设置为true以后, 当输入框中的值为空时, 返回触发getAutocompleteSelect, 返回一个null
         */
        @Prop({default: false}) public allowNull: ISnAutocomplete['allowNull'];
        /**
         * 自动完成组件初始化默认展示的数据
         * 接收的数据格式为: {
         *     [valueKey]: string;
         *     [textKey]: string;
         *     // 这个对象里面可以加其他多余的业务数据属性, 当前组件不会修改
         * }
         */
        @Prop({default: null}) public defaultSelect: ISnAutocomplete['defaultSelect'];
        /**
         * 指定下拉容器中文字对应的value, 用于判断是否是当前选中项逻辑
         */
        @Prop({default: null}) public valueKey: ISnAutocomplete['valueKey'];
        /**
         * 指定下拉容器中用于展示的文字属性名, 只用于界面展示逻辑
         */
        @Prop({default: null}) public textKey: ISnAutocomplete['textKey'];
        /**
         * 去业务层拿去下拉展示的数据, 通过cb返回, 达到异步展示的效果
         */
        @Prop({default: null}) public fetchData: ISnAutocomplete['fetchData'];
        // sn-input中展示的文本信息
        protected ngModel: string = null;
        /**
         * 用于在下拉展开的容器中展示的数据
         */
        private dataList: Array<{ [key: string]: any }> = [] as Array<{ [key: string]: any }>;
        // 当前选中的缓存
        private cacheLastSelected: { [key: string]: any } = null;

        /**
         * 清空内部的缓存数据
         */
        public clear() {
            // 清空缓存
            this.cacheLastSelected = null;
            // 清空输入框的值
            this.ngModel = null;
        }

        @Watch('model')
        protected modelChange(newVal: string, oldVal: string) {
            if (newVal !== oldVal) {
                this.ngModel = newVal;
            }
        }

        /**
         * 监听ngModel内部改动, 若当前watch触发是由sn-autocomplete-base中的input改变来触发的, 则改变外部双向绑定model的值
         * 若当前改动是外部双向绑定model进行修改触发的, 则不进行任何逻辑操作
         */
        @Watch('ngModel')
        protected ngModelChange(newVal: string, oldVal: string) {
            if (newVal !== oldVal && newVal !== this.model) {
                this.changeOutModel(newVal);
            }
        }

        /**
         * 只有在进行选中或者失去焦点的事件流程中, 才改变外部双向绑定的值.
         */
        @Emit('change')
        protected changeOutModel(val: string) {}

        protected created() {
            this.$listeners['get-selected'] = this.wrapGetAutocompleteSelect(this.$listeners['get-selected'] as (item: { [key: string]: any }) => void);
        }

        protected mounted() {
            this.cacheLastSelected = this.defaultSelect;
            this.ngModel = this.cacheLastSelected && this.cacheLastSelected[this.textKey];
            this.validateInit();
        }

        protected localFetchData(msg: string, cb: (data: Array<{ [key: string]: any }>) => void) {
            if (typeof this.fetchData === "function") {
                // 拦截数据, 做一些缓存数据处理
                this.fetchData(msg, (data: Array<{ [key: string]: any }>) => {
                    this.dataList = data;
                    cb(data);
                });
            }
        }

        private wrapGetAutocompleteSelect(func: (item: { [key: string]: any }) => void) {
            return (item: { [key: string]: any }) => {
                // 1.allowNull为false的情况下, item为空, 则默认设置成cacheLastSelected中的值, 且不触发回调事件
                // 2.如果cacheLastSelected也为空, 则将ngModel的值置空, 且不触发回调事件
                if (!this.allowNull && item == null) {
                    // 在回调函数里同步修改autocomplete-base里不会有变化, 所以这里增加setTimeout
                    setTimeout(() => {
                        this.ngModel = this.cacheLastSelected && this.cacheLastSelected[this.textKey];
                    });
                    return;
                }
                // 1.allowNull为true, item为空, 但是ngModel不为空, 则用之前的来填充, 不回调
                // 假如ngModel为空, 则设置cacheLastSelected为空, 且回调
                if (this.allowNull && item == null && !isEmptyString(this.ngModel)) {
                    // 在回调函数里同步修改autocomplete-base里不会有变化, 所以这里增加setTimeout
                    setTimeout(() => {
                        this.ngModel = this.cacheLastSelected && this.cacheLastSelected[this.textKey];
                    });
                    return;
                }

                if (this.cacheLastSelected !== item) {
                    this.cacheLastSelected = item;
                    func(item);
                }
            }
        }

        /**
         * 验证一下初始化参数, 在console中给出提示
         */
        private validateInit() {
            if (!this.textKey || !this.valueKey) {
                console.log("sn-autocomplete init error: autocompleteText or autocompleteValue is null");
            }
        }

    }
</script>

