<template>
  <div class="layout">
    <StudentHeader />

    <StuSidebar v-if="showSidebar" />

    <main class="main-content" :class="{ 'with-sidebar': showSidebar }">

      <div v-if="currentTabs.length > 0" class="secondary-navbar">
        <div class="module-tabs">
          <router-link v-for="tab in currentTabs" :key="tab.path" :to="tab.path" class="tab-item" active-class="active">
            {{ tab.name }}
          </router-link>
        </div>
      </div>

      <div class="content-body">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import StudentHeader from './headers/StuHeader.vue'
import StuSidebar from './siderbars/StuSidebar.vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'StudentLayout',
  components: {
    StudentHeader,
    StuSidebar
  },
  setup() {
    const route = useRoute()
    const courseId = ref('')

    watch(() => route.params.courseId, (newId) => {
      courseId.value = newId || ''
    }, { immediate: true })

    // 判断是否显示 Sidebar
    const showSidebar = computed(() => {
      if (route.meta && typeof route.meta.showSidebar !== 'undefined') {
        return route.meta.showSidebar
      }
      // 默认学生端除了特定页面外都显示
      return route.path.startsWith('/student') && !['/student/profile', '/student/campushome', '/student/resourcehome'].includes(route.path)
    })

    // === 顶部 Tab 配置 (关键修复) ===
    const moduleConfigs = {
      'leave': [
        { name: '我要请假', path: '/student/leave/apply' },
        { name: '申请记录', path: '/student/leave/records' }
      ],
      'resource': [
        { name: '可用教室', path: '/student/classroom' },
        { name: '书籍借阅', path: '/student/library' }
      ],
      'campus': [
        { name: '宿舍分配', path: '/student/studorm' },
        { name: '校园论坛', path: '/student/forum' }
      ]
    }

    const currentTabs = computed(() => {
      const path = route.path

      // 1. 匹配请假
      if (path.includes('/leave')) return moduleConfigs['leave']

      // 2. 匹配资源 (修复：只要是 classroom 或 library 页面，就显示这两个 tab)
      if (path.includes('/classroom') || path.includes('/library')) return moduleConfigs['resource']

      // 3. 匹配校园生活
      if (path.includes('/studorm') || path.includes('/forum') || path.includes('/postdetail')) return moduleConfigs['campus']

      return []
    })

    return {
      showSidebar,
      currentTabs
    }
  }
}
</script>

<style scoped>
.layout {
  min-block-size: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.main-content {
  padding-block-start: 60px;
  /* 避开顶部 Header */
  min-block-size: 100vh;
  transition: margin-left 0.2s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  inline-size: 100%;
}

/* 有侧边栏时向右偏移 */
.main-content.with-sidebar {
  margin-inline-start: 240px;
  inline-size: calc(100% - 240px);
}

/* === 修复后的次级导航栏样式 === */
.secondary-navbar {
  background: white;
  padding: 0 30px;
  border-block-end: 1px solid #e8e8e8;
  block-size: 50px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);

  position: sticky;
  inset-block-start: 60px;
  /* 紧贴 Header 下方 */
  z-index: 99;
  /* 确保在内容之上，Header之下 */
  inline-size: 100%;
}

.content-body {
  flex: 1;
  padding: 24px;
  inline-size: 100%;
}

.module-tabs {
  display: flex;
  gap: 30px;
  block-size: 50px;
}

.tab-item {
  display: flex;
  align-items: center;
  block-size: 100%;
  font-size: 14px;
  color: #666;
  text-decoration: none;
  border-block-end: 2px solid transparent;
  cursor: pointer;
  padding: 0 5px;
  transition: all 0.2s;
}

.tab-item:hover {
  color: #2A5CAA;
}

.tab-item.active {
  color: #2A5CAA;
  font-weight: 500;
  border-block-end-color: #2A5CAA;
}
</style>