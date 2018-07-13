<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-button type="primary" icon="plus" @click="newAdd">新增</el-button>
      <el-button type="danger" icon="delete" @click="batchDelete">删除</el-button>

    </h3>
    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
        <el-tree v-if="roleTree"
                 :data="roleTree"
                 ref="roleTree"
                 class="box-card"
                 show-checkbox
                 highlight-current
                 :render-content="renderContent"
                 @node-click="handleNodeClick" clearable node-key="id" :props="defaultProps"></el-tree>
      </el-col>
      <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card">
          <div class="text item">
            <el-form :model="form" ref="form" :rules="rules" >
              <el-form-item label="父级" :label-width="formLabelWidth">
                <!--<el-input v-model="form.parentId" auto-complete="off"></el-input>-->
                <el-select-tree v-model="form.parentId" :treeData="roleTree" :propNames="defaultProps1" clearable
                                :disabled="true" placeholder="请选择父级">
                </el-select-tree>
              </el-form-item>
              <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="form.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                <el-button type="primary" @click="onSubmit('form')" v-text="form.id?'修改':'新增'"></el-button>
                <el-button type="info" @click="settingMenu($event,form.id)" icon="setting" v-show="form.id && form.id!=null">配置菜单资源
                </el-button>
                <el-button type="info" @click="settingResource($event,form.id)" icon="setting" v-show="form.id && form.id!=null">配置后台资源
                </el-button>
                <el-button type="danger" @click="deleteSelected(form.id)" icon="delete" v-show="form.id && form.id!=null">删除
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>

        <el-dialog title="配置后台资源" :visible.sync="dialogRVisible" size="tiny">
          <div class="select-tree">
          <el-scrollbar
            tag="div"
            class='is-empty'
            wrap-class="el-select-dropdown__wrap"
            view-class="el-select-dropdown__list">
          <el-tree
            :data="resourceTree"
            ref="resTree"
            show-checkbox
            node-key="id"
            :render-content="renderContentTree"
            v-loading="dialogRLoading"
            :props="defaultProps">
          </el-tree>
          </el-scrollbar>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button @click="setCheckedNodes">全选</el-button>
          <el-button @click="resetChecked">清空</el-button>
          <el-button @click="dialogRVisible = false">取 消</el-button>
          <el-button type="primary" @click="configRoleResources">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="配置菜单资源" :visible.sync="dialogMVisible" size="tiny">
          <div class="select-tree">
            <el-scrollbar
              tag="div"
              class='is-empty'
              wrap-class="el-select-dropdown__wrap"
              view-class="el-select-dropdown__list">
              <el-tree
                :data="menusTree"
                ref="menusTree"
                show-checkbox
                default-expand-all
                :render-content="renderContentTree"
                node-key="id"
                v-loading="dialogMLoading"
                :props="defaultProps">
              </el-tree>
            </el-scrollbar>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogMVisible = false">取 消</el-button>
          <el-button type="primary" @click="configRoleMenus">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
  </imp-panel>

