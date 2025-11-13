<!-- components/layout/AppSidebar.vue -->
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
        <router-link v-for="item in group.children" :key="item.path" :to="item.path" class="menu-item"
          :class="{ active: isItemActive(item) }">
          <span class="item-icon">{{ item.icon }}</span>
          <span class="item-text">{{ item.name }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 菜单配置（第二层级）- 根据PDF和接口文档重新设计
const menuConfig = {
  teaching: [
    {
      name: '教学管理',
      children: [
        { name: '考勤管理', path: '/teaching/attendance', icon: '✅' },
        { name: '作业管理', path: '/teaching/homework', icon: '📝' },
        { name: '成绩管理', path: '/teaching/grades', icon: '📊' },
        { name: '课程资源', path: '/teaching/resources', icon: '📚' },
        { name: '学生管理', path: '/teaching/students', icon: '👨‍🎓' },
        { name: '请假管理', path: '/teaching/leave', icon: '📋' }
      ]
    }
  ],
  reservation: [
    {
      name: '预约服务',
      children: [
        { name: '教室预约', path: '/reservation/classroom', icon: '📅' },
        { name: '预约记录', path: '/reservation/history', icon: '📋' },
        { name: '我的预约', path: '/reservation/my-bookings', icon: '👤' }
      ]
    },
    {
      name: '教室管理',
      children: [
        { name: '教学楼管理', path: '/reservation/management/buildings', icon: '🏢' },
        { name: '教室信息', path: '/reservation/management/classrooms', icon: '🏫' },
        { name: '审批预约', path: '/reservation/management/approve', icon: '✅' }
      ]
    }
  ],
  campus: [
    {
      name: '图书馆',
      children: [
        { name: '图书查询', path: '/campus/library/books', icon: '📚' },
        { name: '借阅记录', path: '/campus/library/records', icon: '📖' },
        { name: '图书推荐', path: '/campus/library/recommendations', icon: '🌟' },
        { name: '借阅策略', path: '/campus/library/policies', icon: '⏱️' }
      ]
    },
    {
      name: '校园服务',
      children: [
        { name: '校园动态', path: '/campus/news', icon: '📢' },
        { name: '活动安排', path: '/campus/activities', icon: '🎯' },
        { name: '校园服务', path: '/campus/services', icon: '🏫' }
      ]
    }
  ]
}

// 计算当前模块的菜单
const currentMenuGroups = computed(() => {
  if (route.path.startsWith('/teaching')) {
    return menuConfig.teaching
  } else if (route.path.startsWith('/reservation')) {
    return menuConfig.reservation
  } else if (route.path.startsWith('/campus')) {
    return menuConfig.campus
  }
  return []
})

// 计算当前模块标题
const currentModuleTitle = computed(() => {
  if (route.path.startsWith('/teaching')) return '智能教学'
  if (route.path.startsWith('/reservation')) return '资源预约'
  if (route.path.startsWith('/campus')) return '校园生活'
  return '功能菜单'
})

// 检查菜单项是否激活
const isItemActive = (item: { name: string; path: string; icon: string }) => {
  return route.path.startsWith(item.path)
}
</script>

<style scoped>
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
