<template>
  <imp-panel title="消息">
    {{content}}
  </imp-panel>
</template>
<script>
  import * as api from "../../api"
  import * as sysApi from '../../services/sys'
  export  default{
    data(){
      return {
        content:""
      }
    },
    methods: {
      loadData(){
        let queryId = this.$route.query.id;
        sysApi.getMessage({id:queryId})
          .then(res => {
            this.content = res.text;
          })
      }
    },
    created() {
      this.loadData();
    },
    mounted(){

    },
    watch: {
      '$route': function (route) {
        let id = route.query.id;
        sysApi.getMessage({id:id})
          .then(res => {
            this.content = res.text;
          })
      },
    }
  }
</script>
