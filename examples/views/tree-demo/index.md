## tree 树形控件

## 基础用法

基础的树形结构展示

:::demo `show-checkbox=true `可以显现选择框, tree组件绑定`@on-check`接收选择框check事件,回调传递2个参数, 第一个是选中状态, 第二个是当前选中项data, 第三个是所有选中数组集合.`default-expand-level` 设置默认展开层级. `default-expand-all` 切换所有节点展开关闭
```html
<div>
    <sn-button @click="showCheckbox = !showCheckbox">show-checkbox</sn-button>
    <sn-button v-show="showCheckbox" @click="handleCheckedAll">show-checkbox</sn-button>
    <sn-button @click="defaultExpandAll = !defaultExpandAll">default-expand-all</sn-button>
    <sn-tree
        :data="data"
        :show-checkbox="showCheckbox"
        :default-expand-all="defaultExpandAll"
        :default-expand-level="defaultExpandLevel"
        ref="snTree"
        @on-check="checkChange"
    ></sn-tree>
</div>

<script lang="ts" type="text/tsx">
    import {Vue, Component, Prop, Watch, Emit} from "vue-property-decorator";
   @Component
   export default class ClassName extends Vue {
       private showCheckbox: boolean = false;
       private defaultExpandAll: boolean = false;
       private defaultExpandLevel: number = 1;
       private checkAll: boolean = false;
       
       private data: Array<any> = [
           {
               Name: 'parent 1',
               children: [
                   {
                       Name: 'parent 1-1',
                   },
                   {
                       Name: 'parent 1-2',
                       children: [
                           {
                               Name: 'parent 1-1-1',
                           },
                           {
                               Name: 'parent 1-1-2',
                           }
                       ]
                   }
               ]

           }
       ];
       
       private checkChange(flag:boolean, data: any, allCheck: Array<any>) {
           console.log(flag, data, allCheck)
       }
       
       private handleCheckedAll() {
           this.checkAll = !this.checkAll
           const result: Array<any> = this.$refs.snTree.setCheckedNodeAll(this.checkAll)
           console.log(result)
       }
   }
</script>

```
:::

## 禁用状态

:::demo 通过`disabled`设置禁用状态. `default-checked-key` 设置默认勾选, 接收一个数组. `default-select-key`设置默认选中.此时要设置node-key属性,用来作为每个节点唯一标识.
```html
<div>
    <sn-tree
        :data="data"
        :show-checkbox="true"
        default-checked-key="1"
        default-select-key="3"
        node-key="id"
        @on-check="checkChange"
    ></sn-tree>
</div>

<script lang="ts" type="text/tsx">
    import {Vue, Component, Prop, Watch, Emit} from "vue-property-decorator";
   @Component
   export default class ClassName extends Vue {
       private data: Array<any> = [
           {
               Name: 'parent 2',
               id: 0,
               children: [
                   {
                       Name: 'parent 1-1',
                       id: 1
                   },
                   {
                       Name: 'parent 1-2',
                       id: 2,
                       disabled: true,
                       children: [
                           {
                               Name: 'parent 1-1-1',
                               id: 3
                           },
                           {
                               Name: 'parent 1-1-2',
                               id: 4
                           }
                       ]
                   }
               ]

           }
       ];
       
       private checkChange(flag:boolean, data: any, allCheck: Array<any>) {
           console.log(flag, data, allCheck)
       }
   }
</script>
```
:::

