export const CONTEXT = process.env.API_HOST;
export const SOCKET = process.env.API_CLIENT;
/*跨域标识路径*/
export const STOMP = SOCKET + '/socket/wisely2';
/*登录*/
export const LOGIN = CONTEXT + '/login';
export const GET_MENUS = CONTEXT + '/userinfo';
/*退出*/
export const LOGOUT = CONTEXT + '/logout';
/*验证*/
export const LOGINVOID = CONTEXT + '/checklogin';
/*角色路径*/
export const SYS_ROLE_LIST = CONTEXT + '/role/all';
export const SYS_ROLE_SAVE = CONTEXT + '/role/save';
export const SYS_ROLE_UPDATE = CONTEXT + '/role/update';
export const SYS_ROLE_DELETE = CONTEXT + '/role/delete';
/*资源路径*/
export const SYS_RESOURCE_LIST = CONTEXT + '/resource/rests';
export const SYS_RESOURCE_UPDATE = CONTEXT + '/resource/update';
export const SYS_RESOURCE_ADD = CONTEXT + '/resource/save';
export const SYS_RESOURCE_DELETE = CONTEXT + '/resource/delete';
/*菜单路径*/
export const SYS_MENU_ADD = CONTEXT + '/menu/save';
export const SYS_MENU_LIST = CONTEXT + '/menu/all';
export const SYS_MENU_UPDATE = CONTEXT + '/menu/update';
export const SYS_MENU_DELETE = CONTEXT + '/menu/delete';
/*配置资源*/
export const SYS_SET_ROLE_RESOURCE = CONTEXT + '/role/resource/save';
export const SYS_SET_ROLE_MENU = CONTEXT + '/role/menu/save';
export const SYS_ROLE_RESOURCE = CONTEXT + '/role/resources';
export const SYS_ROLE_MENU = CONTEXT + '/role/menus';
/*用户管理*/
export const SYS_USER_PAGE = CONTEXT + '/user/page';
export const SYS_USER_PAGE_ALL = CONTEXT + '/user/all';
export const GET_FLAG = CONTEXT + '/user/editable';
export const SYS_SET_ROLE_USER = CONTEXT + '/user/role/save';
export const SYS_USER_ROWS = CONTEXT + '/user/roles';
export const SYS_USER_ADD = CONTEXT + '/user/save';
export const SYS_USER_UPDATE = CONTEXT + '/user/update';
/*外网审批的接口*/
export const GBA = process.env.API_HOST;

//获取分页的业务列表
export const getmatterchilds = GBA + '/matterchild/register';
//根据业务id获取业务信息
export const getmatterchildinfo = GBA + '/matterchild/info?id=';
//暂存
export const save = GBA + '/process/savetemp';
//查询暂存数据
export const gettemp = GBA + '/process/gettemp?processId=';
//接件
export const receive = GBA + '/process/save';
//获取接件后的信息
export const getreceive = GBA + '/process/get?taskId=';
//文件上传
export const paperupload = GBA + '/upload/savefile';
//文件下载
export const paperdownload = GBA + '/upload/getfile';
//删除文件删除
export const deleteuploadflie = GBA + '/upload/delete?ids=';
//加载所有用户
export const getallusers = GBA + '/zone/getzoneuser';
//加载当前部门所有用户
export const getusers = GBA + '/user/all';
//更新表单信息并且受理
export const updateprocessbaseinfo = GBA + '/process/update';
//业务流转
export const dotask = GBA + '/process/dotask';
//查询工作台的待办事项统计量
export const gettoal = GBA + '/process/gettotal';
//查询流程实例
export const gettask = GBA + '/process/gettask?processId=';
//查询工作台待接件的信息
export const getstay = GBA + '/process/getstay';
//查询环节待办信息
export const gettaskstay = GBA + '/process/gettaskstay';
//查询申请人证件编号
export const getpaperno = GBA + '/applicant/getpaperno';
//查询申请人
export const getapplicant = GBA + '/applicant/getapplicant';
//查询证照库信息
export const getevidence = GBA + '/applicant/getevidence';
//删除纸质删除状态
export const deleteall = GBA + '/upload/deleteall'
//暂停审批
export const dosuspend = GBA + '/process/dosuspend'
//恢复审批
export const dorecovery = GBA + '/process/dorecovery'
//判断当前环境
export const isNotProd = process.NODE_ENV == 'production' ? false : true;
/*word通知书*/
export const SYS_FORM_TABLE = CONTEXT + '/advice/get';
export const SYS_FORM_All = CONTEXT + '/department/all';
export const SYS_SUBMIT = CONTEXT + '/advice/save';
export const SYS_SET_SUBMIT = CONTEXT + '/sysconfiguer/add';
export const SYS_SET_FIND = CONTEXT + '/sysconfiguer/find';
export const SYS_DELETE = CONTEXT + '/advice/delete';
export const SYS_EDIT = CONTEXT + '/advice/delete';
export const SYS_FIND = CONTEXT + '/element/list';
export const SYS_UPDATE_LIST = CONTEXT + '/element/save';
export const SYS_ALTER = CONTEXT + '/advice/update';
export const SYS_UPLOAD = CONTEXT + '/upload/savefile';
/*通知书打印*/
/*export const SYS_ADVICE_LIST = CONTEXT + '/advice/list';*/
/*export const SYS_ADVICE_LIST = CONTEXT + '/advice/linklist';*/
export const SYS_ADVICE_PRINT = CONTEXT + '/advice/doprint';
export const SYS_ADVICE_HTML = CONTEXT + '/advice/dohtml';
export const SYS_ADVICE_HTML_LOOK = CONTEXT + '/advice/dohtmllook';
export const SYS_FORM_UPLOAD = CONTEXT + '/advicedata/list';
export const SYS_FORM_EDIT = CONTEXT + '/advicedata/update';
export const SYS_MONI_PRINT = CONTEXT + '/advice/dopreview';
export const SYS_ROLE_MSG = CONTEXT + '/advice/msg';
export const SYS_ROLE_GETMSG = CONTEXT + '/advice/msg';
export const SYS_COMPOSE = CONTEXT + '/advice/compose';
/*chat*/
export const CHAT_LIST = CONTEXT + '/message/list';
export const CHAT_INFO = CONTEXT + '/message/status';
export const CHAT_USER = CONTEXT + '/message/user';
export const CHAT_USER_DELETE = CONTEXT + '/message/del';
export const CHAT_MSG_LIST = CONTEXT + '/message/all';
