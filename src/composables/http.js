import axios from "axios";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus"; // 假设使用 Element Plus 消息提示组件
import { useUserStore } from '@/stores/user';

// 动态加载 Router，避免在模块初始化时直接调用 useRouter
let router = null;
const getRouter = () => {
  if (!router) {
    router = useRouter();
  }
  return router;
};

// 创建 Axios 实例
export const http = axios.create({
  baseURL: "/api",
  timeout: 5000, // 设置超时时间
});

// 公共错误处理函数
const handleErrorResponse = (error) => {
  if (error.response) {
    const { code, msg } = error.response.data;

    // 根据错误码进行处理
    switch (code) {
      case 401:
        // 未登录或 Token 失效，跳转登录页
        ElMessage.error("登录过期，请重新登录");
        setTimeout(() => {
          getRouter().push("/login");
        }, 1000);
        break;
      case 403:
        // 无权限访问
        ElMessage.warning("权限不足，无法访问此资源");
        break;
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
        // 服务器错误
        ElMessage.error("服务器错误，请稍后再试");
        break;
      default:
        // 其他错误
        ElMessage.error(msg || "发生未知错误");
    }

    return Promise.reject(msg || "请求失败");
  } else if (error.request) {
    // 请求未响应的情况
    ElMessage.error("无法连接到服务器，请检查网络");
    return Promise.reject("无法连接到服务器");
  } else {
    // 其他类型的错误
    ElMessage.error(error.message || "发生未知错误");
    return Promise.reject(error.message);
  }
};

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      const userStore = useUserStore();
      userStore.logout();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);
