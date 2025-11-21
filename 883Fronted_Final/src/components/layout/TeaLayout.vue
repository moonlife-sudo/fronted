<template>
  <div class="layout">
    <TeaHeader />
    <TeaSidebar v-if="showSidebar" />

    <main class="main-content" :class="{ 'with-sidebar': showSidebar }">

      <div v-if="showSidebar" class="secondary-navbar">
        <div class="nav-wrapper">
          <div v-if="currentTabs.length > 0" class="module-tabs">
            <router-link v-for="tab in currentTabs" :key="tab.path" :to="resolveTabPath(tab.path)" class="tab-item"
              active-class="active">
              {{ tab.name }}
            </router-link>
          </div>

          <div v-else class="breadcrumb">
            <span class="active-page">{{ currentPageTitle }}</span>
          </div>
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

    const showSidebar = computed(() => {
      if (route.meta && typeof route.meta.showSidebar !== 'undefined') {
        return route.meta.showSidebar
      }
      return route.path.startsWith('/teacher')
    })

    // === 定义子功能 Tabs ===
    const moduleConfigs = {
      'attendance': [
        { name: '发起签到', path: 'attendance/launch' },
        { name: '考勤记录', path: 'attendance/detail' },
        { name: '修改考勤', path: 'attendance/modify' }
      ],
      'homework': [
        { name: '发布作业', path: 'homework/publish' },
        { name: '提交情况', path: 'homework/submissions' },
        { name: 'AI批改', path: 'homework/correct' }
      ],
      'grades': [
        { name: '成绩册', path: 'grades/detail' },
        { name: '录入成绩', path: 'grades/input' },
        { name: '成绩组成', path: 'grades/composition' }
      ],
      'resources': [
        { name: '资源列表', path: 'resources/list' },
        { name: '上传资源', path: 'resources/upload' }
      ],
      // === 【新增】请假管理 Tabs ===
      'leave': [
        { name: '审批申请', path: 'leave/approval' },
        { name: '申请记录', path: 'leave/records' }
      ]
    }

    const currentTabs = computed(() => {
      const path = route.path
      if (path.includes('/attendance')) return moduleConfigs['attendance']
      if (path.includes('/homework')) return moduleConfigs['homework']
      if (path.includes('/grades')) return moduleConfigs['grades']
      if (path.includes('/resources')) return moduleConfigs['resources']

      // === 【新增】匹配请假路径 ===
      if (path.includes('/leave')) return moduleConfigs['leave']

      return []
    })

    const resolveTabPath = (subPath) => {
      if (courseId.value) {
        return `/teacher/course/${courseId.value}/${subPath}`
      }
      return subPath
    }

    const currentPageTitle = computed(() => route.meta.title || '教学中心')

    return {
      showSidebar,
      currentTabs,
      currentPageTitle,
      resolveTabPath
    }
  }
}
</script>

<style scoped>
/* 1. 布局容器：防止溢出 */
.layout {
  min-block-size: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

/* 2. 主内容区：设置为 Flex 列布局 */
.main-content {
  padding-block-start: 60px;
  /* 避开顶部 Header */
  min-block-size: 100vh;
  transition: margin-inline-start 0.2s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  /* 确保子元素定位参照正确 */
}

/* 当有侧边栏时，整体向右移，空出侧边栏的位置 */
.main-content.with-sidebar {
  margin-inline-start: 220px;
  /* 对应 TeaSidebar 的宽度 */
}

/* 3. 次级导航栏 (白色条)：核心修复点 */
.secondary-navbar {
  background: white;
  border-block-end: 1px solid #e8e8e8;
  block-size: 50px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);

  /* --- 关键修复开始 --- */
  inline-size: 100%;
  /* 强制撑满宽度 */
  box-sizing: border-box;
  /* 含 padding 在内，不撑破布局 */
  padding: 0 24px;
  /* 左右留点缝隙给内容 */

  position: sticky;
  /* 粘性定位 */
  inset-block-start: 60px;
  /* 紧贴 Header 下方 */
  z-index: 10;
  /* 保证在内容之上，但低于 Header 和 Sidebar */
  /* --- 关键修复结束 --- */
}

/* 内部包装器：用于限制内容最大宽度（可选，这里设为 100% 即可） */
.nav-wrapper {
  inline-size: 100%;
}

/* 内容区：自动填充剩余空间 */
.content-body {
  flex: 1;
  padding: 24px;
  inline-size: 100%;
  /* 确保内容区也是满宽 */
  box-sizing: border-box;
}

/* Tab 样式 (保持不变) */
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

.active-page {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}
</style>