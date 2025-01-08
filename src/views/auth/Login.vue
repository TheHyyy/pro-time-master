<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>登录</h2>
      </template>

      <el-form
        ref="loginForm"
        :model="loginData"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginData.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginData.password"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading">
            登录
          </el-button>
          <el-button @click="$router.push('/register')">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/auth';
import { createTodo } from '@/api/todo';

const router = useRouter();
const loading = ref(false);
const loginData = ref({
  username: '',
  password: '',
});

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const handleLogin = async () => {
  try {
    loading.value = true;
    const response = await login(loginData.value.username, loginData.value.password);
    if (response.data?.access_token) {
      localStorage.setItem('token', response.data.access_token);
      
      // 获取本地任务
      const localTodos = await offlineStorage.getTodos();
      
      // 同步本地任务到服务器
      for (const todo of localTodos) {
        if (!todo.synced) {
          await createTodo(todo);
        }
      }
      
      router.push('/');
      ElMessage.success('登录成功');
    }
  } catch (error) {
    ElMessage.error('登录失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;

  .login-card {
    width: 400px;
  }
}
</style> 