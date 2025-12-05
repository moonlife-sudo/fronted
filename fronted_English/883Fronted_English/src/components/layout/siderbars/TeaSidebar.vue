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
        <router-link v-for="item in group.children" :key="item.path" :to="resolvePath(item.path)" class="menu-item"
          :class="{ active: isItemActive(item) }">
          <span class="item-text">{{ item.name }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'TeaSidebar',
  setup() {
    const route = useRoute()
    const courseId = ref('')

    watch(() => route.params.courseId, (newId) => {
      courseId.value = newId || ''
    }, { immediate: true })

    const inCourseContext = computed(() => !!courseId.value)

    // 菜单配置
    const menuConfig = {
      // 1. 课程内菜单 (智能教学) - 已按要求合并功能
      courseSmart: [
        {
          name: 'Teaching Center',
          children: [
            { name: 'Course Overview', path: 'overview' },
            { name: 'Knowledge Graph', path: 'learning-path' },

            // === 合并后的考勤管理 ===
            // 点击跳转到 launch，顶部 Tab 会显示 [发起签到 | 考勤记录 | 修改考勤]
            { name: 'Attendance Management', path: 'attendance/launch' },

            // === 合并后的作业管理 ===
            // 点击跳转到 publish，顶部 Tab 会显示 [发布作业 | 提交情况 | AI批改]
            { name: 'Homework Management', path: 'homework/publish' },

            { name: 'Grade Management', path: 'grades/detail' },
            { name: 'Course Resources', path: 'resources/list' },
            { name: 'Student List', path: 'students/detail' },
            { name: 'Leave Approval', path: 'leave/approval' }
          ]
        }
      ],
      // 2. Resource Center Menu
      resource: [
        {
          name: 'Resource Management',
          children: [
            { name: 'Classroom Booking', path: '/teacher/classroom' },
            { name: 'Library', path: '/teacher/library' }
          ]
        }
      ],
      // 3. Default/Teaching Home Menu
      teachingDefault: [
        {
          name: 'Teaching Work',
          children: [
            { name: 'My Courses', path: '/teacher/teachinghome' }
          ]
        }
      ]
    }

    const currentMenuGroups = computed(() => {
      const path = route.path

      // A. 课程内 -> 优先级最高
      if (inCourseContext.value) {
        return menuConfig.courseSmart
      }

      // B. 资源中心 (只有具体进入功能页才显示)
      if (path.includes('/teacher/classroom') || path.includes('/teacher/library')) {
        return menuConfig.resource
      }

      // C. 默认显示教学
      return menuConfig.teachingDefault
    })

    const currentModuleTitle = computed(() => {
      if (inCourseContext.value) return 'Intelligent Teaching'
      if (route.path.includes('library') || route.path.includes('classroom')) return 'Resource Management'
      return 'Teaching Management'
    })

    const resolvePath = (path) => {
      if (!path.startsWith('/')) {
        return `/teacher/course/${courseId.value}/${path}`
      }
      return path
    }

    const isItemActive = (item) => {
      const fullPath = resolvePath(item.path)
      // 核心逻辑：高亮判断
      // 比如点击"作业管理"，实际路径是 .../homework/publish
      // 此时如果用户切换 Tab 到了 .../homework/submissions，侧边栏"作业管理"依然要高亮
      // 所以只要路径包含 item.path 的前缀部分(如 'homework')即可

      // 提取路径的前缀部分 (例如 'homework/publish' -> 'homework')
      const itemPrefix = item.path.split('/')[0]

      if (route.path.startsWith(fullPath)) return true

      // 如果处于课程上下文中，且当前路由包含该菜单项的功能前缀，也视为激活
      if (inCourseContext.value && route.path.includes(`/${itemPrefix}/`)) {
        return true
      }

      return false
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
/* === 完全复用学生端的淡蓝色样式 === */
.app-sidebar {
  inline-size: 240px;
  background-color: #d6e2f5;
  /* 淡蓝色背景 */
  block-size: calc(100vh - 60px);
  position: fixed;
  inset-block-start: 60px;
  inset-inline-start: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 99;
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
  color: #2A5CAA;
  /* 深蓝色文字 */
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
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
  border-inline-start: 3px solid transparent;
  gap: 10px;
  margin: 2px 0;
}

.menu-item:hover {
  background-color: rgba(194, 212, 240, 0.5);
  color: #2A5CAA;
}

.menu-item.active {
  background-color: #c2d4f0;
  /* 激活状态背景更深一点的蓝 */
  color: #2A5CAA;
  border-inline-start-color: #2A5CAA;
}

.item-text {
  white-space: nowrap;
  overflow: hidden;
  font-weight: 500;
}
</style>