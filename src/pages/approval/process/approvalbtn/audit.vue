<template>
  <content>
    <!--放置操作按钮-->
    <div>
      <el-button v-if="['AUDIT'].indexOf(currentProcessState)!=-1" type="primary" size="small" @click="pass">通过</el-button>
      <el-button v-if="['AUDIT'].indexOf(currentProcessState)!=-1" type="primary" size="small"
                 @click="notPass('showDialog')">不通过</el-button>
      <el-button v-if="['AUDIT'].indexOf(currentProcessState)!=-1" type="primary" size="small"
                 @click="doSuspendAndRecover('suspend')">暂停</el-button>
      <el-button v-if="['SUSPEND'].indexOf(currentProcessState)!=-1" type="primary" size="small"
                 @click="doSuspendAndRecover('recover')">恢复</el-button>
    </div>

    <!--不予受理弹框-->
    <div>
      <el-dialog title="不通过" :visible.sync="notPassDialog">
        <el-form :model="notPassInfo" ref="notPassInfoForm">
          <el-form-item label="原因" prop="reason" :rules="[{required:true,message:'请填写不通过的原因！',trigger:'blur'}]">
            <el-input type="textarea" v-model="notPassInfo.reason"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button-group class="float-right">
              <el-button @click="notPass('cancel')">取 消</el-button>
              <el-button type="primary" @click="notPass('confirm')">反 馈</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </content>

</template>

<script>
  import * as URL from "../../../../api"
  import * as utils from '../../../../common/utils'

  export default {
    props: ['getDataFromComponent', 'getFunctionFromProcess', 'currentProcess'],
    data() {
      return {
        //不受理对象
        notPassInfo: {
          reason: null,
        },
        notPassDialog: false,
      };
    },
    computed: {
      //从父组件获取流程状态
      currentProcessState() {
        return this.getDataFromComponent('currentProcess').state;
      },
    },
    methods: {
      //暂停操作
      doSuspendAndRecover(type) {
        var message = type == 'suspend' ? '暂停' : '恢复';
        var url = type == 'suspend' ? URL.dosuspend : URL.dorecovery;
        //从其他组件获取数据
        var taskId = this.getDataFromComponent('taskId');
        var changeCurrentProcessState = this.getFunctionFromProcess('changeCurrentProcessState');
        var setStatusInfo = this.getFunctionFromProcess('setStatusInfo');

        this.$confirm('确认需要提交吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.$http.get(url + '?taskId=' + taskId).then((rs) => {
            utils.consoleLog({message: '打印' + message + '后的结果', content: rs});
            if (rs.data.success) {
              this.$message({
                message: message + '操作成功！',
                type: 'success'
              })
              changeCurrentProcessState(type == 'suspend' ? 'SUSPEND' : 'AUDIT');//更新暂停与恢复
              setStatusInfo({
                applyWay: '窗口登记',
                state: type == 'suspend' ? '已暂停' : '已受理',
                timing: type == 'suspend' ? '已暂停计时' : '计时中'
              })
            } else {
              this.$message.error(message + '操作失败！');
            }
          });
        });

      },
      //完成实现
      pass() {
        //从其他组件获取方法
        var validateBaseInfo = this.getFunctionFromProcess('validateBaseInfo');
        var changeDialogState = this.getFunctionFromProcess('changeDialogState');
        var that = this;

        //判断是否填写相关的字段和材料是否上传
        if (!validateBaseInfo()) {
          return;
        }
        changeDialogState('processingDialog', true);//显示流程操作框
      },
      //不通过
      notPass(type) {
        //从其他组件获取数据
        var processBaseInfo = this.getDataFromComponent('processBaseInfo');
        var taskId = this.getDataFromComponent('taskId');
        //从其他组件获取方法
        var updateProcessState = this.getFunctionFromProcess('updateProcessState');

        var that = this;
        switch (type) {
          case 'showDialog':
            this.notPassDialog = true;//显示弹框
            break;
          case 'cancel':
            this.notPassDialog = false;//隐藏弹框
            break;
          case 'confirm':
            var tempValid = null;
            //验证数据合法性
            this.$refs['notPassInfoForm'].validate((valid) => {
              tempValid = valid;
            });

            if (!tempValid) {
              return;
            }

            this.$confirm('确认需要提交吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              var obj = {
                taskId: taskId,
                message: that.notPassInfo.reason,//办理意见
                status: 'audit:2',//分支状态
              }
              that.$http.post(URL.dotask, obj).then((rs) => {
                if (rs.data.success) {
                  this.$confirm('办件已标记为“不通过”！', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'info'
                  });
                  updateProcessState(true);//隐藏流程处理页)
                } else {
                  that.$message.error('不通过操作失败！');
                }
              }).catch((error) => {
                utils.consoleLog({message: '打印不通过的错误信息', content: error});
              });
            })
            this.notPassDialog = false;//隐藏弹框
            break;
        }
      },
      //通过的具体实现
      passImpl() {
        //从其他组件获取数据
        var processBaseInfo = this.getDataFromComponent('processBaseInfo');
        var processSuggestion = this.getDataFromComponent('processSuggestion');
        var taskId = this.getDataFromComponent('taskId');
        var taskRequest = this.getDataFromComponent('taskRequest');
        var selectedUserTreeData = this.getDataFromComponent('selectedUserTreeData');
        //从其他组件获取方法
        var changeDialogState = this.getFunctionFromProcess('changeDialogState');
        var changeProcessPageState = this.getFunctionFromProcess('changeProcessPageState');
        var setStatusInfo = this.getFunctionFromProcess('setStatusInfo');
        var that = this;

        this.$confirm('确认通过吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          var userIds = [];
          $.each(selectedUserTreeData, (index, value) => {
            if (value.id != -1 && value.id != '-1') {
              userIds.push(value.id);
            }
          });

          that.$http.post(URL.dotask, {
            taskId: taskId,//业务id
            message: processSuggestion,//办理意见
            user: userIds.join(','),//下一步处理人
            isMessage: taskRequest.isMessage,//是否发送短信
            status: 'audit:1'
          }).then((rs) => {
            changeDialogState('processingDialog', false);//隐藏流程操作框
            if (rs.data.success) {
              this.$confirm('办件已标记为“通过”！', '提示', {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'info'
              });
              //根据流程判断流程流转或者关闭页面
              changeProcessPageState(processBaseInfo.id);
              //改变状态信息
              setStatusInfo({
                applyWay: '窗口登记',
                state: '已完结',
                timing: '计时结束'
              });
            } else {
              that.$message.error('通过操作失败！');
            }
          }).catch((error) => {
            that.$message.error('通过操作失败！');
            utils.consoleLog({message: '打印通过的错误信息', content: error});
          });
        });
      },
    },
  }
</script>

<style scoped>
  .float-right {
    float: right;
  }
</style>
