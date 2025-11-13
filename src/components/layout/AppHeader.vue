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
          <button class="search-btn">🔍</button>
        </div>
        <div class="message-icon">
          <button class="icon-btn">💬</button>
        </div>
        <UserInfo />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import UserInfo from './UserInfo.vue'

interface MenuItem {
  name: string
  path: string
}

const route = useRoute()

// 最高层级菜单
const topLevelMenu = ref<MenuItem[]>([
  { name: '首页', path: '/' },
  { name: '智能教学', path: '/teaching' },
  { name: '资源预约', path: '/reservation' },
  { name: '校园生活', path: '/campus' }
])

// 检查菜单激活状态
const isActive = (menuItem: MenuItem): boolean => {
  if (menuItem.path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(menuItem.path)
}
</script>

<style scoped>
.app-header {
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  inset-inline-end: 0;
  z-index: 1000;
  background: white;
}

.top-level-nav {
  background-color: var(--primary-color, #2A5CAA);
  color: var(--text-white, #ffffff);
  block-size: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  inline-size: 200px;
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
</style>
