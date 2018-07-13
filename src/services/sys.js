import axios from "../common/axios";
import * as api from "../api";
import defaultValue from "./mock.data";
import * as utils from '../common/utils'

export function login (params) {
  return new Promise((resolve, reject) => {
    axios.post(api.LOGIN, params).then(response => {
      resolve(response.data);
    }, err => {
      var msg = null;
      utils.consoleLog({message:'打印登录的结果信息',content:err});
      if(err.toString().indexOf('400')!=-1){
        msg = '用户名或密码错误！';
      }
      reject(msg);
    })
      .catch((error) => {
        utils.consoleLog({message:'打印登录的错误信息',content:error});
        resolve(defaultValue.login)
      })
  })
}
export function setrole (params) {
  return new Promise((resolve, reject) => {
    axios.post(api.SYS_SET_ROLE_RESOURCE, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.login);
    })
      .catch((error) => {
        resolve(defaultValue.login)
      })
  })
}
export function setrolemenu (params) {
  return new Promise((resolve, reject) => {
    axios.post(api.SYS_SET_ROLE_MENU, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.login);
    })
      .catch((error) => {
        resolve(defaultValue.login)
      })
  })
}
export function setuers (params) {
  return new Promise((resolve, reject) => {
    axios.post(api.SYS_SET_ROLE_USER, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.login);
    })
      .catch((error) => {
        resolve(defaultValue.login)
      })
  })
}
export function setresource (params) {
  return new Promise((resolve, reject) => {
    axios.post(api.SYS_ROLE_RESOURCE, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.login);
    })
      .catch((error) => {
        resolve(defaultValue.login)
      })
  })
}
export function setmenu (params) {
  return new Promise((resolve, reject) => {
    axios.post(api.SYS_ROLE_MENU, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.login);
    })
      .catch((error) => {
        resolve(defaultValue.login)
      })
  })
}

export function loginVoid (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.LOGINVOID, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.login);
    })
      .catch((error) => {
        resolve(defaultValue.login)
      })
  })
}
export function getmenuList (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.GET_MENUS, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.login);
    })
      .catch((error) => {
        resolve(defaultValue.login)
      })
  })
}



export function menuList (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.SYS_MENU_LIST, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.menuList);
    })
      .catch((error) => {
        resolve(defaultValue.menuList)
      })
  })
}

export function resourceList (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.SYS_RESOURCE_LIST, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.resource);
    })
      .catch((error) => {
        resolve(defaultValue.resource)
      })
  })
}

export function roleList (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.SYS_ROLE_LIST, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.roleList);
    })
      .catch((error) => {
        resolve(defaultValue.roleList)
      })
  })
}

export function userList (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.SYS_USER_PAGE, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(userList);
    })
      .catch((error) => {
        resolve(userList)
      })
  })
}
export function menuLists (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.GET_MENUS, params).then(response => {
      resolve(response.data.menus);
    }, err => {
      resolve(userList);
    })
      .catch((error) => {
        resolve(userList)
      })
  })
}
export function msgList (params) {
  return new Promise((resolve, reject) => {
    axios.post(api.SYS_ROLE_MSG, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.msgList);
    })
      .catch((error) => {
        resolve(defaultValue.msgList)
      })
  })
}
export function getCompose (params) {
  return new Promise((resolve, reject) => {
    axios.post(api.SYS_COMPOSE, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.compose);
    })
      .catch((error) => {
        resolve(defaultValue.compose)
      })
  })
}
export function getMessage (params) {
  return new Promise((resolve, reject) => {
    axios.post(api.SYS_ROLE_GETMSG, params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.message);
    })
      .catch((error) => {
        resolve(defaultValue.message)
      })
  })
}

