<!-- components/layout/UserInfo.vue -->
<template>
  <div class="user-info">
    <div class="user-avatar">
      <img :src="userAvatar" alt="用户头像" class="avatar-img">
    </div>
    <div class="user-details">
      <span class="user-name">{{ userName }}</span>
      <div class="user-actions">
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userAvatar = ref<string>('/src/assets/images/default-avatar.jpg')
const userName = ref<string>('教师姓名')

// 组件挂载时获取用户信息
onMounted(() => {
  // 从本地存储获取用户信息
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      userName.value = user.name || '教师姓名'
      if (user.avatar) {
        userAvatar.value = user.avatar
      }
    } catch (error) {
      console.error('解析用户信息失败:', error)
    }
  }
})

const handleLogout = () => {
  // 清除所有认证信息
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('authToken')
  sessionStorage.clear()

  // 如果有使用状态管理，这里可以重置用户状态
  // 例如：userStore.clearUser()

  // 跳转到登录页
  router.push('/login')

  console.log('退出登录成功')
}
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  inline-size: 36px;
  block-size: 36px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.avatar-img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  color: var(--text-white);
  font-size: 14px;
  font-weight: 500;
}

.user-actions {
  margin-block-start: 2px;
}

.logout-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--text-white);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}
</style>
