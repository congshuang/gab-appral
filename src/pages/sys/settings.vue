<template>

  <imp-panel>
    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">
      <el-col :span="8" :xs="24" :sm="24" :md="8" :lg="8" style="margin-bottom: 20px;">
        <el-upload
          class="upload-demo"
          drag
          :action="getaction"
          multiple
          name="file"

          :file-list="fileList"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          style="width: 100%">
          <i class="el-icon-upload" v-if="img"></i>
          <img :src='getsrc(base64)' alt="" class="set-img" v-else>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip" style="text-align: center;color: #cecece">只能上传图片文件，且不超过2M</div>
        </el-upload>
      </el-col>
      <el-col :span="16" :xs="24" :sm="24" :md="16" :lg="16">
        <el-card class="box-card">
          <div class="text item">
            <el-form ref="form" :model="form" label-width="100px" :rules="rules">
              <el-form-item label="模板名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="底部名称" prop="bottom">
                <el-input v-model="form.bottom"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </imp-panel>

</template>
<script>

  import panel from "../../components/panel.vue"
  import treeter from "../../components/treeter"
  import merge from 'element-ui/lib/utils/merge';
  import qs from "qs"
  import * as utils from '../../common/utils'
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import * as api from "../../api"
  import * as sysApi from '../../services/sys'
  import types from '../../store/mutation-types'
  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
    },
    data(){
      return {
        config:false,
        base64:"",
        form: {
          id:"",
          icon:"",//上id
          name:"",//自定义名字
          bottom:"",
        },
        img:true,
        fileList:[],
        rules: {
          bottom: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入名称', trigger: 'change' }
          ],

        },
      }
    },
    computed:{
      getaction(){
        return api.SYS_UPLOAD;
      },
    },
    methods: {
      ...mapMutations({
        setUserInfo: types.SET_USER
      }),
      getsrc(path){
          return "data:image/png;base64,"+path;
      },
      /*上传成功的回调*/
      uploadSuccess(response, file, fileList){
        let num = fileList.length-1;
        this.fileList= [];
        this.fileList.push(fileList[num]);
        let data = response.content;
        let res = {};
        let resData = data[0];
        res.icon = resData.id;
        merge(this.form,res);
        console.log("adssssssssssssssssssssssssssssssss",this.form);

      },
      /*失败的回调*/
      uploadError(err, file, fileLis){
        this.$message('上传失败');

      },
      newAdd(){
        this.form = {
          id:"",
          icon:"",//上id
          name:"",//自定义名字
          bottom:"",
        };
        this.fileList= [];
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.form.icon){
              this.$http.post(api.SYS_SET_SUBMIT, this.form)
                .then(res => {
                  this.config = true;
                  this.loadData();

                }).catch(e => {
                this.$message('操作失败');
              })
            }else{
              this.$message('请上传通知书模板...');
            }

          } else {
            return false;
          }
        });

      },
      loadData(){
        this.$http.get(api.SYS_SET_FIND)
          .then(res => {
            let data = {};
            let resList = res.data.content;
            let resData = resList[0];
            data.id = resData.id;
            data.icon = resData.icon;
            data.bottom = resData.bottom;
            data.name = resData.name;
            this.base64 = resData.content;
            if(resData.content !== ""){
              this.img = false;
            }
            if(this.config){
              this.setUserInfo(resData);
            }
            merge(this.form,data);

          }).catch(e => {
          this.$message('操作失败');
        })
      }
    },
    created(){
      this.loadData();
    }
  }
</script>

<style>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .box-card{
    border: 1px solid #ebeef5;
    background-color: #fff;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  .clearfix:after {
    clear: both
  }
  .box-out{
    width: 100%;
    box-sizing: border-box;
    height: 354px;
  }
  .set-img{
    font-size: 67px;
    color: #c0c4cc;
    margin: 40px 0 16px;
    line-height: 50px;
    width: 67px;
    height: 67px;
  }

</style>
