<template>
  <header class="main-header animated">
    <div class="logo">
      <div class="logo-lg" style="font-size: 17px;text-align: left"><span v-if="ifor" class="logo_img"><i class="fa fa-diamond back-theme"></i></span><img class="logo_img" :src='getpath(user.content)' v-else><div class="mip-title back-theme"><b>{{user.name ? user.name:"一窗通用审批系统"}}</b></div></div>
    </div>
    <nav class="navbar">
      <div class="navbar-custom-menu">
        <span class="back-theme">欢迎您登录!</span>
        <el-dropdown class="navbar-dropdown" trigger="click"  hide-on-click v-if="syslist.length != 0">
          <div class="el-dropdown-link" style="height: auto;line-height: inherit">
            <el-badge :value="sysLen" class="item">
              <i class="fa fa-exclamation-triangle back-theme"></i>
            </el-badge>
          </div>
          <el-dropdown-menu slot="dropdown" divided="true">
            <el-dropdown-item v-for="(item,index) in syslist" class="message-list">
              <div @click="clickList(item)" class="el-item">
                <p class="el-item-p">
                  {{item.content}}
                </p>
                <p class="el-item-p el-item-span">
                  <span class="el-item-span">{{setTimeDate(item.createdAt)}}</span>
                </p>
              </div>
            </el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>
        <span class="navbar-dropdown" v-if="syslist.length == 0" @click="changeTo()">
          <span class="el-dropdown-link" style="height: auto;line-height: inherit">
            <i class="fa fa-exclamation-triangle back-theme"></i>
          </span>
        </span>
        <el-dropdown class="navbar-dropdown" trigger="click"  hide-on-click v-if="list.length != 0">
          <div class="el-dropdown-link" style="height: auto;line-height: inherit">
            <el-badge :value="listLen" class="item">
              <i class="fa fa-envelope-o back-theme"></i>
            </el-badge>
          </div>
          <el-dropdown-menu slot="dropdown" divided="true">
            <el-dropdown-item v-for="(item,index) in list" class="message-list">
              <div @click="clickList(item)" class="el-item">
                <p class="el-item-p">
                  <span>{{item.name}}</span>
                  <span class="el-item-span">-{{setTimeDate(item.createdAt)}}</span>
                </p>
                <p class="el-item-p el-item-span">
                  {{item.content}}
                </p>
              </div>
            </el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>
        <span class="navbar-dropdown" v-if="list.length == 0" @click="changeTo()">
          <span class="el-dropdown-link" style="height: auto;line-height: inherit">
            <i class="fa fa-envelope-o back-theme"></i>
          </span>
        </span>
        <el-dropdown class="navbar-dropdown" trigger="click"  hide-on-click>
          <div class="el-dropdown-link" style="height: auto;line-height: inherit">
            <i class="fa fa-user-o back-theme"></i>
          </div>
          <el-dropdown-menu slot="dropdown" divided="true">
            <el-dropdown-item v-for="(it,index) in listView" class="message-list">
              <p @click="clickView(index)">{{it}}</p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click" class="navbar-dropdown" hide-on-click>
          <div class="el-dropdown-link">
            <img :src='getsrc(userInfo.avatar)' style="width: 25px;height: 25px;border-radius: 50%; vertical-align: middle;">
            <span class="back-theme">{{userInfo.name}}</span>
          </div>
          <el-dropdown-menu slot="dropdown" style="padding: 0px">
            <el-dropdown-item class="message-list">
              <i class="fa fa-cogs back-theme"></i>
              <span @click="changeLimit">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item class="message-list">
              <i class="fa fa-power-off back-theme"></i>
              <span @click="logout">退出</span>
            </el-dropdown-item>
            <el-dropdown-item class="message-list" v-if="isshow">
              <i class="fa fa-wrench back-theme"></i>
              <span @click="routeSet">系统设置</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </nav>

  </header>
