# 自动完成组件
## 最基本的组件
:::demo 最基本的组件 使用autocomplete-base

```html
<template>
    <div class="m-sn-component">
        <div class="m-top10">
            <h1 style="font-size: 18px; text-align: center;">sn-auto-complete基础组件</h1>
            <p><SnCheckbox v-model="baseComponentParams.readonly">是否只读</SnCheckbox></p>
            <div>
                <sn-autocomplete-base
                    v-model="baseSelectedVModel"
                    :placeholder = "baseComponentParams.placeholder"
                    :readonly = "baseComponentParams.readonly"
                    :text-key = "baseComponentParams.textKey"
                    :value-key = "baseComponentParams.valueKey"
                    :fetch-data = "baseComponentParams.fetchData"
                    @get-selected = "baseComponentParams.getSelected"
                >
                </sn-autocomplete-base>
            </div>
            <p>选中的人员名为: {{baseSelectedName}}</p>
            <button @click="triggerClick()">主动获取</button>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Emit} from "vue-property-decorator";
    import SnAutocompleteBase from "../../../packages/autocomplete/src/autocomplete-base.vue";
    import SnAutocomplete from "../../../packages/autocomplete";
    import SnButton from "../../../packages/button";
    import SnCheckbox from "../../../packages/checkbox";

    interface Person {
        ID: string | number;
        Name: string;
    }

    @Component({
        components: {
            SnAutocomplete,
            SnAutocompleteBase,
            SnCheckbox,
            SnButton
        }
    })
    export default class Controller extends Vue {
        public baseComponentParams: any = null;
        protected baseSelectedName: string = null;
        protected baseSelectedVModel: string = null;
        private mockDatas = [{
            ID: 1,
            Name: '张三'
        },{
            ID: 2,
            Name: '李四'
        },{
            ID: 3,
            Name: '王五'
        },{
            ID: 4,
            Name: '赵六'
        },{
            ID: 5,
            Name: '吴七'
        },{
            ID: 6,
            Name: '邓八'
        },{
            ID: 7,
            Name: '彭九'
        },{
            ID: 8,
            Name: "谭十"
        }]/* as Person[]*/;
        private selectedUserName: string = null;

        protected created() {
            this.initAutoCompleteBase();
        }

        protected clear() {
            this.getAutoCompleteComponent().clear();
        }
        protected triggerClick(){
            console.debug("主动失去焦点按钮: 当前选中的结果为", this.baseSelectedVModel, this.baseSelectedName);
        }

        private initAutoCompleteBase() {
            this.baseComponentParams = {}/* as SnAutocompleteParams<Person>*/;
            this.baseComponentParams.valueKey = "ID";
            this.baseComponentParams.textKey = "Name";
            this.$set(this.baseComponentParams, "placeholder", "请输入帐号/姓名");
            this.$set(this.baseComponentParams, "autocompleteData", []);
            this.baseComponentParams.fetchData = (msg, cb)=> {
                console.debug("biz 自动完成基础组件: 检索", msg);
                this.searchUser(msg).then((data)=> {
                    cb(data);
                });
            };
            this.baseComponentParams.getSelected = (user)=> {
                console.debug("biz 自动完成基础组件: 获取选中的结果", user);
                this.baseSelectedName = user && user.Name;
            };
        }

        private searchUser(msg: string): Promise<Person[]> {
            console.debug("searchUser", msg);
            return new Promise((resolve)=> {
                if(msg == null || msg  === '') {
                    resolve(this.mockDatas.concat([]));
                } else {
                    resolve(this.mockDatas.filter((m1)=> {
                        return m1.Name.indexOf(msg) !== -1;
                    }).concat([]));
                }
            });
        }
    }
</script>
<style scoped>
/*组件展示*/
.m-sn-component{
    margin: 12px;
}
</style>
```

:::

## 包含是否允许为空逻辑的组件
:::demo 带是否允许为空业务逻辑的组件, 通过allowNull来控制, 使用autocomplate组件

