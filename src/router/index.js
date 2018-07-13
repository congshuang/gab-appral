import Vue from "vue";
import VueRouter from "vue-router";
import routeConfig from "./routes";
import * as sysApi from '../services/sys'

//加载路由中间件
Vue.use(VueRouter);

//定义路由
const router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes: routeConfig,
})

router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth) && from.name!=='login') {
    sysApi.loginVoid().then(res => {next();});
  } else {
    next();
  }
})

export default router
