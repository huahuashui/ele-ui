<template>
    <div>
        <sn-autocomplete-base
            ref="autocomplete"
            v-model="baseSelectedVModel"
            placeholder = "请输入账号/姓名"
            text-key = "Name"
            value-key = "ID"
            :fetch-data = "fetchData"
        ></sn-autocomplete-base>
    </div>
</template>
<script lang="ts">
    import SnAutocompleteBase from "../../../../packages/autocomplete/src/autocomplete-base.vue";
    import {Component} from "vue-property-decorator";
    import Vue from "vue";

    const AUTOCOMPLETE_DATAS = [{
        ID: 1,
        Name: '张三'
    }, {
        ID: 2,
        Name: '李四'
    }, {
        ID: 3,
        Name: '王五'
    }, {
        ID: 4,
        Name: '赵六'
    }, {
        ID: 5,
        Name: '吴七'
    }, {
        ID: 6,
        Name: '邓八'
    }, {
        ID: 7,
        Name: '彭九'
    }, {
        ID: 8,
        Name: "谭十"
    }];

    @Component({
        components: { SnAutocompleteBase }
    })
    export default class TestUnitTs extends Vue {
        private baseSelectedVModel: string = null;
        private baseComponentParams: string = null;
        private autocompleteData: any[] = [];
        private mockDatas = ([] as any[]).concat(AUTOCOMPLETE_DATAS);
        protected fetchData(msg, cb) {
            console.log("biz 自动完成基础组件: 检索", msg);
            this.searchUser(msg).then((data) => {
                cb(data);
            });
        }
        protected searchUser(msg) {
            console.debug("searchUser", msg);
            return new Promise((resolve) => {
                if (msg == null || msg === '') {
                    resolve(this.mockDatas.concat([]));
                } else {
                    resolve(this.mockDatas.filter((m1) => {
                        return m1.Name.indexOf(msg) !== -1;
                    }).concat([]));
                }
            });
        }
    }
</script>
