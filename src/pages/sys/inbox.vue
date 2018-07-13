<template>
  <div class="inbox">
    <div class="boxs-header">
      <p class="boxs-title">收信箱</p>
      <div class="boxs-search">
        <el-input placeholder="请输入主题或内容的关键词..." v-model="searchKey" size="small">
          <el-button slot="append" icon="el-icon-search" @click="loadData"></el-button>
        </el-input>
      </div>
      <div class="boxs-search" style="text-align: right;margin-right: 20px;width: 40px;">
        <el-button type="danger" icon="el-icon-delete"  size="small" @click="deleteSelect"></el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData.rows"
      tooltip-effect="dark"
      style="width: 100%"
      highlight-current-row
      @row-dblclick="tableRowDblclick"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"

        prop="id"
        width="30">
      </el-table-column>
      <el-table-column
        prop="messageType"

        align="center"
        label="类型"
        :filters="[{ text: '系统', value: '系统' }, { text: '个人', value: '个人' }]"
        :filter-method="filterTags"
        filter-placement="bottom-end"
        width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.messageType == '1' ? 'success' : 'primary'"
            close-transition>{{scope.row.messageType == '1' ? '个人' : '系统'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="发件人"
        align="center"
        width="80">
      </el-table-column>

      <el-table-column
        prop="content"
        label="主题"
        align="center"
        width="300">
        <template slot-scope="scope">
          <span @click="tableRowDblclick(scope.row,$event)">{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="时间"
        align="center"
        width="150"
        >
        <template slot-scope="scope">
          {{ setTimes(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="readed"
        label="标签"
        width="100"
        :filters="[{ text: '已读', value: '已读' }, { text: '未读', value: '未读' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
        >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.readed ? 'success' : 'primary'"
            close-transition>{{scope.row.readed ? '已读' : '未读'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            @click="handleDelete(scope.$index, scope.row,$event)">删除
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
        searchKey: null,
        tableData: {
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        },

        multipleSelection: [],
        currentPage: 1
      }
    },
    computed:{

    },
    methods: {
      ...mapMutations({
        setLog: types.SET_LOG
      }),
      deleteSelect(){
        let obj = this.multipleSelection.join(',');
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         if(this.multipleSelection == []){
           this.$message('操作成功')
         }else{
           this.$http.get(api.CHAT_USER_DELETE + "?mailIds=" + obj).then(res => {
             this.loadData();
             this.$message('操作成功');
           }).catch(e => {
             this.$message('操作失败');
           });
         }

        });
      },
      filterTag(value, row) {
        if(row.readed){
          return '已读' === value;
        }else{
          return '未读' === value;
        }

      },
      setTimes(date){
        date = new Date(date);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y+"-"+m+"-"+d;
      },
      filterTags(value, row){
        if(row.messageType == '1'){
          return '个人' === value;
        }else{
          return '系统' === value;
        }
      },
      handleDelete(index, rows, e){
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(api.CHAT_USER_DELETE + "?mailIds=" + rows.id).then(res => {
            this.loadData();
            this.$message('操作成功');
          }).catch(e => {
            this.$message('操作失败');
          });
        });
      },
      handleSelectionChange(val) {
        let array = [];
        val.forEach(function (data,index) {
          array.push(data.id);
        })
        this.multipleSelection = array;
      },
      tableRowClassName({row, rowIndex}) {
        let index = this.tableData.rows;
        if (index[rowIndex]['readed']) {
          return '';
        }else{
          return 'success-row';
        }

        return '';
      },
      tableRowDblclick(row,ev){
        let obj = {
          senderId:row.sender,
          id:row.id,
          name:row.name,
          content:row.content,
          path:null,
          title:'无标题',
          time:row.createdAt,
          email:'1461373703@qq.com',
          account:row.account,
          messageType:row.messageType
        };
        this.setLog(obj);
        let redirectUrl = '/sys/chatting/compose';
        this.$router.push({path: redirectUrl});
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.loadData();
      },
      loadData(){
        let obj = {
          nameLike:this.searchKey,
          size:this.tableData.pagination.pageSize,
          page:this.tableData.pagination.pageNo-1
        };
        this.$http.get(api.SYS_USER_PAGE_ALL)
          .then(res => {
            let datas =  res.data.content;

            this.$http.post(api.CHAT_LIST ,obj)
              .then(res1 => {
                let dataList = res1.data.content.content;
                let len = res1.data.content.totalElements;
                let len1 = datas.length;
                let len2 = dataList.length;
                console.log("-----------------",res1)
                this.tableData.pagination.total = len;
                this.searchKey = "";
                let array = [];
                for(let i = 0;i < len2;i ++){
                  for(let j = 0;j < len1;j ++){

                    if(dataList[i]['sender'] == datas[j]['id']){

                      dataList[i]['name'] = datas[j].name;
                      dataList[i]['account'] = datas[j].account;
                      array.push(dataList[i]);
                      break;
                    }
                  }
                }
                this.tableData.rows = array;

              }).catch(e => {
              this.$message('操作失败');
            });
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
  .inbox{
    width: 100%;
    height: 100%;
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
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
