<template>
  <el-menu default-active="currentPath" class="el-menu-admin" router
           mode="vertical" @open="handleOpen" @close="handleClose" :collapse="isCollapse" style="width: 200px">
    <div style="height: 80px;"></div>
      <el-submenu v-for="(item,i) in adminMenus" :key="i" :index="(i).toString()" >
      <template slot="title">
        <i :class="item.iconCls"></i>
        <span slot="title"> {{item.nameZh}}</span>
      </template>
        <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
          <i :class="child.icon"></i>
          {{ child.nameZh }}
        </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
    export default {
      name: 'AdminMenu',
      data () {
        return {
          isCollapse: false
        }
      },
      computed: {
        adminMenus () {
          return this.$store.state.adminMenus
        },
        currentPath () {
          return this.$route.path
        }
      }
    }
</script>

<style scoped>
  .el-menu-admin {
    border-radius: 5px;
    height: 100%;
  }
</style>
