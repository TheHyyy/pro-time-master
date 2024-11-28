<template>
  <div class="layout-container">
    <!-- 头部 -->
    <header class="layout-header">
      <el-header>
        <h1>My Todo App</h1>
      </el-header>
    </header>

    <div class="layout_content">
      <!-- 侧边栏 -->
      <aside class="layout-sidebar">
        <el-menu default-active="1" class="menu" :router="true">
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/">待办事项</el-menu-item>
        </el-menu>
      </aside>

      <!-- 主体部分 -->
      <main class="layout-main">
        <!-- <router-view /> -->
        <!-- 主体部分通过路由展示 -->
        <TODO />
      </main>
    </div>
  </div>
</template>

<script setup>
import TODO from "@/views/todopage/index.vue";
// 此处你可以根据需求进行一些布局上的配置，如主题切换、菜单折叠等
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.layout-header {
  background-color: #409eff;
  color: #fff;
  padding: 20px;
  /* 让header独占一行，保持垂直布局 */
  order: 0;
}

.layout_content {
  display: flex;
  .layout-sidebar {
    width: 200px;
    background-color: #f4f4f5;
    /* 让aside排在第二位，在header之后 */
    order: 1;
  }

  .layout-main {
    flex: 1;
    padding: 20px;
    /* 让main排在第三位，在aside之后 */
    order: 2;
  }

  .layout-sidebar {
    width: 200px;
    order: 0;
  }

  .layout-main {
    flex: 1;
    order: 1;
  }
}
</style>
