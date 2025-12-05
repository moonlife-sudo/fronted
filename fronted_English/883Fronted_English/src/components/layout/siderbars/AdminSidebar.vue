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

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'AppSidebar',
  setup() {
    const route = useRoute()

    // 菜单配置（第二层级）- 根据PDF和接口文档重新设计
    const menuConfig = {
    resource: [
        {
          children: [
            { name: 'Classroom Management', path: '/admin/classroom' },
            { name: 'Library Management', path: '/admin/library' },
            { name: 'Approval Management', path: '/admin/approve' }
          ]
        }
      ],
      campus: [
        {
          name: 'Campus Life',
          children: [
            { name: 'Dormitory Assignment', path: '/admin/dormassign' },
            { name: 'Dormitory Management', path: '/admin/dorm' }
          ]
        }
      ]
    }
    // 计算当前模块的菜单
    const currentMenuGroups = computed(() => {
     if (route.path.startsWith('/admin/classroom')) {
        return menuConfig.resource
      } else if (route.path.startsWith('/admin/library')) {
        return menuConfig.resource
      } 
      else if (route.path.startsWith('/admin/approve')) {
        return menuConfig.resource
      } 
      else if (route.path.startsWith('/admin/dorm') ||
          route.path.startsWith('/admin/dormassign') ) {
        return menuConfig.campus
      }
      return []
    })

    // 计算当前模块标题
    const currentModuleTitle = computed(() => {
      if (route.path.startsWith('/admin/dorm') ||
          route.path.startsWith('/admin/dormassign')) {
        return 'Campus Life'
      }
      if (route.path.startsWith('/admin/classroom')) return 'Resource Management'
      if (route.path.startsWith('/admin/library')) return 'Resource Management'
      if (route.path.startsWith('/admin/approve')) return 'Resource Management'
      return 'Function Menu'
    })

    // 检查菜单项是否激活
    const isItemActive = (item) => {
      return route.path === item.path || route.path.startsWith(item.path + '/')
    }

    return {
      currentMenuGroups,
      currentModuleTitle,
      isItemActive
    }
  }
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

.nav-text {
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
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