</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import * as api from "../../api"
  import * as sysApi from '../../services/sys'
  import types from '../../store/mutation-types'
  export default {
    name: 'myheader',
    data() {
      return {
        isshow:false,
        sysLen: 0,
        listLen: 0,
        themeColor: "",
        color: "#fff",
        color1: "#fff",
        listView:["白色","黑色","紫色","咖啡色","红色","绿色","黄色","蓝色"],
        fontTheme:["#000","#909399","#909399","#909399","#909399","#000","#909399","#909399"],
        backTheme:["#fff","#222222","#522b76","#31271e","#981b1b","#00a651","#e8b51b","#003471"],
      }
    },
    computed: {

      ...mapGetters([
        'userInfo',
        'change',
        'menuList',
        'user',
        'list',
        'syslist'

      ]),
      ifor(){
        let tf = (this.user.content == "" || !this.user.content);
        return tf;
      },

    },
    methods:{
      ...mapMutations({
        setIndex: types.SET_INDEX,
        setLog: types.SET_LOG,
        setMsgList: types.SET_MSG_LIST,
        setSysList: types.SET_SYS_LIST,
      }),
      setTimeDate(date){
        date = new Date(date);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y+"-"+m+"-"+d;
      },
      getpath(path){

        return "data:image/png;base64,"+path;
      },
      changeTo(){
        let redirectUrl = '/sys/chatting/inbox';
        this.$router.push({path: redirectUrl});

      },
      getsrc(path){

        if(path){
          return path;
        }else{
          return '../../../static/img/user.png';
        }
      },
      logout(){
        this.$http.get(api.LOGOUT)
          .then(res => {
            this.$router.push({path: '/login'});
          }).catch(error => {
          this.$message('退出失败');
        })
      },changeLimit(){
        this.$router.push({path: '/resetPwd'});
      },clickList(row){
        /*this.$router.push({path:'/sys/message',query:{id:id}});*/
        let obj = {
          senderId:row.sender,
          id:row.id,
          name:row.name,
          content:row.content,
          path:null,
          title:'标题',
          time:row.createdAt,
          email:'1461373703@qq.com',
          account:row.account,
          messageType:row.messageType
        };
        this.setLog(obj);
        let redirectUrl = '/sys/chatting/compose';
        this.$router.push({path: redirectUrl});
      },clickView(index){
        let colors = this.fontTheme;
        let color = colors[index];
        let colors1 = this.backTheme;
        let color1 = colors1[index];
        $(".back-theme").css("color",color);
        $(".main-header").css("background",color1);
        $(".navbar").css("background",color1);
        this.setIndex(index);
        window.localStorage.setItem('color-sid',index);
      },routeSet(){
        this.$router.push({path: '/settings'});
      }
    },
    mounted(){
      if(this.menuList !=="" && this.menuList !==null){
        this.isshow =true;
      }
      let index = window.localStorage.getItem('color-sid');
      if(index>=0){
        let colors = this.fontTheme;
        let color = colors[index];
        let colors1 = this.backTheme;
        let color1 = colors1[index];
        $(".back-theme").css("color",color);
        $(".main-header").css("background",color1);
        $(".navbar").css("background",color1);
        this.setIndex(index);
      }
    },
    created(){

      this.$http.get(api.CHAT_MSG_LIST+ "?messageType=1")
        .then(res => {
          console.log("-----------",res);
          this.setMsgList(res.data.content);
        }).catch(e => {
        this.$message('操作失败');
      });
      this.$http.get(api.CHAT_MSG_LIST+ "?messageType=2")
        .then(res => {
          this.setSysList(res.data.content);
        }).catch(e => {
        this.$message('操作失败');

      });
    },
    watch: {
      'list': function (index) {
          this.listLen = index.length;
      },'syslist': function (index) {
          this.sysLen = index.length;
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .animated {
    animation-duration: .2s;
  }

  .main-header a {
    text-decoration: none;
    color: #48576a;
  }

  .main-header {
    position: fixed;
    min-width: 100%;
    box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
    z-index: 1999;
    animation-name: slideInDown;
    animation-fill-mode: both;
    color: #48576a;
  }

  .main-header .navbar .sidebar-toggle {
    float: left;
    background-color: transparent;
    background-image: none;
    padding: 15px 15px;
    font-family: fontAwesome;
    line-height: 20px;
  }

  .main-header .navbar .sidebar-toggle:before {
    content: "\f03b";
  }

  .main-header {
    background-color: #ffffff;
  }

  .main-header .logo {
    -webkit-transition: width 0.3s ease-in-out;
    -o-transition: width 0.3s ease-in-out;
    transition: width 0.3s ease-in-out;
    display: block;
    float: left;
    height: 50px;
    font-size: 20px;
    line-height: 50px;
    text-align: center;
    width: 400px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    padding: 0 15px;
    font-weight: 300;
    overflow: hidden;
    text-decoration: none;
  }

  .main-header .logo .logo-lg {
    display: block;
    height: 38px;
    line-height: 38px;
    margin-top: 6px;
  }

  .main-header .navbar {
    -webkit-transition: margin-left 0.3s ease-in-out;
    -o-transition: margin-left 0.3s ease-in-out;
    transition: margin-left 0.3s ease-in-out;
    margin-bottom: 0;
    margin-left: 400px;
    border: none;
    min-height: 50px;
    border-radius: 0;
    background-color: #ffffff;
  }

  .layout-top-nav .main-header .navbar {
    margin-left: 0;
  }


  body.hold-transition .main-header .navbar,
  body.hold-transition .main-header .logo {
    -webkit-transition: none;
    -o-transition: none;
    transition: none;
  }

  .main-header .navbar .sidebar-toggle {
    display: block;
  }

  .main-header .navbar .sidebar-toggle:hover {
    background: #f9f9f9;
  }

  .main-header .logo {
    border-bottom: 0 solid transparent;
  }


  @media (max-width: 800px) {

    .main-header .logo {
      display: none;
    }

    .main-header .navbar {
      margin: 0;
    }

    .main-header .logo, .main-header .navbar {
      width: 100%;
    }

  }
  .main-header.closeLogo .navbar{
    margin-left: 44px;
  }

  .main-header.closeLogo .logo{
    width: 44px;
    padding: 0 8px;
  }
  .main-header.closeLogo .logo .logo-lg b{
    display: none;
  }
  .main-header.closeLogo .sidebar-toggle {
    background: #f9f9f9;
  }

  .main-header.closeLogo .navbar .sidebar-toggle:before {
    content: "\f03c";
  }

  .main-header.mobileLogo .navbar .sidebar-toggle:before {
    content: "\f03a";
  }

  .navbar-custom-menu{
    float: right;
  }

  .navbar-custom-menu .el-dropdown-link{
    cursor: pointer;
    height: 50px;
    padding: 13px 5px;
    min-width: 50px;
    text-align: center;
  }
  .navbar-custom-menu .el-dropdown-link img{
    background-color: #108ee9;
  }

  .navbar-custom-menu .el-dropdown-link:hover{
    background: #f9f9f9;
  }
  .message-list{
    list-style: none;
  }
  .message-list a{
    text-decoration: none;
    color: #666666;
  }

  .el-dropdown-menu .header-pic{
    text-align: center;
    background-color: #108ee9;
    padding: 20px;
  }
  .el-dropdown-menu .header-pic img{
    vertical-align: middle;
    height: 90px;
    width: 90px;
    border: 3px solid;
    border-color: transparent;
    border-color: hsla(0,0%,100%,.2);
    background-color: #108ee9;
  }
  .el-dropdown-menu .header-pic p{
    font-size: 1.5rem;
    color: #ffffff;
  }
  .el-dropdown-menu .pull-left{
    background-color: #f9f9f9;
    padding: 10px;
    display: inline-block;
    float: left;
  }
  .el-dropdown-menu .pull-right{
    background-color: #f9f9f9;
    padding: 10px;
    float: right;
    display: inline-block;
  }
  .logo_img{
    float: left;
    height: 38px;
  }
  .mip-title{
    float: left;
    height: 38px;
    margin-left: 10px;
  }
  .el-item{
    height: 50px;
  }
  .el-item-p{
    height: 50%;
    line-height: 25px;
  }
  .el-item-span{
    color: #b8b8b8;
  }
</style>
