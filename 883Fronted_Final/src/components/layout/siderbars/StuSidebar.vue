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
          <!-- <span class="item-icon">{{ item.icon }}</span> -->
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
  name: 'StuSidebar',
  setup() {
    const route = useRoute()
    const courseId = ref('')

    // 1. 监听路由，获取课程ID (这是新旧代码最大的区别)
    watch(() => route.params.courseId, (newId) => {
      courseId.value = newId || ''
    }, { immediate: true })

    // 判断是否在课程内
    const inCourseContext = computed(() => !!courseId.value)

    // 2. 菜单配置
    const menuConfig = {
      // === A. 课程内菜单 (智能教学) ===
      // path 写相对路径，后面会自动拼上 /student/course/:id/
      courseSmart: [
        {
          name: '学习中心',
          children: [
            { name: '考勤签到', path: 'attendance/index', icon: '📍' },
            { name: '我的作业', path: 'homework/list', icon: '📝' },
            { name: '成绩查询', path: 'grades/index', icon: '📊' },
            { name: '课程资源', path: 'resources/list', icon: '📂' },
            { name: '请假申请', path: 'leave/apply', icon: '📅' }
          ]
        },
        {
          name: '课程概况',
          children: [
            { name: '课程首页', path: 'overview', icon: '🏠' }
          ]
        }
      ],

      // === B. 普通菜单 (资源、校园) ===
      resource: [
        {
          name: '资源管理',
          children: [
            { name: '教室预约', path: '/student/classroom', icon: '🏛️' },
            { name: '书籍借阅', path: '/student/library', icon: '📖' }
          ]
        }
      ],
      campus: [
        {
          name: '校园生活',
          children: [
            { name: '宿舍分配', path: '/student/studorm', icon: '🛏️' },
            { name: '校园论坛', path: '/student/forum', icon: '💬' }
          ]
        }
      ],
      // 添加一个默认的教学管理入口（用于非课程内）
      teachingDefault: [
        {
          name: '教学管理',
          children: [
            { name: '我的课程', path: '/student/teachinghome', icon: '📚' },
            { name: '请假记录', path: '/student/leave', icon: '📅' } // 全局请假记录
          ]
        }
      ]
    }

    // 3. 决定显示哪组菜单
    const currentMenuGroups = computed(() => {
      // 如果在课程里，显示课程专属菜单
      if (inCourseContext.value) {
        return menuConfig.courseSmart
      }
      // 如果是资源相关
      if (route.path.includes('/resource') || route.path.includes('/library') || route.path.includes('/classroom')) {
        return menuConfig.resource
      }
      // 如果是校园相关
      if (route.path.includes('/campus') || route.path.includes('/dorm') || route.path.includes('/forum')) {
        return menuConfig.campus
      }
      // 默认显示教学首页
      return menuConfig.teachingDefault
    })

    // 4. 计算标题
    const currentModuleTitle = computed(() => {
      if (inCourseContext.value) return '智能学习'
      if (route.path.includes('/resource')) return '资源管理'
      if (route.path.includes('/campus') || route.path.includes('/dorm')) return '校园生活'
      return '教学管理'
    })

    // 5. 路径解析工具 (核心！)
    const resolvePath = (path) => {
      // 如果不是以 / 开头，说明是课程内的相对路径，需要加上前缀
      if (!path.startsWith('/')) {
        return `/student/course/${courseId.value}/${path}`
      }
      return path
    }

    // 6. 高亮逻辑
    const isItemActive = (item) => {
      const fullPath = resolvePath(item.path)
      return route.path === fullPath || route.path.startsWith(fullPath + '/')
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
/* === 保持你原有的样式完全不变 === */
.app-sidebar {
  inline-size: 240px;
  background-color: var(--sidebar-bg, #d6e2f5);
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
  gap: 10px;
  margin: 2px 0;
}

.menu-item:hover {
  background-color: rgba(194, 212, 240, 0.5);
  color: var(--primary-color, #2A5CAA);
}

.menu-item.active {
  background-color: var(--sidebar-active, #c2d4f0);
  color: var(--primary-color, #2A5CAA);
  border-inline-start-color: var(--primary-color, #2A5CAA);
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