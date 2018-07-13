<template>
  <content>
    <!--展现办件信息-->
    <div>
      <el-form :inline="true" :rules="processFormInfoRules" :model="processFormInfo" label-width="300px"
               ref="processFormInfoForm">
        <el-form-item label="申请人类型:">
          <el-radio :disabled="isReadOnly" size="small" class="radio" v-model="processFormInfo.applicantType"
                    :label="'PERSONAL'">
            个人
          </el-radio>
          <el-radio :disabled="isReadOnly" size="small" class="radio" v-model="processFormInfo.applicantType"
                    :label="'COMPANY'">企业
          </el-radio>
        </el-form-item>
        <el-form-item label="证照类型:" label-width="368px" prop="paperType">
          <el-select :disabled="isReadOnly" size="small" v-model="processFormInfo.paperType" style="width:190px;">
            <el-option
              v-for="item in paperType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人证照编号:" prop="paperNo">
          <el-input :disabled="isReadOnly" size="small" v-model="processFormInfo.paperNo" @input="paperNoChange"
                    ></el-input>
      </el-form-item>
        <el-form-item label="申请人:" prop="applicant">
          <el-input :disabled="isReadOnly" size="small" v-model="processFormInfo.applicant"
                    ></el-input>
        </el-form-item>

        <!--<el-form-item label="申请人证照编号:" prop="paperNo">
          <el-autocomplete :disabled="isReadOnly"
                           size="small"
                           v-model="processFormInfo.paperNo"
                           :fetch-suggestions="paperNoQuerySearchAsync"
                           @select="paperNoSelect1"
                           :trigger-on-focus="false"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="申请人:" prop="applicant">
          <el-autocomplete :disabled="isReadOnly"
                           size="small"
                           v-model="processFormInfo.applicant"
                           :fetch-suggestions="applicantQuerySearchAsync"
                           @select="paperNoSelect2"
                           :trigger-on-focus="false"
          ></el-autocomplete>
        </el-form-item>-->
        <el-form-item label="地址:" prop="address">
          <el-input :disabled="isReadOnly" size="small" v-model="processFormInfo.address"
                    style="width:692px;"></el-input>
        </el-form-item>
        <el-form-item label="法人代表:" class="frdb" v-if="frdbShow" prop="legalPerson">
          <el-input :disabled="isReadOnly" size="small" v-model="processFormInfo.legalPerson"
                    style="width:692px;"></el-input>
        </el-form-item>
        <el-form-item label="联系人身份证:" prop="contactPersonNo">
          <el-input :disabled="isReadOnly" size="small" v-model="processFormInfo.contactPersonNo"></el-input>
        </el-form-item>
        <el-form-item label="联系人:" prop="contactPerson">
          <el-input :disabled="isReadOnly" size="small" v-model="processFormInfo.contactPerson"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="phone">
          <el-input :disabled="isReadOnly" size="small" v-model="processFormInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="手机:" prop="telephone">
          <el-input :disabled="isReadOnly" size="small" v-model="processFormInfo.telephone"></el-input>
        </el-form-item>
        <el-form-item label="邮编:" prop="postcode">
          <el-input :disabled="isReadOnly" size="small" v-model="processFormInfo.postcode"></el-input>
        </el-form-item>
        <el-form-item label="传真:" prop="fax">
          <el-input :disabled="isReadOnly" size="small" v-model="processFormInfo.fax"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件:" prop="email">
          <el-input :disabled="isReadOnly" size="small" v-model="processFormInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="是否使用物流:" prop="isPost">
          <el-radio :disabled="isReadOnly" size="small" class="radio" v-model="processFormInfo.isPost" :label=true
                    :value="true">是
          </el-radio>
          <el-radio :disabled="isReadOnly" size="small" class="radio" v-model="processFormInfo.isPost" :label=false
                    :value="false">否
          </el-radio>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input :disabled="isReadOnly" size="small" type="textarea" v-model="processFormInfo.remark"
                    style="width:692px;"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </content>
</template>

