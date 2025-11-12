import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue' // 使用相对路径
import router from './router'

// 引入全局样式
import './assets/styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