## 动态加载数据
:::demo 需要动态加载的节点添加`loading: false`属性, tree添加`loadData`传入加载数据的方法,此方法有2个参数, 第一个是当前tree节点的状态, 第二个参数是动态获取数据后的回调函数cb, 将获取的数据传入cb即可.
```html
<div>
    <sn-tree
        :data="data"
        :show-checkbox="true"
        :loadData="loadData"
    ></sn-tree>
</div>

<script lang="ts" type="text/tsx">
    import {Vue, Component, Prop, Watch, Emit} from "vue-property-decorator";
   @Component
   export default class ClassName extends Vue {
       private count: number = 0;
       private data: Array<any> = [
           {
               Name: 'parent 3',
               children: [
                   {
                       Name: 'parent 1-1',
                       id: 1,
                       loading: false
                   },
                   {
                       Name: 'parent 1-2',
                       id: 2,
                       disabled: true,
                       children: [
                           {
                               Name: 'parent 1-1-1',
                               id: 3
                           },
                           {
                               Name: 'parent 1-1-2',
                               id: 4
                           }
                       ]
                   }
               ]

           }
       ];
       
       private checkChange(flag:boolean, data: any, allCheck: Array<any>) {
           console.log(flag, data, allCheck)
       }
       
       private loadData(data: any, cb: (children: Array<any>) => void) {
           setTimeout(() => {
               let children: Array<any> = []
               if(data.level < 4) {
                  children = [
                      {
                          Name: 'children' + this.count ++,
                          loading: false
                      },
                      {
                          Name: 'children' + this.count ++
                      }
                  ]
               } 
               
               cb(children)
           }, 1000)
       }
   }
</script>
```
:::

## 自定义内容

节点支持自定义内容, 可以在节点区添加按钮或图标等内容

:::demo 通过`render`和`scoped slot`都可以进行自定义. render接收2个参数, 第一个为createElement, 第二个{node, data, map} node为 当前节点的Node对象, data是当前节点数据, map是所有node节点的映射.
```html
<div class="m-tree-demo-container">
    <div class="block">
        <div class="title">使用render函数</div>
        <sn-tree
                :data="data"
                :show-checkbox="true"
                :render="renderFn"
                @on-check="checkChange"
            ></sn-tree>
    </div>
    <div class="block">
        <div class="title">使用slot</div>
        <sn-tree
                :data="data"
                :show-checkbox="true"
                @on-check="checkChange"
            >
            <template v-slot:default="{node, data, map, root}">
                <div class="custom-tree-node">
                    <span>{{data.Name}}</span>
                   <span style="margin: 0 0 0 auto">
                       <sn-button @click="append(data)">append</sn-button>
                       <sn-button @click="remove(node, data, map, root)">remove</sn-button>
                   </span>
               </div>
            </template>
        </sn-tree>
    </div>
    
</div>
<script lang="ts" type="text/tsx">
    import {Vue, Component, Prop, Watch, Emit} from "vue-property-decorator";
   @Component
   export default class ClassName extends Vue {
       private count: number = 0;
       private data: Array<any> = [
           {
               Name: 'parent 4',
               children: [
                   {
                       Name: 'parent 1-1',
                       id: 1
                   },
                   {
                       Name: 'parent 1-2',
                       id: 2,
                       children: [
                           {
                               Name: 'parent 1-1-1',
                               id: 3
                           },
                           {
                               Name: 'parent 1-1-2',
                               id: 4
                           }
                       ]
                   }
               ]

           },
           {
                          Name: 'parent 4',
                          children: [
                              {
                                  Name: 'parent 1-1',
                                  id: 1
                              },
                              {
                                  Name: 'parent 1-2',
                                  id: 2,
                                  children: [
                                      {
                                          Name: 'parent 1-1-1',
                                          id: 3
                                      },
                                      {
                                          Name: 'parent 1-1-2',
                                          id: 4
                                      }
                                  ]
                              }
                          ]
           
                      },
                      {
                                     Name: 'parent 4',
                                     children: [
                                         {
                                             Name: 'parent 1-1',
                                             id: 1
                                         },
                                         {
                                             Name: 'parent 1-2',
                                             id: 2,
                                             children: [
                                                 {
                                                     Name: 'parent 1-1-1',
                                                     id: 3
                                                 },
                                                 {
                                                     Name: 'parent 1-1-2',
                                                     id: 4
                                                 }
                                             ]
                                         }
                                     ]
                      
                                 }
       ];
       mounted() {
       }
       
       private renderFn(h: any, params: any) {
           // tsLint warning: the "this" keyword is disallowed outside of a class body
           const self = this;
           const {data, node, map, root} = params
           return (
               <div class="custom-tree-node">
                   <span>{data.Name}</span>
                   <span style="margin: 0 0 0 auto">
                       <sn-button onClick={() => self.append(data)}>append</sn-button>
                       <sn-button onClick={() => self.remove(node, data, map, root)}>remove</sn-button>
                   </span>
               </div>
           )
       }
       
       private append(data: any) {
           if(!data.children) this.$set(data, 'children', [])
           data.children.push({
              Name: 'append'
           })
       }

       private remove(node: any, data: any, map: any, root: any) {
           const parent = map[node.parentKey] || root
           const children = parent.node.children || parent.node
           const index = children.findIndex((child: any) => child.id === data.id)
           children.splice(index, 1)
       }
       
       private checkChange(flag:boolean, data: any, allCheck: Array<any>) {
          console.log(flag, data, allCheck)
      }
      
       
   }
</script>
```
:::

