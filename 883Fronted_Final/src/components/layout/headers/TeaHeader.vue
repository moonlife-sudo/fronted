<template>
  <header class="app-header">
    <div class="top-level-nav">
      <div class="nav-left">
        <router-link to="/teacher/teachinghome" class="nav-logo">
          <span class="logo-text">智能教学系统 (教师端)</span>
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
          <input type="text" placeholder="搜索资源/学生..." class="search-input">
          <button class="search-btn">
            <img src="@/assets/images/search-icon.png" alt="搜索" class="icon-img">
          </button>
        </div>

        <div class="message-container" ref="messageRef">
          <button class="icon-btn" @click="toggleMessage">
            <img src="@/assets/images/message-icon.png" alt="消息" class="icon-img">
            <span class="badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
          </button>

          <div v-if="showMessageBox" class="message-dropdown">
            <div class="msg-header">
              <span>消息通知</span>
              <span class="clear-btn" @click="clearMessages">全部已读</span>
            </div>
            <div class="msg-list">
              <div v-for="msg in messages" :key="msg.id" class="msg-item">
                <div class="msg-avatar">{{ msg.sender[0] }}</div>
                <div class="msg-content">
                  <p class="sender">{{ msg.sender }}</p>
                  <p class="text">{{ msg.text }}</p>
                </div>
                <span class="msg-time">{{ msg.time }}</span>
              </div>
              <div v-if="messages.length === 0" class="empty-msg">暂无新消息</div>
            </div>
          </div>
        </div>

        <div class="user-avatar-container" ref="avatarRef" @click="toggleUserMenu">
          <div class="user-avatar">
            <img v-if="hasAvatar" src="https://placeholder.pics/svg/150x150/DEDEDE/555555/教师头像" alt="用户头像"
              class="avatar-img">
            <div v-else class="avatar-placeholder">{{ userInfo.name ? userInfo.name[0] : 'T' }}</div>
          </div>

          <div v-if="showUserMenu" class="user-dropdown">
            <div class="user-info-header">
              <p class="name">{{ userInfo.name || '教师' }}</p>
              <p class="role">教师</p>
            </div>
            <ul class="dropdown-list">
              <li @click="goToProfile">
                <i class="bi bi-person"></i> 个人中心
              </li>
              <li @click="handleLogout" class="logout-item">
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
  name: 'TeaHeader',
  setup() {
    const route = useRoute()
    const router = useRouter()

    // --- 导航逻辑 (教师端菜单) ---
    const topLevelMenu = ref([
      { name: '首页', path: '/home' }, // 通用首页
      { name: '教学管理', path: '/teacher/teachinghome' }, // 教师核心功能
      { name: '资源中心', path: '/teacher/resourcehome' },
    ])

    const isActive = (menuItem) => {
      if (menuItem.path === '/home') return route.path === '/home'
      return route.path.startsWith(menuItem.path)
    }

    // --- 用户信息逻辑 ---
    const userInfo = ref({ name: '周老师' })
    const hasAvatar = ref(true)
    const showUserMenu = ref(false)
    const avatarRef = ref(null)

    onMounted(() => {
      const savedUser = localStorage.getItem('userInfo')
      if (savedUser) {
        userInfo.value = JSON.parse(savedUser)
      }
    })

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
      showMessageBox.value = false
    }

    const goToProfile = () => {
      router.push('/teacher/profile')
    }

    const handleLogout = () => {
      if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        router.push('/login')
      }
    }

    // --- 消息逻辑 ---
    const showMessageBox = ref(false)
    const messageRef = ref(null)
    const unreadCount = ref(3)
    const messages = ref([
      { id: 1, sender: '教务处', text: '请于本周五前提交教学大纲。', time: '09:00' },
      { id: 2, sender: '张同学', text: '老师，请问作业什么时候截止？', time: '昨天' },
      { id: 3, sender: '系统通知', text: '您的课程《计算机导论》已通过审核。', time: '前天' }
    ])

    const toggleMessage = () => {
      showMessageBox.value = !showMessageBox.value
      showUserMenu.value = false
    }

    const clearMessages = () => {
      messages.value = []
      unreadCount.value = 0
    }

    // 点击外部关闭菜单
    const handleClickOutside = (event) => {
      if (avatarRef.value && !avatarRef.value.contains(event.target)) {
        showUserMenu.value = false
      }
      if (messageRef.value && !messageRef.value.contains(event.target)) {
        showMessageBox.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

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
      showMessageBox,
      messageRef,
      toggleMessage,
      unreadCount,
      messages,
      clearMessages
    }
  }
}
</script>

<style scoped>
/* 复用 StuHeader 的样式，主色调保持一致 */
.app-header {
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  inset-inline-end: 0;
  z-index: 1000;
  background-color: var(--primary-color, #2A5CAA);
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
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.main-nav {
  display: flex;
  gap: 5px;
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
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 500;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  display: flex;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 5px 15px;
  align-items: center;
}

.search-input {
  background: transparent;
  border: none;
  color: white;
  inline-size: 150px;
  outline: none;
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
  inline-size: 20px;
  block-size: 20px;
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.message-container {
  position: relative;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  position: relative;
}

.badge {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: -5px;
  background-color: #ff4d4f;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  transform: scale(0.8);
}

/* 下拉菜单样式 */
.message-dropdown,
.user-dropdown {
  position: absolute;
  inset-block-start: 50px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #333;
  z-index: 1001;
  overflow: hidden;
  animation: slideIn 0.2s ease;
}

.message-dropdown {
  inset-inline-end: -50px;
  inline-size: 300px;
}

.user-dropdown {
  inset-inline-end: 0;
  inline-size: 160px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.msg-header {
  padding: 12px 16px;
  border-block-end: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 14px;
}

.clear-btn {
  color: #666;
  cursor: pointer;
  font-size: 12px;
  font-weight: normal;
}

.msg-list {
  max-block-size: 300px;
  overflow-y: auto;
}

.msg-item {
  display: flex;
  padding: 12px 16px;
  border-block-end: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;
}

.msg-item:hover {
  background: #f9f9f9;
}

.msg-avatar {
  inline-size: 36px;
  block-size: 36px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-inline-end: 12px;
  font-weight: bold;
}

.msg-content {
  flex: 1;
  overflow: hidden;
}

.sender {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.text {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.msg-time {
  font-size: 11px;
  color: #999;
  margin-inline-start: 8px;
}

.empty-msg {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 13px;
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
}

.avatar-img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  inline-size: 100%;
  block-size: 100%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
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