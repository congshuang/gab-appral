import Vue from "vue";
import Vuex from "vuex";
import types from "./mutation-types";
import defaultValue from "../services/mock.data";
import * as api from "../api";
import { getCurrentMenu, getSessionKey } from '../common/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,  // process.env.NODE_ENV !== 'production', 直接修改state 抛出异常

  getters: {
    loading: state => state.loading,
    menuList: state => state.menuList,
    sidebar: state => state.sidebar,
    userInfo:state => state.userInfo,
    device:state => state.device,
    currentMenus:state => state.currentMenus,
    collapse:state => state.collapse,
    indexskin:state => state.indexskin,
    log:state => state.log,
    sentId:state => state.sentId,
    websoket:state => state.websoket,
    change:state => state.change,
    user:state => state.user,
    list:state => state.list,
    syslist:state => state.syslist,

  },
  state: {
    loading: false,
    menuList: {},
    sidebar: {
      collapsed: getSessionKey('state.sidebar.collapsed','false')==='true',
      show: getSessionKey('state.sidebar.show','true')==='true',
    },
    collapse:false,
    indexskin:0,
    device: {
      isMobile: false
    },
    userInfo:{name:'佚名'},
    user:{},
    currentMenus:[],
    log:{},
    sentId:false,
    websoket:{},
    change:false,
    list:[],
    syslist:[],

  },
  mutations: {
    //只能同步的函数
    [types.TOGGLE_DEVICE] (state, isMobile) {
      state.device.isMobile = isMobile
    },[types.SET_MSG_LIST] (state, list) {
      state.list = list
    },[types.SET_SYS_LIST] (state, list) {
      state.syslist = list
    },[types.SET_WEBSOCKET] (state, ws) {
      state.websoket = ws
    },[types.SET_LOG] (state, log) {
      state.log = log
    },[types.SET_SENDERID] (state, id) {
      state.sentId = id
    },[types.SET_CHANGE] (state, change) {
      state.change = change
    },
    [types.SET_INDEX] (state, skin) {
      state.indexskin = skin
    },
    [types.SET_COLLAPSE] (state, isCollapse) {
      state.collapse = isCollapse
    },
    [types.TOGGLE_LOADING] (state) {
      state.loading = !state.loading
    },
    [types.LOAD_MENU] (state, menu) {
      state.menuList = menu;
    },
    [types.LOAD_CURRENT_MENU] (state, menu) {
      state.currentMenus = menu;
    },
    [types.SET_USER_INFO] (state, info) {
      state.userInfo = info;
    },[types.SET_USER] (state, info) {
      state.user = info;
    },
    [types.TOGGLE_SIDEBAR] (state, collapsed) {
      if (collapsed == null) collapsed = !state.sidebar.collapsed;
      state.sidebar.collapsed = collapsed;
      window.sessionStorage.setItem("state.sidebar.collapsed",collapsed)
    },
    [types.TOGGLE_SIDEBAR_SHOW] (state,show) {
      if (show == null) state.sidebar.show = !state.sidebar.show;
      else{
        state.sidebar.show = show;
      }
      window.sessionStorage.setItem("state.sidebar.show",state.sidebar.show)
    },
  }, actions: {
    //异步的函数
    toggleLoading: ({commit}) => commit(types.TOGGLE_LOADING),
    loadMenuList: ({state,commit}) => {
      Vue.axios.get(api.GET_MENUS).then(res => {
        commit(types.LOAD_MENU, res.data.menus);
        commit(types.SET_USER_INFO, res.data);
      }).catch(exp => commit(types.LOAD_MENU, defaultValue.menuList));
    },
    changeCurrentMenu: ({state,commit},{path,matched,fullPath}) => {
      const a = getCurrentMenu(fullPath,state.menuList);
      commit(types.LOAD_CURRENT_MENU, a.reverse());
    }
  },
})

export default store
