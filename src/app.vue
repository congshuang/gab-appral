<template>
  <div class="entry">
    <diyHeader></diyHeader>
    <diy-aside></diy-aside>
    <div class="content-wrapper" :class="{ slideCollapse: isCollapse,mobileSide:!isCollapse}" style="height: 100%;">
      <el-scrollbar tag="div" wrapClass="content-scrollbar">
        <section class="content">
          <transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut" appear>
            <router-view class="router"></router-view>
          </transition>
          <imp-footer></imp-footer>
        </section>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import Stomp from 'stompjs'
  import diyHeader from './components/layout/header'
  import diyAside from './components/layout/aside'
  import impFooter from './components/layout/footer'
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import types from './store/mutation-types'
  import * as api from "./api"
  export default {
    name: 'entry',
    data(){
      return {
        backTheme:["#fff","#222222","#522b76","#31271e","#981b1b","#00a651","#e8b51b","#003471"],
        backColor:"#fff",
        size: "100%",
        fl: "right",
        color: "#000",
        websock: null,
        client: null,
        changed:false
      }
    },
    components: {diyHeader, diyAside,impFooter},
    computed: {
      ...mapGetters({
        isCollapse: 'collapse',
        indexskin: 'indexskin'
      })
    },
    mounted(){


    },
    created(){

      this.initWebSocket();
    },
    methods:{
      ...mapMutations({
        setWebsocket: types.SET_WEBSOCKET,
        setChange: types.SET_CHANGE,
        setUserInfo: types.SET_USER,
        setMsgList: types.SET_MSG_LIST,
        setSysList: types.SET_SYS_LIST,
      }),
      close(){
        this.isShow = false;
      },
      initWebSocket(){ //初始化weosocket
        const wsuri = "ws://10.6.10.114:8888/socket/wisely";
        this.websock = new WebSocket(wsuri);
        this.setWebsocket(this.websock);
        this.client = Stomp.over(this.websock);
        this.$http.get(api.SYS_SET_FIND)
          .then(res => {
            let resList = res.data.content;
            let resData = resList[0];
            this.setUserInfo(resData);
          }).catch(e => {
        });
        //ws地址
        this.client.connect({},this.responseCallback, this.onFailed);
      },
      responseCallback(frame){
        let that = this;
        this.client.subscribe('/topic/spread',function (res) {
          let resBody = JSON.parse(res.body).content;
          that.changeList();
          that.$notify({
            title: '群发提示',
            message: resBody,
            position: 'bottom-right'
          });
        });
        this.client.subscribe('/topic/system',function (res) {
          let resBody = JSON.parse(res.body).content;
          that.changeSysList();
          that.$notify({
            title: '群发提示',
            message: resBody,
            position: 'bottom-right'
          });
        });
        this.client.subscribe('/user/queue/single',function (res) {
          console.log("stompresdsdaadsdsadsad",res);
          let resBody = JSON.parse(res.body).content;
          that.changeList();
          that.$notify({
            title: '单发提示',
            message: resBody,
            position: 'bottom-right'
          });
        });

      },
      onFailed(frame) {
        console.log('Failed: ' + frame)
      },
      changeSysList(){
        this.$http.get(api.CHAT_MSG_LIST+ "?messageType=2")
          .then(res => {
            this.setSysList(res.data.content);
          }).catch(e => {
          this.$message('操作失败');
        });
      },
      changeList(){
        this.$http.get(api.CHAT_MSG_LIST+ "?messageType=1")
          .then(res => {
            this.setMsgList(res.data.content);
          }).catch(e => {
          this.$message('操作失败');
        });

      }
    },
    watch: {
      'indexskin' :function (index) {
        let theme = this.backTheme;
        this.backColor = theme[index];
        if(index != 0){
          this.color = "#fff"
        }
      }
    }
  }
</script>

<style>
  .sysCall{
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 300px;
    height: 300px;
  }
  body{
    margin:0;
  }
  .entry{
    width: 100%;
    height: 100%;
  }
  .header{
    position: fixed;
    min-width: 100%;
    -webkit-box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
    box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
    z-index: 1999;
    -webkit-animation-name: slideInDown;
    animation-name: slideInDown;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    height: 50px;
    background-color: #fff;
    text-align: left;
    line-height: 50px;

  }
  .animated {
    animation-duration: .2s;
  }

  blockquote, body, dd, dl, dt, fieldset, figure, h1, h2, h3, h4, h5, h6, hr, html, iframe, legend, li, ol, p, pre, textarea, ul {
    margin: 0;
    padding: 0;
  }

  *,:after, :before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .router{
    min-height: 500px;
    background-color: #fff;
  }
  .content-wrapper {
    -webkit-transition: -webkit-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    -moz-transition: -moz-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    -o-transition: -o-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    transition: transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    padding-top: 50px;
    background-color: #f5f5f5;
  }
  .inWrap{
    margin-left: 44px;
  }.outWrap{
     margin-left: 230px;
   }
  .content-scrollbar{
    height: calc(100vh - 50px);
  }

  .content-wrapper .el-scrollbar__bar.is-vertical{
    display: none;
  }

  .content-wrapper .content {
    padding: 1.25rem;
  }

  .slideCollapse{
    margin-left: 44px;
  }

  .mobileSide{
    margin-left: 230px;
  }

</style>
