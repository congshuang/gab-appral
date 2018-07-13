<template>
  <div class="mail">
    <div class="boxs-header">
      <p class="boxs-title">{{log.title}}</p>
      <div class="boxs-search">
        <el-tag v-if="log.messageType == '1'">个人消息</el-tag>
        <el-tag v-else>系统消息</el-tag>
        <el-button size="small" style="background-color: #f3f4f4;color: #000;"> <i class="fa fa-print"></i></el-button>
        <el-button size="small" style="background-color: #f3f4f4;color: #000;"> <i class="fa fa-trash-o"></i></el-button>
        <el-button size="small" style="background-color: black;color: #fff;" @click="reply">{{sender}} <i class="fa fa-mail-reply"></i></el-button>
      </div>
    </div>
    <div class="boxs-header" style="background-color: #f3f4f4;border-bottom: 1px solid #ebebeb;">
      <p class="boxs-title" style="margin-right: 10px;">
        <img :src='setPath(log.path)' style="width: 30px;height: 30px;border-radius: 50%;">
      </p>
      <p class="boxs-title" style="font-size: 14px;padding-top: 5px;">
        发件人: <span style="color: red;">{{log.name}}</span> </p>
      <div class="boxs-search" style="text-align: right;padding-top: 5px;">
        <span style="color: black;font-size: 12px;">{{setTimeDate(log.time)}}</span>
      </div>
    </div>
    <div class="mail-article">{{log.content}}</div>
  </div>
</template>
<script>

  import panel from "../../components/panel.vue"
  import treeter from "../../components/treeter"
  import merge from 'element-ui/lib/utils/merge';
  import * as sysApi from '../../services/sys'
  import qs from "qs"
  import * as api from "../../api"
  import * as utils from '../../common/utils'
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import types from '../../store/mutation-types'
  export default {
    mixins: [treeter],
    components: {

    },
    data(){
      return {
        conData:{},
        sender:''
      }
    },
    computed:{
      ...mapGetters([
        'log'
      ])
    },
    methods: {
      setTimeDate(date){
        date = new Date(date);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y+"-"+m+"-"+d;
      },
      ...mapMutations({
        setSenderId: types.SET_SENDERID,
        setMsgList: types.SET_MSG_LIST,
        setSysList: types.SET_SYS_LIST,
      }),
      reply(){
        let redirectUrl = '/sys/chatting/sent';
        let allId = false;
        if(this.log.messageType == '1'){
          this.setSenderId(allId);
          this.$router.push({path: redirectUrl,query:this.log});
        }else{
          this.$router.push({path: '/desk'});
        }


      },
      loadData(){
        this.$http.get(api.CHAT_INFO + "?mailIds=" + this.log.id)
          .then(res => {
            this.changeList();
          }).catch(e => {
          this.$message('操作失败');
        });
      },
      setPath(path){
        if(path){
          return path;
        }else{
          return '../../../static/img/user.png';
        }
      },
      changeList(){
        if(this.log.messageType == '1'){

          this.sender = '回复';
          this.$http.get(api.CHAT_MSG_LIST+ "?messageType=1")
            .then(res => {
              this.setMsgList(res.data.content);
            }).catch(e => {
            this.$message('操作失败');
          });
        }else{
          this.sender = '前往';
          this.$http.get(api.CHAT_MSG_LIST+ "?messageType=2")
            .then(res => {
              this.setSysList(res.data.content);
            }).catch(e => {
            this.$message('操作失败');

          });
        }

      }
    },
    created(){

    },
    mounted(){
      this.loadData();
    },
    watch: {
      'log': function (route) {
        this.loadData();
      },
    }

  }
</script>

<style>
  .mail{
    width: 100%;
    height: 100%;
  }
  .mail-article{
    padding-right: 20px;
    padding-left: 20px;
    padding-top: 20px;
    text-indent: 20px;
    line-height: 25px;
  }
  .boxs-header{
    width: 100%;
    height: 70px;
    padding: 20px;
  }
  .boxs-title{
    font-size: 20px;
    float: left;
  }
  .boxs-search{
    float: right;
    width: 300px;
  }
</style>
