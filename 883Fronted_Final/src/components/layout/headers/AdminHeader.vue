<!-- components/layout/AppHeader.vue -->
<template>
<header class="app-header">
    <div class="top-level-nav">
      <div class="nav-left">
        <router-link to="/" class="nav-logo">
          <span class="logo-text">智能教学系统</span>
        </router-link>
        <nav class="main-nav">
          <router-link v-for="item in topLevelMenu" :key="item.path" :to="item.path" class="nav-item"
            :class="{ active: isActive(item) }">
            {{ item.name }}
          </router-link>
        </nav>
      </div>
      <div class="nav-right">
        <div class="search-box">
          <input type="text" placeholder="搜索..." class="search-input">
          <button class="search-btn"></button>
        </div>
        <div class="message-icon">
          <button class="icon-btn"></button>
        </div>
        <!-- 用户头像移到最右侧 -->
        <div class="user-avatar-container" @click="goToProfile">
          <div class="user-avatar">
            <img src="https://placeholder.pics/svg/150x150/DEDEDE/555555/用户头像" alt="用户头像" class="avatar-img" v-if="hasAvatar">
            <div class="avatar-placeholder" v-else></div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'AppHeader',
  setup() {
    const route = useRoute()
    const router = useRouter()

    // 最高层级菜单
    const topLevelMenu = ref([
      { name: '首页', path: '/home' },
      { name: '智能教学', path: '/admin/teaching' },
      { name: '资源管理', path: '/admin/resourcehome' },
      { name: '校园生活', path: '/admin/campushome' }
    ])

    // 用户头像状态
    const hasAvatar = ref(true)

    // 检查菜单激活状态
    const isActive = (menuItem) => {
      if (menuItem.path === '/') {
        return route.path === '/'
      }
      return route.path.startsWith(menuItem.path)
    }

    // 跳转到个人资料页面
    const goToProfile = () => {
      router.push('/admin/profile')
    }

    return {
      topLevelMenu,
      hasAvatar,
      isActive,
      goToProfile
    }
  }
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: var(--primary-color, #2A5CAA);
  color: var(--text-white, #ffffff);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

}

.top-level-nav {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-logo {
  font-size: 20px;
  font-weight: bold;
  color: var(--text-white, #ffffff);
  text-decoration: none;
}

.logo-text {
  color: var(--text-white, #ffffff);
}

.main-nav {
  display: flex;
  gap: 0;
}

.nav-item {
  color: var(--text-white, #ffffff);
  text-decoration: none;
  padding: 10px 20px;
  transition: background-color 0.3s;
  border-radius: 4px;
  font-size: 14px;
}

.nav-item:hover,
.nav-item.active {
  background-color: rgba(255, 255, 255, 0.15);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-box {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.search-input {
  background: transparent;
  border: none;
  padding: 5px 10px;
  color: var(--text-white, #ffffff);
  width: 200px;
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-btn {
  background: transparent;
  border: none;
  padding: 5px 10px;
  color: var(--text-white, #ffffff);
  cursor: pointer;
  font-size: 16px;
}

.icon-btn {
  background: transparent;
  border: none;
  color: var(--text-white, #ffffff);
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 用户头像样式 */
.user-avatar-container {
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.3s;
  margin-left: 10px;
}

.user-avatar-container:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 20px;
  color: var(--text-white, #ffffff);
}
</style>