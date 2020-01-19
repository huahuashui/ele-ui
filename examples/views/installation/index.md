## 安装

```shell
npm i ele-ui -S 
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

Vue.use(SensenetsUI);

new Vue({
    el: '#app',
    render: h => h(App)
});
```

### 按需引入

借助 `babel-plugin-component`, 只需引入需要的组件即可。
首先，安装babel-plugin-component：
```shell
npm install babel-plugin-component -D 
或
yarn add babel-plugin-component --dev
```
然后，将.babelrc的plugins中添加下面代码：
```json
{
       "plugins": [
               [
                     "component",
                     {
                           "libraryName": "ele-ui",
                           "styleLibrary": {
                                 "name": "theme-chalk",
                                 "base": false
                           }
                     }
               ]
       ]
}
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
完整组件列表和引入方式
```javascript
import Vue from "vue";
import {
    Audio,
    AudioComplete,
    AudioCompleteBase,
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    ButtonGroup,
    CheckBox,
    CheckBoxGroup,
    CollapseText,
    CopyText,
    Form,
    FormItem,
    Input,
    Pagination,
    Popconfirm,
    Popover,
    Progress,
    Radio,
    RadioGroup,
    Scroll,
    Select,
    SelectBase,
    SelectOption,
    SimpleLayer,
    Slider,
    Spiner,
    Switch,
    Tab,
    TabPane,
    Table,
    TabelColumn,
    ToolTip,
    Tree,
    Upload
} from "ele-ui"

Vue.component(Audio.name, Audio)
Vue.component(AudioComplete.name, AudioComplete)
Vue.component(AudioCompleteBase.name, AudioCompleteBase)
Vue.component(Badge.name, Badge)
Vue.component(Breadcrumb.name, Breadcrumb)
Vue.component(BreadcrumbItem.name, BreadcrumbItem)
Vue.component(Button.name, Button)
Vue.component(ButtonGroup.name, ButtonGroup)
Vue.component(CheckBox.name, CheckBox)
Vue.component(CheckBoxGroup.name, CheckBoxGroup)
Vue.component(CollapseText.name, CollapseText)
Vue.component(CopyText.name, CopyText)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Pagination.name, Pagination)
Vue.component(Popconfirm.name, Popconfirm)
Vue.component(Popover.name, Popover)
Vue.component(Progress.name, Progress)
Vue.component(Radio.name, Radio)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Scroll.name, Scroll)
Vue.component(Select.name, Select)
Vue.component(SelectBase.name, SelectBase)
Vue.component(SelectOption.name, SelectOption)
Vue.component(SimpleLayer.name, SimpleLayer)
Vue.component(Slider.name, Slider)
Vue.component(Spiner.name, Spiner)
Vue.component(Switch.name, Switch)
Vue.component(Tab.name, Tab)
Vue.component(TabPane.name, TabPane)
Vue.component(Table.name, Table)
Vue.component(TabelColumn.name, TabelColumn)
Vue.component(ToolTip.name, ToolTip)
Vue.component(Tree.name, Tree)
Vue.component(Upload.name, Upload)
```
