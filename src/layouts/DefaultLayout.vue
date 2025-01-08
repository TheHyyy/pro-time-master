<template>
  <div class="layout-container">
    <header class="header">
      <div class="logo">Pro Time Master</div>
      <div class="user-info">
        <template v-if="isLoggedIn">
          <span>{{ username }}</span>
          <el-button type="text" @click="handleLogout">退出</el-button>
        </template>
        <template v-else>
          <el-button type="text" @click="$router.push('/login')">登录</el-button>
          <el-button type="text" @click="$router.push('/register')">注册</el-button>
        </template>
      </div>
    </header>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '@/api/auth';

const router = useRouter();

const isLoggedIn = computed(() => !!localStorage.getItem('token'));
const username = computed(() => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).username : '';
});

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .logo {
      font-size: 20px;
      font-weight: bold;
      color: #409eff;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  .main-content {
    flex: 1;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
}
</style>