```html
<template>
    <div class="m-sn-component">

        <!--sn-autocomplete-->
        <div class="m-top10">
            <h1 style="font-size: 18px; text-align: center;">sn-auto-complete高阶组件</h1>
            <p>例子: 查询人员</p>
            <p><SnCheckbox v-model="componentParams.readonly">是否只读</SnCheckbox></p>
            <p><SnCheckbox v-model="componentParams.allowNull">是否允许为空</SnCheckbox></p>
            <div>
                <sn-autocomplete
                    v-model="currentSelectModel"
                    ref="autoCompleteComponent"
                    :placeholder = "componentParams.placeholder"
                    :readonly = "componentParams.readonly"
                    :text-key = "componentParams.textKey"
                    :value-key = "componentParams.valueKey"
                    :fetch-data = "componentParams.fetchData"
                    @get-selected = "componentParams.getSelected"
                    :allow-null = "componentParams.allowNull"
                    :default-select="defaultSelect"
                ></sn-autocomplete>
            </div>
            <!-- <p>数组长度: {{getAutoCompleteData.length}}</p> -->
            <p>选中的人员为: {{selectedUserName}}</p>
            <sn-button @click="clear">主动清空数据</sn-button>
            <sn-button @click="triggerClick">主动获取数据</sn-button>
        </div>

    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Emit} from "vue-property-decorator";
    import SnAutocomplete from "../../../packages/autocomplete";
    import SnButton from "../../../packages/button";
    import SnCheckbox from "../../../packages/checkbox";

    interface Person {
        ID: string | number;
        Name: string;
    }

    @Component({
        components: {
            SnAutocomplete,
            SnCheckbox,
            SnButton
        }
    })
    export default class Controller extends Vue {
        public componentParams: any = null;
        protected currentSelectModel: string = null;
        protected defaultSelect = {
            ID: "1",
            Name: "zzy"
        }/* as Person*/;
        private mockDatas = [{
            ID: 1,
            Name: '张三'
        },{
            ID: 2,
            Name: '李四'
        },{
            ID: 3,
            Name: '王五'
        },{
            ID: 4,
            Name: '赵六'
        },{
            ID: 5,
            Name: '吴七'
        },{
            ID: 6,
            Name: '邓八'
        },{
            ID: 7,
            Name: '彭九'
        },{
            ID: 8,
            Name: "谭十"
        }]/* as Person[]*/;
        private selectedUserName: string = null;

        protected created() {
            this.initAutoComplete();
        }

        protected clear() {
            this.getAutoCompleteComponent().clear();
        }
        protected triggerClick(){
            console.debug("主动获取数据", this.currentSelectModel, this.selectedUserName);
        }


        private getAutoCompleteComponent(): any {
            return this.$refs.autoCompleteComponent/* as any*/;
        }

        private initAutoComplete() {
            this.componentParams = {} as any;
            this.componentParams.valueKey = "ID";
            this.componentParams.textKey = "Name";
            this.$set(this.componentParams, "readonly", false);
            this.$set(this.componentParams, "placeholder", "请输入帐号/姓名");
            this.$set(this.componentParams, "allowNull", true);
            this.$set(this.componentParams, "autocompleteData", []);
            this.componentParams.fetchData = (msg, cb)=> {
                console.debug("biz 层准备检索", msg);
                this.searchUser(msg).then((datas)=> {
                    cb(datas);
                });
            };
            this.componentParams.getSelected = (user)=> {
                console.debug("biz 选中了", user);
                this.selectedUserName = user && user.Name;
            };
        }

        private searchUser(msg: string): Promise<Person[]> {
            console.debug("searchUser", msg);
            return new Promise((resolve)=> {
                if(msg == null || msg  === '') {
                    resolve(this.mockDatas.concat([]));
                } else {
                    resolve(this.mockDatas.filter((m1)=> {
                        return m1.Name.indexOf(msg) !== -1;
                    }).concat([]));
                }
            });
        }
        
    }
</script>
<style scoped>
/*组件展示*/
.m-sn-component{
    margin: 12px;
}
</style>
```

:::
