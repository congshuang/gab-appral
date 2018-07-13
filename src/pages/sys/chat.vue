<template>
  <imp-panel>
    <el-row class="tac">
      <el-col :span="5">
        <aside class="sub-aside">

          <div class="aside-header" style="background: #f9f9f9">
            <el-button style="background-color: #00a651;color: #fff;width: 80%;" size="small" @click="compose">
              群发<i class="fa fa-pencil" style="margin-left: 30px;"></i>
            </el-button>
          </div>
          <el-scrollbar tag="div" wrapClass="vue-scrollbar" style="background: #f9f9f9">
            <div class="sidebar" >
              <el-menu
                :default-active="onRoutes"
                class="el-menu-style"
                background-color="#f9f9f9"
                text-color="#000"
                router
                active-text-color="#409EFF">
                <template v-for="(item,index) in chatList">
                  <el-menu-item :index="item.href"><i :class="item.icon"></i>
                    <span slot="title">{{item.name}}
                    <el-tag :type="item.type" size="mini" style="margin-left: 88px;" v-if="index == 0">{{boxIndex}}</el-tag>
                    </span>
                  </el-menu-item>
                </template>
              </el-menu>

            </div>
          </el-scrollbar>
        </aside>
      </el-col>
      <el-col :span="19">
        <div class="content-wrapper" style="padding-top: 0px;background-color: #fff;">
          <el-scrollbar tag="div" wrapClass="content-scrollbar">
            <section class="content" style="padding: 0px;">
              <transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut" appear>
                <router-view class="router"></router-view>
              </transition>
            </section>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
  </imp-panel>
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
      'imp-panel': panel,
    },
    data(){
      return {
        sentIndex: 1,
        boxIndex: 2,
        list1:0,
        list2:0,
        chatList:[
          {"id":1,"parentId":"","sort":0,"name":"收信箱","href":"/sys/chatting/inbox","icon":"sen fa fa-inbox","children":[],"type":"danger"},
          {"id":2,"parentId":"","sort":1,"name":"发送箱","href":"/sys/chatting/sent","icon":"sen fa fa-send","children":[],"type":"info"},
        ]
      }
    },
    computed:{
      onRoutes(){
        return this.$route.path;
      },
      ...mapGetters([
        'list',
        'syslist'
      ]),
    },
    methods: {
      ...mapMutations({
        setSenderId: types.SET_SENDERID
      }),

      onRouteKeys(){
        const getParentArray = (path, ms, kas = []) => {
          if (ms && ms.length > 0) {
            for (var k = 0, length = ms.length; k < length; k++) {
              if (path == ms[k].href) {
                kas.push(ms[k].href);
                break;
              }
              var i = kas.length;
              if (ms[k].children && ms[k].children.length > 0) {
                getParentArray(path, ms[k].children, kas);
              }
              if (i < kas.length) {
                kas.push(ms[k].href);
              }
            }
          }

          return kas.reverse();
        }
        return getParentArray(this.$route.path, this.chatList);
      },
      compose(){
        let redirectUrl = '/sys/chatting/sent';
        let allId = true;
        this.setSenderId(allId);
        this.$router.push({path: redirectUrl});
      }
    },
    created(){
      let list1 = this.list == null ?0:this.list.length;
      let list2 = this.syslist == null ?0:this.syslist.length;
      this.boxIndex = list1+list2;
    },
    watch:{
      'list':function (list) {
          this.list1 = list.length;
          this.boxIndex = this.list1 +  this.list2;
      },
      'syslist':function (list) {
          this.list2 = list.length;
          this.boxIndex = this.list1 +  this.list2;
      },
    }
  }
</script>

<style>
  .sub-aside{
    min-height: 500px;
    width: 100%;
    border-right: 1px solid #ebebeb;
  }
  .tac{
    border: 1px solid #ebebeb;
  }
  .aside-header{
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tag-red{
    border-radius: 20px;
    background-color: red;
    color: #fff;
    height: 20px;
    width: 20px;
    display: inline-block;
  }
  .sen{
    width: 14px;
    height: 14px;
  }
</style>
