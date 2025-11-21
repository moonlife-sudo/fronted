<template>
  <aside class="app-sidebar">
    <div class="sidebar-header">
      <span class="sidebar-title">{{ currentModuleTitle }}</span>
    </div>

    <nav class="sidebar-nav">
      <div v-for="group in currentMenuGroups" :key="group.name" class="menu-group">
        <div class="group-title">
          {{ group.name }}
        </div>
        <router-link v-for="item in group.items" :key="item.path" :to="resolvePath(item.path)" class="menu-item"
          :class="{ active: isItemActive(item) }">
          <span class="item-icon">{{ item.icon }}</span>
          <span class="item-text">{{ item.name }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'TeaSidebar',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const courseId = ref('')

    watch(() => route.params.courseId, (newId) => {
      courseId.value = newId || ''
    }, { immediate: true })

    const inCourseContext = computed(() => !!courseId.value)

    // === 菜单配置：左侧只放“大模块” ===
    const menuConfig = {
      // 1. 课程内菜单
      courseSmart: [
        {
          name: '教学管理',
          items: [
            // 点击这些，去往各自的默认页面（顶栏会显示子菜单）
            { name: '考勤管理', path: 'attendance/launch', icon: ' ' },
            { name: '作业管理', path: 'homework/publish', icon: ' ' },
            { name: '成绩管理', path: 'grades/detail', icon: ' ' },
            { name: '课程资源', path: 'resources/list', icon: ' ' },
            { name: '学生管理', path: 'students/detail', icon: ' ' },
            { name: '请假审批', path: 'leave/approval', icon: ' ' } // 假设你有这个
          ]
        },
        {
          name: '课程概况',
          items: [
            { name: '课程首页', path: 'overview', icon: ' ' },
            { name: '知识图谱', path: 'learning-path', icon: ' ' },
          ]
        }
      ],
      // 2. 课程外菜单 (非课程详情页)
      default: [
        {
          name: '工作台',
          items: [
            { name: '我的课程', path: '/teacher/teachinghome', icon: ' ' },
            { name: '请假中心', path: '/teacher/leave', icon: ' ' },
          ]
        },
        {
          name: '公共资源',
          items: [
            { name: '教室预约', path: '/teacher/classroom', icon: ' ' },
            { name: '图书馆', path: '/teacher/library', icon: ' ' }
          ]
        }
      ]
    }

    const currentMenuGroups = computed(() => {
      if (inCourseContext.value) return menuConfig.courseSmart
      return menuConfig.default
    })

    const currentModuleTitle = computed(() => {
      if (inCourseContext.value) return '智能教学系统'
      return '教师中心'
    })

    const resolvePath = (path) => {
      if (!path.startsWith('/')) {
        return `/teacher/course/${courseId.value}/${path}`
      }
      return path
    }

    // 高亮逻辑：只要当前路由包含这个模块的关键词，侧边栏就高亮
    const isItemActive = (item) => {
      const fullPath = resolvePath(item.path)
      const currentPath = route.path

      // 提取模块名 (例如 attendance) 进行模糊匹配
      // item.path 格式如 "attendance/launch" -> 取 "attendance"
      if (inCourseContext.value && !item.path.startsWith('/')) {
        const moduleKey = item.path.split('/')[0]
        // 如果当前路径里包含这个模块名 (e.g. /teacher/course/101/attendance/detail)
        if (currentPath.includes(`/${moduleKey}`)) {
          return true
        }
      }

      // 精确匹配 (用于首页等)
      return currentPath === fullPath || currentPath.startsWith(fullPath + '/')
    }

    return {
      currentMenuGroups,
      currentModuleTitle,
      resolvePath,
      isItemActive
    }
  }
}
</script>

<style scoped>
/* === 完全复用 StuSidebar.vue 的样式 === */
.app-sidebar {
  inline-size: 240px;
  background-color: var(--sidebar-bg, #d6e2f5);
  /* 学生端的淡蓝色背景 */
  block-size: calc(100vh - 60px);
  position: fixed;
  inset-block-start: 60px;
  inset-inline-start: 0;
  box-shadow: var(--sidebar-shadow, 2px 0 8px rgba(0, 0, 0, 0.1));
  z-index: 999;
  overflow-y: auto;
}

.sidebar-header {
  block-size: 50px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-block-end: 1px solid rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  font-weight: bold;
  color: var(--primary-color, #2A5CAA);
  font-size: 16px;
}

.sidebar-nav {
  padding: 15px 0;
}

.menu-group {
  margin-block-end: 20px;
}

.group-title {
  padding: 0 15px 8px 15px;
  font-size: 12px;
  color: var(--text-light-gray, #666666);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  text-decoration: none;
  color: var(--text-gray, #333333);
  transition: all 0.3s;
  border-inline-start: 3px solid transparent;
  /* 左侧高亮条 */
  gap: 10px;
  margin: 2px 0;
}

.menu-item:hover {
  background-color: rgba(194, 212, 240, 0.5);
  color: var(--primary-color, #2A5CAA);
}

.menu-item.active {
  background-color: var(--sidebar-active, #c2d4f0);
  /* 激活时的背景色 */
  color: var(--primary-color, #2A5CAA);
  border-inline-start-color: var(--primary-color, #2A5CAA);
  /* 激活时的左侧蓝条 */
}

.item-icon {
  font-size: 16px;
  min-inline-size: 20px;
  text-align: center;
}

.item-text {
  white-space: nowrap;
  overflow: hidden;
  font-weight: 500;
}
</style>