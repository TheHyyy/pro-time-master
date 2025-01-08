import { http } from '@/composables/http';

export const login = (username, password) => {
  return http.post('/auth/login', { username, password });
};

export const register = (username, password) => {
  return http.post('/auth/register', { username, password });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}; 