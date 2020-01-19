<template>
    <div class="m-tooltip-demo">
        <div>
            <div class="box">
                <div class="top">
                    <sn-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                        <sn-button>上左</sn-button>
                    </sn-tooltip>
                    <sn-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top">
                        <sn-button>上边</sn-button>
                    </sn-tooltip>
                    <sn-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
                        <sn-button>上右</sn-button>
                    </sn-tooltip>
                </div>
                <div class="left">
                    <sn-tooltip class="item" effect="dark" content="Left Top 提示文字" placement="left-start">
                    <sn-button>左上</sn-button>
                    </sn-tooltip>
                    <sn-tooltip class="item" effect="dark" content="Left Center 提示文字" placement="left">
                    <sn-button>左边</sn-button>
                    </sn-tooltip>
                    <sn-tooltip class="item" effect="dark" content="Left Bottom 提示文字" placement="left-end">
                    <sn-button>左下</sn-button>
                    </sn-tooltip>
                </div>

                <div class="right">
                    <sn-tooltip class="item" effect="dark" content="Right Top 提示文字" placement="right-start">
                    <sn-button>右上</sn-button>
                    </sn-tooltip>
                    <sn-tooltip class="item" effect="dark" content="Right Center 提示文字" placement="right">
                    <sn-button>右边</sn-button>
                    </sn-tooltip>
                    <sn-tooltip class="item" effect="dark" content="Right Bottom 提示文字" placement="right-end">
                    <sn-button>右下</sn-button>
                    </sn-tooltip>
                </div>
                <div class="bottom">
                    <sn-tooltip class="item" effect="dark" content="Bottom Left 提示文字" placement="bottom-start">
                    <sn-button>下左</sn-button>
                    </sn-tooltip>
                    <sn-tooltip class="item" effect="dark" content="Bottom Center 提示文字" placement="bottom">
                    <sn-button>下边</sn-button>
                    </sn-tooltip>
                    <sn-tooltip class="item" effect="dark" content="Bottom Right 提示文字" placement="bottom-end">
                    <sn-button>下右</sn-button>
                    </sn-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";

    @Component({
        name: "TooltipDemo",
        components: {

        }
    })
    export default class TooltipDemo extends Vue {

    }
</script>

<style lang="scss">
    .m-tooltip-demo {
        margin: 20px;

        .box {
            width: 400px;

            .top {
                text-align: center;
            }

            .left {
                float: left;
                width: 60px;
            }

            .right {
                float: right;
                width: 60px;
            }

            .bottom {
                clear: both;
                text-align: center;
            }

            .item {
                margin: 4px;
            }

            .left .el-tooltip__popper,
            .right .el-tooltip__popper {
                padding: 8px 10px;
            }
        }
    }
</style>
