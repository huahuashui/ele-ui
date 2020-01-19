import {createVue, createVueByClass, destroyVM, timeoutPromise} from "../util";
import {Component} from "vue-property-decorator";
import Vue from "vue";
import TestUnitTs from "../vue-ts-block/test-ts-unit/test-unit-ts";
import SnAutocompleteBase from "../../../packages/autocomplete-base/index";

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

describe.skip('test-ts-vue', ()=> {
    let vm;
    afterEach(()=>{
        console.log("用例执行完成");
        destroyVM(vm);
    });
    it('test-import-vue', done => {
        vm = createVueByClass(TestUnitTs, true);

        let elm = vm.$el;
        let inputEle = elm.querySelector("input");
        // 测试placeholder
        expect(inputEle && inputEle.getAttribute("placeholder")).to.equal("请输入账号/姓名");
        console.debug("inputEle", inputEle);
        const resultbox = vm.$refs.autocomplete.$refs.autocompleteResultBox;
        inputEle.focus();

        test();
        async function test(){
            await timeoutPromise(() => {
                expect(resultbox.style.display).to.not.equal('none');
                expect(resultbox.querySelectorAll(".result-item").length).to.be.equal(AUTOCOMPLETE_DATAS.length);
                inputEle.blur();
            }, 1000);
            await timeoutPromise(() => {
                console.log("resultbox.style.display", resultbox.style.display);
                expect(resultbox.style.display).to.equal('none');
                done();
            }, 2000);
        }
    });

    it('test1', done => {
        @Component({
            template: `
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
            `,
            components: { SnAutocompleteBase }
        })
        class TestVue extends Vue {
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

        vm = createVueByClass(TestVue, true);

        let elm = vm.$el;
        let inputEle = elm.querySelector("input");
        // 测试placeholder
        expect(inputEle && inputEle.getAttribute("placeholder")).to.equal("请输入账号/姓名");
        console.debug("inputEle", inputEle);
        const resultbox = vm.$refs.autocomplete.$refs.autocompleteResultBox;
        inputEle.focus();

        test();
        async function test(){
            await timeoutPromise(() => {
                expect(resultbox.style.display).to.not.equal('none');
                expect(resultbox.querySelectorAll(".result-item").length).to.be.equal(AUTOCOMPLETE_DATAS.length);
                inputEle.blur();
            }, 1000);
            await timeoutPromise(() => {
                console.log("resultbox.style.display", resultbox.style.display);
                expect(resultbox.style.display).to.equal('none');
                done();
            }, 2000);
        }
    });

});
