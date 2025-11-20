<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- 根据路由动态显示对应角色的Header -->
    <AdminHeader v-if="currentRole === 'admin'" />
    <TeaHeader v-else-if="currentRole === 'teacher'" />
    <StuHeader v-else />
    
    <!-- 根据路由动态显示对应角色的Sidebar -->
    <AdminSidebar v-if="showSidebar && currentRole === 'admin'" />
    <TeaSidebar v-else-if="showSidebar && currentRole === 'teacher'" />
    <StuSidebar v-else-if="showSidebar" />
    
    <main class="main-content" :class="{ 'with-sidebar': showSidebar }">
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 导入各个角色的Header和Sidebar组件
import AdminHeader from './components/layout/headers/AdminHeader.vue'
import TeaHeader from './components/layout/headers/TeaHeader.vue'
import StuHeader from './components/layout/headers/StuHeader.vue'

import AdminSidebar from './components/layout/siderbars/AdminSidebar.vue'
import TeaSidebar from './components/layout/siderbars/TeaSidebar.vue'
import StuSidebar from './components/layout/siderbars/StuSidebar.vue'

export default {
  name: 'App',
  components: {
    AdminHeader,
    TeaHeader,
    StuHeader,
    AdminSidebar,
    TeaSidebar,
    StuSidebar
  },
  setup() {
    const route = useRoute()
    
    // 根据当前路由路径自动判断角色
    const currentRole = computed(() => {
      const path = route.path
      
      if (path.startsWith('/admin')) {
        return 'admin'
      } else if (path.startsWith('/teacher')) {
        return 'teacher'
      } else {
        return 'student'
      }
    })
    
    // 根据路由判断是否显示侧边栏
    const showSidebar = computed(() => {
      const sidebarRoutes = [
        // 学生路由
        '/student/attendance',
        '/student/grade',
        '/student/classresource',
        '/student/homework',
        '/student/homeworkdetail',
        '/student/leave',
        '/student/library',
        '/student/classroom',
        // 教师路由  
        '/teacher/students',
        '/teacher/resources', 
        '/teacher/attendance',
        '/teacher/grades',
        '/teacher/homework',
        '/teacher/leave',
        '/teacher/library',
        '/teacher/classroom',
        // 管理员路由
        '/admin/dorm',
        '/admin/approve',
        '/admin/classroom',
        '/admin/library'
      ]
      return sidebarRoutes.some(path => route.path.startsWith(path))
    })
    
    return {
      currentRole,
      showSidebar
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  position: relative;
  background: transparent;
}

.main-content {
  margin-top: -20px;
  padding: 20px;
  background: #f5f5f5;
  min-height: calc(100vh - 60px);
  transition: margin-left 0.3s ease;
  background-clip: content-box;
  background-origin: content-box;
}

.main-content.with-sidebar {
  margin-left: 240px;
}

.main-content::before {
  content: '';
  position: absolute;
  top: 50px; 
  left: 0;
  right: 0;
  bottom: 0;
  background: #f5f5f5;
  z-index: -1;
}

.main-content.with-sidebar::before {
  left: 240px;
}
</style>