import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/index.css";
import "./assets/icon/iconfont.css";
import axios from "axios";
axios.defaults.baseURL = "http://119.23.53.78:8888/api/private/v1";
Vue.prototype.$http = axios;

Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
