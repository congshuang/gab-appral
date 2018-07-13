<template>
  <content>
    <!--展现业务信息-->
    <div>
      <span class="matter-child-info">事项名称：{{matterChildInfo.name}}</span>
      <span class="matter-child-info">事项编码：{{matterChildInfo.logicNo}}</span>
      <span class="matter-child-info">事项类型：{{matterChildInfo.type}}</span>
      <span class="matter-child-info">所属部门：{{matterChildInfo.dept}}</span>
      <span class="matter-child-info">是否收费：{{matterChildInfo.isPay}}</span>
      <span class="matter-child-info">审批结果：{{matterChildInfo.examineApprove}}</span>
      <span class="matter-child-info">承诺期限：{{matterChildInfo.limitByPromise+'  工作日'}}</span>
      <span class="matter-child-info">受理条件：{{matterChildInfo.processCondition}}</span>
    </div>

  </content>
</template>

<script>

  export default {
    props: [],
    data() {
      return {
        //事项信息
        matterChildInfo: {
          id: null,
          name: '卫生许可证申请',//事项名称
          logicNo: '111111111111112222',//事项编码
          type: '承诺件',//事项类型
          dept: '市安监局',//所属部门
          isPay: '否',//是否收费
          examineApprove: '证照',//审批结果
          limitByPromise: '5',//承诺期限
          processCondition: '卫生许可证申请',//受理条件
          matterPaperList: [],//材料列表
        },
      };
    },
  }
</script>

<style scoped>
  .matter-child-info {
    float: left;
    width: 33.3%;
    padding-left: 110px;
    margin-bottom: 10px;
  }
</style>