## 节点分页

:::demo
```html
<sn-tree
    :data="data"
s    :isDefaultSelected="true"
>
    <template v-slot:page="{node}">
        <div class="page">
            <span @click="firstPage(node)">«</span>
            <span @click="preBtn(node)">‹</span>
            <span @click="nextBtn(node)">›</span>
            <span @click="lastPage(node)">»</span>
        </div>
    </template>
</sn-tree>
<script lang="ts" type="text/tsx">
    import {Vue, Component, Prop, Watch, Emit} from "vue-property-decorator";
   @Component
   export default class ClassName extends Vue {
         private pageNum: number = 1;
         private data: Array<any> =  null;
         
         private created() {
             setTimeout(() => {
                 this.data = [
                                          {
                                              Name: 'parent 5',
                                              children: [
                                                  {
                                                      Name: 'parent 1-1',
                                                      id: 1,
                                                      isPage: true,
                                                      loading: false,
                                                      loadData: function(node: any, cb: (children: Array<any>) => void) {
                                                             node.loading = true
                                                             setTimeout(() => {
                                                               const children: Array<any> = []
                                                               for(let i = 0; i < 50; i++) {
                                                                   children.push({
                                                                        Name: 'loaded1'
                                                                   })
                                                               }
                                                               cb(children)
                                                             }, 1000)
                                                      }
                                                  },
                                                  {
                                                      Name: 'parent 1-2',
                                                      id: 2,
                                                      children: [
                                                          {
                                                              Name: 'parent 1-1-1',
                                                              id: 3
                                                          },
                                                          {
                                                              Name: 'parent 1-1-2',
                                                              id: 4
                                                          }
                                                      ]
                                                  }
                                              ]
                                 
                                          }
                                      ];
             }, 1000)
         }
         
         private createChildren(node: any, num: number, pageNum: number) {
              const children: Array<any> = []
              for(let i = 0; i < num; i++) {
                  children.push({
                       Name: 'loaded' + pageNum
                  })
              }
              node.node.children = children
         }
         
         private firstPage(node: any) {
             this.pageNum = 1
             this.createChildren(node, 1, 50)
         }
         
         private preBtn(node: any) {
             this.pageNum = this.pageNum - 1
             if(this.pageNum < 1) return this.pageNum = 1
             this.createChildren(node, 50, this.pageNum)
         }
         
         private nextBtn(node: any) {
             this.pageNum = this.pageNum + 1
             if(this.pageNum > 10) return this.pageNum = 10
             this.createChildren(node, 50, this.pageNum)
         }
         
         private lastPage(node: any) {
             this.pageNum = 1
             this.createChildren(node, 50, 10)
         }
   }
</script>
```
:::

## 过滤节点

