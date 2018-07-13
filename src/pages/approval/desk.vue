<!--
办理工作台页面
-->
<template>
  <imp-panel>
  <div>
    <el-row :gutter="8" v-show="notShowProcess">
      <el-tabs v-model="activeName" @tab-click="tabSwitch">
        <el-tab-pane :label="'待接件('+countData.connector+')'" name="connector"></el-tab-pane>
        <el-tab-pane :label="'待受理('+countData.accept+')'" name="accept"></el-tab-pane>
        <el-tab-pane :label="'待补办('+countData.supplement+')'" name="supplement"></el-tab-pane>
        <el-tab-pane :label="'待审批('+countData.audit+')'" name="audit"></el-tab-pane>
        <el-tab-pane :label="'待办结('+countData.waitfinish+')'" name="waitfinish"></el-tab-pane>
        <el-tab-pane :label="'已暂停('+countData.suspend+')'" name="suspend"></el-tab-pane>
        <el-tab-pane :label="'已办结('+countData.finish+')'" name="finish"></el-tab-pane>
        <el-tab-pane :label="'异常办结('+countData.abnormal+')'" name="abnormal"></el-tab-pane>
        <!-- <el-tab-pane :label="'待预审('+countData.pre+')'" name="pre"></el-tab-pane>
         <el-tab-pane :label="'预审通过'+countData.preThrough+')'" name="preThrough"></el-tab-pane>-->
        <el-tab-pane label="待办事宜" name="toDo">

          <el-col :span="24" v-if="!showTabs">
            <el-form :inline="true" label-width="120px" ref="departmentQueryForm">
              <el-form-item label="时间">
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="开始日期" v-model="queryObj.startDate" value-format="yyyy-MM-dd"
                                  style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">到</el-col>
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="结束日期" v-model="queryObj.endDate" value-format="yyyy-MM-dd"
                                  style="width: 100%;"></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="标题:" label-width="100px">
                <el-input v-model="queryObj.title"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button icon="search" type="primary" @click="loadingListData(null)">查询</el-button>
              </el-form-item>
            </el-form>

            <el-table
              :data="tableData"
              stripe
              height="360"
              ref="singleTable"
              highlight-current-row
              style="width: 100%">
              <el-table-column
                type="index"
                label="序"
                header-align="center"
                width="80"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="name"
                label="标题"
                header-align="center"
                align="center">
                <template slot-scope="scope">
                  <a href="javascript:void(0);" @click="handleCurrentLineChange2(scope.row)"
                     style="text-decoration:none;">{{
                    scope.row.name }}</a>
                </template>
              </el-table-column>
              <el-table-column
                prop="link"
                label="步骤名称" header-align="center"
                align="center">
              </el-table-column>
              <el-table-column
                prop="processor"
                label="办理人" header-align="center"
                align="center">
              </el-table-column>
              <el-table-column
                prop="applicant"
                label="提交人" header-align="center"
                align="center">
              </el-table-column>
              <el-table-column
                prop="linkDate"
                label="发送时间" header-align="center"
                align="center">
              </el-table-column>
            </el-table>

            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagenation.currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pagenation.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagenation.total">
            </el-pagination>
          </el-col>
        </el-tab-pane>
      </el-tabs>

      <el-col :span="24" v-if="showTabs">
        <el-form :inline="true" label-width="700px" ref="departmentQueryForm">
          <el-form-item label="申请人:">
            <el-input v-model="queryObj.applicant"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="search" type="primary" @click="loadingListData()">查询</el-button>
          </el-form-item>
        </el-form>
        <div style="width:100%;height: 360px;">
          <el-table
            :data="tableData"
            stripe
            height="360"
            ref="singleTable"
            highlight-current-row
            style="width: 100%">
            <el-table-column
              type="index"
              label="序"
              header-align="center"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="window"
              label="窗口"
              width="95"
              header-align="center"
              align="center"
              v-if="columShow.window"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="办件名称"
              header-align="center"
              align="center" v-if="columShow.name">
              <template slot-scope="scope">
                <a href="javascript:void(0);" @click="handleCurrentLineChange(scope.row)" style="text-decoration:none;">{{
                  scope.row.name }}</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="applicant"
              label="申请人"
              width="95" header-align="center"
              align="center" v-if="columShow.applicant">
            </el-table-column>
            <el-table-column
              prop="createDate"
              label="申请时间" width="180" header-align="center"
              align="center" v-if="columShow.createDate">
            </el-table-column>
            <el-table-column
              prop="connectorAt"
              label="接件时间" width="180" header-align="center"
              align="center" v-if="columShow.connectorAt">
            </el-table-column>
            <el-table-column
              prop="supplementAt"
              label="通知补正时间" width="180" header-align="center"
              align="center" v-if="columShow.supplementAt">
            </el-table-column>
            <el-table-column
              prop="finishDate"
              label="办结时间" width="180" header-align="center"
              align="center" v-if="columShow.finishDate">
            </el-table-column>
            <el-table-column
              prop="acceptDate"
              label="受理时间" width="180" header-align="center"
              align="center" v-if="columShow.acceptDate">
            </el-table-column>
            <el-table-column
              prop="linkDate"
              label="受理时间" width="180" header-align="center"
              align="center" v-if="columShow.linkDate">
            </el-table-column>
            <el-table-column
              prop="dueDate"
              label="承诺办结日期" width="180" header-align="center"
              align="center" v-if="columShow.dueDate">
            </el-table-column>
            <el-table-column
              prop="lastTime"
              label="剩余时间" width="180" header-align="center"
              align="center" v-if="columShow.lastTime">
            </el-table-column>
            <el-table-column
              prop="submitAt"
              label="提交时间" width="180" header-align="center"
              align="center" v-if="columShow.submitAt">
            </el-table-column>
            <el-table-column
              prop="preThroughAt"
              label="预审通过时间" width="180" header-align="center"
              align="center" v-if="columShow.preThroughAt">
            </el-table-column>
            <el-table-column
              prop="processName"
              label="步骤名称" header-align="center"
              align="center" v-if="columShow.processName">
            </el-table-column>
            <el-table-column
              prop="dealPerson"
              label="办理人" header-align="center"
              align="center" v-if="columShow.dealPerson">
            </el-table-column>
            <el-table-column
              prop="submitPerson"
              label="提交人" header-align="center"
              align="center" v-if="columShow.submitPerson">
            </el-table-column>
            <el-table-column
              prop="sendTime"
              label="发送时间" header-align="center"
              align="center" v-if="columShow.sendTime">
            </el-table-column>
          </el-table>
        </div>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenation.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagenation.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagenation.total">
        </el-pagination>
      </el-col>
    </el-row>

    <!--放置流程处理页面-->
    <el-row v-show="!notShowProcess">
      <process :updateProcessState="updateProcessState" ref="processComponent"></process>
    </el-row>
  </div>
  </imp-panel>
