<template>
  <header class="app-header">
    <div class="top-level-nav">
      <div class="nav-left">
        <router-link to="/admin/home" class="nav-logo">
          <span class="logo-text">智能教学系统 (管理端)</span>
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
          <button class="search-btn">
            <img src="@/assets/images/search-icon.png" alt="搜索" class="icon-img">
          </button>
        </div>

        <div class="user-avatar-container" ref="avatarRef" @click="toggleUserMenu">
          <div class="user-avatar">
            <img src="https://placeholder.pics/svg/150x150/DEDEDE/555555/管理员" alt="用户头像" class="avatar-img"
              v-if="hasAvatar">
            <div class="avatar-placeholder" v-else>A</div>
          </div>

          <div v-if="showUserMenu" class="user-dropdown">
            <div class="user-info-header">
              <p class="name">{{ userInfo.name || '管理员' }}</p>
              <p class="role">系统管理员</p>
            </div>
            <ul class="dropdown-list">
              <li @click.stop="goToProfile">
                <i class="bi bi-person"></i> 个人中心
              </li>
              <li @click.stop="handleLogout" class="logout-item">
                <i class="bi bi-box-arrow-right"></i> 退出登录
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'AdminHeader',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const topLevelMenu = ref([
      { name: '首页', path: '/admin/home' }, // 修复路径
      { name: '资源管理', path: '/admin/resourcehome' },
      { name: '生活管理', path: '/admin/campushome' }
    ])

    const userInfo = ref({ name: '管理员' })
    const hasAvatar = ref(true)
    const showUserMenu = ref(false)
    const avatarRef = ref(null)

    onMounted(() => {
      const savedUser = localStorage.getItem('userInfo')
      if (savedUser) {
        try { userInfo.value = JSON.parse(savedUser) } catch (e) { }
      }
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    const isActive = (menuItem) => {
      return route.path === menuItem.path || (menuItem.path !== '/admin/home' && route.path.startsWith(menuItem.path))
    }

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    const handleClickOutside = (event) => {
      if (avatarRef.value && !avatarRef.value.contains(event.target)) {
        showUserMenu.value = false
      }
    }

    const goToProfile = () => {
      showUserMenu.value = false
      router.push('/admin/profile')
    }

    const handleLogout = () => {
      if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        router.push('/login')
      }
    }

    return {
      topLevelMenu,
      hasAvatar,
      userInfo,
      showUserMenu,
      avatarRef,
      isActive,
      toggleUserMenu,
      goToProfile,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* 复用样式 */
.app-header {
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  inset-inline-end: 0;
  z-index: 1000;
  background-color: #2A5CAA;
  block-size: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.top-level-nav {
  inline-size: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-logo {
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-decoration: none;
  white-space: nowrap;
}

.logo-text {
  color: white;
}

.main-nav {
  display: flex;
  gap: 10px;
}

.nav-item {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
}

.nav-item:hover,
.nav-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 500;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 统一搜索框 */
.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 0 15px;
  block-size: 32px;
  inline-size: 220px;
}

.search-input {
  background: transparent;
  border: none;
  color: white;
  flex: 1;
  outline: none;
  font-size: 14px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.icon-img {
  inline-size: 16px;
  block-size: 16px;
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.user-avatar-container {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  padding: 2px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s;
}

.user-avatar-container:hover {
  border-color: white;
}

.user-avatar {
  inline-size: 32px;
  block-size: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ddd;
}

.avatar-img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  color: #555;
  font-weight: bold;
}

.user-dropdown {
  position: absolute;
  inset-block-start: 50px;
  inset-inline-end: 0;
  inline-size: 160px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #333;
  z-index: 1001;
  overflow: hidden;
}

.user-info-header {
  padding: 15px;
  border-block-end: 1px solid #eee;
  background: #fcfcfc;
}

.user-info-header .name {
  font-weight: 600;
  font-size: 14px;
  margin: 0 0 4px 0;
  color: #333;
}

.user-info-header .role {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.dropdown-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-list li {
  padding: 12px 15px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s;
  color: #555;
}

.dropdown-list li:hover {
  background: #f5f7fa;
  color: #2A5CAA;
}

.logout-item {
  color: #ff4d4f !important;
  border-block-start: 1px solid #eee;
}

.logout-item:hover {
  background: #fff1f0 !important;
}
</style>