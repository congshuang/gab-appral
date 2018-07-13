import axios from "axios";
import qs from "qs";
import router from "../router/index"
import {MessageBox, Loading} from 'element-ui'
import vue from 'vue'
import * as utils from './utils'
// axios 配置
axios.defaults.timeout =20000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
let options = {
  lock: true,
  text: '正在加载...',
  background: 'rgba(0, 0, 0, 0.5)',
}
let loadinstanse = {};
//POST传参序列化
axios.interceptors.request.use((config) => {
  config.data = utils.parseJsonToFormData(config.data);
  config.data = qs.stringify(config.data);
  loadinstanse = Loading.service(options);
  return config;
}, (error) => {
  return Promise.reject(error);
});

//返回状态判断
axios.interceptors.response.use(
  response => {
    vue.prototype.$nextTick(() => {
      loadinstanse.close();
    });
    return response;
  },
  error => {
    vue.prototype.$nextTick(() => {
      loadinstanse.close();
    });
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 这里写清除token的代码
          router.replace({
            path: 'login'
          });
          break;
        case 500:
          MessageBox({type: "error", message: "系统网络故障，请稍后再试，或与管理员联系", title: "温馨提示",});
          break;
        case 403:
          MessageBox({type: "error", message: "登录但无权访问，提示无权访问", title: "温馨提示",});
          break;
      }
    }else{
      MessageBox({type: "error", message: "系统网络故障，请稍后再试，或与管理员联系", title: "温馨提示",});
    }
    try {
      console.log(error.response.data);
    } catch (error) {
      console.log(error);
    }

    return Promise.reject(error)
  });


export default axios
