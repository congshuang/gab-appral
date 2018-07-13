<template>
  <content>
    <!--展现材料列表信息-->
    <div>
      <div>
        <el-checkbox v-model="zzAllSelected" :disabled="isReadOnly">纸质全选</el-checkbox>
        <span
          style="float:right;">已标记{{dataCount.all}}件材料，其中纸质{{dataCount.zz}}件，电子文档{{dataCount.dz}}件；容缺{{dataCount.rq}}件；不容缺{{dataCount.brq}}件。</span>
        <hr/>
      </div>
      <el-table
        :data="paperTableData"
        stripe
        highlight-current-row
        style="width: 100%">
        <el-table-column
          type="index" header-align="center"
          align="center"
          label="序"
          width="70">
        </el-table-column>
        <el-table-column
          prop="clsq"
          label="材料收取" header-align="center"
          align="center"
          width="90">
          <template slot-scope="scope">
            <i class="fa fa-check" v-if="scope.row.clsq"></i>
            <i class="fa fa-exclamation-circle" style="color:#DE2A2A;"
               v-else-if="!scope.row.clsq && paperChecked"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="材料名称" header-align="center"
          align="center"
          width="300">
          <template slot-scope="scope">
            <a href="javascript:void(0);" style="text-decoration:none;color:black;cursor: text;">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="dz" header-align="center"
          align="center"
          label="电子">
          <template slot-scope="scope">
            <i class="fa fa-save" @click="dzSelected($event)" :data-id="scope.row.id" v-if="scope.row.dz"
               v-bind:class="[scope.row.dzUpload?active_icon:'',isReadOnly?diabled_icon:cursor_pointer]"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="zz" header-align="center"
          align="center"
          label="纸质">
          <template slot-scope="scope">
            <i class="fa fa-file-text" @click="zzSelected($event)" v-bind:data-id="scope.row.id"
               v-if="scope.row.zz"
               v-bind:class="[scope.row.zzUpload?active_icon:'',isReadOnly?diabled_icon:cursor_pointer]"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="pz" header-align="center"
          align="center"
          label="拍照">
          <template slot-scope="scope">
            <i class="fa fa-camera"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="sfrq" header-align="center"
          align="center"
          label="是否容缺">
        </el-table-column>
        <el-table-column
          prop="bz" header-align="center"
          align="center"
          :show-overflow-tooltip=true
          width="200"
          label="备注">
        </el-table-column>
      </el-table>
    </div>

  </content>
</template>

