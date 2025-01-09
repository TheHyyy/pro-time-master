import { defineStore } from 'pinia';
import { ref } from 'vue';
import { login as loginApi, register as registerApi } from '@/api/auth';

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref(localStorage.getItem('token'));
  const showLoginDialog = ref(false);

  const setUserInfo = (info) => {
    userInfo.value = info;
    localStorage.setItem('user', JSON.stringify(info));
  };

  const setToken = (newToken) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials);
      if (response.success) {
        setUserInfo(response.data.user);
        setToken(response.data.token);
        showLoginDialog.value = false;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (credentials) => {
    const response = await registerApi(credentials);
    if (response.success) {
      return true;
    }
    throw new Error(response.message || '注册失败');
  };

  const logout = () => {
    userInfo.value = null;
    token.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    showLoginDialog.value = true;
  };

  return {
    userInfo,
    token,
    showLoginDialog,
    login,
    register,
    logout,
    setUserInfo,
    setToken
  };
}); 