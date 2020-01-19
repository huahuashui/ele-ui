## 安装

```shell
npm install element-ui -S
或 
yarn add ele-ui
```

## 引入ele-ui

### 完整引入

在main.ts中写入一下内容

```javascript
import Vue from 'vue';
import EleUi from 'ele-ui';
import "ele-ui/lib/theme-chalk/ele-ui.css";
import App from "./App.vue";

Vue.use(EleUi);

new Vue({
    el: '#app',
    render: h => h(App)
});
```

接下来， 如果你只希望引入部分组件， 比如Button， 那么需要在main.ts中写入一下内容：
```javascript
import Vue from "vue";
import {Button} from "ele-ui";
import App from "./App.vue";

Vue.component(Button.name, Button);

new Vue({
  el: '#app',
  render: h => h(App)
});
```