:::demo
```html
<div>
    <sn-input v-model="inputText" placeholder="输入关键字过滤"></sn-input>
    <sn-tree :data="data" ref="tree">
    
    </sn-tree>
</div>
<script lang="ts" type="text/tsx">
    import {Vue, Component, Prop, Watch, Emit} from "vue-property-decorator";
   @Component
   export default class ClassName extends Vue {
       private data: Array<any> = [
            {
                Name: 'parent6',
                children: [
                    {
                        Name: 'parent6-1',
                        id: 1,
                        children: [
                            {
                                Name: 'parent 6-1-1',
                                id: 3
                            },
                            {
                                Name: 'parent 6-1-2',
                                id: 4
                            }
                        ]
                    },
                    {
                        Name: 'parent 6-2',
                        id: 2,
                        disabled: true,
                        children: [
                            {
                                Name: 'parent 6-2-1',
                                id: 5
                            },
                            {
                                Name: 'parent 6-2-2',
                                id: 6
                            }
                        ]
                    }
                ]
 
            }
        ];
       private inputText: string = '';
       
       @Watch('inputText') onInputChange(val: any) {
           if(!val) return false
           this.$refs.tree.store.filterShowTreeNodes((data: any) => {
               return data.Name.indexOf(val) > -1
           })
       }
   }
</script>
```
:::
## Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---  | --- | ---  | ---   | ---    |
| data | 展示数据 | array | --- | --- |
| children-key | 子节点属性 | string | --- | children |
| tree-key-name | 树结构展示字段 | string | --- | Name |
| show-checkbox | 是否显示复选框 | boolean | --- | false |
| default-expand-all | 树结构展开状态, 可通过切换default-expand-all来改变全部展开和收起 | boolean | --- | false|
| multiple | 是否多选selected, 点击展示字段 | boolean | --- | false |
| label-icon-class | 节点icon的class样式 | string | --- | --- |
| expand-icon-class | 自定义展开图标class | string | --- | --- |
| pack-up-class | 自定义收起图标class | string | --- | --- |
| render | 自定义树节点的内容区的渲染函数 | Function(h, {data, node, map, root}) | --- | --- |
| page-render | 节点分页渲染函数, 需要分页的节点要设置isPage为true | Function(h, {node}) | --- | --- |
| load-data | 异步加载函数, 需要异步加载的节点要设置loading为false | Function(h, {node, resolve}) | --- | --- |
| default-checked-key | 默认checked的节点的key数组, 此时必须设置node-key来指定数组的key | array | --- | --- |
| default-select-key | 默认selected的节点的key数组, 此时必须设置node-key来指定数组的key | array | --- | --- |
| node-key | 每个树节点用来作为唯一标识的属性 | string | --- | --- |
| check-strictly | 父子是否不关联 | boolean | --- | false |
| default-expand-level | 默认树结构展开的层级 | number | --- | 0 |
| empty-text | data为空时显示的文字 | string | --- | 暂无数据 |

## Event

| 事件名 | 说明 | 回调参数 |
| ---    | --- | ---      |
| on-check | checkbox状态改变时的回调 | 共三个参数，依次为： 当前checkbox状态、当前节点数据、当前所有选中节点的Node数组 |
| on-select | 点击树节点时触发 | 两个参数： 当前节点Node数据，当前所有select数组 |
| on-toggle-expand | 收起和展开时触发 | 当前节点数据 |

## Tree methods

| 方法名 | 说明 | 参数 |
| ---   | ---  | ---  |
| setCheckedNodeAll | 设置所有节点checkbox状态 | state： boolean，勾选或取消勾选。k?:string, 可选参数，节点的属性。没有时返回checkbox为true的节点数组，有k时返回k属性值的数组。|
| getCheckedNodes | 获取checkbox相应状态的节点 | flag：boolean ，默认为true表示获取已勾选。k?:string 同上 |
| getSelectedNode | 获取被选中节点 | 无 |
| getIndeterminateNode | 获取checkbox为半选节点 | 无 |

## Node
`tree`节点类型

| 属性 | 说明 | 类型 | 默认值 |
| ---  | --- | ---  |  ---   |
| node | 原始节点数据 | object | --- |
| nodeKey | Node节点唯一标识 | number | --- |
| children | Node节点的子节点 | Node[] | --- |
| parentKey | 节点的父节点的nodeKey | number | --- |
| disabled | 是否禁止节点被选择 | boolean | false |
| loading ?  | 异步加载标识 | boolean | --- |
| loadingState ? | 是否已全部加载 | boolean | --- |
| checked | 复选框状态 | boolean | false |
| selected | 节点状态 | boolean | false |
| expand | 节点展开状态 | boolean | false |
| isFirstExpand | 是否是第一次展开 | boolean | true |
| indeterminate | checkbox是否是半选 | boolean | false |
| level | 节点层级 | number | --- |
| isPage | 节点是否分页 | boolean | --- |
| visible | 节点是否可见 | boolean | true |
| iconClass | 节点icon | string | --- |

