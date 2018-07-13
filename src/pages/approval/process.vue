<!--流程处理组件-->
<template>
  <div>
    <el-row>
      <div class="fixed-top">
        <div class="top-title-div">
          <span>事项信息</span>
          <i class="el-icon-close" @click="clearData" style="cursor: pointer;"></i>
        </div>
        <div class="fui-toolbar">
          <!--放置操作按钮-->
          <div class="buttons">
            <el-button-group>
              <receiveBtn v-if="['CONNECTOR'].indexOf(currentProcess.state)!=-1"
                          :getDataFromComponent="getDataFromComponent"
                          :getFunctionFromProcess="getFunctionFromProcess"/>
              <clerkBtn v-else-if="['ACCEPT','SUPPLEMENT'].indexOf(currentProcess.state)!=-1" ref="clerkBtnComponent"
                        :getDataFromComponent="getDataFromComponent" :getFunctionFromProcess="getFunctionFromProcess"/>
              <auditBtn v-else-if="['AUDIT','SUSPEND'].indexOf(currentProcess.state)!=-1" ref="auditBtnComponent"
                        :getDataFromComponent="getDataFromComponent" :getFunctionFromProcess="getFunctionFromProcess"/>
              <finishBtn v-else-if="['WAITFINISH'].indexOf(currentProcess.state)!=-1" ref="finishBtnComponent"
                         :getDataFromComponent="getDataFromComponent" :getFunctionFromProcess="getFunctionFromProcess"/>
            </el-button-group>
          </div>
          <!--放置状态信息-->
          <div class="status">
            <p>申报方式：{{statusInfo.applyWay}}&nbsp;&nbsp;状态：{{statusInfo.state}}&nbsp;&nbsp;计时：{{statusInfo.timing}}</p>
            <p>文书打印:
              <el-dropdown @command="changeData" size="mini" split-button>
                文件列表
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in documentList"
                    :key="item.id" :command="item.id">{{item.fileName}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </p>
          </div>
        </div>
      </div>
      <el-col :span="24">
        <div style="width:100%;height:420px;overflow-y: auto;overflow-x: hidden;">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="01 事项信息" name="1">
              <!--引入业务信息组件-->
              <matterchildinfo ref="matterChildInfoComponent"></matterchildinfo>
            </el-collapse-item>
            <el-collapse-item
              :title="'02 办件信息  '+(processBaseinfo.serialNo==null?'':'('+'办件编号：'+processBaseinfo.serialNo+')')"
              name="2">
              <!--引入办件信息组件-->
              <Processbaseinfo ref="processFormInfoComponent" :changeDialogState="changeDialogState"
                               :getDataFromComponent="getDataFromComponent"></Processbaseinfo>
            </el-collapse-item>
            <el-collapse-item title="03 申报材料" name="3">
              <!--引入材料列表组件-->
              <Paperlist ref="paperListComponent" :changeDialogState="changeDialogState"
                         :setFileTableData="setFileTableData" :getDataFromComponent="getDataFromComponent"></Paperlist>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
    </el-row>

    <!--各种弹框-->
    <el-row>
      <!--材料上传弹框-->
      <el-col>
        <el-dialog title="材料上传" size="small" :visible.sync="dzDialogShow"
                   :before-close="updateDz">
          <el-button-group>

            <el-upload
              name="file"
              style="float: left"
              accept="file"
              :action="paperUploadUrl"
              :multiple=true
              :show-file-list=false
              :on-success="onSuccess"
            >
              <el-button type="primary" size="small"><i class="fa fa-upload fa-lg"></i>&nbsp;选择文件上传</el-button>
            </el-upload>
            <el-button type="primary" size="small" v-if="showDeleteBtn" @click="deleteBtnClick()"><i
              class="fa fa-times-circle fa-lg"></i>&nbsp;删除选中
            </el-button>
            <el-button type="primary" size="small" @click="updateDz"><i class="fa fa-save fa-lg"></i>&nbsp;确认并关闭
            </el-button>
          </el-button-group>
          <el-table
            :data="fileTableData"
            stripe
            highlight-current-row
            @selection-change="selectionChange"
            style="width: 100%">
            <el-table-column
              type="selection" header-align="center"
              align="center"
              prop="selected"
              width="70">
            </el-table-column>
            <el-table-column
              prop="name"
              label="附件名称" header-align="center"
              align="left"
            >
            </el-table-column>
            <el-table-column
              prop="time"
              label="添加时间" header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="look" header-align="center"
              align="center"
              label="查看" width="100">
              <template slot-scope="scope">
                <i class="fa fa-eye" style="cursor: pointer;" :data-id="scope.row.uploadId"
                   @click="paperDownload($event)"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </el-col>
      <el-dialog title="编辑数据" :visible.sync="pictureVisible" width="837px">
        <div class="dataprint">
          <form id="form1" onsubmit="return false" action="#" method="post">
            <div class="img-out">

            </div>
            <div>
              <input type="hidden" name="processId" v-model="processBaseinfo.id">
              <input type="hidden" name="adviceBookId" v-model="dataVal">
            </div>
          </form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="pictureVisible = false">取 消</el-button>
          <el-button type="info" @click="infoChange">打印预览</el-button>
        </div>
      </el-dialog>
      <el-dialog title="打印" :visible.sync="dialogFormVisible" width="837px">
          <div id="print">
              <div class="img-out">
                <img style="width: 797px;height: 1128px;" :src="pathSrc1">

              </div>
          </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="printInfo">打 印</el-button>
        </div>
      </el-dialog>
      <!--流程处理弹框-->
      <el-dialog title="流程处理" width="70%" :visible.sync="processingDialog">
        <el-row>
          <el-col :span="8">
            <div>
              <i class="fa fa-commenting"></i>&nbsp;签署意见
            </div>
            <el-input type="textarea" :rows="5" v-model="processSuggestion" resize="none"></el-input>
            <div>
              <i class="fa fa-code-fork"></i>&nbsp;步骤选择
            </div>

            <el-card style="width:100%;height: 200px;border: solid lightgray 1px;">
              <div v-for="obj in processOperates"
                   style="width:100%;border: solid #ff6603 1px;margin-bottom:10px;padding:5px 30px;">
                <el-radio class="radio" v-model="processSelected" :label="obj.label">{{obj.name}}</el-radio>
              </div>
            </el-card>
          </el-col>
          <el-col :span="16">
            <div>
              &nbsp;&nbsp;<i class="fa fa-users"></i>&nbsp;人员选择
            </div>
            <div
              style="margin-left:5px;width:100%;height: 338px;border: 1px solid lightgray;border-radius: 4px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);">
              <div style="border-bottom: 1px solid #e7e7e7;line-height: 30px;"><span
                style="cursor: pointer;padding:5px 0px;margin-left:10px;border-bottom: 2px solid #ff6603;color: #ff6603;">{{currentProcess.name}}</span>
              </div>
              <el-row>
                <el-col :span="12">
                  <div style="margin:5px;">
                    <el-tabs type="card" v-model="userTabActive" id="thisIsUserTab">
                      <el-tab-pane label="本部门" name="department">
                        <div class="user-tab">
                          <el-input
                            placeholder="请输入内容查询"
                            v-model="departmentUserFilterText" icon="search">
                          </el-input>
                          <div style="height: 5px"></div>
                          <el-tree
                            :data="departmentUserTreeData"
                            show-checkbox
                            default-expand-all
                            node-key="id"
                            ref="departmentUserTree"
                            highlight-current
                            :filter-node-method="filterNode"
                            @check-change="userSelected"
                            :props="defaultProps">
                          </el-tree>
                        </div>
                      </el-tab-pane>
                      <!--<el-tab-pane label="所有用户" name="all">
                        <div class="user-tab">
                          <el-input
                            placeholder="请输入内容查询"
                            v-model="allUserFilterText" icon="search">
                          </el-input>
                          <div style="height: 5px"></div>
                          <el-tree
                            :data="allUserTreeData"
                            show-checkbox
                            node-key="id"
                            ref="allUserTree"
                            highlight-current
                            :default-expanded-keys="[0]"
                            :filter-node-method="filterNode"
                            @check-change="userSelected"
                            :props="defaultProps">
                          </el-tree>
                        </div>
                      </el-tab-pane>-->
                    </el-tabs>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div style="margin:5px;">
                    <el-tabs type="card" v-model="selectedUserTabActive">
                      <el-tab-pane label="已选人员" name="selectedUser">
                        <div class="user-tab" style="overflow-y: visible;">
                          <div style="border-bottom: solid  #d1dbe5 1px;">
                            <el-tooltip class="select-user-operate" effect="dark" content="回到初始状态"
                                        placement="top">
                              <i class="fa fa-reply fa-lg" @click="deleteSelectedUser('reply')"></i>
                            </el-tooltip>
                            <el-tooltip class="select-user-operate" effect="dark" content="清空"
                                        placement="top">
                              <i class="fa fa-trash fa-lg" @click="deleteSelectedUser('clear')"></i>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="开启发送短信通知" placement="top">
                              <el-checkbox size="small" v-model="taskRequest.isMessage">短信通知</el-checkbox>
                            </el-tooltip>
                          </div>
                          <div style="width:100%;height: 224px;overflow-y: auto;border-bottom: solid  #d1dbe5 1px;">
                            <el-tree
                              :data="selectedUserTreeData"
                              node-key="id"
                              empty-text="没有人员"
                              ref="selectedUserTree"
                              highlight-current
                              :props="defaultProps">
                            </el-tree>
                          </div>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <span style="float:left">当前步骤：<span style="color: rgb(255, 102, 3);">{{currentProcess.name}}</span>&nbsp;&nbsp;当前操作：<span
            style="color: rgb(255, 102, 3);">送下一步</span></span>
          <el-button @click="processingDialog = false">取 消</el-button>
          <el-button type="primary" @click="completeProcessOperate()">确认提交</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>

</template>

<script>
  import * as URL from "../../api"
  import receiveBtn from './process/approvalbtn/receive'
  import clerkBtn from './process/approvalbtn/clerk'
  import auditBtn from './process/approvalbtn/audit'
  import finishBtn from './process/approvalbtn/finish'
  import Matterchildinfo from "./process/matterchildinfo";
  import Processbaseinfo from "./process/processforminfo";
  import Paperlist from "./process/paperlist";
  import * as utils from '../../common/utils';
  import treeter from "../../components/treeter"

  export default {
    mixins: [treeter],
    props: ['updateProcessState'],
    components: {
      Paperlist,
      Matterchildinfo,
      receiveBtn, clerkBtn, Processbaseinfo, auditBtn, finishBtn
    },
    data() {
      return {
        dialogFormVisible:false,
        dataVal:"",
        //记录流程状态信息
        statusInfo: {
          applyWay: '窗口登记',
          state: '初始化',
          timing: '未开始计时'
        },
        taskId: null,//用于保存流程实例id
        pictureVisible:false,
        pathSrc:"",
        pathSrc1:"",
        //业务流转查询参数
        taskRequest: {
          processId: null,//业务id
          message: null,//办理意见
          user: '张三',//下一步处理人
          status: null,//分支状态
          isMessage: null,//是否发送短信
        },
        value: "--文书列表--",
        matterChildId: null,//用于保存业务的id
        processStates: ['ACCEPT', 'AUDIT', 'SUPPLEMENT', 'FINISH'],//记录可以执行的流程操作
        //记录当前流程的状态
        currentProcess: {
          state: 'CONNECTOR',
          name: null,
        },
        //用来展示可以执行的步骤
        processOperates: [{
          name: '受理',
          label: 'ACCEPT'
        }],
        processSelected: 'ACCEPT',//默认选择下一步操作
        //用于保存被选中的人
        selectedUserTreeData: [{
          id: 1,
          name: '市_张三',
        }, {id: 2, name: '市_李四'}],
        //控制数目录的
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        departmentUserFilterText: '',//过滤本部门用户
        allUserFilterText: '',//过滤所有用户
        //保存所有用户的数据
        allUserTreeData: [{
          id: 0,
          name: '所有用户',
          children: [
            {id: 6, name: '本市级区域管理员(市本级)',},
            {id: -1, name: '市体育局', children: [{id: 3, name: '市_钱一'}, {id: 4, name: '市_钱二'}]},
            {id: -1, name: '市安监局', children: [{id: 2, name: '市_李四'}, {id: 1, name: '市_张三'}]},
            {id: -1, name: '市行政服务中心', children: [{id: 5, name: '市级中心管理员'}]}],
        }],
        //保存本部门的数据
        departmentUserTreeData: [{
          id: -1,
          name: '本部门',
          children: [],
        }],
        userTabActive: 'all',//用来记录用户选择激活的tab
        selectedUserTabActive: 'selectedUser',//用来记录已用户选择激活的tab
        processSuggestion: '同意!',//用来保存当前流程的信息
        processingDialog: false,//用于标识是否显示流程处理弹框
        paperChecked: false,//用于标识是否检验文件上传
        showDeleteBtn: false,//是否显示删除按钮
        fileTableData: [],//用于保存上传文件弹出框中已上传文件列表信息
        fileSelectedData: [],//用于保存上传文件弹出框中被选中的行
        dzDialogShow: false,//用于标识电子证件弹出框是否显示
        activeNames: ['1', '2', '3'],//用于控制默认显示的折叠面板
        // 办件信息
        processBaseinfo: {
          id: null,//业务id
          serialNo: null,//流水号
          matterChildId: null,//小项业务ID
          createDate: null,//创建时间
          finishDate: null,//完成时间
          acceptDate: null,//受理时间
          applyWay: null,//申请方式
          dueDate: null,//到期时间
          bit: null,//是否暂停
          stopDate: null,//暂停时间
          processBaseinfo: null,//办件信息
          paperUploadList: null,//附件材料
          activityList: null,//环节信息
          name: null,//事项名字
        },
        //文书打印 文书列表
        documentList: [],
        textid:"",
      };
    },
    computed: {
      'paperUploadUrl':

        function () {
          return URL.paperupload;
        }
      ,
    }
    ,
    methods: {
      /*打印编辑*/
      infoChange(){
        let that = this;
        $.ajax({
          //几个参数需要注意一下
          type: "POST",//方法类型
          dataType: "json",//预期服务器返回的数据类型
          url: URL.SYS_ADVICE_PRINT ,//url
          data: $('#form1').serialize(),
          success: function (result) {
            that.pathSrc1 = "data:image/png;base64,"+result.content.content;
            that.dialogFormVisible = true;
          },
          error : function() {
            that.$message('操作失败');
          }
        });
      },
      //设置状态信息
      setStatusInfo(obj) {
        this.statusInfo = obj;
      },
      //该方法用于将process的组件的方法集成分布到子组件
      getFunctionFromProcess(type) {
        var that = this;
        switch (type) {
          case 'setStatusInfo':
            return that.setStatusInfo;
            break;
          case 'loadMatterProcessInfo':
            return that.loadMatterProcessInfo;
            break;
          case 'validateBaseInfo':
            return that.validateBaseInfo;
          case 'doTask':
            return that.doTask;
            break;
          case 'updateProcessState':
            return that.updateProcessState;
            break;
          case 'changeProcessPageState':
            return that.changeProcessPageState;
            break;
          case 'changeDialogState':
            return that.changeDialogState;
            break;
          case 'changeCurrentProcessState':
            return that.changeCurrentProcessState;
            break;
        }
      },
      //控制页面流程流转或根据流程关闭页面
      changeProcessPageState(processId) {
        var that = this;
        that.$http.get(URL.gettask + processId).then((rs) => {
          utils.consoleLog({message: '打印获取流程实例信息', content: rs});
          if (rs.data.success) {
            if (!!rs.data.content && rs.data.content.length > 0) {
              that.taskId = rs.data.content[0].taskId;
              that.changeCurrentProcessState(rs.data.content[0].definitionKey=='FINISH'?'WAITFINISH':rs.data.content[0].definitionKey);
              utils.consoleLog({message: 'taskId=' + that.taskId, constent: null});
              that.loadMatterProcessInfo(that.taskId);
            } else {
              that.updateProcessState(true);//隐藏流程页面
            }
          }
        });
      },
      //清空数据
      clearData() {
        var that = this;
        //设置当前流程为待接件
        this.currentProcess.state = 'CONNECTOR';
        var baseInfo = that.processBaseinfo;
        for (var v in baseInfo) {
          baseInfo[v] = null;
        }
        //清除事项业务信息
        that.matterChildId = null;
        that.matterChildInfo = null;
        //清楚表单信息
        that.$refs.processFormInfoComponent.clearData();
        //清楚文件列表相关信息
        that.$refs.paperListComponent.clearData();
        //隐藏流程页面
        that.updateProcessState(true);
        //
        that.taskId = null;
      },
      //改变流程状态
      changeCurrentProcessState(state) {
        this.loadData(state);
        this.currentProcess.state = state;
      },
      //加载流程状态
      doTask(obj) {
        var that = this;
        that.taskRequest.message = obj.message;
        that.taskRequest.status = obj.status;
        that.taskRequest.taskId = that.taskId;
        var userIds = [];
        $.each(that.departmentUserTreeData, (index, value) => {
          if (value.id != -1 && value.id != '-1') {
            userIds.push(value.id);
          }
        });
        that.taskRequest.user = userIds.join(',');
        that.$http.post(URL.dotask, that.taskRequest).then((rs) => {
          //打印改变流程状态的结果
          utils.consoleLog({message: '打印当前流程状态', content: rs.data.content});
          if (!!rs.data.content) {
            that.changeCurrentProcessState(rs.data.content.definitionKey=='FINISH'?'WAITFINISH':rs.data.content.definitionKey);
          }
          that.loadMatterProcessInfo(that.taskRequest.processId);
        }).catch((error) => {
          utils.consoleLog({message: '打印当前流程状态的错误信息', content: error});
        });
      }
      ,
      changeData(value){
        this.dataVal = value;
        this.pictureVisible = true;
        this.$http.post(URL.SYS_ADVICE_HTML, {processId:this.processBaseinfo.id,link:value})
          .then(res => {
            if(res.data.success){
              let html = res.data.content.html;
              let dataList = res.data.content.value;
              let opt = $(".dataprint .img-out");
              opt.empty().append(html);
              console.log(dataList.length);
              for(let i=0 ;i<dataList.length;i++){
                let dataname = dataList[i].name;
                let datavalue = dataList[i].value;
                opt.find("input[name="+dataname+"]").val(datavalue);
                if(dataname=='paperName'){
                  opt.find("input[name='paperName']").after("<textarea name='paperName' cols='100' rows='5'>"+datavalue+"</textarea>");
                  opt.find("input[name='paperName']").remove();
                }
              }
            }else{
              this.$message({message:res.data.message,type:'error'});
              this.pictureVisible = false;
            }
          }).catch(e => {
          this.$message('操作失败');
          this.pictureVisible = false;
        })
      },
      //该方法用于调控获取其他组件的信息
      getDataFromComponent(type) {
        switch (type) {
          //获取已所有的已上传文件列表
          case 'paperUploadList':
            return this.$refs.paperListComponent.newPaperUploadList;
            break;
          //获取办件表单信息
          case 'processFormInfo':
            return this.$refs.processFormInfoComponent.processFormInfo;
            break;
          //获取业务基础信息
          case 'matterChildInfo':
            return this.$refs.matterChildInfoComponent.matterChildInfo;
            break;
          //获取大的办结信息
          case 'processBaseInfo':
            return this.processBaseinfo;
            break;
          //获取新增的上传文件列表
          case 'newPaperUploadList':
            return this.$refs.paperListComponent.newPaperUploadList;
            break;
          //获取审批意见信息
          case 'processSuggestion':
            return this.processSuggestion;
            break;
          //获取流程实例id
          case 'taskId':
            return this.taskId;
            break;
          //获取被选中的用户
          case 'selectedUserTreeData':
            return this.selectedUserTreeData;
            break;
          //获取taskRequest对象
          case 'taskRequest':
            return this.taskRequest;
            break;
          //获取当前流程状态
          case 'currentProcess':
            return this.currentProcess;
            break;
        }
      }
      ,
      //改变当前材料已上传文件的值
      setFileTableData(value) {
        this.fileTableData = value;
      }
      ,
      //改变提示框的状态
      changeDialogState(type, value) {
        var that = this;
        switch (type) {
          //流程弹出框
          case 'processingDialog':
            that.processingDialog = value;
            break;
          //文件上传列表的删除按钮
          case 'showDeleteBtn':
            that.showDeleteBtn = value;
            break;
          //显示上传材料弹出框
          case 'dzDialogShow':
            that.dzDialogShow = value;
            break;
          //显示上传材料弹出框
          case 'paperChecked':
            that.$refs.paperListComponent.paperChecked = value;
            break;
        }
      }
      ,
      //验证申请人证照编号和申请人信息是已填写，包括材料是否上传
      validateBaseInfo(type) {
        if (type) {
          return this.$refs.processFormInfoComponent.validateBaseInfo(type) && this.$refs.paperListComponent.validateBaseInfo();
        }
        return this.$refs.processFormInfoComponent.validateBaseInfo(type);
      }
      ,
      //完成流程操作
      completeProcessOperate() {
        //判断当前流程
        var that = this;
        var val = that.currentProcess.state;
        switch (val) {
          case 'ACCEPT'://受理
            that.$refs.clerkBtnComponent.clerkImpl();
            break;
          case 'AUDIT':
            that.$refs.auditBtnComponent.passImpl();
            break;
          case 'SUPPLEMENT':
            break;
          case 'FINISH':
            break;
        }
      }
      ,
      //在已选人员中删除被选中的人员
      deleteSelectedUser(type) {
        if ('reply' == type) {
          true
          this.$refs.departmentUserTree.setChecked(-1, true, true);

        } else if ('clear' == type) {
          this.selectedUserTreeData = [];
          this.$refs.departmentUserTree.setChecked(-1, false, true);
        }
      }
      ,
      //当用户目录被选中
      userSelected() {
        var departmentUsers = this.$refs.departmentUserTree.getCheckedNodes();
        this.selectedUserTreeData = departmentUsers.filter((value) => {
          if (value.name !== '本部门') {
            return true
          }
        });
      }
      ,
      //更新电子图标的状态
      updateDz() {
        var fileTableData = this.fileTableData;
        this.dzDialogShow = false;//隐藏操作栏
        this.$refs.paperListComponent.updateDz(fileTableData);
      }
      ,

      //多选框被选中
      selectionChange(selection) {
        this.fileSelectedData = selection;
      }
      ,
      //文件上传删除按钮被点击
      deleteBtnClick() {
        var fileSelectedData = this.fileSelectedData.slice(0);//获取上传文件弹出框中选中的文件列表
        var fileTableData = this.fileTableData.slice(0);//获取上传文件弹出框中所有的文件列表
        var indexs = [];//用来记录要删除的下标
        var ids = [];//用来记录要删除的id
        var uploadIds = [];//用来记录要删除的上传文件id
        var that = this;
        var deleteSuccess = true;//用来控制是否执行前端删除，若后端删除失败，则不执行前端删除

        if (fileSelectedData.length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择需要删除的文件！',
          });
          return;
        }

        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $.each(fileSelectedData, function (index, value) {
            $.each(fileTableData, function (index1, value1) {
              if (value1 == value) {
                indexs.push(value);
                if (!!value.id) {
                  ids.push(value.id);
                }
                if (!!value.uploadId) {
                  uploadIds.push(value.uploadId);
                }
              }
            });
          });


          //如果已经接件，则还要实现后台删除
          if (!!that.processBaseinfo.id && ids.length > 0) {
            utils.consoleLog({message: '打印要被删除的文件id', content: ids});
            that.$http.get(URL.deleteuploadflie + ids.join(',')).then((rs) => {
              utils.consoleLog({message: '打印后台删除结果', content: rs});
              if (rs.data.success) {
                //从已上传的列表中移除已删除的文件
                that.$refs.paperListComponent.removeDeletedUploadFiles(ids);
                that.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              } else {
                that.$message.error('后台删除失败！');
                deleteSuccess = false;
              }
            }).catch((error) => {
              utils.consoleLog({message: '打印后台删除结果的错误信息', content: error});
              that.$message.error('后台删除失败！');
              deleteSuccess = false;
            })
          }

          if (deleteSuccess) {
            //页面上删除
            $.each(indexs, function (index, value) {
              fileTableData.removeByValue(value);
            });
            let newIndexs = [];//用来记录新增的上传文件的数组下标
            //删除新增的列表
            $.each(uploadIds, (index1, uploadId) => {
              $.each(that.$refs.paperListComponent.newPaperUploadList, (index2, paperUpload) => {
                if (paperUpload.uploadId == uploadId) {
                  newIndexs.push(paperUpload);
                }
              });
            });

            var array = that.$refs.paperListComponent.newPaperUploadList.slice(0);
            $.each(newIndexs, (index, value) => {
              array.removeByValue(value);
            });

            that.$refs.paperListComponent.newPaperUploadList = array;
            that.fileSelectedData = fileTableData;
            that.fileTableData = fileTableData;
          }

          if (that.fileTableData.length == 0) {
            this.showDeleteBtn = false;//隐藏删除按钮
          }

        }).catch((error) => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      /*打印*/
      printInfo(){
        $("#print").jqprint();
        this.dialogFormVisible = false;
      },
      //下载文件
      paperDownload(e) {
        var paperId = $(e.target).attr('data-id');
        location.href = URL.paperdownload + '?id=' + paperId;
      }
      ,
      //文件上传成功
      onSuccess(response, file, fileList) {
        var that = this;
        var paperId = that.$refs.paperListComponent.dzId;
        if (response.code == '200' && response.success) {
          if (!!response.content && response.content.length > 0) {
            var tempInfo = response.content[0];
            //更新当前文件上传列表
            that.fileTableData.push({
              uploadId: tempInfo.id,
              selected: false,
              name: tempInfo.name,
              time: tempInfo.createdAt,
              look: true,
            });
            //更新新增上传文件列表
            that.$refs.paperListComponent.newPaperUploadList.push({
              matterPaperId: paperId,//材料id
              // name: null,//材料名称
              fileName: tempInfo.name,//文件名称
              uploadId: tempInfo.id,//文件id
              uploadDate: tempInfo.createdAt,//上传时间
              isUpload: true,
              originalType: 'ELECTRONIC'
            });
            that.$message({
              type: 'success',
              message: '文件【' + tempInfo.name + '】上传成功！',
            });
          }
        } else {
          that.$message({
            type: 'warning',
            message: '文件【' + file.name + '】上传失败！',
          });
        }

        if (this.fileTableData.length > 0) {
          this.showDeleteBtn = true;
        }
      },
      //用于数目录节点过滤
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      //加载业务信息
      loadMatterChildInfo(matterChildId) {
        var that = this;
        this.matterChildId = matterChildId;
        this.$http.get(URL.getmatterchildinfo + '' + matterChildId).then((rs) => {
            //判断是否结果是否正常
            if (rs.data.success) {
              var matterChild = rs.data.content;
              utils.consoleLog({message: '打印获取到的业务信息', content: matterChild});
              if (!!matterChild) {
                that.$refs.matterChildInfoComponent.matterChildInfo = matterChild;
                var matterPaperList = [];
                if(!!matterChild.matterPaperList){
                  matterChild.matterPaperList.forEach((value) => {
                    matterPaperList.push({
                      id: value.id,
                      clsq: null,
                      name: value.name,
                      dz: ['ELECTRONIC', 'ALL'].indexOf(value.originalType) != -1 ? true : false,
                      dzUpload: false,
                      zz: ['PAPER', 'ALL'].indexOf(value.originalType) != -1 ? true : false,
                      zzUpload: false,
                      pz: null,
                      sfrq: ['REQUIRED'].indexOf(value.uploadRule) ? "容缺" : "不容缺",
                      bz: value.contentStandard,
                    })
                  });
                }

                that.$refs.paperListComponent.paperTableData = matterPaperList;
                that.$refs.paperListComponent.updateIconState();
              }
            }
          }
        )
      },
      //加载业务流程信息
      loadMatterProcessInfo(value, isReceive, taskId) {
        this.textid = value;
        var that = this;
        var url = URL.getreceive;

        if (!!isReceive) {
          url = URL.gettemp;
        }

        if (!!taskId) {
          this.taskId = taskId;
        }

        that.$http.get(url + '' + value).then(
          (rs) => {
            if (rs.data.success) {
              var result = rs.data.content;
              utils.consoleLog({message: '打印获取到的业务流程信息', content: result});
              that.processBaseinfo = result;
            }
          });
      },
      //加载所有用户
      loadAllUsers() {
        var that = this;
        that.$http.get(URL.getallusers).then((rs) => {
          utils.consoleLog({message: '打印获取到的所有用户信息', content: rs});
        });
      },
      //加载本部门用户
      loadCurrentDepartmentUsers() {
        var that = this;
        that.$http.get(URL.getusers).then((rs) => {
          utils.consoleLog({message: '打印获取到的本部门用户信息', content: rs.data.content});
          if (!!rs.data.content) {
            that.$refs.departmentUserTree.updateKeyChildren(-1, rs.data.content.slice(0));
            that.selectedUserTreeData = rs.data.content.slice(0);
            var ids = [];
            that.$refs.departmentUserTree.setChecked(-1, true, true);
          }
        }).catch((error) => {
          that.$message('加载部门用户信息失败！');
          utils.consoleLog({message: '打印获取到的本部门用户的错误信息', error});
        })

      },
      loadData(id){
        id = id.toString().toLowerCase();
        utils.consoleLog({message:'打印当前环境的key',content:id});
        var map = new Map();
        var documentList = ['接件通知书','受理通知书','审批通知书','补正通知书','异常办结通知书','正常办结通知书'];
        var linkList = ['CONNECTOR','ACCEPT','AUDIT','SUPPLEMENT','ABNORMAL','FINISH'];

        map.set('accept',[0]);//待受理
        map.set('supplement',[3]);//待补正
        map.set('audit',[0,1]);//待审批
        map.set('waitfinish',[0,1,2]);//待办结
        map.set('finish',[0,1,2,5]);//已办结
        map.set('abnormal',[4]);//异常办结
        if(map.has(id)){
          var list = [];
          map.get(id).forEach((value)=>{
            list.push({id:linkList[value],fileName:documentList[value]});
          });
          this.documentList = list;
        }
      }
    }
    ,
    mounted() {
      //修改手风琴标题样式
      $('.el-collapse-item__header').css({color: '#f96e40', borderBottom: '1px solid #f96e40'});
      //修改人员选择tab的样式
      setTimeout(() => {
        this.userTabActive = 'department';
      }, 3000);
    },
    watch: {
      //监听本部门用户的树过滤
      'departmentUserFilterText'(val) {
        this.$refs.departmentUserTree.filter(val);
      }
      ,
      //监听所有用户的树过滤
      'allUserFilterText'(val) {
        this.$refs.allUserTree.filter(val);
      }
      ,
      //监听办件信息
      'processBaseinfo': function () {
        var that = this;
        //更新表单信息
        that.$refs.processFormInfoComponent.processFormInfo = that.processBaseinfo.processBaseinfo;
        //更新已上传文件信息
        that.$refs.paperListComponent.paperUploadList = that.processBaseinfo.paperUploadList;
        //清空新增已上传列表
        that.$refs.paperListComponent.newPaperUploadList = [];
        //更新业务展示信息
        that.loadMatterChildInfo(that.processBaseinfo.matterChildId);
      }

      ,
      //监听流程处理款是否显示
      'processingDialog':

        function (val) {
          if (!!val) {
            //加载本部门的用户列表
            this.loadCurrentDepartmentUsers();
          }
        },
      //监听流程状态
      'currentProcess.state': function (val) {
        var that = this;
        var name = null;
        var processOperates = null;
        var processSelected = null;
        switch (val) {
          case 'ACCEPT':
            name = '受理';
            processOperates = [{
              name: '审批',
              label: 'AUDIT'
            }]
            processSelected = 'AUDIT';
            break;
          case 'AUDIT':
            name = '审批';
            processOperates = [{
              name: '办结',
              label: 'FINISH'
            }]
            processSelected = 'FINISH';
            break;
          case 'SUPPLEMENT':
            name = '补正';
            break;
          case 'FINISH':
            name = '完成';
            break;
        }
        that.currentProcess.name = name;
        that.processOperates = processOperates;
        that.processSelected = processSelected;
      }
    }
    ,
    created() {

      //初始化格式时间方法
      utils.initFunction();
      $('html').css('background-color', 'white');
    }
  }
