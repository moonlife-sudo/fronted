<template>
  <header class="app-header">
    <div class="top-level-nav">
      <div class="nav-left">
        <router-link to="/student/home" class="nav-logo">
          <span class="logo-text">Smart Teaching System</span>
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
          <input type="text" placeholder="Search..." class="search-input">
          <button class="search-btn">
            <img src="@/assets/images/search-icon.png" alt="Search" class="icon-img">
          </button>
        </div>

        <div class="user-avatar-container" ref="avatarRef" @click="toggleUserMenu">
          <div class="user-avatar">
            <img :src="getAvatarImage()" alt="User Avatar" class="avatar-img">
          </div>

          <div v-if="showUserMenu" class="user-dropdown">
            <div class="user-info-header">
              <p class="name">{{ getUserDisplayName() }}</p>
              <p class="role">{{ getRoleDisplayName() }}</p>
            </div>
            <ul class="dropdown-list">
              <li @click="goToProfile">
                <i class="bi bi-person"></i> Personal Profile
              </li>
              <li @click="handleLogout" class="logout-item">
                <i class="bi bi-box-arrow-right"></i> Logout
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
  name: 'StuHeader',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const topLevelMenu = ref([
      { name: 'Home', path: '/student/home' }, // 修复路径
      { name: 'Smart Teaching', path: '/student/teachinghome' },
      { name: 'Resource Management', path: '/student/resourcehome' },
      { name: 'Campus Life', path: '/student/campushome' }
    ])

    const isActive = (menuItem) => {
      return route.path === menuItem.path || (menuItem.path !== '/student/home' && route.path.startsWith(menuItem.path))
    }

    const userInfo = ref({ name: 'Student User' })
    const hasAvatar = ref(true)
    const showUserMenu = ref(false)
    const avatarRef = ref(null)

    // 获取头像图片
    const getAvatarImage = () => {
      const role = getRoleDisplayName()
      if (role === 'Administrator') {
        return require('@/assets/images/avatar-admin.svg')
      } else if (role === 'Teacher') {
        return require('@/assets/images/avatar-teacher.svg')
      } else {
        return require('@/assets/images/student_icon.png')
      }
    }

    // 获取用户显示名称
    const getUserDisplayName = () => {
      console.log('学生端Header - 当前用户信息:', userInfo.value)
      return userInfo.value.full_name || userInfo.value.name || userInfo.value.username || 'Student'
    }

    // 获取角色显示名称
    const getRoleDisplayName = () => {
      if (userInfo.value.roles && Array.isArray(userInfo.value.roles)) {
        const roles = userInfo.value.roles
        if (roles.includes('super_admin') || roles.includes('admin') || roles.includes('administrator') || roles.includes('Administrator')) {
          return 'Administrator'
        } else if (roles.includes('teacher') || roles.includes('Teacher') || roles.includes('instructor')) {
          return 'Teacher'
        } else if (roles.includes('student')) {
          return 'Student'
        } else {
          return 'Student' // Default to Student
        }
      }
      // 根据用户名判断（兜底逻辑）
      if (userInfo.value.username === 'admin') {
        return 'Administrator'
      } else if (userInfo.value.username && userInfo.value.username.startsWith('T')) {
        return 'Teacher'
      } else {
        return 'Student'
      }
    }

    onMounted(() => {
      const savedUser = localStorage.getItem('userInfo')
      console.log('学生端Header - localStorage中的userInfo:', savedUser)
      if (savedUser) {
        try { 
          const parsedUser = JSON.parse(savedUser)
          console.log('学生端Header - 解析后的用户信息:', parsedUser)
          userInfo.value = parsedUser
        } catch (e) { 
          console.error('学生端Header - 解析userInfo失败:', e)
        }
      }
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    const goToProfile = () => {
      router.push('/student/profile')
    }

    const handleLogout = () => {
      if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        router.push('/login')
      }
    }

    const handleClickOutside = (event) => {
      if (avatarRef.value && !avatarRef.value.contains(event.target)) {
        showUserMenu.value = false
      }
    }

    return {
      topLevelMenu,
      isActive,
      userInfo,
      hasAvatar,
      showUserMenu,
      avatarRef,
      toggleUserMenu,
      goToProfile,
      handleLogout,
      getRoleDisplayName,
      getUserDisplayName,
      getAvatarImage
    }
  }
}
</script>

<style scoped>
/* 使用与 TeaHeader 相同的样式 */
.app-header {
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  inset-inline-end: 0;
  z-index: 1000;
  background-color: #2A5CAA;
  color: white;
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
  gap: 30px;
}

.nav-logo {
  font-size: 18px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.main-nav {
  display: flex;
  gap: 10px;
}

.nav-item {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: 6px 16px;
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

/* 统一的搜索框样式 */
.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 0 15px;
  block-size: 32px;
  inline-size: 220px;
  /* 固定宽度 */
}

.search-input {
  background: transparent;
  border: none;
  color: white;
  flex: 1;
  outline: none;
  font-size: 13px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
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
}

.user-avatar {
  inline-size: 36px;
  block-size: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
}

.avatar-img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  color: white;
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