<script>
  import * as URL from '../../../api'
  import * as utils from '../../../common/utils'

  export default {
    props: ['changeDialogState', 'setFileTableData', 'getDataFromComponent'],
    data() {
      return {
        paperTableData: [],//用于保存材料列表信息
        paperChecked: false,//用于标识是否检验文件上传
        dzId: null,//记录被操作的电子的行的id
        //该对象用于记录材料的相关统计信息
        dataCount: {
          all: 0,
          zz: 0,
          dz: 0,
          rq: 0,
          brq: 0,
        },
        active_icon: 'active-icon',//用于标识材料中的图标样式
        diabled_icon: 'diabled-icon',
        cursor_pointer: 'cursor-pointer',
        zzAllSelected: null,
        //用以保存已上传材料的列表
        paperUploadList: [],
        newPaperUploadList: [],//用于保存新添加的所有上传文件列表
      };
    },
    computed: {
      //判断是否只读状态
      isReadOnly() {
        return ['CONNECTOR', 'ACCEPT', 'SUPPLEMENT'].indexOf(this.currentProcessState) == -1;
      },
      //从父组件获取流程状态
      currentProcessState() {
        return this.getDataFromComponent('currentProcess').state;
      },
    },
    methods: {
      //清楚文件列表信息
      clearData() {
        this.newPaperUploadList = [];
        this.paperTableData = [];
        this.paperUploadList = [];
        this.paperChecked = false;
      },
      //移除已删除文件信息
      removeDeletedUploadFiles(ids) {
        var that = this;
        var indexs = [];
        $.each(that.paperUploadList, (index, value) => {
          $.each(ids, (idIndex, id) => {
            if (value.id == id) {
              indexs.push(value);
            }
          });
        });

        var tempArray = that.paperUploadList.slice(0);
        $.each(indexs, (index, value) => {
          tempArray.removeByValue(value);
        });

        that.paperUploadList = tempArray;
      },
      //更新图表的状态
      updateIconState() {
        var that = this;
        $.each(that.paperTableData, (index, paperInfo) => {
          $.each(that.paperUploadList, (index2, paperUpload) => {
            if (paperInfo.id == paperUpload.matterPaperId && paperUpload.originalType == 'ELECTRONIC') {
              paperInfo.dzUpload = true;
              paperInfo.clsq = true;
            } else if (paperInfo.id == paperUpload.matterPaperId && paperUpload.originalType == 'PAPER') {
              paperInfo.zzUpload = true;
              paperInfo.clsq = true;
            }
          });
        });
      },
      //电子图标被点击，更新弹出框中已上传列表的显示
      dzSelected(row) {
        if (this.isReadOnly) {
          return;
        }
        var id = $(row.target).attr('data-id');
        this.changeDialogState('dzDialogShow', true);//显示上传材料弹出框
        var tempArray = [];
        var that = this;
        //从已上传的所有列表中，找到当前选中的材料的上传文件列表
        $.each(that.paperUploadList, (index, value) => {
          if (value.matterPaperId == id && value.originalType == 'ELECTRONIC') {
            tempArray.push({
              uploadId: value.uploadId,
              selected: value.selected,
              name: value.fileName,
              time: value.createDate,
              look: true,
              id: !!value.id ? value.id : null,
            });
          }
        });
        //从新增的上传文件列表，找到当前选中的材料的上传文件列表
        $.each(that.newPaperUploadList, (index, value) => {
          if (value.matterPaperId == id && value.originalType == 'ELECTRONIC') {
            tempArray.push({
              uploadId: value.uploadId,
              selected: value.selected,
              name: value.fileName,
              time: value.uploadDate,
              look: true,
              id: !!value.id ? value.id : null,
            });
          }
        });

        //改变父组件中的值，改变展示的已上传文件
        that.setFileTableData(tempArray);

        if (tempArray.length == 0) {
          this.changeDialogState('showDeleteBtn', false);//隐藏删除按钮
        } else {
          this.changeDialogState('showDeleteBtn', true);//隐藏删除按钮
        }

        utils.consoleLog({message: '打印弹出框中已上传文件列表', content: tempArray});

        this.dzId = id;
      },
      //用于更新统计数据
      updateDataCount() {
        var dataCount = this.dataCount;
        for (var o in dataCount) {
          dataCount[o] = 0;
        }
        $.each(this.paperTableData, function (index, value) {
          if (value.clsq) {
            dataCount.all++;
            if (value.zz) {
              dataCount.zz++;
            }
            if (value.dz) {
              dataCount.dz++;
            }
          }
          if (value.sfrq == '容缺') {
            dataCount.rq++;
          } else {
            dataCount.brq++;
          }
        });
      },
      //删除纸质图标高亮状态
      deleteZzState(paperId) {
        var processBaseInfo = this.getDataFromComponent('processBaseInfo');
        this.$http.get(URL.deleteall + '?processId=' + processBaseInfo.id + '&paperId=' + paperId).then((rs) => {
          utils.consoleLog({message: '打印删除纸质图标状态结果', content: rs});
          if (rs.data.success) {
            var tempArray1 = [], tempArray2 = [];
            this.paperUploadList.forEach((value, index) => {
              if (value.matterPaperId == paperId) {
                tempArray1.push(value);
              }
            });
            this.newPaperUploadList.forEach((value, index) => {
              if (value.matterPaperId == paperId) {
                tempArray2.push(value);
              }
            });

            tempArray1.forEach((value) => {
              this.paperUploadList.removeByValue(value);
            })
            tempArray2.forEach((value) => {
              this.paperUploadList.removeByValue(value);
            })
          }
        });
      },
      //纸质图标被选中
      zzSelected(row) {
        if (this.isReadOnly) {
          return;
        }

        var $this = this;
        var id = $(row.target).attr('data-id');
        var isAll = true;//用于标识是否所有的材料都被选中
        $.each(this.paperTableData, function (index, value) {
          if (value.id == id) {
            if (value.zzUpload) {
              value.zzUpload = false;
              value.clsq = false;
              $this.deleteZzState(id);//后台删除状态
            } else {
              value.zzUpload = true;
              value.clsq = true;
              //向已上传文件列表添加这个材料的记录
              $this.newPaperUploadList.push({
                matterPaperId: id,
                isUpload: true,
                originalType: 'PAPER'
              });
            }
          }

          //判断当前纸质是否被选中
          if (value.zz && value.zzUpload == false) {
            isAll = false;
          }
        });

        if (!isAll) {
          if (this.zzAllSelected != '') {
            this.zzAllSelected = null;
          }
        } else {
          this.zzAllSelected = true;
        }
        this.updateDataCount();//更新统计信息
      },
      //更新电子图标的状态
      updateDz(fileTableData) {
        var dzId = this.dzId;
        var isChange = false;//用于标识是否有更改

        //判断当前是否有上传文件没有
        $.each(this.paperTableData, function (index, value) {
          if (dzId == value.id) {
            if (fileTableData.length > 0 && !value.dzUpload) {
              value.dzUpload = true;
              value.clsq = true;
              isChange = true;
            } else if (fileTableData.length == 0 && value.dzUpload) {
              value.dzUpload = false;
              value.clsq = false;
              isChange = true;
            }
          }
        });

        if (isChange) {
          this.updateDataCount();//更新统计信息
        }
      },
      //验证材料是否上传
      validateBaseInfo() {
        var paperTableData = this.paperTableData;
        var that = this;
        var fileNotUploadCount = 0;//用于记录未提交材料的数量

        //判断材料是否上传
        this.paperChecked = true//用于显示材料未标记的警告
        $.each(paperTableData, function (index, value) {
          if (!value.clsq) {
            fileNotUploadCount++;
          }
        });
        if (fileNotUploadCount > 0) {
          this.$confirm('有' + fileNotUploadCount + '份材料未提交！！', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
          })
          return false;
        }

        return true;
      },
    },
    mounted() {
    },
    watch: {
      //监听纸质全选按钮对应的数据
      'zzAllSelected': function (val) {
        if (val == null) {
          return;
        }
        $.each(this.paperTableData, function (index, value) {
          if (value.zz && val == '') {
            value.zzUpload = false;
            value.clsq = false;
          } else if (value.zz && val != '') {
            value.zzUpload = true;
            value.clsq = true;
          }
        });
        this.updateDataCount();//更新统计信息
      },
      //监听已上传文件列表
      'paperUploadList': function (val) {
        utils.consoleLog({message: '监听已上传文件列表', content: val});
        this.updateIconState();//更新图标状态
      }
    },
  }
</script>

<style scoped>

  .active-icon {
    color: #f96d41;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .diabled-icon {
    cursor: not-allowed;
  }
</style>
