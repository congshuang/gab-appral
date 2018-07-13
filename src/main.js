
import Vue from "vue";
import frame from "./frame.vue";
import router from "./router";
import store from "./store";
import axios from "./common/axios";
import VueAxios from 'vue-axios'
import qs from "qs";
import 'animate.css'
import $ from 'expose-loader?$!jquery';
import '../src/assets/js/jquery.jqprint-0.3'
import filters from "./filters";
import ElementUI from 'element-ui'
import Stomp from 'stompjs'
import 'element-ui/lib/theme-chalk/index.css'
import ImpPanel from "./components/panel.vue";
import * as api from "./api"

Vue.prototype.$http = axios;
Vue.axios = axios;
Vue.http = axios;
Vue.use(VueAxios, axios);

Vue.component(ImpPanel.name, ImpPanel);
Vue.use(ElementUI);

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  store,
  router,
  el: "#app",
  render: h => h(frame)
})
