<template>
  <el-card class="admin-header">
    <a href="/index">
      <img src="../../assets/img/icon/icon2.png" alt="" width="55px" style="float: left;margin-top: -5px;">
    </a>
    <span style="font-size: 32px;font-weight: bold;position:absolute;left: 100px">后台管理</span>
    <el-button type="primary" icon="el-icon-refresh" @click="refresh()" style=" margin-left:1200px" circle ></el-button>
    <i class="el-icon-switch-button" v-on:click="logout" style="font-size: 40px;float: right"></i>
  </el-card>

</template>

<script>
  import {createRouter} from '../../router'

  export default {
    name: 'Header',
    methods: {
      logout () {
        var _this = this
        this.$axios.get('/logout').then(resp => {
          if (resp && resp.data.rspCode === '200') {
            _this.$store.commit('logout')
            _this.$router.replace('/index')
            // 清空路由，防止路由重复加载
            const newRouter = createRouter()
            _this.$router.matcher = newRouter.matcher
            this.$message.info(resp.data.data);
          }
        }).catch(failResponse => {})
      },
      refresh(){
        var _this = this
        this.$axios.get('/menu/refreshmenu').then(resp => {
          if (resp && resp.data.rspCode === '200') {
            this.$message.success(resp.data.data);
          }else {
            this.$message.warning("后端错误");
          }
        })
      }
    }
  }
</script>

<style scoped>
  .admin-header {
    height: 80px;
    opacity: 0.85;
    line-height: 40px;
    min-width: 900px;
  }
  .el-icon-switch-button {
    cursor: pointer;
    outline:0;
  }
</style>
