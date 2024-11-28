import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
// import TodoPage from '@/views/todopage/index.vue';
// import HomePage from '@/views/HomePage.vue';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    // children: [
    //   { path: '', component: HomePage }, // 首页
    //   { path: 'todos', component: TodoPage }, // 待办事项页面
    // ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
