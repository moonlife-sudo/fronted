import { createRouter, createWebHistory } from 'vue-router'

// 使用相对路径导入，避免路径别名问题
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 修正路由守卫，避免在文件顶部使用store
router.beforeEach((to, from, next) => {
  // 动态导入store，避免循环依赖
  import('../stores/authStore.ts').then(({ useAuthStore }) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login')
    } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
      next('/')
    } else {
      next()
    }
  })
})

export default router
