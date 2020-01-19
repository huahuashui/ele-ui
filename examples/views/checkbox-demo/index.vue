<template>
    <div class="m-checkbox-demo">
        <p>默认</p>
        <div class="top10">
            <sn-checkbox v-model="checkboxVal">111</sn-checkbox>
            
            <sn-checkbox v-model="checkboxVal">222</sn-checkbox>
            
            <sn-checkbox v-model="checkboxVal" disabled>333</sn-checkbox>
        </div>
        
        <p class="top10">选项组</p>
        <sn-checkbox-group class="top10" v-model="checkboxVal1">
            <sn-checkbox true-value="1"
                         false-value="2" prop="1">111
            </sn-checkbox>
            
            <sn-checkbox true-value="3"
                         false-value="4" prop="2">222
            </sn-checkbox>
            
            <sn-checkbox true-value="5"
                         false-value="6" prop="3">333
            </sn-checkbox>
        </sn-checkbox-group>
    
        <p class="top10">自定义-选项组</p>
        <sn-checkbox-group class="top10" v-model="checkboxVal1">
            <sn-checkbox true-value="1"
                         false-value="2"
                         prop="1" :has-icon-tags="true">
                <template slot="full">
                    <sn-button type="success">男</sn-button>
                </template>
                <template slot="none">
                    <sn-button type="danger">男</sn-button>
                </template>
            </sn-checkbox>
        
            <sn-checkbox true-value="3"
                         false-value="4" prop="2" :has-icon-tags="true">
                <template slot="full">
                    <sn-button type="success">女</sn-button>
                </template>
                <template slot="none">
                    <sn-button type="danger">女</sn-button>
                </template>
            </sn-checkbox>
        
            <sn-checkbox true-value="5"
                         false-value="6" prop="3" :has-icon-tags="true">
                <template slot="full">
                    <sn-button type="success">未知</sn-button>
                </template>
                <template slot="none">
                    <sn-button type="danger">未知</sn-button>
                </template>
            </sn-checkbox>
        </sn-checkbox-group>
        
        <p class="top10">全选</p>
        <sn-checkbox class="top10" @change="handleChangeCheckAll" v-model="checkAll" :indeterminate="indeterminate">全选</sn-checkbox>
        <sn-checkbox-group class="top10" v-model="checkCity" @change="handleChangeCity">
            <sn-checkbox v-for="item in cityOptions"
                         :key="item.prop"
                         :prop="item.prop"
                         :true-value="item.value"
                         :false-value="null">
                {{item.value}}
            </sn-checkbox>
        </sn-checkbox-group>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component({
        components: {}
    })
    export default class ComponentName extends Vue {
        protected checkboxVal: string = '1';
        protected checkboxVal1: any[] = [{
            prop: '1',
            value: '1'
        }];

        // 城市-全选相关
        protected cityOptions = [
            {
                prop: '1',
                value: '上海'
            },
            {
                prop: '2',
                value: '北京'
            },
            {
                prop: '3',
                value: '广州'
            },
            {
                prop: '4',
                value: '深圳'
            }
        ];
        protected checkCity: any[] = [];
        protected checkAll = false;
        protected indeterminate = false;

        // 全选
        protected handleChangeCheckAll() {
            this.checkCity = this.checkAll ? this.cityOptions : [];
            this.indeterminate = false;
        }

        // 全选-各项
        protected handleChangeCity() {
            const checkCity = this.checkCity.filter(item => !!item.value);
            const checkedCount = checkCity.length;
            this.checkAll = checkedCount === this.cityOptions.length;
            this.indeterminate = checkedCount > 0 && checkedCount < this.cityOptions.length;
        }

        private created() {

        };

        private mounted() {

        };
    }
</script>

<style lang="scss">
    .m-checkbox-demo {
        margin: 20px;
        
        .top10 {
            margin-top: 10px;
        }
    }
</style>
