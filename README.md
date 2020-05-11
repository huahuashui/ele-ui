# ele-ui
A Component Library for Vue.js.

import Vue from 'vue';
import EleUi from 'ele-ui';
import "ele-ui/lib/theme-chalk/ele-ui.css";
import App from "./App.vue";
 
Vue.use(SensenetsUI);
 
new Vue({
    el: '#app',
    render: h => h(App)
});

// or
import {Button} from "ele-ui";
import App from "./App.vue";
 
Vue.component(Button.name, Button);
 
new Vue({
  el: '#app',
  render: h => h(App)
});
