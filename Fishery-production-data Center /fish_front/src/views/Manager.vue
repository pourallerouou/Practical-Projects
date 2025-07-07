<template>
  <div>
    <!-- 头部区域开始  -->
    <div style="height:60px; display:flex;">
      <div style="width:240px; height:60px; display:flex; align-items: center; padding-left: 20px; background-color: #3a456b">
        <img style="width:40px; height:40px; border-radius:50%"  src="../assets/img/mylog.jpg"/>
        <span style="font-size:20px;font-weight:bold;color:#fff; margin-left: 10px">Mr Bai</span>
      </div>
      <div style="flex:1; display:flex;align-items: center; padding-left: 15px; border-bottom: 1px solid #ddd">
        首页/数据分析
      </div>
      <div style="width: fit-content; padding-right: 20px; display: flex; align-items: center; border-bottom: 1px solid #ddd">
        <el-dropdown>
          <div style="display: flex; align-items: center">
            <img style="width: 40px; height: 40px; border-radius: 50%"  src="../assets/img/mylog.jpg"/>
            <span style="margin-left: 5px">Admin</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- 下拉菜单内容 -->
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>


    </div>
    <!-- 头部区域结束  -->
    <!--  主体区域  -->
    <div style="display:flex">
        <!-- 菜单区域 -->
      <div style="width: 240px;">
        <el-menu router :default-openeds="['1']" default-active="/manager/home" style="min-height: calc(100vh - 60px);">
          <el-menu-item index="/manager/home">
            <el-icon><House /></el-icon>
            <span>main</span>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>
              <span>data</span>
            </template>
            <el-menu-item index="/manager/about">About</el-menu-item>
          </el-sub-menu>
        </el-menu>

      </div>
        <!-- 数据渲染区域开始 -->
      <div style="flex:1; width:0 ; padding:10px ;background-color: #f2f4ff" >
        <RouterView />
      </div>
    </div>


  </div>
</template>

<script setup>

import {House, Location} from "@element-plus/icons-vue";
</script>


<style scoped>
.el-menu{
  background-color: #3a456b;
  border: none
}
.el-sub-menu__title{
  background-color: #3a456b;
  color:#ddd;
}
.el-menu-item {
  height: 50px;
  color:#ddd;
}
.el-menu .is-active{
  background-color: #537bee;
  color: #ffffff;
}

.el-sub-menu__title:hover{
  background-color: #3a456b;
}
.el-menu-item:not(.is-active):hover{
  background-color: #7a9fff;
  color: #333;
}

.el-dropdown {
  cursor:pointer;
}
.el-tooltip__trigger{
  outline: none;
}
.el-menu--inline .el-menu-item {
  padding-left: 45px !important;
}
</style>