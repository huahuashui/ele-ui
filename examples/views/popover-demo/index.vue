<template>
    <div class="m-popover-demo">
        <div>
            <sn-popover
                placement="bottom"
                title="标题"
                width="200"
                :close-delay="200"
                @show="show()"
                @after-enter="afterEnter()"
                @hide="hide()"
                @after-leave="afterLeave()"
                trigger="hover"
                content="hover这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                <sn-button slot="reference">hover 激活</sn-button>
            </sn-popover>

            <sn-popover
                placement="bottom"
                title="标题"
                width="200"
                trigger="click"
                @show="show()"
                @after-enter="afterEnter()"
                @hide="hide()"
                @after-leave="afterLeave()"
                :disabled="false"
                content="click这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                <sn-button slot="reference">click 激活</sn-button>
            </sn-popover>

            <sn-popover
                ref="popover"
                placement="right"
                title="标题"
                width="200"
                trigger="focus"
                content="focus这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                <sn-button slot="reference">focus 激活</sn-button>
            </sn-popover>

            <sn-popover
                placement="bottom"
                title="标题"
                width="200"
                trigger="manual"
                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                v-model="visible">
                <sn-button slot="reference" @click="visible = !visible">手动激活</sn-button>
            </sn-popover>

            
            <sn-popover
                placement="bottom"
                title="标题"
                width="400"
                trigger="click"
                :value="false"
                :offset="10"
                content="click这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                <sn-button slot="reference">click 激活 form</sn-button>
                <sn-form>
                    <sn-form-item label="基础用法">
                        <sn-input placeholder="请输入内容"
                                v-model="input">
                        </sn-input>
                    </sn-form-item>
                    <sn-form-item label="禁用状态">
                        <sn-input placeholder="请输入内容"
                                :disabled="true"
                                v-model="input">
                        </sn-input>
                    </sn-form-item>
                    <sn-form-item label="可清空">
                        <sn-input placeholder="请输入内容"
                                :clearable="true"
                                v-model="input">
                        </sn-input>
                    </sn-form-item>
                    <sn-form-item label="密码框">
                        <sn-input placeholder="请输入密码"
                                :show-password="true"
                                v-model="input">
                        </sn-input>
                    </sn-form-item>
                    <sn-form-item label="带icon的输入框">
                        <sn-input placeholder="请选择日期"
                                prefix-icon="sn-input-clear"
                                v-model="input">
                        </sn-input>
                        <sn-input class="m-top10"
                                placeholder="请输入内容"
                                v-model="input">
                            <i slot="suffix" class="sn-input__icon sn-input-clear"></i>
                        </sn-input>
                    </sn-form-item>
                    <sn-form-item label="尺寸">
                        <sn-input class="m-top10"
                                size="large"
                                placeholder="请输入内容"
                                v-model="input">
                        </sn-input>
                        <sn-input class="m-top10"
                                size="medium"
                                placeholder="请输入内容"
                                v-model="input">
                        </sn-input>
                        <sn-input class="m-top10"
                                size="small"
                                placeholder="请输入内容"
                                v-model="input">
                        </sn-input>
                        <sn-input class="m-top10"
                                size="tiny"
                                placeholder="请输入内容"
                                v-model="input">
                        </sn-input>
                        <sn-input class="m-top10"
                                size="mini"
                                placeholder="请输入内容"
                                v-model="input">
                        </sn-input>
                    </sn-form-item>
                </sn-form>
            </sn-popover>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";

    @Component({
        name: "PopoverDemo",
        components: {

        }
    })
    export default class PopoverDemo extends Vue {
        protected visible: boolean = false;
        protected input: string = '';

        private show() {
            console.log("show：显示时触发");
        }
        
        private afterEnter() {
            console.log("after-enter：显示动画播放完毕后触发");
        }

        private hide() {
            console.log("hide：隐藏时触发");
        }

        private afterLeave() {
            console.log("after-leave：隐藏动画播放完毕后触发");
        }
    }
</script>

<style lang="scss">
    .m-popover-demo {
        margin: 20px;
    }
</style>
