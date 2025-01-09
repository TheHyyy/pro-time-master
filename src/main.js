import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import "./styles/index.scss";
import ElementPlus from "element-plus";
import 'element-plus/dist/index.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'




const app = createApp(App)
const pinia = createPinia()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')