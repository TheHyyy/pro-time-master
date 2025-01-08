import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';

const routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', component: () => import('@/views/todopage/index.vue') },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);

export default router;
