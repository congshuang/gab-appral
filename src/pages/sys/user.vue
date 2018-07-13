<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="12">
            <el-button type="primary" icon="plus" @click="routeTo">新增</el-button>
          <el-button type="danger" icon="delete" @click="handleDelete">删除</el-button>
        </el-col>
        <el-col :span="12">
          <div class="el-input" style="width: 200px; float: right;">
            <i class="el-input__icon el-icon-search" style="position: absolute;right: 0px;color: #c0c4cc;" ></i>
            <input type="text" placeholder="输入用户名称" v-model="searchKey" @keyup.enter="search($event)"
                   class="el-input__inner" style="padding-right: 30px;">
          </div>
        </el-col>
      </el-row>
    </h3>
    <div slot="body">
      <el-table
        :data="tableData.rows"
        border
        style="width: 100%"
        v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
        <el-table-column
          prop="id"
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          label="照片" width="76">
          <template slot-scope="scope">
            <img :src='getsrc(scope.row.portrait)' style="width: 45px;vertical-align: middle;" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="account"
          label="登录用户名">
        </el-table-column>
        <el-table-column
          prop="phoneNo"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="telNo"
          label="座机电话">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            {{ scope.row.nonLocked===1 ? '已激活' : '未激活' }}
          </template>
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
              type="info"
              icon="setting"
              @click="handleRoleConfig(scope.$index, scope.row)">配置角色
            </el-button>
            <el-button
              size="small"
              type="danger"
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

      <el-dialog title="配置用户角色" :visible.sync="dialogVisible" size="tiny">
        <div class="select-tree">
          <el-scrollbar
            tag="div"
            class='is-empty'
            wrap-class="el-select-dropdown__wrap"
            view-class="el-select-dropdown__list">
            <el-tree
              ref="roleTree"
              :data="roleTree"
              show-checkbox
              check-strictly
              default-expand-all
              node-key="id"
              v-loading="dialogLoading"
              :props="defaultProps">
            </el-tree>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="configUserRoles">确 定</el-button>
          </span>
      </el-dialog>
    </div>


  </imp-panel>
</template>

<script>
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import treeter from "../../components/treeter"
  import testData from "../../../static/data/data.json"
  import * as sysApi from '../../services/sys'
  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        currentRow: {},
        dialogVisible: false,
        dialogLoading: false,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        roleTree: [],
        isTrue:false,
        listLoading: false,
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
        userid:""
      }
    },
    methods: {
      routeTo(){
        if(this.isTrue){
          this.$router.push({path: 'userAdd'})
        }else{
          this.$alert('当前编辑不可使用...', '提示', {
            confirmButtonText: '确定'
          });
        }

      },
      getsrc(id){
        return 'http://10.6.10.122:8686/oac/file/download/'+id;
      },
      search(target){
        this.loadData();
      },
      handleSelectionChange(val){

      },
      handleRoleConfig(index, row){
        this.currentRow = row;
        this.userid = row.id;
        this.dialogVisible = true;
        if (this.roleTree.length <= 0) {
          this.dialogLoading = true;
          sysApi.roleList().then(res => {
            let resList = res.content;
            this.dialogLoading = false;
            this.roleTree = [];
            this.roleTree.push(...resList)
          })
        }

        this.$http.get(api.SYS_USER_ROWS + "?id=" + row.id)
          .then(res => {
            let listnodes = [];
            this.setCheckedNodes(res.data.content,listnodes);
            console.log('list',listnodes);
            this.$refs.roleTree.setCheckedKeys(listnodes);
          }).catch(err=> {

        })
      },
      configUserRoles(){
        let checkedKeys = this.$refs.roleTree.getCheckedKeys();
        let params = {
          userId:this.userid,
          roleIds:checkedKeys
        };
        sysApi.setuers(params)
          .then(res => {
            if(!res.success){
              this.$message(res.message);
            }else{
              this.$message('修改成功');
              this.dialogVisible = false;
              this.roleTree = [];
            }
          });
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.loadData();
      },
      handleEdit(index, row){
        if(this.isTrue){
          this.$router.push({path: 'userAdd', query: {id: row.id}})
        }else{
          this.$alert('当前编辑不可使用...', '提示', {
            confirmButtonText: '确定'
          });
        }
      },
      handleDelete(index, row){
        if(this.isTrue){
          this.$http.get(api.SYS_USER_DELETE + "?userIds=" + row.id).then(res => {
            this.loadData();
          });
        }else{
          this.$alert('当前删除不可使用...', '提示', {
            confirmButtonText: '确定'
          });
        }

      },
      loadData(){
        let pageNo =  this.tableData.pagination.pageNo-1;
        this.$http.get(api.SYS_USER_PAGE + "?nameLike=" + this.searchKey+ "&size=" + this.tableData.pagination.pageSize+ "&page=" +pageNo)
          .then(res => {
            let dataList = res.data.content.content;
            let len = res.data.content.totalElements;
            this.tableData.rows = dataList;
            this.tableData.pagination.total = len;

          }).catch(e => {
          this.$message('操作失败');

        });
        this.$http.get(api.GET_FLAG)
          .then(res => {
            this.isTrue = res.data.content;
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
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
</style>
