<template>
  <div class="layout">
    <StudentHeader />

    <StuSidebar v-if="showSidebar" />

    <main class="main-content" :class="{ 'with-sidebar': showSidebar }">

      <div v-if="showSidebar && currentTabs.length > 0" class="secondary-navbar">
        <div class="module-tabs">
          <router-link v-for="tab in currentTabs" :key="tab.path" :to="resolveTabPath(tab.path)" class="tab-item"
            active-class="active">
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
import StuSidebar from './siderbars/StuSidebar.vue' // 引入侧边栏
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'StudentLayout',
  components: {
    StudentHeader,
    StuSidebar // 注册组件
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
      return route.path.startsWith('/student')
    })

    // 顶部 Tab 配置 (可选)
    const moduleConfigs = {
      'leave': [
        { name: '我要请假', path: 'leave/apply' },
        { name: '申请记录', path: 'leave/records' }
      ]
    }

    const currentTabs = computed(() => {
      const path = route.path
      if (path.includes('/leave')) return moduleConfigs['leave']
      return []
    })

    const resolveTabPath = (subPath) => {
      // 1. 如果在课程内，拼课程路径
      if (courseId.value) {
        return `/student/course/${courseId.value}/${subPath}`
      }
      // 2. 【修复】如果在全局，强制拼上 /student/ 前缀，变成绝对路径
      return `/student/${subPath}`
    }

    return {
      showSidebar,
      currentTabs,
      resolveTabPath
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
  min-block-size: 100vh;
  transition: margin-inline-start 0.3s ease;
  display: flex;
  flex-direction: column;
}

/* 关键样式：有侧边栏时，内容向右推 240px */
.main-content.with-sidebar {
  margin-inline-start: 240px;
}

/* 次级导航栏样式 (仿教师端) */
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
  z-index: 998;
  inline-size: 100%;
  box-sizing: border-box;
}

.content-body {
  flex: 1;
  padding: 24px;
  inline-size: 100%;
  box-sizing: border-box;
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