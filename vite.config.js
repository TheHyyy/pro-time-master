import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
  server: {
    proxy: {
      // 当请求以 /api 开头时，代理到 localhost:3000
      "/api": {
        target: "http://localhost:3000", // 代理目标
        changeOrigin: true, // 如果是跨域请求，允许修改请求头中的 Origin 字段
        rewrite: (path) => path.replace(/^\/api/, ""), // 重写路径，去掉 /api 前缀
      },
    },
  },
  plugins: [
    vue(),
    // 自动导入相关 Vue API
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      // 自定义自动导入的模块
      resolvers: [
        // 设置自动导入 http.ts
        (filePath) => {
          if (filePath.endsWith("http.ts")) {
            return {
              name: "http",
              as: "@/composables/http", // 指定别名，确保路径正确
            };
          }
        },
        ElementPlusResolver(),
      ],
    }),
    // 自动引入组件
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass", // 导入 ElementPlus 组件时使用 Sass 样式
        }),
      ],
    }),
  ],
});