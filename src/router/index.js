import { createRouter, createWebHistory } from "vue-router";
// 导入菜单路由

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(''),
  routes: [
    {
      path: "/",
      name: "/",
      children: [
        {
          path: "/",
          name: "DemoOne",
          component: () => import("@/views/homepage/index.vue"),
          meta: {
            title: "官网首页",
            background: "需要传递的数据",
          },
        },
      ],
    },
    // {
    //   path: "/blank-page-wx-pay",
    //   name: "BlankPageWxPay",
    //   meta: {
    //     title: "课程详情",
    //   },
    //   component: () => import("@/views/blank-page-wx-pay/index.vue"),
    // },
  ],
});
// beforeEach router
router.beforeEach(async (to, from, next) => {
  next();
});
export default router;
