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
          accept=".doc"
          :file-list="fileList"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          style="width: 100%">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip" style="text-align: center;color: #cecece">只能上传docx文件，且不超过2M</div>
        </el-upload>
      </el-col>
      <el-col :span="16" :xs="24" :sm="24" :md="16" :lg="16">
        <el-card class="box-card">
          <div class="text item">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
              <el-form-item label="模板名称" prop="fileName">
                <el-input v-model="form.fileName"></el-input>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-input v-model="form.uploadDate" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="环节" prop="link">
                <el-select v-model="form.link" placeholder="请选择环节">
                  <el-option label="已接件" value="CONNECTOR"></el-option>
                  <el-option label="已受理" value="ACCEPT"></el-option>
                  <el-option label="已审批" value="AUDIT"></el-option>
                  <el-option label="待补正" value="SUPPLEMENT"></el-option>
                  <el-option label="异常办结" value="ABNORMAL"></el-option>
                  <el-option label="已办结" value="FINISH"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="委办局" prop="department">
                <el-select v-model="form.department" placeholder="请选择委办局">
                  <el-option v-for="it in department" :key="it.code" :label="it.name" :value="it.code" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="区划编码" prop="zoneCode">
                <el-select v-model="form.zoneCode" placeholder="请选择区划编码">
                  <el-option label="区划编码1" value="1"></el-option>
                  <el-option label="区划编码2" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div slot="body">
      <el-row style="width: 100%;padding-bottom: 20px;">
        <el-col :span="24">
          <div class="el-input" style="width: 200px; float: right;">
            <i class="el-input__icon el-icon-search" style="position: absolute;right: 0px;color: #c0c4cc;"></i>
            <input type="text" placeholder="输入用户名称" v-model="searchKey" @keyup.enter="search($event)"
                   class="el-input__inner" style="padding-right: 30px;">
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="tableData.rows"
        border
        style="width: 100%"
        v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <el-table-column
          prop="fileName"
          label="模板名称">
        </el-table-column>
        <el-table-column
          width="200px"
          prop="uploadDate"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="linkText"
          label="环节">
        </el-table-column>
        <el-table-column
          prop="departmentText"
          label="委办局">
        </el-table-column>
        <el-table-column
          prop="zoneCodeText"
          label="区划编码">
        </el-table-column>
        <el-table-column label="操作" width="285">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="default"
              icon="edit"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="small"
              type="default"
              icon="edit"
              @click="openEditPrintDialog(scope.$index, scope.row)">模拟打印
            </el-button>
            <el-button
              size="small"
              type="default"
              icon="edit"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.pagination.pageNo"
        :page-sizes="[5, 10, 20]"
        :page-size="tableData.pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.pagination.total">
      </el-pagination>
      <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="1100px">
        <div class="box-out">
          <el-upload
            class="upload-demo"
            drag
            :action="getaction"
            multiple
            name="file"
            accept=".doc"
            :file-list="fileList1"
            :on-success="uploadSuc"
            :on-error="uploadError"
            style="width: 40%;box-sizing: border-box;float: left;">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip" style="text-align: center;color: #cecece">只能上传docx文件，且不超过2M</div>
          </el-upload>

          <el-card class="box-card" style="width: 60%;float: left;box-sizing: border-box;">
            <el-form ref="formrow" :model="formrow" label-width="80px" :rules="rules">
              <el-form-item label="模板名称" prop="fileName">
                <el-input v-model="formrow.fileName"></el-input>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-input v-model="formrow.uploadDate" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="环节" prop="link">
                <el-select v-model="formrow.link" placeholder="请选择环节">
                  <el-option label="已接件" value="CONNECTOR"></el-option>
                  <el-option label="已受理" value="ACCEPT"></el-option>
                  <el-option label="已审批" value="AUDIT"></el-option>
                  <el-option label="待补正" value="SUPPLEMENT"></el-option>
                  <el-option label="异常办结" value="ABNORMAL"></el-option>
                  <el-option label="已办结" value="FINISH"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="委办局" prop="department">
                <el-select v-model="formrow.department" placeholder="请选择委办局">
                  <el-option v-for="its in department" :key="its.code" :label="its.name" :value="its.code" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="区划编码" prop="zoneCode">
                <el-select v-model="formrow.zoneCode" placeholder="请选择区划编码">
                  <el-option label="区划编码1" value="1"></el-option>
                  <el-option label="区划编码2" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-card>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="formupload('formrow')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="模拟打印" :visible.sync="dialogVisible" width="837px">
        <div id="print">
          <div class="img-out">
            <img  style="width: 797px;height: 1128px;" :src="pathSrc">
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="printInfo">打 印</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑数据" :visible.sync="pictureVisible" width="837px">
        <div class="dataprint">
          <form id="form1" onsubmit="return false" action="#" method="post">
            <div class="img-out">

            </div>
            <div>
             <input type="hidden" name="uploadId" v-model="printUploadId" />
            </div>
          </form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="pictureVisible = false">取 消</el-button>
          <el-button type="info" @click="printPreView">打印预览</el-button>
        </div>
      </el-dialog>
    </div>
  </imp-panel>