<script>
  import * as URL from '../../../api'
  import * as utils from '../../../common/utils'

  export default {
    props: ['changeDialogState', 'getDataFromComponent'],
    data() {
      return {
        frdbShow: false,//用于控制法人代表不显示
        paperNoTimeOut: null,//用于保存申请人证件编号自动填充的定时任务
        applicantTimeOut: null,//用于保存申请人自动填充的定时任务
        paperType1: [{value: 'CERTIFICAT', label: '身份证'}],//申请类型为个人时的证照类型
        paperType2: [{value: 'ORGANIZATION', label: '组织机构代码'}, {value: 'SEXUAL', label: '统一社会信用代码'}],//申请类型为企业时的证照类型
        paperType: [{value: 'CERTIFICAT', label: '身份证'}],//用于页面上证照类型展示
        // 办件信息
        processFormInfo: {
          state: 'receive',
          applicantType: 'PERSONAL',//申请人类型：
          paperType: 'CERTIFICAT',//证照类型
          paperNo: null,//申请人证照编号
          applicant: null,//申请人
          address: null,//地址
          legalPerson: null,//法人代表
          contactPersonNo: null,//联系人身份证
          contactPerson: null,//联系人
          phone: null,//联系电话
          telephone: null,//手机
          postcode: null,//邮编
          fax: null,//传真
          email: null,//电子邮件
          remark: null,//备注
          isPost: false//是否使用物流
        },
        //办件信息表单验证规则
        processFormInfoRules: {
          paperType: [{required: true, message: '请选择证件类型', trigger: 'change'}],
          paperNo: [{required: true, message: '请输入申请人证照编号', trigger: 'change'}, {
            max: 30,
            message: '不超过30字符',
            trigger: 'change'
          }],
          applicant: [{required: true, message: '请输入申请人', trigger: 'change'}, {
            max: 50,
            message: '不超过50字符',
            trigger: 'change'
          }],
          address: [{max: 100, message: '不超过100字符', trigger: 'change'}],
          legalPerson: [{max: 50, message: '不超过50字符', trigger: 'change'}],
          contactPersonNo: [{max: 50, message: '不超过50字符', trigger: 'change'}],
          contactPerson: [{max: 50, message: '不超过50字符', trigger: 'change'}],
          phone: [{max: 50, message: '不超过50字符', trigger: 'change'}],
          telephone: [{max: 11, message: '不超过11字符', trigger: 'change'}],
          postcode: [{max: 6, message: '不超过6字符', trigger: 'change'}],
          fax: [{max: 50, message: '不超过50字符', trigger: 'change'}],
          email: [{type: 'email', message: '无效的邮件地址', trigger: 'change'}, {max: 50, message: '不超过50字符', trigger: 'change'}],
          remark: [{max: 1000, message: '不超过1000字符', trigger: 'change'}],
        },
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
      //证照编号改变
      paperNoChange(){
       var obj = {
         paperNo:this.processFormInfo.paperNo,
         applicantType:this.processFormInfo.applicantType
       }
       this.$http.post(URL.getevidence,obj).then((rs)=>{
         utils.consoleLog({message:'打印获取的证照库信息',content:rs});
         if (rs.data.success) {
           var content = rs.data.content;
           if (!!content) {
             var processFormInfo = this.processFormInfo;
             for (var property in content) {
               if (['applicantType', 'paperType','paperNo'].indexOf(property) == -1) {
                 processFormInfo[property] = content[property];
               }
             }
           }
         }else{

         }
       }).catch(()=>{
         var processFormInfo = this.processFormInfo;
         for (var property in processFormInfo) {
           if (['applicantType', 'paperType','paperNo'].indexOf(property) == -1) {
             processFormInfo[property] = null;
           }
         }
       });
      },
      //清空表单中的数据
      clearData() {
        var formInfo = this.processFormInfo;
        for (var v in formInfo) {
          if (['applicantType', 'paperType', 'isPost'].indexOf(v) != -1) {
            formInfo['applicantType'] = 'PERSONAL';
            formInfo['paperType'] = 'CERTIFICAT';
            formInfo['isPost'] = false;
          } else {
            formInfo[v] = null;
          }
        }
        this.$refs.processFormInfoForm.clearValidate();//清空验证信息
      },
      //验证申请人证照编号和申请人信息是已填写
      validateBaseInfo(type) {
        var processFormInfo = this.processFormInfo;
        var that = this;
        var isContinue = true;
        this.$refs.processFormInfoForm.validate((rs) => {
          if (!rs) {
            this.$confirm('请正确填写表单信息！', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'warning'
            })
          }

          isContinue = rs;
        });
        return isContinue;
      },
      //用于申请人自动填充列表
      applicantQuerySearchAsync(queryString, cb) {
        var that = this;
        var tempArray = [];
        if (queryString && queryString.trim() != '') {
          queryString = queryString.trim();
          that.$http.post(URL.getapplicant, {
            applicant: queryString,
            applicantType: that.processFormInfo.applicantType
          }).then((rs) => {
            var tempArray = [];
            utils.consoleLog({message: '打印获取申请人证照库信息列表', content: rs});
            tempArray = rs.data.content;
            clearTimeout(this.applicantTimeOut);
            this.applicantTimeOut = setTimeout(() => {
              cb(tempArray);
            }, 2000 * Math.random());
          }).catch((error) => {
            var tempArray = [];
            clearTimeout(this.applicantTimeOut);
            this.applicantTimeOut = setTimeout(() => {
              cb(tempArray);
            }, 2000 * Math.random());
          });
          ;
        }
      },
      //用于申请人证照编号自动填充列表
      paperNoQuerySearchAsync(queryString, cb) {
        var that = this;

        that.$http.post(URL.getpaperno, {
          paperNo: queryString,
          applicantType: that.processFormInfo.applicantType
        }).then((rs) => {
          var tempArray = [];
          utils.consoleLog({message: '打印获取申请人证照编号证照库信息列表', content: rs});
          tempArray = rs.data.content;
          clearTimeout(this.paperNoTimeOut);
          this.paperNoTimeOut = setTimeout(() => {
            cb(tempArray);
          }, 2000 * Math.random());
        }).catch((error) => {
          var tempArray = [];
          clearTimeout(this.paperNoTimeOut);
          this.paperNoTimeOut = setTimeout(() => {
            cb(tempArray);
          }, 2000 * Math.random());
        });
      },
      //当自动填充列表被选中执行的方法
      paperNoSelect1(item) {
        var that = this;
        that.$http.post(URL.getevidence, {
          paperNo: item.value,
          applicantType: that.processFormInfo.applicantType
        }).then((rs) => {
          utils.consoleLog({message: '打印从证照库获取的详细信息', content: rs});
          if (rs.data.success) {
            var content = rs.data.content;
            if (!!content) {
              var processFormInfo = this.processFormInfo;
              for (var property in content) {
                if (['applicationType', 'paperType'].indexOf(property) == -1) {
                  processFormInfo[property] = content[property];
                }
              }
            }
          }
        });
      },
      //当自动填充列表被选中执行的方法
      paperNoSelect2(item) {
        var that = this;
        that.$http.post(URL.getevidence, {
          applicant: item.value,
          applicantType: that.processFormInfo.applicantType
        }).then((rs) => {
          utils.consoleLog({message: '打印从证照库获取的详细信息', content: rs});
          if (rs.data.success) {
            var content = rs.data.content;
            if (!!content) {
              var processFormInfo = this.processFormInfo;
              for (var property in content) {
                if (['applicationType', 'paperType'].indexOf(property) == -1) {
                  processFormInfo[property] = content[property];
                }
              }
            }
          }
        });
      },
    },
    watch: {
      //监听事项个人申请类型
      'processFormInfo.applicantType': function (val) {
        if ('PERSONAL' == val) {
          this.processFormInfo.paperType = 'CERTIFICAT';
          this.paperType = this.paperType1;
          this.processFormInfo.frdb = null;
          this.frdbShow = false;//隐藏法人代表输入框
        } else {
          this.processFormInfo.paperType = 'ORGANIZATION';
          this.paperType = this.paperType2;
          this.frdbShow = true;//显示法人代表输入框
        }
      },
    },
  }
</script>

<style scoped>

</style>
