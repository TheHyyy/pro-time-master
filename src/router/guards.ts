import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useUserStore } from '@/stores/user';

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    const store = useUserStore();
    store.showLoginDialog = true;
  }
  
  // 始终允许导航
  next();
}; 