</template>
<script>

  import panel from "../../components/panel.vue"
  import treeter from "../../components/treeter"
  import merge from 'element-ui/lib/utils/merge';
  import * as sysApi from '../../services/sys'
  import qs from "qs"
  import * as api from "../../api"
  import * as utils from '../../common/utils'

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
    },
    data(){
      return {
        printUploadId:null,//用于打印
        pictureVisible:false,//控制是否显示可编辑的打印弹窗
        listLoading: false,
        dialogVisible:false,
        pathSrc:"",
        form: {
          id:"",
          uploadId:"",//上id
          fileName:"",//自定义名字
          fileType:"",
          uploadDate:"",//创建时间
          link:"",//环节
          department:"",//委办局
          zoneCode:"",//区划编码
        },
        fileList:[],
        fileList1:[],
        rules: {
          fileName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          link: [
            { required: true, message: '请选择一个环节', trigger: 'change' }
          ],
          department: [
            { required: true, message: '请选择一个委办局', trigger: 'change' }
          ],
          zoneCode: [
            { required: true, message: '请选择一个区划编码', trigger: 'change' }
          ],

        },
        formrow:{},
        searchKey: '',
        tableData: {
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        },
        dialogFormVisible:false,
        formLabelWidth: '120px',
        dataId:"",
        department:""
      }
    },
    computed:{
      getaction(){
        return api.SYS_UPLOAD;
      },
    },
    methods: {
      /*打印预览*/
      printPreView(){
        let that = this;
        $.ajax({
          //几个参数需要注意一下
          type: "POST",//方法类型
          dataType: "json",//预期服务器返回的数据类型
          url: api.SYS_MONI_PRINT ,//url
          data: $('#form1').serialize(),
          success: function (res) {
            console.log(res);
            that.pathSrc = "data:image/png;base64,"+res.content.content;
            that.dialogVisible = true;
          },
          error : function() {
            that.$message('操作失败');
          }
        });
      },
      //可编辑打印页面弹框
      openEditPrintDialog(index,row){
        //this.dataVal = value;
        this.pictureVisible = true;
        this.printUploadId = row.uploadId;
        this.$http.post(api.SYS_ADVICE_HTML_LOOK, {uploadId:row.uploadId})
          .then(res => {
            if(res.data.success){
              let html = res.data.content.html;
              let opt = $(".dataprint .img-out");
              opt.empty().append(html);
              opt.find("input[name='paperName']").after("<textarea name='paperName' cols='100' rows='5'></textarea>");
              opt.find("input[name='paperName']").remove();
            }else{
              this.$message({message:res.data.message,type:'error'});
              this.pictureVisible = false;
            }
          }).catch(e => {
            utils.consoleLog({message:'打印可编辑打印页面弹框错误信息',content:e});
          this.$message('操作失败');
          this.pictureVisible = false;
        })
      },
      /*输入内容转换*/
      placename(name){
        return "请输入"+name;
      },

      search(target){
        this.loadData();
      },
      handleSelectionChange(val){

      },
      /*打印*/
      printInfo(){
        $("#print").jqprint();
        this.dialogVisible = false;
      },
      /*上传成功的回调*/
      uploadSuccess(response, file, fileList){
        let num = fileList.length-1;
        this.fileList= [];
        this.fileList.push(fileList[num]);
        let data = response.content;
        let res = {};
        let resData = data[0];
        res.uploadId = resData.id;
        res.uploadDate = resData.createdAt;
        res.fileType = resData.name;

        merge(this.form,res);
      },
      /*上传成功的回调*/
      uploadSuc(response, file, fileList){
        console.log("------------",fileList)
        let num = fileList.length-1;
        this.fileList1= [];
        this.fileList1.push(fileList[num]);
        let data = response.content;
        let res = {};
        let resData = data[0];
        this.formrow.uploadId = resData.id;

      },
      /*失败的回调*/
      uploadError(err, file, fileLis){
        this.$message('上传失败');

      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.loadData();
      },
      newAdd(){
        this.form = {
          id:"",
          uploadId:"",//上id
          fileName:"",//自定义名字
          fileType:"",
          uploadDate:"",//创建时间
          link:"",//环节
          department:"",//委办局
          zoneCode:"",//区划编码
        };
        this.fileList= [];
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log("---------------",this.form.id)
            if(this.form.uploadId){
              this.$http.post(api.SYS_SUBMIT, this.form)
                .then(res => {
                  this.loadData();
                  this.newAdd();
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
      handleEdit(index, row){
        this.formrow = row;
        this.dialogFormVisible = true;
        let opt = {
          name:"",
          percentage:100
        };
        opt.name = row.fileName;
        this.fileList1 = [];
        this.fileList1.push(opt);
      },
      handlePrint(index, row){
        this.dialogVisible = true;
        this.$http.post(api.SYS_MONI_PRINT, {uploadId:row.uploadId})
          .then(res => {
            console.log(res);
            this.pathSrc = "data:image/png;base64,"+res.data.content.content;
            this.dialogVisible = true;
          }).catch(e => {
          this.$message('操作失败');
        })
      },
      formupload(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post(api.SYS_ALTER, this.formrow)
              .then(res => {
                this.formrow = {};
                this.dialogFormVisible = false;
                this.loadData();
                this.fileList1= [];
              }).catch(e => {
              this.$message('操作失败');

            })
          } else {
            return false;
          }
        });


      },
      handleDelete(index, row){
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(api.SYS_DELETE + "?id=" + row.id).then(res => {
            this.deleteList(this.tableData.rows,row.id);
            this.tableData.pagination.total = this.tableData.pagination.total-1;
          });
        });


      },
      loadData(){
        let opt ={
          filename:this.searchKey,
          page:this.tableData.pagination.pageNo-1,
          size:this.tableData.pagination.pageSize
        };
        this.$http.post(api.SYS_FORM_TABLE,opt)
          .then(res => {

            let dataList = res.data.content.content;
            console.log(dataList);
            let len = dataList.length;
            this.tableData.rows = dataList;
            this.tableData.pagination.total = len;

          }).catch(e => {
          this.$message('操作失败');

        });
        this.$http.get(api.SYS_FORM_All,{})
          .then(res => {
            this.department = res.data.content;
          }).catch(e => {
          this.$message('操作失败');

        });

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

</style>