</template>

<script>
  import * as URL from "../../api"
  import process from "./process.vue"
  import * as utils from "../../common/utils"

  export default {
    data() {
      return {
        inputWidth: '300px',//用于控制输入框的文本长度
        inputTabWidth: '900px',//用于控制输入框的文本长度
        notShowProcess: true,//是否显示进程
        //用来统计各个业务的统计量
        countData: {
          connector: 0,//待接件
          accept: 0,//待受理
          supplement: 0,//待补办
          audit: 0,//待审批
          waitfinish: 0,//待办结
          suspend: 0,//已暂停
          finish: 0,//已办结
          abnormal: 0,//异常办结
          pre: 0,
          preThrough: 0,
        },
        //用以保存查询条件
        queryObj: {
          startDate: null,//开始日期
          endDate: null,//结束日期
          title: null,//标题
          applicant: null,//申请人
        },
        showTabs: true,//展示多的tab的table
        //用来保存分页相关的东西
        pagenation: {
          currentPage: 1,
          size: 10,
          total: 0,
        },
        //该对象用来控制table显示的列
        columShow: {
          id: null,//业务id
          serialNo: null,//流水号
          matterChildId: null,//事项id
          window: true,//窗口
          name: true,//事项名字
          applicantId: null,//申请人id
          applicant: true,//申请人名字
          processorId: null,//办理人id
          processor: null,//办理人
          finishDate: false,//完成时间
          applyWay: null,//申请方式
          dueDate: null,//到期时间
          bit: null,//是否暂停
          stopDate: null,//暂停时间
          linkDate: false,//
          createDate: true,//申请时间
          connectorAt: false,//接件时间
          supplementAt: false,//通知补正时间
          acceptDate: false,//受理时间
          dueDate: false,//承诺办结日期
          lastTime: false,//剩余时间
          submitAt: false,//提交时间
          preThroughAt: false,//评审通过
        },
        activeName: 'connector',//记录当前的tab
        tableData: [],
        currentRow: null,//保存被选中的一行
      }
    },
    computed: {},
    components: {process},
    methods: {
      //当业务名称被点击
      handleCurrentLineChange: function (row) {
        var state = this.activeName;//记录操作的名称
        //以下两个数组用于区分传参
        var getStayArray = ['connector', 'suspend', 'finish', 'abnormal'];
        var getTaskStayArray = ['toDo', 'accept', 'supplement', 'audit', 'waitfinish'];
        var id = row.taskId;
        var isReceive = false;
        var taskId = null;
        var isSuspend = false;
        var statusInfo = {
          applyWay: '窗口登记',
          state: '初始化',
          timing: '未开始计时'
        };

        if (getStayArray.indexOf(this.activeName) != -1) {
          id = row.id;
          isReceive = true;
        } else {
          taskId = row.taskId;
        }

        switch (state) {
          case 'finish':
            statusInfo.state = '已完结';
            statusInfo.timing = '计时结束';
            break;
          case 'abnormal':
            statusInfo.state = '已完结';
            statusInfo.timing = '计时结束';
            break;
          case 'waitfinish':
            statusInfo.state = '已受理';
            statusInfo.timing = '计时中';
            break;
          case 'suspend'://暂停
            id = row.id;
            isReceive = true;
            taskId = row.taskId;
            statusInfo.state = '已暂停';
            statusInfo.timing = '已暂停计时';
            break;
          case'audit'://审批
            statusInfo.state = '已受理';
            statusInfo.timing = '计时中';
            if (row.isSuspend == 'true') {
              state = 'suspend';
              statusInfo.state = '已暂停';
              statusInfo.timing = '已暂停计时';
            }
            break;
          case'supplement'://补正
            statusInfo.state = '待补正';
            break;
          case 'accept'://受理
            statusInfo.state = '已接件';
            break;
          case 'connector'://接件
            state = 'connector';
            isReceive = true;
            break;
        }
        this.$refs.processComponent.setStatusInfo(statusInfo);
        this.$refs.processComponent.changeCurrentProcessState(state.toUpperCase());
        this.$refs.processComponent.loadMatterProcessInfo(id, isReceive, taskId);
        //加载
        this.notShowProcess = false;
      },
      //当待办事项中的标题被点击
      handleCurrentLineChange2: function (row) {
        var state = this.activeName;//记录操作的名称
        //以下两个数组用于区分传参
        var array = ['accept', 'audit', 'supplement', 'waitfinish']
        var state = row.linkKey.toLowerCase();
        var statusInfo = {
          applyWay: '窗口等记',
          state: '初始化',
          timing: '未开始计时'
        };

        switch (state.toLowerCase()) {
          case 'waitfinish':
            statusInfo.state = '已受理';
            statusInfo.timing = '计时中';
            break;
          case'audit'://审批
            statusInfo.state = '已受理';
            statusInfo.timing = '计时中';
            if (row.isSuspend == 'true') {
              state = 'suspend';
              statusInfo.state = '已暂停';
              statusInfo.timing = '已暂停计时';
            }
            break;
          case'supplement'://补正
            statusInfo.state = '待补正';
            break;
          case 'accept'://受理
            statusInfo.state = '已接件';
            break;
        }
        this.$refs.processComponent.setStatusInfo(statusInfo);
        this.$refs.processComponent.changeCurrentProcessState(state.toUpperCase());
        this.$refs.processComponent.loadMatterProcessInfo(row.taskId, false, row.taskId);
        //加载
        this.notShowProcess = false;
      },
      //改变是否显示流程页面
      updateProcessState(type) {
        this.notShowProcess = type;
        this.loadingCountData();
        this.loadingListData();
      },
      //处理显示每页的大小
      handleSizeChange(size) {
        var that = this;
        that.pagenation.size = size;
        that.pagenation.currentPage = 1;
        //重新加载数据
        that.loadingCountData();
        that.loadingListData();
      },
      //当前页改变
      handleCurrentChange(currentPage) {
        var that = this;
        that.pagenation.currentPage = currentPage;
        //重新加载数据
        that.loadingCountData();
        that.loadingListData();
      },
      //该方法用于将columShow对属性都置为false
      formatColumShow(showArray) {
        var columShow = this.columShow;
        for (var o in columShow) {
          if (showArray.indexOf(o) != -1) {
            columShow[o] = true;
          } else {
            columShow[o] = false;
          }
        }
      },
      //当tab切换
      tabSwitch(tab, event) {
        var that = this;
        that.showTabs = true;//隐藏
        var isReceive = false;
        this.pagenation.currentPage = 1;
        this.pagenation.total = 0;
        switch (tab.name) {
          case 'connector'://待接件
            that.formatColumShow(['window', 'name', 'applicant', 'createDate']);
            isReceive = true;
            break;
          case 'accept'://待受理
            that.formatColumShow(['window', 'name', 'applicant', 'connectorAt']);
            break;
          case 'supplement'://待补办
            that.formatColumShow(['window', 'name', 'applicant', 'supplementAt']);
            break;
          case 'audit'://待审批
            that.formatColumShow(['window', 'name', 'applicant', 'linkDate']);
            break;
          case 'waitfinish'://待办结
            that.formatColumShow(['window', 'name', 'applicant', 'dueDate', 'lastTime']);
            break;
          case 'suspend'://已暂停
            that.formatColumShow(['window', 'name', 'applicant', 'acceptDate', 'dueDate']);
            break;
          case 'finish'://已办结
            that.formatColumShow(['window', 'name', 'applicant', 'finishDate']);
            break;
          case 'abnormal'://异常办结
            that.formatColumShow(['window', 'name', 'applicant', 'finishDate']);
            break;
          case 'pre':
            that.formatColumShow(['window', 'name', 'applicant', 'submitAt']);
            break;
          case 'preThrough':
            that.formatColumShow(['window', 'name', 'applicant', 'preThroughAt']);
            break;
          case 'toDo':
            that.showTabs = false;//隐藏
            break;
        }
        //重新加载数据
        that.loadingCountData();
        that.loadingListData();
      },
      //加载列表数据
      loadingListData() {
        var that = this;
        var url = URL.gettaskstay;
        var getStayArray = ['connector', 'suspend', 'finish', 'abnormal'];
        var getTaskStayArray = ['toDo', 'accept', 'supplement', 'audit', 'waitfinish'];
        var defKey = null;

        if (getStayArray.indexOf(that.activeName) != -1) {
          url = URL.getstay;
          defKey = that.activeName.toUpperCase();
        } else if (getTaskStayArray.indexOf(that.activeName) != -1) {
          url = URL.gettaskstay;
          if (that.activeName != 'toDo') {
            defKey = that.activeName.toUpperCase();
          }
        }
        that.$http.post(url, {
          defKey: defKey,
          size: that.pagenation.size,
          page: that.pagenation.currentPage - 1,
          applicant: that.queryObj.applicant,
          startDate: that.queryObj.startDate,
          endDate: that.queryObj.endDate,
          matterName: that.queryObj.title
        }).then((rs) => {
          utils.consoleLog({message: '打印获取点击tab【' + that.activeName + '】获取到的列表信息', content: rs});
          if (rs.data.success && !!rs.data.content) {
            var data = rs.data.content.content;
            that.pagenation.total = rs.data.content.totalElements;
            $.each(data, (index, value) => {
              value['connectorAt'] = value.linkDate;
              value['supplementAt'] = value.linkDate;
            });

            that.tableData = data;
          } else {
            that.tableData = [];
          }

        }).catch((error) => {
          utils.consoleLog({message: '打印获取点击tab获取到的错误信息', content: error});
        });
      },
      //加载列表数量数据
      loadingCountData() {
        var that = this;
        that.$http.get(URL.gettoal).then((rs) => {
          utils.consoleLog({message: '载列表数量数据请求结果', content: rs});

          if (rs.data.success && !!rs.data.content) {
            var result = rs.data.content;
            result.forEach((value, index) => {
              that.countData[value.name.toLowerCase()] = value.value;
            })
          }
        }).catch((error) => {
          utils.consoleLog({message: '载列表数量数据请求结果的错误信息', content: error});
        });
      }
    },
    created() {
      utils.initFunction();//初始化一些原型
      this.loadingCountData();
      this.loadingListData();
    }
  }
</script>

<style scoped>
</style>
