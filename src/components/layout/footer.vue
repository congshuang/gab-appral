<template>
  <footer class="main-footer">
    {{user.bottom}}
  </footer>
</template>
<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  export default {
    name: 'main-footer',
    data() {
      return {
      }
    },
    computed: {

      ...mapGetters([
        'user'
      ]),
      ifor(){
        let tf = (this.user.content == "");
        return tf;
      }
    },
  }
</script>
<style>
  .main-footer {
    -webkit-transition: -webkit-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    -moz-transition: -moz-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    -o-transition: -o-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    transition: transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    text-align: center;
    padding: 5px 15px;
    color: #444;
    width: 100%;

  }

</style>
