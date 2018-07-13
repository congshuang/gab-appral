import NotFoundView from "../components/404.vue";
import login from "../pages/sys/login.vue";
import chatting from "../pages/sys/chat.vue";
import compose from "../pages/sys/compose.vue";
import sent from "../pages/sys/sent.vue";
import inbox from "../pages/sys/inbox.vue";
import app from "../app.vue";
import menuList from "../pages/sys/menu.vue";
import message from "../pages/sys/message.vue";
import role from "../pages/sys/role.vue";
import resource from "../pages/sys/resource.vue";
import settings from "../pages/sys/settings.vue";
import sysUser from "../pages/sys/user.vue";
import userAdd from "../pages/sys/useradd.vue";
import resetPwd from "../pages/sys/resetpwd.vue";
import word from "../pages/sys/word.vue";
/**一窗*/
import matterlog from "../pages/approval/matterlog.vue";
import process from "../pages/approval/process.vue";
import desk from "../pages/approval/desk.vue";
// Routes
const routes = [
  {path: '/login', component: login ,name:'login'},
  {
    path: '/404', component: NotFoundView ,name:'404'
  },
  {
    path: '', component: app, name:'app', meta: { requiresAuth: true },children: [
    /*一窗*/
    {path:'/',component:matterlog , name: 'matterlog'},
    {path:'/matterlog',component:matterlog , name: 'matterlog'},
    {path:'/process',component:process, name: 'process'},
    {path:'/desk',component:desk, name: 'desk'},
    {path: '/resetPwd', component: resetPwd},
    {path: '/settings', component: settings},
    {path: '/sys/message', component: message},
    {path: '/sys/chatting', component: chatting,children:[
      {path: '/sys/chatting/sent', component: sent},
      {path: '/sys/chatting/compose', component: compose},
      {path: '/sys/chatting/inbox', component: inbox},
    ]},

    {path: '/sys/menuList', component: menuList},
    {path: '/sys/roleList', component: role},
    {path: '/sys/word', component: word},
    {path: '/sys/userList', component: sysUser},
    {path: '/sys/userAdd', component: userAdd},
    {path: '/sys/resource', component: resource}
  ]
  },

  {path: '*',redirect: '/404'}
]


export default routes

