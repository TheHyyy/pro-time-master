import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

export const http = axios.create({
  baseURL: '/api',
});

// 公共错误处理函数
const handleErrorResponse = (error) => {
  if (error.response) {
    const { code, msg } = error.response.data;

    // 根据错误码进行处理
    if (code === 401) {
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } else if ([500, 501, 502, 503, 504].includes(code)) {
      // 可以在此处显示服务器错误提示等
    } else {
      // 可以在此处显示其他错误提示
    }
    return Promise.reject(msg);
  } else if (error.request) {
    // 处理请求未响应的情况
    setTimeout(() => {
      router.push("/login");
    }, 1000);
    return Promise.reject("无法连接到服务器");
  } else {
    // 处理其他类型的错误
    return Promise.reject(error.message);
  }
};

// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    // const userStore = useUserStore(); // 假设你使用了 Pinia 或 Vuex，确保你在适当的地方访问 store

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // 直接返回响应数据
    return response.data || response;
  },
  function (error) {
    return handleErrorResponse(error);
  }
);
