<template>
  <content>
    <!--放置操作按钮-->
    <div>
      <el-button type="primary" size="small" @click="save">保存</el-button>
      <el-button type="primary" size="small" @click="receive">接件</el-button>
    </div>
  </content>

</template>

<script>
  import * as URL from "../../../../api"
  import * as utils from '../../../../common/utils'

  export default {
    props: ['getDataFromComponent', 'getFunctionFromProcess'],
    data() {
      return {};
    },
    methods: {
      //保存按钮
      save() {
        //从其他组件获取数据
        var processFormInfo = this.getDataFromComponent('processFormInfo');
        var matterChildInfo = this.getDataFromComponent('matterChildInfo');
        var paperUploadList = this.getDataFromComponent('paperUploadList');
        //从其他组件获取方法
        var validateBaseInfo = this.getFunctionFromProcess('validateBaseInfo');
        var updateProcessState = this.getFunctionFromProcess('updateProcessState');
        var that = this;
        //调用process组件的方法判断是否填写相关的字段
        if (!validateBaseInfo()) {
          return;
        }
        //构建提交的对象
        processFormInfo.name = matterChildInfo.name;
        processFormInfo.matterChildId = matterChildInfo.id;
        processFormInfo.paperUploadList = paperUploadList;
        that.$http.post(URL.save, processFormInfo).then((rs) => {
          utils.consoleLog({message: '打印保存操作的结果', content: rs});
          var result = rs.data;
          if (result.success) {
            this.$confirm('保存成功！', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'warning'
            });
            var processId = result.content;
            //调用process组件方法关闭流程页
            updateProcessState(true);
          } else {
            that.$message.error('保存操作失败！');
          }
        }).catch((error) => {
          that.$message.error('保存操作失败！');
          utils.consoleLog({message: '打印保存操作失败的错误信息', content: error});
        });
      },
      //完成接件
      receive() {
        //从其他组件获取数据
        var processFormInfo = this.getDataFromComponent('processFormInfo');
        var matterChildInfo = this.getDataFromComponent('matterChildInfo');
        var paperUploadList = this.getDataFromComponent('paperUploadList');
        var processBaseInfo = this.getDataFromComponent('processBaseInfo');
        //从其他组件获取方法
        var validateBaseInfo = this.getFunctionFromProcess('validateBaseInfo');
        var changeProcessPageState = this.getFunctionFromProcess('changeProcessPageState');

        var that = this;
        //调用process组件的方法判断是否填写相关的字段
        if (!validateBaseInfo()) {
          return;
        }

        this.$confirm('确认接件吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          //构建提交的对象
          processFormInfo.name = matterChildInfo.name;
          processFormInfo.matterChildId = matterChildInfo.id;
          processFormInfo.paperUploadList = paperUploadList;
          processFormInfo.processId = processBaseInfo.id ? processBaseInfo.id : null;

          that.$http.post(URL.receive, processFormInfo).then((rs) => {
            var result = rs.data;
            if (result.success) {
              that.$message({
                type: 'success',
                message: '接件成功!'
              });
              var processId = result.content;
              //调用process组件方法根据流程判断流程流转或者关闭页面
              changeProcessPageState(processId);
            } else {
              that.$message.error(result.message?result.message:'接件操作失败！');
            }
          }).catch((error) => {
            that.$message.error('接件操作失败！');
            utils.consoleLog({message: '打印接件操作失败的错误信息', content: error});
          });
        });
      },
    },
  }
</script>

<style scoped>
</style>
