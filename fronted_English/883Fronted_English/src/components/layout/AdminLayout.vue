<template>
  <div class="layout">
    <AdminHeader />

    <AdminSidebar v-if="showSidebar" />

    <main class="main-content" :class="{ 'with-sidebar': showSidebar }">
      <router-view />
    </main>
  </div>
</template>

<script>
import AdminHeader from './headers/AdminHeader.vue'
import AdminSidebar from './siderbars/AdminSidebar.vue' // 注意这里你的目录名是 siderbars (有个拼写错误但要对应实际目录)
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'AdminLayout',
  components: {
    AdminHeader,
    AdminSidebar
  },
  setup() {
    const route = useRoute()

    // 控制侧边栏显示的逻辑
    const showSidebar = computed(() => {
      // 1. 如果路由 meta 中明确配置了 showSidebar，以 meta 为准
      if (route.meta && typeof route.meta.showSidebar !== 'undefined') {
        return route.meta.showSidebar
      }
      // 2. 默认逻辑：管理员端大部分页面显示侧边栏，除了一些概览页
      // 你可以根据需要调整这里的逻辑
      return true
    })

    return {
      showSidebar
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
  transition: margin-left 0.2s ease, width 0.2s ease;
  inline-size: 100%;
  position: relative;
}

/* 当侧边栏存在时，内容区域向右偏移 240px (对应 Sidebar 宽度) */
.main-content.with-sidebar {
  margin-inline-start: 240px;
  inline-size: calc(100% - 240px);
}
</style>