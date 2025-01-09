<template>
  <el-dialog
    :title="isLogin ? '登录' : '注册'"
    v-model="visible"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      @submit.prevent
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item v-if="!isLogin" label="确认密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          show-password
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <div class="switch-mode">
          <el-button link @click="toggleMode">
            {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
          </el-button>
        </div>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isLogin ? '登录' : '注册' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';

const userStore = useUserStore();
const visible = computed({
  get: () => userStore.showLoginDialog,
  set: (val) => userStore.showLoginDialog = val
});

const isLogin = ref(true);
const loading = ref(false);
const formRef = ref();

const form = ref({
  username: '',
  password: '',
  confirmPassword: ''
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    {
      validator: (rule, value, callback) => {
        if (!isLogin.value && value !== form.value.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  form.value = {
    username: '',
    password: '',
    confirmPassword: ''
  };
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    loading.value = true;
    
    if (isLogin.value) {
      const success = await userStore.login({
        username: form.value.username,
        password: form.value.password
      });
      if (success) {
        visible.value = false;
        ElMessage.success('登录成功');
      }
    } else {
      await userStore.register({
        username: form.value.username,
        password: form.value.password
      });
      ElMessage.success('注册成功');
      isLogin.value = true;
    }
  } catch (error) {
    ElMessage.error(error.message || (isLogin.value ? '登录失败' : '注册失败'));
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 