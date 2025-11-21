<template>
  <div id="app">
    <template v-if="showLayout">
      <AdminHeader v-if="currentRole === 'admin'" />
      <TeaHeader v-else-if="currentRole === 'teacher'" />
      <StuHeader v-else />

      <AdminSidebar v-if="showSidebar && currentRole === 'admin'" />
      <TeaSidebar v-else-if="showSidebar && currentRole === 'teacher'" />
      <StuSidebar v-else-if="showSidebar" />
    </template>

    <main class="main-content" :class="{ 'with-sidebar': showSidebar && showLayout, 'no-layout': !showLayout }">
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 导入组件... (保持不变)
import AdminHeader from './components/layout/headers/AdminHeader.vue'
import TeaHeader from './components/layout/headers/TeaHeader.vue'
import StuHeader from './components/layout/headers/StuHeader.vue'
import AdminSidebar from './components/layout/siderbars/AdminSidebar.vue'
import TeaSidebar from './components/layout/siderbars/TeaSidebar.vue'
import StuSidebar from './components/layout/siderbars/StuSidebar.vue'

export default {
  name: 'App',
  components: {
    AdminHeader, TeaHeader, StuHeader,
    AdminSidebar, TeaSidebar, StuSidebar
  },
  setup() {
    const route = useRoute()

    // 💡 1. 判断是否需要显示布局 (Header/Sidebar)
    // 如果当前路由是 /login 或 /register，则不显示
    const showLayout = computed(() => {
      const noLayoutRoutes = ['/login', '/register']
      return !noLayoutRoutes.includes(route.path)
    })

    // 2. 判断当前角色 (保持不变)
    const currentRole = computed(() => {
      const path = route.path
      if (path.startsWith('/admin')) return 'admin'
      if (path.startsWith('/teacher')) return 'teacher'
      return 'student'
    })

    // 3. 判断是否显示侧边栏 (保持不变，但依赖 showLayout)
    const showSidebar = computed(() => {
      // 如果不显示布局，肯定不显示侧边栏
      if (!showLayout.value) return false

      // 原有的侧边栏判断逻辑
      const sidebarRoutes = [
        // ... (你的长列表保持不变) ...
        '/student/attendance', '/student/grade', '/student/classresource',
        '/student/homework', '/student/homeworkdetail', '/student/leave',
        '/student/library', '/student/classroom', '/student/studorm',
        '/student/forum',
        '/teacher/students', '/teacher/resources', '/teacher/attendance',
        '/teacher/grades', '/teacher/homework', '/teacher/leave',
        '/teacher/library', '/teacher/classroom',
        '/admin/dorm', '/admin/dormassign', '/admin/approve',
        '/admin/classroom', '/admin/library'
      ]
      return sidebarRoutes.some(path => route.path.startsWith(path))
    })

    return {
      currentRole,
      showSidebar,
      showLayout // 导出这个新变量
    }
  }
}
</script>

<style>
/* 全局样式保持不变 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-block-size: 100vh;
  position: relative;
  background: transparent;
}

.main-content {
  /* 默认有 Header 时的样式 */
  margin-block-start: -20px;
  /* 这里的 margin-top 可能是为了抵消 header 高度，或者根据你的布局调整 */
  padding: 20px;
  background: #f5f5f5;
  min-block-size: calc(100vh - 60px);
  transition: margin-left 0.3s ease;
}

/* 💡 新增：没有布局时（登录页）的样式 */
.main-content.no-layout {
  margin-block-start: 0;
  margin-inline-start: 0 !important;
  padding: 0;
  background: transparent;
  /* 登录页可能有自己的背景 */
  min-block-size: 100vh;
}

.main-content.with-sidebar {
  margin-inline-start: 240px;
}

/* 背景遮罩层逻辑也需要调整 */
.main-content::before {
  content: '';
  position: absolute;
  inset-block-start: 50px;
  inset-inline-start: 0;
  inset-inline-end: 0;
  inset-block-end: 0;
  background: #f5f5f5;
  z-index: -1;
  display: block;
  /* 默认显示 */
}

/* 💡 登录页隐藏背景遮罩 */
.main-content.no-layout::before {
  display: none;
}

.main-content.with-sidebar::before {
  inset-inline-start: 240px;
}
</style>