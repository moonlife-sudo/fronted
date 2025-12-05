<template>
  <div class="profile-container">
    <div class="profile-sidebar">
      <div class="user-card">
          <div class="avatar-container">
          <img 
            loading="lazy" 
            :src="getAvatarImage()" 
            alt="User Avatar" 
            class="avatar"
          >
          <button class="avatar-upload" @click="triggerAvatarUpload">
            <i class="bi bi-camera-fill"></i>
          </button>
        </div>
        <h3 class="username">{{ userInfo.full_name || userInfo.username || userInfo.name || 'Loading...' }}</h3>
        <p class="user-role">{{ userInfo.role }}</p>
      </div>
      
      <nav class="profile-nav">
        <ul>
          <li 
            v-for="nav in navItems" 
            :key="nav.id"
            :class="{ active: activeSection === nav.id }"
          >
            <a href="#" @click.prevent="switchSection(nav.id)">
              <i :class="nav.icon"></i> {{ nav.text }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
    
    <div class="profile-content">
      <!-- 基本信息 -->
      <section id="basic-info" class="content-section" :class="{ active: activeSection === 'basic-info' }">
        <div class="section-header">
          <h2>Basic Info</h2>
          <button class="edit-btn" @click="enableEdit">
            <i class="bi bi-pencil-fill"></i> Edit
          </button>
        </div>
        
        <form class="info-form" @submit.prevent="saveBasicInfo">
          <div class="form-group">
            <label for="name">Name</label>
            <input 
              type="text" 
              id="name" 
              :value="userInfo.full_name || userInfo.username"
              @input="userInfo.full_name = $event.target.value"
              :readonly="!isEditing"
            >
          </div>
          
          <div class="form-group">
            <label for="student-id">Student ID</label>
            <input 
              type="text" 
              id="student-id" 
              v-model="userInfo.student_id_number" 
              readonly
            >
          </div>
          
          <div class="form-group">
            <label for="major">Major</label>
            <input 
              type="text" 
              id="major" 
              v-model="userInfo.major" 
              :readonly="!isEditing"
            >
          </div>
          
          <div class="form-group">
            <label for="class-name">Class</label>
            <input 
              type="text" 
              id="class-name" 
              v-model="userInfo.class_name" 
              :readonly="!isEditing"
            >
          </div>
          
          <div class="form-group">
            <label for="grade">Grade</label>
            <input 
              type="text" 
              id="grade" 
              v-model="userInfo.grade" 
              :readonly="!isEditing"
            >
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="userInfo.email" 
              :readonly="!isEditing"
            >
          </div>
          
          <div class="form-actions" v-if="isEditing">
            <button type="button" class="cancel-btn" @click="cancelEdit">Cancel</button>
            <button type="submit" class="save-btn">Save</button>
          </div>
        </form>
      </section>
      
      <!-- 账号安全 -->
      <section id="account-security" class="content-section" :class="{ active: activeSection === 'account-security' }">
        <div class="section-header">
          <h2>Account Security</h2>
        </div>
        
        <div class="security-item">
          <div class="security-info">
            <i class="bi bi-shield-lock-fill"></i>
            <div>
              <h3>Login Password</h3>
              <p>Regularly change your password to ensure account security</p>
            </div>
          </div>
          <button class="modify-btn" @click="modifyPassword">Change Password</button>
        </div>
        
        <div class="security-item">
          <div class="security-info">
            <i class="bi bi-envelope-fill"></i>
            <div>
              <h3>Email Binding</h3>
              <p>Bound Email: {{ maskedEmail }}</p>
            </div>
          </div>
          <button class="modify-btn" @click="enableEdit">Edit Info</button>
        </div>
        
        <div class="security-item">
          <div class="security-info">
            <i class="bi bi-envelope-fill"></i>
            <div>
              <h3>Email Binding</h3>
              <p>Bound Email: {{ maskedEmail }}</p>
            </div>
          </div>
          <button class="modify-btn" @click="enableEdit">Edit Info</button>
        </div>
        
        <!-- 修改密码对话框 -->
        <div v-if="passwordDialog.visible" class="password-dialog-overlay" @click.self="passwordDialog.visible = false">
          <div class="password-dialog">
            <h3>Change Password</h3>
            <div class="form-group">
              <label>Old Password</label>
              <input type="password" v-model="passwordDialog.oldPassword" placeholder="Please enter old password">
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input type="password" v-model="passwordDialog.newPassword" placeholder="Please enter new password (at least 6 characters)">
            </div>
            <div class="form-group">
              <label>Confirm New Password</label>
              <input type="password" v-model="passwordDialog.confirmPassword" placeholder="Please re-enter new password">
            </div>
            <div class="dialog-actions">
              <button class="cancel-btn" @click="passwordDialog.visible = false">Cancel</button>
              <button class="save-btn" @click="savePassword" :disabled="loading">Save</button>
            </div>
          </div>
        </div>
        
        <div class="security-tips">
          <i class="bi bi-info-circle-fill"></i>
          <p>To protect your account security, it is recommended to change your password regularly and bind your email</p>
        </div>
      </section>
      
      <!-- 消息通知 -->
      <section id="notifications" class="content-section" :class="{ active: activeSection === 'notifications' }">
        <div class="section-header">
          <h2>Notifications</h2>
          <button class="mark-all-read" @click="markAllAsRead">Mark All as Read</button>
        </div>
        
        <div class="notification-list">
          <div v-if="notifications.length === 0" class="empty-notifications">
            <i class="bi bi-bell-slash" style="font-size: 48px; color: #ccc; margin-block-end: 16px;"></i>
            <p style="color: #999; font-size: 16px;">No notifications</p>
            <p style="color: #ccc; font-size: 14px;">All notifications have been processed</p>
          </div>
          
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="notification-item" 
            :class="{ unread: notification.unread }"
          >
            <div class="notification-icon">
              <i :class="notification.icon"></i>
            </div>
            <div class="notification-content">
              <h3>{{ notification.title }}</h3>
              <p>{{ notification.content }}</p>
              <span class="notification-time">{{ notification.time }}</span>
            </div>
            <button 
              v-if="notification.unread"
              class="mark-read-btn" 
              @click="markAsRead(notification.id)"
              title="Mark as Read"
            >
              <i class="bi bi-check"></i>
            </button>
          </div>
        </div>
      </section>
      
      <!-- 系统设置 -->
      <section id="settings" class="content-section" :class="{ active: activeSection === 'settings' }">
        
        <div class="settings-group">
          <h3>Notification Settings</h3>
          <div 
            v-for="setting in notificationSettings" 
            :key="setting.id"
            class="setting-item"
          >
            <div class="setting-info">
              <h4>{{ setting.name }}</h4>
              <p>{{ setting.description }}</p>
            </div>
            <label class="switch">
              <input 
                type="checkbox" 
                v-model="setting.enabled"
                @change="updateSetting(setting)"
              >
              <span class="slider"></span>
            </label>
          </div>
        </div>
        
        <div class="settings-group">
          <h3>Privacy Settings</h3>
          <div 
            v-for="setting in privacySettings" 
            :key="setting.id"
            class="setting-item"
          >
            <div class="setting-info">
              <h4>{{ setting.name }}</h4>
              <p>{{ setting.description }}</p>
            </div>
            <label class="switch">
              <input 
                type="checkbox" 
                v-model="setting.enabled"
                @change="updateSetting(setting)"
              >
              <span class="slider"></span>
            </label>
          </div>
        </div>
        
      </section>
    </div>
  </div>
</template>

<script>
import { getProfile, updateProfile, updatePassword, uploadFile } from '@/api/user'

export default {
  name: 'UserProfile',
  data() {
    return {
      activeSection: 'basic-info',
      isEditing: false,
      loading: false,
      passwordDialog: {
        visible: false,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      originalUserInfo: null, // 保存原始数据用于取消编辑
      userInfo: {
        full_name: '',
        username: '',
        student_id_number: '',
        email: '',
        avatar_url: '',
        major: '',
        class_name: '',
        grade: '',
        role: 'Student'
      },
      navItems: [
        { id: 'basic-info', text: 'Basic Info', icon: 'bi bi-person-fill' },
        { id: 'account-security', text: 'Account Security', icon: 'bi bi-shield-lock-fill' },
        { id: 'notifications', text: 'Notifications', icon: 'bi bi-bell-fill' },
        { id: 'settings', text: 'System Settings', icon: 'bi bi-gear-fill' }
      ],
      notifications: [
        {
          id: 1,
          title: 'System Announcement: New Semester Course Selection',
          content: 'The new semester course selection system will open on September 1, 2023. Please prepare in advance...',
          time: '2023-08-25 10:30',
          icon: 'bi bi-megaphone-fill',
          unread: true
        },
        {
          id: 2,
          title: 'Course Reminder: Computer Organization Principles',
          content: 'Your Computer Organization Principles course will be held tomorrow at 8:00 AM in Classroom 301, Teaching Building 3...',
          time: '2023-08-24 15:45',
          icon: 'bi bi-calendar-event-fill',
          unread: false
        },
        {
          id: 3,
          title: 'Homework Reminder: Data Structures Homework',
          content: 'The second homework for Data Structures course has been released, deadline is September 5, 2023...',
          time: '2023-08-23 09:20',
          icon: 'bi bi-book-fill',
          unread: false
        }
      ],
      
      notificationSettings: [
        {
          id: 1,
          name: 'Course Reminders',
          description: 'Remind me before class starts',
          enabled: true
        },
        {
          id: 2,
          name: 'Homework Deadline Reminders',
          description: 'Remind me before homework deadlines',
          enabled: true
        },
        {
          id: 3,
          name: 'System Announcements',
          description: 'Receive system announcements and notifications',
          enabled: true
        }
      ],
      privacySettings: [
        {
          id: 1,
          name: 'Public Profile',
          description: 'Allow other students to view my basic information',
          enabled: false
        },
      ],
      themeColors: ['blue', 'green', 'purple']
    }
  },
  computed: {
    maskedEmail() {
      return this.userInfo.email ? this.userInfo.email.replace(/(.{2}).*@(.*)/, '$1****@$2') : 'Not Bound'
    },
    filteredActivities() {
      // 根据选择的时间范围过滤活动
      // 这里简化处理，实际项目中需要根据日期计算
      return this.activities
    }
  },
  methods: {
    // Get avatar image
    getAvatarImage() {
      // 根据用户角色获取对应头像
      const savedUser = localStorage.getItem('userInfo')
      if (savedUser) {
        try {
          const userInfo = JSON.parse(savedUser)
          const roles = userInfo.roles || []
          
          if (roles.includes('super_admin') || roles.includes('admin') || roles.includes('administrator')) {
              return require('@/assets/images/avatar-admin.svg')
            } else if (roles.includes('teacher') || roles.includes('instructor')) {
              return require('@/assets/images/avatar-teacher.svg')
            } else {
              return require('@/assets/images/student_icon.png')
          }
        } catch (e) {
          return require('@/assets/images/avatar-student.svg')
        }
      }
      
      return require('@/assets/images/avatar-student.svg')
    },
    switchSection(sectionId) {
      this.activeSection = sectionId
    },
    enableEdit() {
      this.isEditing = true
    },
    cancelEdit() {
      this.isEditing = false
      // 恢复原始数据
      if (this.originalUserInfo) {
        this.userInfo = JSON.parse(JSON.stringify(this.originalUserInfo))
      }
    },
    async saveBasicInfo() {
      if (this.loading) return
      
      // 检查token是否存在
      const token = localStorage.getItem('token')
      if (!token) {
        alert('未登录，请先登录')
        this.$router.push('/login')
        return
      }
      
      this.loading = true
      try {
        const basicInfo = {
          email: this.userInfo.email || null
        }
        
        const profileInfo = {
          major: this.userInfo.major || null,
          class_name: this.userInfo.class_name || null,
          grade: this.userInfo.grade || null
        }
        
        const result = await updateProfile({
          basicInfo,
          profileInfo
        })
        
        if (result.code === 1) {
          alert('个人信息已保存成功！')
          this.isEditing = false
          // 重新加载用户信息
          await this.loadUserInfo()
        } else {
          alert(result.msg || '保存失败，请重试')
        }
      } catch (error) {
        console.error('保存失败:', error)
        if (error.message && error.message.includes('未登录')) {
          alert('登录已过期，请重新登录')
          this.$router.push('/login')
        } else {
          alert(error.message || '保存失败，请稍后重试')
        }
      } finally {
        this.loading = false
      }
    },
    modifyPassword() {
      this.passwordDialog.visible = true
      this.passwordDialog.oldPassword = ''
      this.passwordDialog.newPassword = ''
      this.passwordDialog.confirmPassword = ''
    },
    async savePassword() {
      if (!this.passwordDialog.oldPassword || !this.passwordDialog.newPassword) {
        alert('请填写完整信息')
        return
      }
      
      if (this.passwordDialog.newPassword !== this.passwordDialog.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }
      
      if (this.passwordDialog.newPassword.length < 6) {
        alert('密码长度至少6位')
        return
      }
      
      this.loading = true
      try {
        const result = await updatePassword({
          oldPassword: this.passwordDialog.oldPassword,
          newPassword: this.passwordDialog.newPassword
        })
        
        if (result.code === 1) {
          alert('密码修改成功！')
          this.passwordDialog.visible = false
        } else {
          alert(result.msg || '密码修改失败')
        }
      } catch (error) {
        console.error('修改密码失败:', error)
        alert(error.message || 'Password change failed, please try again later')
      } finally {
        this.loading = false
      }
    },
    async loadUserInfo() {
      this.loading = true
      try {
        // 检查token是否存在
        const token = localStorage.getItem('token')
        console.log('Profile页面 - Token检查:', token ? `${token.substring(0, 20)}...` : '未找到token')
        
        if (!token) {
          alert('未登录，请先登录')
          this.$router.push('/login')
          return
        }
        
        console.log('Profile页面 - 准备调用getProfile API')
        const result = await getProfile()
        console.log('Profile页面 - API响应:', result)
        if (result.code === 1 && result.data) {
          const data = result.data
          this.userInfo = {
            full_name: data.full_name || data.name || '',
            username: data.username || '',
            student_id_number: data.profile?.student_id_number || '',
            email: data.email || '',
            avatar_url: data.avatar_url || '',
            major: data.profile?.major || '',
            class_name: data.profile?.class_name || '',
            grade: data.profile?.grade || '',
            role: 'Student'
          }
          // 保存原始数据
          this.originalUserInfo = JSON.parse(JSON.stringify(this.userInfo))
        } else {
          alert(result.msg || 'Failed to load user information')
        }
      } catch (error) {
        console.error('加载用户信息失败:', error)
        
        // 如果是401错误，尝试使用localStorage的用户信息作为fallback
        if (error.response && error.response.status === 401) {
          console.log('API返回401，尝试使用localStorage数据')
          const storedUserInfo = localStorage.getItem('userInfo')
          if (storedUserInfo) {
            try {
              const userData = JSON.parse(storedUserInfo)
              this.userInfo = {
                full_name: userData.full_name || userData.name || '用户',
                username: userData.username || '',
                student_id_number: userData.student_id_number || '',
                email: userData.email || '',
                avatar_url: userData.avatar_url || '',
                major: userData.major || '',
                class_name: userData.class_name || '',
                grade: userData.grade || '',
                role: 'Student'
              }
              this.originalUserInfo = JSON.parse(JSON.stringify(this.userInfo))
              console.log('使用localStorage数据成功')
              return
            } catch (parseError) {
              console.error('解析localStorage用户数据失败:', parseError)
            }
          }
        }
        
        if (error.message && error.message.includes('未登录')) {
          alert('登录已过期，请重新登录')
          this.$router.push('/login')
        } else {
          alert(error.message || '加载用户信息失败，请刷新页面重试')
        }
      } finally {
        this.loading = false
      }
    },
    markAllAsRead() {
      // 过滤掉所有未读消息，只保留已读消息（如果有的话）
      const readCount = this.notifications.filter(n => n.unread).length
      
      if (readCount === 0) {
        alert('没有未读消息')
        return
      }
      
      // 移除所有未读消息
      this.notifications = this.notifications.filter(notification => !notification.unread)
      
      alert(`已删除 ${readCount} 条未读消息`)
    },
    
    // 单个消息标记为已读并移除
    markAsRead(notificationId) {
      this.notifications = this.notifications.filter(notification => notification.id !== notificationId)
    },
    changeViewMode(mode) {
      this.viewMode = mode
    },
    removeFavorite(id) {
      if (confirm('确定要删除此收藏项吗？')) {
        this.favorites = this.favorites.filter(favorite => favorite.id !== id)
      }
    },
    filterActivities() {
      // 根据时间范围过滤活动
      // 实际项目中需要实现具体的过滤逻辑
      console.log('过滤活动，时间范围:', this.selectedTimeRange)
    },
    updateSetting(setting) {
      console.log('更新设置:', setting)
      // 实际项目中这里会发送API请求保存设置
    },
    changeTheme(color) {
      this.selectedTheme = color
      // 实际项目中这里会应用主题颜色
      alert(`主题颜色已切换为: ${color}`)
    },
    changeFontSize() {
      // 实际项目中这里会更改字体大小
      alert(`字体大小已更改为: ${this.selectedFontSize}`)
    },
    async triggerAvatarUpload() {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async (e) => {
        const file = e.target.files[0]
        if (file) {
          // 检查文件大小（限制5MB）
          if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB')
            return
          }
          
          this.loading = true
          try {
            const result = await uploadFile(file)
            if (result.code === 1 && result.data) {
              this.userInfo.avatar_url = result.data
              // 更新头像显示
              const avatarImg = document.querySelector('.avatar')
              if (avatarImg) {
                avatarImg.src = result.data
              }
              alert('头像上传成功！')
            } else {
              alert(result.msg || '头像上传失败')
            }
          } catch (error) {
            console.error('上传头像失败:', error)
            alert(error.message || '上传头像失败，请稍后重试')
          } finally {
            this.loading = false
          }
        }
      }
      input.click()
    }
  },
  async mounted() {
    await this.loadUserInfo()
  }
}
</script>

<style scoped>
@import '@/assets/css/profile.css';

/* 密码对话框样式 */
.password-dialog-overlay {
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  inset-inline-end: 0;
  inset-block-end: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.password-dialog {
  background: white;
  border-radius: 12px;
  padding: 30px;
  inline-size: 90%;
  max-inline-size: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.password-dialog h3 {
  margin-block-end: 20px;
  color: #333;
  font-size: 20px;
}

.password-dialog .form-group {
  margin-block-end: 20px;
}

.password-dialog .form-group label {
  display: block;
  margin-block-end: 8px;
  color: #666;
  font-weight: 500;
}

.password-dialog .form-group input {
  inline-size: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.password-dialog .form-group input:focus {
  outline: none;
  border-color: #2A5CAA;
  box-shadow: 0 0 0 3px rgba(42, 92, 170, 0.1);
}

.password-dialog .dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-block-start: 20px;
}

.password-dialog .cancel-btn,
.password-dialog .save-btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.password-dialog .cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.password-dialog .cancel-btn:hover {
  background: #e0e0e0;
}

.password-dialog .save-btn {
  background: #2A5CAA;
  color: white;
}

.password-dialog .save-btn:hover {
  background: #1e4b8b;
}

.password-dialog .save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 空状态样式 */
.empty-notifications {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 20px 0;
}

/* 消息项样式优化 */
.notification-item {
  position: relative;
  padding-inline-end: 50px; /* 为标记按钮留出空间 */
}

.mark-read-btn {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-end: 15px;
  transform: translateY(-50%);
  background: #2A5CAA;
  color: white;
  border: none;
  inline-size: 32px;
  block-size: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(42, 92, 170, 0.2);
}

.mark-read-btn:hover {
  background: #1e4b8b;
  transform: translateY(-50%) scale(1.1);
}

/* 全部已读按钮样式 */
.mark-all-read {
  background: #52c41a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.mark-all-read:hover {
  background: #389e0d;
  transform: translateY(-1px);
}
</style>