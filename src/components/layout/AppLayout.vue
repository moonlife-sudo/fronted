<!-- components/layout/AppLayout.vue -->
<template>
  <div class="app-layout">
    <!-- 顶部导航（第一层级） -->
    <AppHeader />

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 侧边栏（第二层级） -->
      <AppSidebar v-if="showSidebar" />

      <!-- 内容区域（包含次顶部栏和页面内容） -->
      <div class="content-area" :class="{ 'with-sidebar': showSidebar }">
        <!-- 次顶部栏（第三层级） -->
        <SubHeader v-if="showSubHeader && hasSubMenu" />

        <!-- 页面内容 -->
        <main class="page-content" :class="{ 'with-subheader': showSubHeader && hasSubMenu }">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import SubHeader from './SubHeader.vue'

const route = useRoute()

// 首页不显示侧边栏
const showSidebar = computed(() => {
  return route.path !== '/'
})

// 显示次顶部栏的条件（有侧边栏且当前路由匹配模块）
const showSubHeader = computed(() => {
  if (!showSidebar.value) return false

  // 检查当前路由是否属于需要显示次顶部栏的模块
  return route.path.startsWith('/teaching') ||
    route.path.startsWith('/reservation') ||
    route.path.startsWith('/campus')
})

// 检查当前路由是否有子菜单（避免第二级页面显示空的次顶部栏）
const hasSubMenu = computed(() => {
  const path = route.path
  // 如果当前路径正好是第二级页面的路径，则不显示次顶部栏
  const isSecondLevelPage = [
    '/teaching/attendance', '/teaching/homework', '/teaching/grades',
    '/teaching/resources', '/teaching/students', '/teaching/leave',
    '/reservation/classroom', '/reservation/history',
    '/campus/library', '/campus/news', '/campus/services'
  ].includes(path)

  return !isSecondLevelPage
})
</script>

<style scoped>
.app-layout {
  min-block-size: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  margin-block-start: 60px;
  /* 顶部栏高度 */
  min-block-size: calc(100vh - 60px);
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-block-size: calc(100vh - 60px);
}

.content-area.with-sidebar {
  margin-inline-start: 240px;
  /* 侧边栏宽度 */
  inline-size: calc(100% - 240px);
}

.page-content {
  flex: 1;
  padding: 20px;
  background: #f5f7fa;
  min-block-size: calc(100vh - 60px);
  /* 只有顶部栏 */
}

.page-content.with-subheader {
  min-block-size: calc(100vh - 110px);
  /* 顶部栏 + 次顶部栏 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-area.with-sidebar {
    margin-inline-start: 0;
    inline-size: 100%;
  }
}
</style>