</template>
<script>

  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import types from '../../store/mutation-types'
  import panel from "../../components/panel.vue"
  import treeter from "../../components/treeter"
  import * as sysApi from '../../services/sys'
  import merge from 'element-ui/lib/utils/merge';
  import * as api from "../../api"
  import selectTree from "../../components/selectTree.vue"

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree
    },
    data(){
      return {
        dialogRLoading:false,
        dialogRVisible:false,
        formLabelWidth: '100px',
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        selectedOptions:[],
        defaultProps1: {
          children: 'children',
          label: 'name',
          value: "id",
        },
        dialogMLoading:false,
        dialogMVisible:false,
        roleTree: [],
        resourceTree:[],
        menusTree:[],
        listnodes:[],
        maxId:700000,
        form: {
          id: null,
          parentId: null,
          name: '',
        },
        rules:{
          name: [
            { required: true, message: '请填写名称信息...', trigger: 'blur' },
            { min: 0, max: 150, message: '字符长度不能超过150', trigger: 'blur' }
          ],
        },
        menu:'',
        resource:{}
      }
    },
    methods: {
      ...mapActions({
        loads: 'loadMenuList' // 映射 this.load() 为 this.$store.dispatch('loadMenuList')
      }),
      /*setCheckedNodes() {
        this.$refs.resTree.setCheckedNodes(this.resourceTree);
      },*/
      resetChecked() {
        this.$refs.resTree.setCheckedKeys([]);
      },
      renderContentTree(h, {node, data, store}) {

        return ( <span>
          <span>

         <el-tooltip placement="bottom" effect="light" open-delay={1000}>
          <div slot="content">{node.label}</div>
          <span class="sex">{node.label}</span>
         </el-tooltip>
        </span>
        </span>);
      },
      handleChange(value) {
        let len = value.length;
        this.form.parentId =value[len-1];
      },
      configRoleResources(){
        let checkedKeys = this.$refs.resTree.getCheckedKeys();
        let params = {
          roleId:this.form.id,
          resourceIds:checkedKeys
        }
        sysApi.setrole(params)
          .then(res => {
            if(!res.success){
              this.$message(res.message);
            }else{
              this.$message('修改成功');
              this.dialogRVisible = false;
              this.resourceTree = [];
            }
          })

      },
      configRoleMenus(){
        let checkedKeys = this.$refs.menusTree.getCheckedKeys();
        let params = {
          roleId:this.form.id,
          menuIds:checkedKeys
        }
        sysApi.setrolemenu(params)
          .then(res => {
            if(!res.success){
              this.$message(res.message);
            }else{
              this.loads();
              this.$message('修改成功');
              this.dialogMVisible = false;
              this.menusTree = [];
              this.listnodes = [];
            }
          });
      },
      handleNodeClick(data){
        this.form = merge({}, data);
      },
      newAdd(){
        this.form = {
          id: null,
          parentId: null,
          name: '',
        };
        this.menu = '';
      },
      batchDelete(){
        let checkKeys = this.$refs.roleTree.getCheckedKeys();
        let singleKey = checkKeys.join(',');
        let checkLen = singleKey.split(',').length;
        if (checkKeys == null || checkKeys.length <= 0 ) {
          this.$message.warning('请选择要删除的资源');
          return;
        }
        if(checkLen >1){
          this.$message.warning('只能选择一个删除项');
          this.$refs.roleTree.setCheckedKeys([]);
          return false;
        }
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(api.SYS_ROLE_DELETE + "/" + singleKey)
            .then(res => {
              this.$message('操作成功');
              this.batchDeleteFromTree(this.roleTree, checkKeys);

            }).catch(e => {
              this.$message('操作失败');

            })
        });

      },
      addmenu(){
        this.menu = {
          id: this.form.id,
          parentId: this.form.parentId,
          name: this.form.name,

        };
      },
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.form.id == null){
              this.$http.post(api.SYS_ROLE_SAVE, this.form)
                .then(res => {
                  if(!res.data.success){
                    this.$message(res.data.message);
                  }else{
                    this.$message('添加成功');
                    this.form.id = res.data.content;
                    let optTree = this.roleTree;
                    this.appendTreeNode(optTree, merge({}, this.form));
                    this.roleTree = [];
                    this.roleTree.push(...optTree);
                    console.log("---------------------",merge({}, this.form));
                  }
                  this.newAdd();
                }).catch(e => {
                this.$message('添加失败');
              })
            }else{
              this.addmenu();
              this.$http.post(api.SYS_ROLE_UPDATE, this.menu)
                .then(res => {
                  if(!res.data.success){
                    this.$message(res.data.message);
                  }else{
                    this.$message('修改成功');
                    let optList = this.roleTree;
                    this.updateTreeNode(optList, merge({}, this.form));
                    this.roleTree = [];
                    this.roleTree.push(...optList);
                  }
                  this.newAdd();
                }).catch(e => {
                this.$message('修改失败');
                this.newAdd();
              })
            }
          } else {
            return false;
          }
        });

      },
      deleteSelected(id){

        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(api.SYS_ROLE_DELETE + "/" + id)
            .then(res => {
              this.$message('操作成功');
              this.deleteFromTree(this.roleTree, id);
              this.newAdd();
            }).catch(e =>{
            this.$message('操作失败');
            this.newAdd();
          })
        });
      },
      load(){
        sysApi.roleList().then(res => {
          let resList = res.content;
            this.roleTree = [];
            this.roleTree.push(...resList)
          })
      },
      renderContent(h, {node, data, store}) {
        return (
          <span>
            <span>

              <el-tooltip placement="bottom" effect="light" open-delay={1000}>
                <div slot="content">{node.label}</div>
                <span class="tey">{node.label}</span>
              </el-tooltip>
            </span>
            <span class="render-content">
              <i class="fa fa-wrench" title="配置资源" on-click={(e)=>this.settingResource(e,data.id)}></i>
              <i class="fa fa-trash" title="删除"  on-click={ () => this.deleteSelected(data.id) }></i>
            </span>
          </span>);
      },
      settingResource(event,id){
          event.stopPropagation();
          this.dialogRVisible = true;
          this.dialogRLoading = true;
          //获取所有资源列表
          sysApi.resourceList()
            .then(res => {
              let resource = res.content;
              this.dialogRLoading = false;
              this.resourceTree = [];
              this.resourceTree.push(...resource)

            })
        //获取当前角色配置的资源列表
          this.$http.get(api.SYS_ROLE_RESOURCE + "?id=" + this.form.id)
            .then(res => {
              this.$refs.resTree.setCheckedNodes(res.data.content);
            }).catch(err=> {

          })
      },
      settingMenu(event,id){
        event.stopPropagation();
        this.dialogMVisible = true;
        this.dialogMLoading = true;
        //获取所有的菜单列表
        sysApi.menuList()
          .then(res => {
            let resMenus = res.content;
            this.dialogMLoading = false;
            this.menusTree = [];
            this.menusTree.push(...resMenus)

          })
        //获取当前角色配置的菜单列表
        this.$http.get(api.SYS_ROLE_MENU + "?id=" + this.form.id)
          .then(res => {
            this.$refs.menusTree.setCheckedNodes(res.data.content);
          }).catch(err=> {

        })
      }
    },
    created(){
      this.load();
    }
  }
</script>

<style>
  .render-content {
    float: left;
    margin-right: 20px;
    display: block;
  }
  .box-card{
    border: 1px solid #ebeef5;
    background-color: #fff;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  .render-content i.fa {
    margin-left: 10px;
  }

  .render-content i.fa:hover{
    color: #e6000f;
  }

  .select-tree .el-scrollbar.is-empty .el-select-dropdown__list {
    padding: 0;
  }

  .select-tree .el-scrollbar {
    border: 1px solid #d1dbe5;
  }

  .select-tree .el-tree{
    border:0;
  }
  .tey{
    display: block;
    white-space: nowrap;
    max-width: 120px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sex{
    display: block;
    white-space: nowrap;
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
