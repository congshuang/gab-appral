vb <template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-button type="primary" icon="plus" @click="newAdd">新增</el-button>
      <el-button type="danger" icon="delete" @click="batchDelete">删除</el-button>
    </h3>
    <el-row slot="body" style="margin-bottom: 20px;" :gutter="24">
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
        <el-tree v-if="resourceTree"
                 ref="resourceTree"
                 :data="resourceTree"
                 show-checkbox
                 highlight-current
                 class="box-card"
                 :render-content="renderContent"
                 @node-click="handleNodeClick" clearable node-key="id" :props="defaultProps"></el-tree>
      </el-col>
      <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            {{textTree}}

          </div>
          <div class="text item">
            <el-form :model="form" ref="form" :rules="rules">
              <!--<el-form-item label="父级" :label-width="formLabelWidth">
                &lt;!&ndash;<el-input v-model="form.parentId" auto-complete="off"></el-input>&ndash;&gt;
                &lt;!&ndash;<el-select-tree v-model="form.parentId" :treeData="resourceTree" :propNames="defaultProps" clearable
                                placeholder="请选择父级">
                </el-select-tree>&ndash;&gt;
              </el-form-item>-->
              <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="form.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="路径" :label-width="formLabelWidth" prop="url">
                <el-input v-model="form.url" auto-complete="off"></el-input>
              </el-form-item>
             <!-- <el-form-item label="类型" :label-width="formLabelWidth">
                <el-radio class="radio" v-model="form.type" :label="1">菜单</el-radio>
                <el-radio class="radio" v-model="form.type" :label="2">按钮</el-radio>
                <el-radio class="radio" v-model="form.type" :label="3">功能</el-radio>
              </el-form-item>-->
              <!--<el-form-item label="是否生效" :label-width="formLabelWidth">
                <el-radio class="radio" v-model="form.usable" label="1">是</el-radio>
                <el-radio class="radio" v-model="form.usable" label="0">否</el-radio>
              </el-form-item>
              <el-form-item label="排序" :label-width="formLabelWidth">
                <el-slider v-model="form.sort"></el-slider>
              </el-form-item>-->
              <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
                <el-input v-model="form.remarks" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                <el-button type="primary" @click="onSubmit('form')" v-text="form.id?'修改':'新增'"></el-button>
                <el-button type="danger" @click="deleteSelected" icon="delete" v-show="form.id && form.id!=null">删除
                </el-button>
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
  import * as sysApi from '../../services/sys'
  import * as api from "../../api"

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      /*'el-select-tree': selectTree*/
    },
    data(){
      return {
        textTree:'',
        formLabelWidth: '100px',
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        resourceTree: [],
        maxId:700000,
        form: {
          id: null,
          name: '',
          url: '',
          remarks: ''
        },
        menu:"",
        rules:{
          name: [
            { required: true, message: '请填写名称信息...', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '请填写路径信息...', trigger: 'blur' },
            { min: 0, max: 150, message: '字符长度不能超过150', trigger: 'blur' }
          ],
          remarks: [
            { min: 0, max: 200, message: '字符长度不能超过200', trigger: 'blur' }
          ],
        },
      }
    },
    methods: {
      newAdd(){
        this.form = {
          id: null,
          name: '',
          url: '',
          remarks: ''
        };
        this.menu = "";
      },
      addmenu() {
        this.menu = {
          id: this.form.id,
          name: this.form.name,
          url: this.form.url,
          remarks: this.form.remarks,
        };
      },
      renderContent(h, {node, data, store}) {

        return ( <span>
                    <span>
          <el-tooltip placement="bottom" effect="light" open-delay={1000}>
          <div slot="content">{node.label}</div>
        <span class="xing">{node.label}</span>
        </el-tooltip>

                    </span>
                </span>);
      },
      deleteSelected(){

          this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.get(api.SYS_RESOURCE_DELETE + "/" + this.form.id)
              .then(res => {
                if(!res.data.success){
                  this.$message(res.data.message);
                }else{
                  this.$message('操作成功');
                  this.deleteFromTree(this.resourceTree, this.form.id);
                }
                this.newAdd();
              }).catch(e =>{
              this.$message('操作失败');
              this.newAdd();
          });
        })
      },
      batchDelete(){
        let checkKeys = this.$refs.resourceTree.getCheckedKeys();
        let singleKey = checkKeys.join(',');
        let checkLen = singleKey.split(',').length;
        if (checkKeys == null || checkKeys.length <= 0 ) {
          this.$message.warning('请选择要删除的资源');
          return;
        }
        if(checkLen >1){
          this.$message.warning('只能选择一个删除项');
          this.$refs.resourceTree.setCheckedKeys([]);
          return false;
        }
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(api.SYS_RESOURCE_DELETE + "/" + singleKey)
            .then(res => {
              this.$message('操作成功');
              this.batchDeleteFromTree(this.resourceTree, checkKeys);
            }).catch(e => {
            this.$message('操作失败');
          })
        });

      },
      handleNodeClick(data){

        this.form = merge({}, data);
        console.log(this.form)

      },
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.form.id == null) {
              this.$http.post(api.SYS_RESOURCE_ADD, this.form)
                .then(res => {

                  if(!res.data.success){
                    this.$message(res.data.message);
                  }else{
                    this.$message('操作成功');
                    this.form.id = res.data.content;
                    this.resourceTree.push(this.form);
                  }
                  this.newAdd();
                }).catch(e => {
                this.$message('操作失败');
              })
            } else {
              this.addmenu();
              this.$http.post(api.SYS_RESOURCE_UPDATE, this.menu)
                .then(res => {
                  if(!res.data.success){
                    this.$message(res.data.message);
                  }else{
                    this.$message('操作成功');
                    this.updateTreeNode(this.resourceTree,  merge({}, this.form));
                  }
                }).catch(e=>{
                this.$message('操作成功');
                this.updateTreeNode(this.resourceTree, merge({},this.form));
              })
            }
          } else {
            return false;
          }
        });

      },
      load(){
        sysApi.resourceList()
          .then(res=>{
            let resList = res.content;
            console.log(resList)
            this.resourceTree = [];
            this.resourceTree.push(...resList)
          })
      }
    },
    created(){
      this.load();
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
  .xing{
    display: block;
    white-space: nowrap;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>
