<template>
    <div class="m-radio-demo">
        <p>默认</p>
        <div class="top10">
            <sn-radio value="1" v-model="radioVal">男</sn-radio>
            <sn-radio value="2" v-model="radioVal">女</sn-radio>
            <sn-radio value="3" v-model="radioVal">未知</sn-radio>
        </div>
        
        <p class="top10">自定义内容-文字</p>
        <div class="top10">
            <sn-radio :has-icon-tags="true" value="1" v-model="radioVal">男</sn-radio>
            <sn-radio :has-icon-tags="true" value="2" v-model="radioVal">女</sn-radio>
            <sn-radio :has-icon-tags="true" value="3" v-model="radioVal">未知</sn-radio>
        </div>
        
        <p class="top10">自定义内容-按钮</p>
        <div class="top10">
            <sn-radio :has-icon-tags="true" value="1" v-model="radioVal">
                <template slot="full">
                    <sn-button type="success">男</sn-button>
                </template>
                <template slot="none">
                    <sn-button type="danger">男</sn-button>
                </template>
            </sn-radio>
            
            <sn-radio :has-icon-tags="true" value="2" v-model="radioVal">
                <template slot="full">
                    <sn-button type="success">女</sn-button>
                </template>
                <template slot="none">
                    <sn-button type="danger">女</sn-button>
                </template>
            </sn-radio>
            
            <sn-radio :has-icon-tags="true" value="3" v-model="radioVal">
                <template slot="full">
                    <sn-button type="success">未知</sn-button>
                </template>
                <template slot="none">
                    <sn-button type="danger">未知</sn-button>
                </template>
            </sn-radio>
        </div>
        
        <p class="top10">自定义内容-文字按钮</p>
        <div class="top10">
            <sn-radio :has-icon-tags="true" value="1" v-model="radioVal">
                <template slot="full">
                    <sn-button type="text">男</sn-button>
                </template>
                <template slot="none">
                    <sn-button type="text" style="color:#333;">男</sn-button>
                </template>
            </sn-radio>
            
            <sn-radio :has-icon-tags="true" value="2" v-model="radioVal">
                <template slot="full">
                    <sn-button type="text">女</sn-button>
                </template>
                <template slot="none">
                    <sn-button type="text" style="color:#333;">女</sn-button>
                </template>
            </sn-radio>
            
            <sn-radio :has-icon-tags="true" value="3" v-model="radioVal">
                <template slot="full">
                    <sn-button type="text">未知</sn-button>
                </template>
                <template slot="none">
                    <sn-button type="text" style="color:#333;">未知</sn-button>
                </template>
            </sn-radio>
        </div>
        
        <p class="top10">选项组</p>
        <div class="top10">
            <sn-button @click="radioVal1='3'">选中第三项</sn-button>
            <sn-radio-group v-model="radioVal1" class="top10">
                <sn-radio value="1">1</sn-radio>
                <sn-radio value="2">2</sn-radio>
                <sn-radio value="3">3</sn-radio>
            </sn-radio-group>
        </div>
        
        <p class="top10">禁止状态</p>
        <div class="top10">
            <sn-radio-group v-model="radioVal1" disabled>
                <sn-radio value="1">111</sn-radio>
                <sn-radio value="2">222</sn-radio>
                <sn-radio value="3">333</sn-radio>
            </sn-radio-group>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component({
        name: "RadioDemo",
        components: {}
    })
    export default class RadioDemo extends Vue {
        protected radioVal: string = "1";

        protected radioVal1: string = "1";

        private created() {

        };

        private mounted() {

        };

        private updated() {
            console.log('radioVal', this.radioVal, this.radioVal1)
        }
    }
</script>

<style lang="scss">
    .m-radio-demo {
        margin: 20px;
        
        .top10 {
            margin-top: 10px;
        }
    }
</style>
