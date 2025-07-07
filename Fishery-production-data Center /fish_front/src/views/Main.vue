<script setup>

</script>

<template>
  <!--  头部导航  -->
    <div style="height:60px;">
      <div>
        <nav class="navbar navbar-expand-md navbar-light">
          <div class="container-fluid">
            <a href="/main/fishery" class="navbar-brand">
                <span class="fw-bold text-secondary">
                    <i class="bi bi-water"></i>
                    Fishery Data Center
                </span>
            </a>
            <!-- toggle button for mobile nav-->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-nav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <!--  navbar links  -->
            <div class="collapse navbar-collapse justify-content-end align-center" id="main-nav">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a href="/main/fishery" class="nav-link">渔务作业</a>
                </li>
                <li class="nav-item">
                  <a href="/main/department" class="nav-link">部门管理</a>
                </li>
                <li class="nav-item">
                  <a href="/main/productionsale" class="nav-link">生产销售</a>
                </li>
                <li class="nav-item">
                  <a href="/main" class="nav-link">应急响应</a>
                </li>
                <li class="nav-item ms-2 d-none d-md-inline">
                  <a href="/main/fishery" class="btn btn-secondary">主页</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>

  <!--  主体部分  -->
  <div style=" padding:1px ;background-color: #e2e5ea" >
      <RouterView/>
  </div>
</template>

<style scoped>

</style>