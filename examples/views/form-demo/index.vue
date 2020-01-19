<template>
    <div class="m-form-demo">
        <p>典型表单</p>
        <sn-form class="margin-t10" label-width="80px">
            <sn-form-item label="用户" prop="username">
                <sn-input></sn-input>
            </sn-form-item>
            
            <sn-form-item label="密码" prop="password">
                <sn-input></sn-input>
            </sn-form-item>
            
            <sn-form-item>
                <sn-button type="primary">确认</sn-button>
                <sn-button>取消</sn-button>
            </sn-form-item>
        </sn-form>
        
        <p class="margin-t20">行内表单</p>
        <sn-form class="margin-t10" :inline="true">
            <sn-form-item label="用户" prop="username">
                <sn-input></sn-input>
            </sn-form-item>
            
            <sn-form-item label="密码" prop="password">
                <sn-input></sn-input>
            </sn-form-item>
            
            <sn-form-item>
                <sn-button type="primary">确认</sn-button>
                <sn-button>取消</sn-button>
            </sn-form-item>
        </sn-form>
        
        <p class="margin-t20">对齐方式+表单内组件尺寸控制</p>
        <sn-radio-group class="margin-t10" v-model="labelPosition">
            <sn-radio value="left">左对齐</sn-radio>
            <sn-radio value="right">右对齐</sn-radio>
            <sn-radio value="top">顶部对齐</sn-radio>
        </sn-radio-group>
        <sn-radio-group class="margin-t10" v-model="size">
            <sn-radio value="large">large</sn-radio>
            <sn-radio value="medium">medium</sn-radio>
            <sn-radio value="small">small</sn-radio>
            <sn-radio value="tiny">tiny</sn-radio>
            <sn-radio value="mini">mini</sn-radio>
        </sn-radio-group>
        
        <sn-form class="margin-t10"
                 label-width="80px"
                 :label-position="labelPosition"
                 :size="size">
            <sn-form-item label="用户">
                <sn-input></sn-input>
            </sn-form-item>
            
            <sn-form-item label="密码">
                <sn-input></sn-input>
            </sn-form-item>
            
            <sn-form-item>
                <sn-button type="primary">确认</sn-button>
                <sn-button>取消</sn-button>
            </sn-form-item>
        </sn-form>
        
        <p class="margin-t20">表单验证</p>
        <sn-form class="margin-t10"
                 ref="formRefs"
                 label-width="130px"
                 :status-icon="true"
        
                 :required="true"
                 :show-message="true"
                 :inline-message="false"
        
                 :model="formModel"
                 :rules="formRules"
                 @change="validateChange">
            
            <sn-form-item label="用户" prop="username">
                <sn-input v-model="formModel.username"></sn-input>
            </sn-form-item>
            
            <sn-form-item label="自定义验证密码" prop="password">
                <sn-input v-model="formModel.password"></sn-input>
            </sn-form-item>
            
            <sn-form-item label="自定义验证重复密码" prop="rePassword">
                <sn-input v-model="formModel.rePassword"></sn-input>
            </sn-form-item>
            
            <sn-form-item label="自定义异步验证此项" prop="something">
                <sn-input v-model="formModel.something"></sn-input>
            </sn-form-item>
            
            <sn-form-item>
                <sn-button type="primary" :disabled="!formValid">确认</sn-button>
                <sn-button>取消</sn-button>
            </sn-form-item>
        </sn-form>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {ISnForm} from "../../../types/form";

    @Component
    export default class FormDemo extends Vue {
        protected formModel = {
            username: 1,
            password: 2,
            something: null
        };

        protected formRules = {
            'username': [
                {required: true, type: 'string', message: '请输入用户名'},
                {min: 3, max: 10, message: '用户名长度为3-10'}
            ],
            'password': [{
                validator: (rule: any, value: string, callback: Function) => {
                    console.log('password');
                    if (value === '') {
                        callback('请输入密码');
                    } else {
                        // 回调中不携带数据，表示验证通过
                        callback();
                        (this.$refs.formRefs as ISnForm).validateFields('rePassword')
                    }
                }
            }],
            'rePassword': [{
                validator: (rule: any, value: string, callback: Function) => {
                    console.log('rePassword');
                    if (value === '') {
                        callback('请再次输入密码');
                    } else if (value != this.formModel.password) {
                        callback('两次输入密码不一致');
                    } else {
                        callback();
                    }
                }
            }],
            something: [
                {
                    validator: (rule: any, value: string, callback: Function) => {
                        console.log('异步验证');
                        if (value === '') {
                            callback('请输入内容');
                        } else {

                            // 可异步验证 - 验证结果异步处理完成才返回
                            setTimeout(() => {
                                callback();
                            }, 2000);
                        }
                    }
                }
            ]
        };

        protected labelPosition: string = 'right';
        protected size: string = 'small';
        protected formValid: boolean = false;

        protected validateChange(val: boolean) {
            console.log('formValid', val);
            this.formValid = val;
        }
    }
</script>

<style lang="scss">
    .m-form-demo {
        width: 600px;
        margin: 20px;
        
        .margin-t20 {
            margin-top: 20px;
        }
        
        .margin-t10 {
            margin-top: 10px;
        }
        
        .sn-input {
            width: 200px;
        }
    }
</style>
