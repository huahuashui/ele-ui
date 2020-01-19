## 滚动容器
:::demo
```html
<template>
    <div class="m-scroll-demo">
        <sn-scroll @scroll="handleScroll">
            <ul>
                <li v-for="item in count" :key="item">{{item}}</li>
            </ul>
        </sn-scroll>
    </div>
</template>
<script lang="ts" type="text/tsx">
    import {Vue, Component, Prop, Watch, Emit} from "vue-property-decorator";
    
    @Component
    export default class ScrollDemo extends Vue {
        public count: number = 20;
        
        private handleScroll(scroll) {
            console.log(scroll)
        }
    }
</script>

```
:::

## 滚动加载
:::demo `:open-loaded="true"`来开启滚动加载, 通过`isLoading`和`finished`两个变量控制加载状态,当组件滚动到底部时,会触发`loaded`事件并将`isLoading`设置成`true`.此时可以发起异步操作, 数据更新完毕后, 将`isLoading`设为`false`即可.若数据已全部加载完毕,则将`finished`设成`true`即可
```html
<template>
    <div class="m-scroll-demo">
        <sn-scroll 
            v-model="isLoading" 
            :open-loaded="true"
            :finished="finished"
            @loaded="loadMore"
        >
            <ul>
                <li v-for="item in count" :key="item">{{item}}</li>
            </ul>
        </sn-scroll>
    </div>
</template>
<script lang="ts" type="text/tsx">
    import {Vue, Component, Prop, Watch, Emit} from "vue-property-decorator";
    
    @Component
    export default class ScrollDemo extends Vue {
        public count: number = 20;
        public isLoading: boolean = false;
        public finished: boolean = false;
        loadMore() {
            setTimeout(() => {
                this.isLoading = false
                if(this.count >= 200) {
                    this.finished = true
                    return 
                }
                this.count += 20
                
            }, 1000)
        }
    }
</script>
```
:::

## 横向滚动

:::demo
```html
<template>
    <div class="m-scroll-demo">
        <sn-scroll :scrollX="true">
            <ul style="width: 900px">
                <li v-for="item in 20" :key="item">{{item}}</li>
            </ul>
        </sn-scroll>
    </div>
</template>
```
:::

## API

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---  | ---  | --- | ---   | ---    |
| thumbThick | 滚动条厚度 | number | --- | 8 |
| offset | 距离底部加载更多阈值 | number | --- | 10 |
| scrollY | 纵向滚动 | boolean | --- | true |
| scrollX | 横向滚动 | boolean | --- | false |
| openLoaded | 是否开启无限滚动 | boolean | --- | false |
| finished | 是否全部加载完成 | boolean | --- | false |
| scrollDelay | 触发scroll事件节流延迟 | number | --- | 200 |
| isLoading | 是否正在加载数据 v-model | boolean | --- | false |

## Event

| 事件名 | 说明 | 参数 |
| ---   | --- | ---  |
| scroll | 滚动时触发 | scroll: {x: number, y: number} |
| loaded | 加载更多数据 | 无 |
| reachBottom | 滚动到底部 | 无 |
| reachTop | 滚动到顶部 | 无 |

