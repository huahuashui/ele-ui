<template>
    <sn-popover
        v-bind="$attrs"
        v-model="visible"
        trigger="click"
    >
        <div class="sn-popconfirm">
            <p class="sn-popconfirm__main">
                <i
                    v-if="!hideIcon"
                    class="sn-popconfirm__icon"
                    :class="icon"
                    :style="{color: iconColor}"
                ></i>
                {{title}}
            </p>
            <div class="sn-popconfirm__action">
                <sn-button
                    size="mini"
                    :type="cancelButtonType"
                    @click="cancel"
                >
                    {{cancelButtonText}}
                </sn-button>
                <sn-button
                    size="mini"
                    :type="confirmButtonType"
                    @click="confirm"
                >
                    {{confirmButtonText}}
                </sn-button>
            </div>
        </div>
        <slot name="reference" slot="reference"></slot>
    </sn-popover>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import SnPopover from "ele-ui/packages/popover/index";
    import SnButton from "ele-ui/packages/button/index";
    // import {t} from 'element-ui/src/locale';

    @Component({
        name: 'SnPopconfirm',
        components: {
            SnPopover,
            SnButton
        }
    })
    export default class SnPopconfirm extends Vue {
        /*  参数  说明  类型  可选值  默认值  */

        /** title    标题    String    —    — **/
        @Prop({type: String, default: ''})
        public title: string;

        /** confirmButtonText    确认按钮文字    String    —    — **/
        @Prop({type: String, default: '确认'})
        public confirmButtonText: string;

        /** cancelButtonText    取消按钮文字    String    —    — **/
        @Prop({type: String, default: '取消'})
        public cancelButtonText: string;

        /** confirmButtonType    确认按钮类型    String    —    Primary **/
        @Prop({type: String, default: 'primary'})
        public confirmButtonType: string;

        /** cancelButtonType    取消按钮类型    String    —    Text **/
        @Prop({type: String, default: 'text'})
        public cancelButtonType: string;

        /** icon    Icon    String    —     sn-icon-question **/
        @Prop({type: String, default: 'sn-icon-question'})
        public icon: string;

        /** iconColor     Icon  颜色     String     —  #f90 **/
        @Prop({type: String, default: '#f90'})
        public iconColor: string;

        /** hideIcon    是否隐藏 Icon    Boolean    —    false **/
        @Prop({type: Boolean, default: false})
        public hideIcon: boolean;

        private visible: boolean = false;

        private confirm() {
            this.visible = false;
            this.$emit('onConfirm');
        }

        private cancel() {
            this.visible = false;
            this.$emit('onCancel');
        }
    };
</script>
