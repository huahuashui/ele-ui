
:::demo 通过设置`effect`属性来改变主题，默认为`light`。
```html
<template>
  <sn-button>111</sn-button>
</template>
<template>
  <sn-button>111</sn-button>
</template>
<template>
  <sn-button @click="handleClick">{{text}}</sn-button>
</template>
<script lang="ts" type="text/tsx">
import {Vue, Component, Prop, Watch, Emit} from "vue-property-decorator";
    @Component
    export default class ClassName extends Vue {
        private text: string = 'click me';
        mounted() {
            console.log(123)
        }
        
        private handleClick() {
            alert('点我干啥^.^')
        }
        
    }
</script>
```
:::