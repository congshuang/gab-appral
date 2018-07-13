<template>
  <div class="sent">
    <div class="boxs-header">
      <p class="boxs-title">发送箱</p>
      <div class="boxs-search" style="text-align: right;width: 350px;">
        <el-switch
          v-model="value"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="所有人发送"
          inactive-text="单人发送">
        </el-switch>
        <el-button size="small" style="background-color: #00a651;color: #fff;" @click="send('ruleForm')">发送 <i class="fa fa-send"></i></el-button>
      </div>
    </div>
    <div class="sent-header">
      <el-form ref="form" :model="form" label-width="80px">

        <el-form-item label="发送给" style="margin-bottom: 0px; border-bottom: 1px solid #ebebeb;" v-if="!value">
          <el-select v-model="form.region" filterable size="small" placeholder="" style="width: 100%;border:none;outline: none;">
            <el-option
              v-for="item in options"
              :key="item.account"
              :label="item.name"
              :value="item.account">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送给" style="margin-bottom: 0px;" v-else>
          <el-input v-model="form.sender" size="small" style="width: 100%;border:none;outline: none;" disabled></el-input>
        </el-form-item>
        <el-form-item label="标题" style="margin-bottom: 0px;">
          <el-input v-model="form.subject" size="small" style="width: 100%;border:none;outline: none;"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="sent-article">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="textarea">
          <el-input
            type="textarea"
            id="sent-textarea"
            placeholder="请输入内容"
            resize="none"
            v-model="ruleForm.textarea">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>


</template>
<script>
  import Stomp from 'stompjs'
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
        form:{
          subject:"",
          region:"",
          sender:"@所有人"
        },
        options:[],
        value:false,
        client:null,
        ruleForm:{
          textarea:"",
        },
        rules: {
          textarea: [
            {required: true, message: '请输入内容...', trigger: 'blur'},
            {max: 1000, message: '少于1000字...', trigger: 'blur'}
          ],
        }
      }
    },
    computed:{
      ...mapGetters([
        'sentId',
        'websoket',

      ])
    },
    methods: {
      ...mapMutations({
        setSenderId: types.SET_SENDERID
      }),
      send(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let agentData = this.ruleForm.textarea;
            if(this.value){
              this.client.send('/socket/spread',{},agentData);
              this.ruleForm.textarea = '';
            }else{
              let acount = this.form.region;
              let obj = {account:acount,message:agentData};
              this.client.send('/socket/single',{},JSON.stringify(obj));
              this.ruleForm.textarea = '';
            }
          } else {
            return false;
          }
        });


      },
      loadData() {
        this.$http.get(api.SYS_USER_PAGE_ALL)
          .then(res => {
            let dataList = res.data.content;
            this.options = dataList;
          }).catch(e => {
          this.$message('操作失败');
          });
      }
    },
    created(){
      this.loadData();
      this.value = this.sentId;
      this.form.region = (this.$route.query)['account'];

    },
    mounted(){
      this.client = Stomp.over(this.websoket);
      console.log("sssssssssssssssssssssssssssssssssss",this.websoket)
    },
    watch: {
      'value': function (index) {

        this.setSenderId(index);
      },
    }
  }
</script>

<style>
  .boxs-header{
    width: 100%;
    height: 70px;
    padding: 20px;
  }
  .sent-header{
    width: 100%;
    height: 101px;
    padding: 10px;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
  }
  .boxs-title{
    font-size: 20px;
    float: left;
  }
  .boxs-search{
    float: right;
    width: 300px;
  }
  .sent-article{
    position: relative;
    padding-right: 20px;
    padding-left: 20px;
    padding-top: 20px;
  }
  #sent-textarea{
    width: 100%;
    height: 300px;
  }
</style>