</script>

<style scoped>
  .fixed-top {
    display: table;
    content: " ";
    width: 100%;
  }

  /*标题栏*/
  .top-title-div {
    width: 100%;
    background-color: black;
    height: 40px;
    color: white;
    padding-top: 8px;
    padding-left: 10px;
    font-size: larger;
  }

  /*操作栏*/
  .fui-toolbar {
    height: 80px;
    padding: 5px 14px;
    background-color: #F5F3F2;
  }

  .fui-toolbar > .buttons {
    float: left;
  }

  .fui-toolbar > .status {
    float: right;
    margin-top: 10px;
  }

  /*关闭按钮*/
  .el-icon-close {
    float: right;
    margin-top: 4px;
    margin-right: 10px;
    font-size: large;
  }

  .el-icon-close:hover {
    color: red;
    transform: scale(1.5);
  }

  /*修改用户tab的大小*/
  .user-tab {
    padding: 10px 5px;
    width: 100%;
    height: 230px;
    /* border: 1px solid lightgray;*/
    overflow-y: auto;
  }

  .select-user-operate {
    margin-right: 10px;
    float: right;
    color: darkgray;
  }

  .select-user-operate:hover {
    color: #f96e40;
  }
  .img-out{
    width: 797px;height: 1128px;
  }
  .img{
    width: 100%;
    height: 100%;
  }
  #print{
    position: relative;
    overflow: hidden;
    width: 797px;height: 1128px;
  }
  .dataprint{
    position: relative;
    overflow: hidden;
    width: 797px;height: 1128px;
  }
</style>
