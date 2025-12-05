<template>
  <div class="layout">
    <TeaHeader />
    <TeaSidebar v-if="showSidebar" />

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
import TeaHeader from './headers/TeaHeader.vue'
import TeaSidebar from './siderbars/TeaSidebar.vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'TeacherLayout',
  components: { TeaHeader, TeaSidebar },
  setup() {
    const route = useRoute()
    const courseId = ref('')

    watch(() => route.params.courseId, (newId) => {
      courseId.value = newId || ''
    }, { immediate: true })

    // === 侧边栏显示逻辑 ===
    // 资源中心首页 (resourcehome) 不显示侧边栏，保持与学生端一致
    const showSidebar = computed(() => {
      if (route.meta && typeof route.meta.showSidebar !== 'undefined') {
        return route.meta.showSidebar
      }
      // 默认教师端显示，除了资源首页、个人中心、首页
      const hiddenPaths = ['/teacher/resourcehome', '/teacher/profile', '/teacher/home']
      return route.path.startsWith('/teacher') && !hiddenPaths.includes(route.path)
    })

    // === 定义子功能 Tabs ===
    const moduleConfigs = {
      'attendance': [
        { name: 'Launch Attendance', path: 'attendance/launch' },
  { name: 'Attendance Records', path: 'attendance/detail' },
  { name: 'Modify Attendance', path: 'attendance/modify' }
      ],
      'homework': [
        { name: 'Publish Assignment', path: 'homework/publish' },
  { name: 'Submission Status', path: 'homework/submissions' },
  { name: 'AI Grading', path: 'homework/correct' }
      ],
      'grades': [
        { name: 'Grade Book', path: 'grades/detail' },
  { name: 'Enter Grades', path: 'grades/input' },
  { name: 'Grade Composition', path: 'grades/composition' }
      ],
      'resources': [
        { name: 'Resource List', path: 'resources/list' },
  { name: 'Upload Resources', path: 'resources/upload' }
      ],
      'leave': [
        { name: 'Approve Requests', path: 'leave/approval' },
  { name: 'Request Records', path: 'leave/records' }
      ],
      // 资源管理 Tabs (只有在进入具体功能时才显示)
      'resource_mgmt': [
        { name: 'Classroom Booking', path: '/teacher/classroom' },
  { name: 'Library', path: '/teacher/library' }
      ]
    }

    const currentTabs = computed(() => {
      const path = route.path

      // 课程相关
      if (path.includes('/attendance')) return moduleConfigs['attendance']
      if (path.includes('/homework')) return moduleConfigs['homework']
      if (path.includes('/grades')) return moduleConfigs['grades']
      if (path.includes('/resources') && courseId.value) return moduleConfigs['resources']
      if (path.includes('/leave')) return moduleConfigs['leave']

      // 资源管理相关 (进入 classroom 或 library 时显示 tabs)
      if (path.includes('/classroom') || path.includes('/library')) return moduleConfigs['resource_mgmt']

      return []
    })

    const resolveTabPath = (subPath) => {
      if (courseId.value && !subPath.startsWith('/')) {
        return `/teacher/course/${courseId.value}/${subPath}`
      }
      return subPath
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
  transition: margin-left 0.2s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  inline-size: 100%;
}

/* 当有侧边栏时，内容右移 240px (与 StuSidebar 宽度一致) */
.main-content.with-sidebar {
  margin-inline-start: 240px;
  inline-size: calc(100% - 240px);
}

/* 次级导航栏样式 (统一风格) */
.secondary-navbar {
  background: white;
  border-block-end: 1px solid #e8e8e8;
  block-size: 50px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  padding: 0 24px;

  position: sticky;
  inset-block-start: 60px;
  z-index: 90;
  inline-size: 100%;
}

.content-body {
  flex: 1;
  padding: 24px;
  inline-size: 100%;
  box-sizing: border-box;
}

/* Tab 样式 */
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
  padding: 0 4px;
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