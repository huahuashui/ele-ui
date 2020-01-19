/**
 * describe('hooks', function() {
 *
 *
  下面是钩子函数
  before(function() {
    // 在本区块的所有测试用例之前执行
  });

  after(function() {
    // 在本区块的所有测试用例之后执行
  });

  beforeEach(function() {
    // 在本区块的每个测试用例之前执行
  });

  afterEach(function() {
    // 在本区块的每个测试用例之后执行
  });

  // test cases
});
 */
import {
    createVue,
    destroyVM, timeoutPromise, triggerClick,
    triggerEvent,
} from "../util";

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

describe('Autocomplete', () => {
    let vm;
    // 在本区块的每个测试用例之后执行
    afterEach(() => {
        console.log("单个用例执行完成");
        destroyVM(vm);
    });
    it('create-base', done => {
        vm = createVue({
            template: `
                <sn-autocomplete-base
                    ref="autocomplete"
                    v-model="baseSelectedVModel"
                    placeholder = "请输入账号/姓名"
                    text-key = "Name"
                    value-key = "ID"
                    :fetch-data = "fetchData"
                ></sn-autocomplete-base>
            `,
            data() {
                return {
                    baseSelectedVModel: null,
                    baseComponentParams: null,
                    autocompleteData: [],
                    mockDatas: [].concat(AUTOCOMPLETE_DATAS)
                }
            },
            methods: {
                fetchData(msg, cb) {
                    console.log("biz 自动完成基础组件: 检索", msg);
                    this.searchUser(msg).then((data) => {
                        cb(data);
                    });
                },
                searchUser(msg) {
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
        }, true);

        // vm.$nextTick(() => {
        let elm = vm.$el;
        let inputEle = elm.querySelector("input");
        // 测试placeholder
        expect(inputEle && inputEle.getAttribute("placeholder")).to.equal("请输入账号/姓名");
        console.debug("inputEle", inputEle);
        const resultbox = vm.$refs.autocomplete.$refs.autocompleteResultBox;
        inputEle.focus();
        test();

        async function test() {
            await timeoutPromise(() => {
                expect(resultbox.style.display).to.not.equal('none');
                expect(resultbox.querySelectorAll(".result-item").length).to.be.equal(AUTOCOMPLETE_DATAS.length);
                inputEle.blur();
            }, 1000);
            await timeoutPromise(() => {
                console.log("resultbox.style.display", resultbox.style.display);
                expect(resultbox.style.display).to.equal('none');
                done();
            }, 500);
        }
    });

    it('select-base', done => {
        vm = createVue({
            template: `
                <sn-autocomplete-base
                    ref="autocomplete"
                    v-model="baseSelectedVModel"                    
                    placeholder = "请输入账号/姓名"
                    text-key = "Name"
                    value-key = "ID"
                    :fetch-data = "fetchData"
                    @get-selected="getSelectedUser"
                ></sn-autocomplete-base>
            `,
            data() {
                return {
                    baseSelectedVModel: null,
                    baseComponentParams: null,
                    autocompleteData: [],
                    selectedUser: null,
                    mockDatas: [].concat(AUTOCOMPLETE_DATAS)
                }
            },
            methods: {
                fetchData(msg, cb) {
                    this.searchUser(msg).then((data) => {
                        cb(data);
                    });
                },
                searchUser(msg) {
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
                },
                getSelectedUser(user) {
                    console.debug("选中用户", user);
                    this.selectedUser = user;
                }
            }
        }, true);

        vm.$nextTick(() => {
            let elm = vm.$el;
            let inputEle = elm.querySelector("input");
            const autocompleteRef = vm.$refs.autocomplete;
            inputEle.focus();
            test();

            async function test() {
                const spy = sinon.spy();
                await timeoutPromise(() => {
                    // 选中一项
                    const item = autocompleteRef.$el.querySelectorAll(".result-item")[0];
                    autocompleteRef.$on('get-selected', spy);
                    console.debug("获取准备选中的item", item);
                    item.click();
                }, 500);
                await timeoutPromise(() => {
                    console.debug("spy.withArgs()", spy.withArgs());
                    expect(spy.withArgs().callCount).to.be.equal(1);
                    expect(vm.baseSelectedVModel).to.be.equal('张三');
                    console.debug("vm.selectedUser.Name", vm.selectedUser && vm.selectedUser.Name);
                    expect(vm.selectedUser && vm.selectedUser.Name).to.be.equal('张三');
                    done();
                }, 500);
            }
        });
    });
    it('测试随便输入一个值然后失去焦点', done => {
        vm = createVue({
            template: `
                <sn-autocomplete-base
                    ref="autocomplete"
                    v-model="baseSelectedVModel"                    
                    placeholder = "请输入账号/姓名"
                    text-key = "Name"
                    value-key = "ID"
                    :fetch-data = "fetchData"
                    @get-selected="getSelectedUser"
                ></sn-autocomplete-base>
            `,
            data() {
                return {
                    baseSelectedVModel: null,
                    baseComponentParams: null,
                    autocompleteData: [],
                    selectedUser: null,
                    mockDatas: [].concat(AUTOCOMPLETE_DATAS)
                }
            },
            methods: {
                fetchData(msg, cb) {
                    this.searchUser(msg).then((data) => {
                        cb(data);
                    });
                },
                searchUser(msg) {
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
                },
                getSelectedUser(user) {
                    this.selectedUser = user;
                }
            }
        }, true);

        vm.$nextTick(() => {
            let elm = vm.$el;
            let inputEle = elm.querySelector("input");
            const autocompleteRef = vm.$refs.autocomplete;
            inputEle.focus();
            test();

            async function test() {
                await timeoutPromise(() => {
                    // 选中一项
                    const item = autocompleteRef.$el.querySelectorAll(".result-item")[0];
                    item.click();
                }, 500);
                await timeoutPromise(() => {
                    expect(vm.baseSelectedVModel).to.be.equal('张三');
                    expect(vm.selectedUser && vm.selectedUser.Name).to.be.equal('张三');
                }, 0);
                await timeoutPromise(()=>{
                    inputEle.value = '李';
                    triggerEvent(inputEle, 'input'); // 更新input的v-model
                    triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
                    inputEle.blur();
                }, 0);
                await timeoutPromise( () => {
                    expect(vm.baseSelectedVModel).to.be.equal('李');
                    expect(vm.selectedUser).to.be.equal(undefined);
                }, 0);
                await timeoutPromise(()=>{
                    inputEle.focus();
                }, 0);
                await timeoutPromise(()=>{
                    inputEle.value = '赵六';
                    triggerEvent(inputEle, 'input'); // 更新input的v-model
                    triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
                    inputEle.blur();
                }, 0);
                await timeoutPromise(()=>{
                    expect(vm.baseSelectedVModel).to.be.equal('赵六');
                    expect(vm.selectedUser).to.be.equal(undefined);
                }, 0);
                await timeoutPromise(()=>{
                    inputEle.focus();
                }, 0);
                await timeoutPromise(()=>{
                    inputEle.blur();
                }, 0);
                await timeoutPromise( () => {
                    expect(vm.baseSelectedVModel).to.be.equal('赵六');
                    expect(vm.selectedUser && vm.selectedUser.Name).to.be.equal(AUTOCOMPLETE_DATAS[3].Name);
                }, 500);
                await timeoutPromise(()=>{
                    done();
                }, 0)
            }
        });
    });
    it('先选中一个值, 然后立马改变, 看状态是否变更', done => {
        vm = createVue({
            template: `
                <sn-autocomplete-base
                    ref="autocomplete"
                    v-model="baseSelectedVModel"                    
                    placeholder = "请输入账号/姓名"
                    text-key = "Name"
                    value-key = "ID"
                    :fetch-data = "fetchData"
                    @get-selected="getSelectedUser"
                ></sn-autocomplete-base>
            `,
            data() {
                return {
                    baseSelectedVModel: null,
                    baseComponentParams: null,
                    autocompleteData: [],
                    selectedUser: null,
                    mockDatas: [].concat(AUTOCOMPLETE_DATAS)
                }
            },
            methods: {
                fetchData(msg, cb) {
                    this.searchUser(msg).then((data) => {
                        cb(data);
                    });
                },
                searchUser(msg) {
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
                },
                getSelectedUser(user) {
                    this.selectedUser = user;
                }
            }
        }, true);

        vm.$nextTick(() => {
            let elm = vm.$el;
            let inputEle = elm.querySelector("input");
            const autocompleteRef = vm.$refs.autocomplete;
            inputEle.focus();
            test();

            async function test() {
                await timeoutPromise(() => {
                    // 选中一项
                    const item = autocompleteRef.$el.querySelectorAll(".result-item")[0];
                    item.click();
                }, 500);
                await timeoutPromise(() => {
                    expect(vm.baseSelectedVModel).to.be.equal('张三');
                    expect(vm.selectedUser && vm.selectedUser.Name).to.be.equal('张三');
                }, 500);
                // await timeoutPromise(()=>{
                //     inputEle.focus();
                // }, 500);
                await timeoutPromise(()=>{
                    inputEle.value = '李';
                    triggerEvent(inputEle, 'input'); // 更新input的v-model
                    triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
                    inputEle.blur();
                }, 500);
                // await timeoutPromise(()=>{
                //
                // }, 500);
                await timeoutPromise( () => {
                    expect(vm.baseSelectedVModel).to.be.equal('李');
                    expect(vm.selectedUser).to.be.equal(undefined);
                }, 500);
                await timeoutPromise(()=>{
                    inputEle.focus();
                }, 0);
                await timeoutPromise(()=>{
                    inputEle.value = '赵六';
                    triggerEvent(inputEle, 'input'); // 更新input的v-model
                    triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
                    inputEle.blur();
                }, 500);
                await timeoutPromise(()=>{
                    inputEle.focus();
                }, 0);
                await timeoutPromise(()=>{
                    inputEle.blur();
                }, 500);
                await timeoutPromise( () => {
                    expect(vm.baseSelectedVModel).to.be.equal('赵六');
                    expect(vm.selectedUser && vm.selectedUser.Name).to.be.equal(AUTOCOMPLETE_DATAS[3].Name);
                }, 500);
                await timeoutPromise(()=>{
                    done();
                }, 500)
            }
        });
    });
    // 创建sn-autocomplete
    it('create', done => {
        vm = createVue({
            template: `
                <sn-autocomplete
                    ref="autocomplete"
                    v-model="baseSelectedVModel"
                    placeholder = "请输入账号/姓名"
                    text-key = "Name"
                    value-key = "ID"
                    :fetch-data = "fetchData"
                ></sn-autocomplete>
            `,
            data() {
                return {
                    baseSelectedVModel: null,
                    baseComponentParams: null,
                    autocompleteData: [],
                    mockDatas: [].concat(AUTOCOMPLETE_DATAS)
                }
            },
            methods: {
                fetchData(msg, cb) {
                    console.log("biz 自动完成基础组件: 检索", msg);
                    this.searchUser(msg).then((data) => {
                        cb(data);
                    });
                },
                searchUser(msg) {
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
        }, true);
        let elm = vm.$el;
        let inputEle = elm.querySelector("input");
        // 测试placeholder
        expect(inputEle && inputEle.getAttribute("placeholder")).to.equal("请输入账号/姓名");
        inputEle.focus();
        setTimeout(() => {
            const resultbox = vm.$refs.autocomplete.$refs.autocompleteBase.$refs.autocompleteResultBox;
            expect(resultbox.style.display).to.not.equal('none');
            expect(resultbox.querySelectorAll(".result-item").length).to.be.equal(8);
            inputEle.blur();
            setTimeout(() => {
                console.log("resultbox.style.display", resultbox.style.display);
                expect(resultbox.style.display).to.equal('none');
                done();
            }, 500);

        }, 500);
    });
    // sn-autocomplate选中用测试用例
    it('select', done => {
        vm = createVue({
            template: `
            <sn-autocomplete
                ref="autocomplete"
                v-model="baseSelectedVModel"
                placeholder = "请输入账号/姓名"
                text-key = "Name"
                value-key = "ID"
                :fetch-data = "fetchData"
                @get-selected="getSelectedUser"
            ></sn-autocomplete>
          `,
            data() {
                return {
                    baseSelectedVModel: null,
                    baseComponentParams: null,
                    autocompleteData: [],
                    selectedUser: null,
                    mockDatas: [].concat(AUTOCOMPLETE_DATAS)
                }
            },
            methods: {
                fetchData(msg, cb) {
                    console.log("biz 自动完成基础组件: 检索", msg);
                    this.searchUser(msg).then((data) => {
                        cb(data);
                    });
                },
                searchUser(msg) {
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
                },
                getSelectedUser(user) {
                    console.debug("选中了用户");
                    this.selectedUser = user;
                }
            }
        }, true);
        let elm = vm.$el;
        let inputEle = elm.querySelector("input");
        const autocompleteRef = vm.$refs.autocomplete;
        inputEle.focus();
        setTimeout(() => {
            // 选中一项
            const item = autocompleteRef.$el.querySelectorAll(".result-item")[1];

            console.debug("获取准备选中的item", item);
            item.click();
            setTimeout(() => {
                expect(vm.baseSelectedVModel).to.be.equal('李四');
                console.debug("vm.selectedUser.Name", vm.selectedUser && vm.selectedUser.Name);
                expect(vm.selectedUser && vm.selectedUser.Name).to.be.equal('李四');
                done();
            }, 500);

        }, 500);
    });

    it('input-select-change', done => {
        vm = createVue({
            template: `
            <sn-autocomplete
                ref="autocomplete"
                v-model="baseSelectedVModel"
                placeholder = "请输入账号/姓名"
                text-key = "Name"
                value-key = "ID"
                :fetch-data = "fetchData"
                @get-selected="getSelectedUser"
            ></sn-autocomplete>
          `,
            data() {
                return {
                    baseSelectedVModel: null,
                    baseComponentParams: null,
                    autocompleteData: [],
                    selectedUser: null,
                    mockDatas: [].concat(AUTOCOMPLETE_DATAS)
                }
            },
            methods: {
                fetchData(msg, cb) {
                    this.searchUser(msg).then((data) => {
                        cb(data);
                    });
                },
                searchUser(msg) {
                    return new Promise((resolve) => {
                        if (msg == null || msg === '') {
                            resolve(this.mockDatas.concat([]));
                        } else {
                            resolve(this.mockDatas.filter((m1) => {
                                return m1.Name.indexOf(msg) !== -1;
                            }).concat([]));
                        }
                    });
                },
                getSelectedUser(user) {
                    this.selectedUser = user;
                }
            }
        }, true);
        let elm = vm.$el;
        let inputEle = elm.querySelector("input");
        const autocompleteRef = vm.$refs.autocomplete;
        inputEle.focus();
        // 为了写法好看, 这里用async和await来写, 避免setTimeout的回调地狱
        test();

        async function test() {
            await timeoutPromise(() => {
                // 选中一项
                const item = autocompleteRef.$el.querySelectorAll(".result-item")[1];
                item.click();
            }, 500);
            await timeoutPromise(() => {
                expect(vm.baseSelectedVModel).to.be.equal('李四');
                inputEle.focus();
            }, 500);
            await timeoutPromise(() => {
                console.debug("模拟事件点击");
                /**
                 * 模拟事件点击
                 */
                inputEle.value = "王五"; // 先默认输入的值
                triggerEvent(inputEle, 'input'); // 更新input的v-model
                triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
                console.debug("模拟事件点击结束");
            }, 500);
            await timeoutPromise(() => {
                const items = autocompleteRef.$el.querySelectorAll(".result-item");
                expect(items.length).to.be.equal(1);
                items[0].click();
            }, 500);
            await timeoutPromise(() => {
                expect(vm.baseSelectedVModel).to.be.equal('王五');
                const resultbox = vm.$refs.autocomplete.$refs.autocompleteBase.$refs.autocompleteResultBox;
                expect(resultbox.style.display).to.be.equal('none');
            }, 500);
            await timeoutPromise(() => {
                done();
            }, 500);
        };
    });

    it("not-allow-null-test", done => {
        vm = createVue({
            template: `
            <sn-autocomplete
                ref="autocomplete"
                v-model="baseSelectedVModel"
                allow-null="false"
                placeholder = "请输入账号/姓名"
                text-key = "Name"
                value-key = "ID"
                :fetch-data = "fetchData"
                @get-selected="getSelectedUser"
            ></sn-autocomplete>
          `,
            data() {
                return {
                    baseSelectedVModel: null,
                    baseComponentParams: null,
                    autocompleteData: [],
                    selectedUser: null,
                    mockDatas: [].concat(AUTOCOMPLETE_DATAS)
                }
            },
            methods: {
                fetchData(msg, cb) {
                    this.searchUser(msg).then((data) => {
                        cb(data);
                    });
                },
                searchUser(msg) {
                    return new Promise((resolve) => {
                        if (msg == null || msg === '') {
                            resolve(this.mockDatas.concat([]));
                        } else {
                            resolve(this.mockDatas.filter((m1) => {
                                return m1.Name.indexOf(msg) !== -1;
                            }).concat([]));
                        }
                    });
                },
                getSelectedUser(user) {
                    this.selectedUser = user;
                }
            }
        }, true);
        let elm = vm.$el;
        let inputEle = elm.querySelector("input");
        const autocompleteRef = vm.$refs.autocomplete;
        inputEle.focus();

        test();
        async function test(){
            // 默认选中第一个
            await timeoutPromise(() => {
                const item = autocompleteRef.$el.querySelectorAll(".result-item")[0];
                item.click();
            }, 500);
            await timeoutPromise(()=>{
                inputEle.focus();
            }, 500);
            await timeoutPromise(()=>{
                // 退格一步, 再失去焦点
                /**
                 * 模拟退格了
                 */
                inputEle.value = "张"; // 先默认输入的值
                triggerEvent(inputEle, 'input'); // 更新input的v-model
                triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
            }, 500);
            await timeoutPromise(()=>{
                inputEle.blur();
            }, 500);
            await timeoutPromise(()=>{
                // allowNull不能为空,
                expect(vm.baseSelectedVModel).to.be.equal('张三');
            }, 500);
            await timeoutPromise(()=>{
                inputEle.focus();
            }, 500);
            await timeoutPromise(()=>{
                /**
                 * 模拟退格了
                 */
                inputEle.value = "李四"; // 先默认输入的值
                triggerEvent(inputEle, 'input'); // 更新input的v-model
                triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
            }, 500);
            await timeoutPromise(() => {
                const item = autocompleteRef.$el.querySelectorAll(".result-item")[0];
                item.click();
            }, 500);
            await timeoutPromise(()=>{
                // allowNull不能为空,
                expect(vm.baseSelectedVModel).to.be.equal('李四');
            }, 500);
            await timeoutPromise(()=>{
                inputEle.focus();
            }, 500);
            await timeoutPromise(()=>{
                /**
                 * 模拟退格了
                 */
                inputEle.value = "王五1"; // 先默认输入的值
                triggerEvent(inputEle, 'input'); // 更新input的v-model
                triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
            }, 500);
            await timeoutPromise(() => {
                const item = autocompleteRef.$el.querySelectorAll(".result-item")[0];
                item && item.click();
            }, 500);
            await timeoutPromise(()=> {
                inputEle.blur();
            }, 500);
            await timeoutPromise(()=>{
                // allowNull不能为空,
                expect(vm.baseSelectedVModel).to.be.equal('李四');
            }, 500);
            await timeoutPromise(()=>{
                /**
                 * 模拟退格了
                 */
                inputEle.value = ""; // 先默认输入的值
                triggerEvent(inputEle, 'input'); // 更新input的v-model
                triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
            }, 500);
            await timeoutPromise(()=> {
                inputEle.blur();
            }, 500);
            await timeoutPromise(()=>{
                // allowNull不能为空,
                expect(vm.baseSelectedVModel).to.be.equal('李四');
            }, 500);
            await timeoutPromise(()=>{
                done();
            }, 500)
        }
    });
    // 设置允许为空
    it("allow-null-test", done => {
        vm = createVue({
            template: `
            <sn-autocomplete
                ref="autocomplete"
                v-model="baseSelectedVModel"
                allow-null="true"
                placeholder = "请输入账号/姓名"
                text-key = "Name"
                value-key = "ID"
                :fetch-data = "fetchData"
                @get-selected="getSelectedUser"
            ></sn-autocomplete>
          `,
            data() {
                return {
                    baseSelectedVModel: null,
                    baseComponentParams: null,
                    autocompleteData: [],
                    selectedUser: null,
                    mockDatas: [].concat(AUTOCOMPLETE_DATAS)
                }
            },
            methods: {
                fetchData(msg, cb) {
                    this.searchUser(msg).then((data) => {
                        cb(data);
                    });
                },
                searchUser(msg) {
                    return new Promise((resolve) => {
                        if (msg == null || msg === '') {
                            resolve(this.mockDatas.concat([]));
                        } else {
                            resolve(this.mockDatas.filter((m1) => {
                                return m1.Name.indexOf(msg) !== -1;
                            }).concat([]));
                        }
                    });
                },
                getSelectedUser(user) {
                    this.selectedUser = user;
                }
            }
        }, true);
        let elm = vm.$el;
        let inputEle = elm.querySelector("input");
        const autocompleteRef = vm.$refs.autocomplete;
        inputEle.focus();

        test();
        async function test(){
            // 默认选中第一个
            await timeoutPromise(() => {
                const item = autocompleteRef.$el.querySelectorAll(".result-item")[0];
                item.click();
            }, 500);
            await timeoutPromise(()=>{
                inputEle.focus();
            }, 500);
            await timeoutPromise(()=>{
                // 退格一步, 再失去焦点
                /**
                 * 模拟退格了
                 */
                inputEle.value = "张"; // 先默认输入的值
                triggerEvent(inputEle, 'input'); // 更新input的v-model
                triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
            }, 500);
            await timeoutPromise(()=>{
                inputEle.blur();
            }, 500);
            await timeoutPromise(()=>{
                // allowNull不能为空,
                expect(vm.baseSelectedVModel).to.be.equal('张三');
                expect(vm.selectedUser && vm.selectedUser.Name).to.be.equal('张三');
            }, 500);
            await timeoutPromise(()=>{
                inputEle.focus();
            }, 500);
            await timeoutPromise(()=>{
                /**
                 * 模拟退格了
                 */
                inputEle.value = "李四"; // 先默认输入的值
                triggerEvent(inputEle, 'input'); // 更新input的v-model
                triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
            }, 500);
            await timeoutPromise(() => {
                const item = autocompleteRef.$el.querySelectorAll(".result-item")[0];
                item.click();
            }, 500);
            await timeoutPromise(()=>{
                // allowNull不能为空,
                expect(vm.baseSelectedVModel).to.be.equal('李四');
                expect(vm.selectedUser && vm.selectedUser.Name).to.be.equal('李四');
            }, 500);
            await timeoutPromise(()=>{
                inputEle.focus();
            }, 500);
            await timeoutPromise(()=>{
                /**
                 * 模拟退格了
                 */
                inputEle.value = "王五1"; // 先默认输入的值
                triggerEvent(inputEle, 'input'); // 更新input的v-model
                triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
            }, 500);
            await timeoutPromise(() => {
                const item = autocompleteRef.$el.querySelectorAll(".result-item")[0];
                item && item.click();
            }, 500);
            await timeoutPromise(()=> {
                inputEle.blur();
            }, 500);
            await timeoutPromise(()=>{
                // allowNull不能为空,
                expect(vm.baseSelectedVModel).to.be.equal('李四');
                expect(vm.selectedUser && vm.selectedUser.Name).to.be.equal('李四');
            }, 500);
            await timeoutPromise(()=>{
                inputEle.focus();
            }, 500);
            await timeoutPromise(()=>{
                /**
                 * 模拟退格了
                 */
                inputEle.value = ""; // 先默认输入的值
                triggerEvent(inputEle, 'input'); // 更新input的v-model
                triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
            }, 500);
            await timeoutPromise(()=> {
                inputEle.blur();
            }, 500);
            await timeoutPromise(()=>{
                // allowNull不能为空
                expect(vm.baseSelectedVModel).to.be.equal('');
                expect(vm.selectedUser && vm.selectedUser.Name).to.be.equal(null);
            }, 500);
            await timeoutPromise(()=>{
                done();
            }, 500)
        }
    });

    it('default-select', done => {
        vm = createVue({
            // v-model="baseSelectedVModel"
            template: `
                <sn-autocomplete
                    ref="autocomplete"
                    v-model="baseSelectedVModel"
                    :allow-null="false"
                    placeholder = "请输入账号/姓名"
                    text-key = "Name"
                    value-key = "ID"
                    :fetch-data = "fetchData"
                    @get-selected="getSelectedUser"
                    :default-select="defaultSelect"
                ></sn-autocomplete>
            `,
            data() {
                return {
                    defaultSelect: AUTOCOMPLETE_DATAS[3],
                    baseSelectedVModel: null/*AUTOCOMPLETE_DATAS[3].Name*/,
                    baseComponentParams: null,
                    autocompleteData: [],
                    selectedUser: null,
                    mockDatas: [].concat(AUTOCOMPLETE_DATAS)
                }
            },
            mounted(){
                this.baseSelectedVModel = AUTOCOMPLETE_DATAS[3].Name;
                this.selectedUser = this.defaultSelect;
                console.debug("test mounted", this.baseSelectedVModel);
            },
            watch: {
                baseSelectedVModel:function(model) {
                    console.debug("baseSelectedVModel发生了改变", model);
                }
            },
            methods: {
                fetchData(msg, cb) {
                    this.searchUser(msg).then((data) => {
                        cb(data);
                    });
                },
                searchUser(msg) {
                    return new Promise((resolve) => {
                        if (msg == null || msg === '') {
                            resolve(this.mockDatas.concat([]));
                        } else {
                            resolve(this.mockDatas.filter((m1) => {
                                return m1.Name.indexOf(msg) !== -1;
                            }).concat([]));
                        }
                    });
                },
                getSelectedUser(user) {
                    console.debug("默认选中", user);
                    this.selectedUser = user;
                }
            }
        }, true);
        let elm = vm.$el;
        let inputEle = elm.querySelector("input");
        const autocompleteRef = vm.$refs.autocomplete;
        test();

        async function test(){
            await timeoutPromise(()=>{
                inputEle.focus();
            }, 500);
            await timeoutPromise(()=>{
                const items = autocompleteRef.$el.querySelectorAll(".result-item");
                expect(items.length).to.be.equal(1);
            }, 500);
            await timeoutPromise(()=>{
                inputEle.value = "";
                triggerEvent(inputEle, 'input'); // 更新input的v-model
                // triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
            }, 500);
            await timeoutPromise(()=>{
                inputEle.focus();
            }, 500);
            await timeoutPromise(()=>{
                inputEle.blur();
            }, 500);
            await timeoutPromise(()=>{
                expect(vm.baseSelectedVModel).to.be.equal("赵六");
                expect(vm.selectedUser && vm.selectedUser.Name).to.be.equal("赵六");
            }, 500);
            await timeoutPromise(()=>{
                inputEle.focus();
            }, 500);
            await timeoutPromise(()=>{
                inputEle.value = "彭九";
                triggerEvent(inputEle, 'input'); // 更新input的v-model
                triggerEvent(inputEle, 'keyup'); // 模拟触发keyup事件
            }, 500);
            await timeoutPromise(()=>{
                inputEle.blur();
            }, 500);
            await timeoutPromise(()=>{
                expect(vm.baseSelectedVModel).to.be.equal("彭九");
                expect(vm.selectedUser && vm.selectedUser.Name).to.be.equal("彭九");
            }, 1000);
            await timeoutPromise(()=>{
                done();
            }, 500);
        }
    });
}
