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
        <h3 class="username">{{ userInfo.full_name || userInfo.username || userInfo.name || '加载中...' }}</h3>
        <p class="user-role">{{ userInfo.role }} | {{ userInfo.college }}</p>
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
          <h2>Basic Information</h2>
          <button class="edit-btn" @click="enableEdit" v-if="!isEditing">
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
            <label for="teacher-id">Teacher ID</label>
            <input 
              type="text" 
              id="teacher-id" 
              v-model="userInfo.username" 
              readonly
            >
          </div>
          
          <div class="form-group">
            <label for="college">College</label>
            <input 
              type="text" 
              id="college" 
              v-model="userInfo.college" 
              :readonly="!isEditing"
              placeholder="Please enter college"
            >
          </div>
          
          <div class="form-group">
            <label for="department">Department</label>
            <input 
              type="text" 
              id="department" 
              v-model="userInfo.department" 
              :readonly="!isEditing"
              placeholder="Please enter department"
            >
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="userInfo.email" 
              :readonly="!isEditing"
              placeholder="Please enter email address"
            >
          </div>
          
          <div class="form-actions" v-if="isEditing">
            <button type="button" class="cancel-btn" @click="cancelEdit" :disabled="loading">Cancel</button>
            <button type="submit" class="save-btn" :disabled="loading">
              {{ loading ? 'Saving...' : 'Save' }}
            </button>
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
              <p>Change your password regularly to ensure account security</p>
            </div>
          </div>
          <button class="modify-btn" @click="modifyPassword">Change Password</button>
        </div>
        
        <div class="security-item">
          <div class="security-info">
            <i class="bi bi-envelope-fill"></i>
            <div>
              <h3>Email Binding</h3>
              <p>Bound email: {{ maskedEmail }}</p>
            </div>
          </div>
          <button class="modify-btn" @click="modifyEmail">Change Email</button>
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
import { getProfile, updateProfile } from '@/api/user'

export default {
  name: 'TeacherProfile',
  data() {
    return {
      activeSection: 'basic-info',
      isEditing: false,
      loading: false,
      viewMode: 'grid',
      selectedTimeRange: 'week',
      selectedTheme: 'blue',
      selectedFontSize: 'medium',
      originalUserInfo: null, // 保存原始数据用于取消编辑
      userInfo: {
        full_name: '',
        username: '',
        college: 'JI',
        department: 'COMPUTER SCIENCE',
        email: '',
        role: 'Teacher',
      },
      navItems: [
        { id: 'basic-info', text: 'Basic Info', icon: 'bi bi-person-fill' },
        { id: 'account-security', text: 'Account Security', icon: 'bi bi-shield-lock-fill' },
        { id: 'notifications', text: 'Notifications', icon: 'bi bi-bell-fill' },
        { id: 'settings', text: 'Settings', icon: 'bi bi-gear-fill' }
      ],
      notifications: [
        {
          id: 1,
          title: 'System Notice: New Semester Course Selection',
          content: 'The new semester course selection system will open on September 1, 2023. Please prepare in advance...',
          time: '2023-08-25 10:30',
          icon: 'bi bi-megaphone-fill',
          unread: true
        },
        {
          id: 2,
          title: 'Course Reminder: Computer Organization',
          content: 'Your Computer Organization class will be held tomorrow at 8:00 AM in Classroom 301, Building 3...',
          time: '2023-08-24 15:45',
          icon: 'bi bi-calendar-event-fill',
          unread: false
        },
        {
          id: 3,
          title: 'Assignment Reminder: Data Structures Homework',
          content: 'The second Data Structures assignment has been published. Deadline: September 5, 2023...',
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
          name: 'Assignment Deadlines',
          description: 'Remind me before assignment deadlines',
          enabled: true
        },
        {
          id: 3,
          name: 'System Notifications',
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
    // 获取头像图片
    getAvatarImage() {
      // 教师页面直接返回教师头像
      return require('@/assets/images/avatar-teacher.svg')
    },
    switchSection(sectionId) {
      this.activeSection = sectionId
    },
    enableEdit() {
      // 保存原始数据
      this.originalUserInfo = JSON.parse(JSON.stringify(this.userInfo))
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
        alert('Not logged in, please login first')
        this.$router.push('/login')
        return
      }
      
      this.loading = true
      try {
        const basicInfo = {
          email: this.userInfo.email || null
        }
        
        const profileInfo = {
          college: this.userInfo.college || null,
          department: this.userInfo.department || null
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
          alert('Login expired, please login again')
          this.$router.push('/login')
        } else {
          alert(error.message || 'Failed to save, please try again later')
        }
      } finally {
        this.loading = false
      }
    },
    modifyPassword() {
      alert('即将跳转到修改密码页面...')
    },
    modifyEmail() {
      alert('即将跳转到更换邮箱页面...')
    },
    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.unread = false
      })
      alert('所有通知已标记为已读')
    },
    changeViewMode(mode) {
      this.viewMode = mode
    },
    removeFavorite(id) {
      if (confirm('Are you sure you want to remove this favorite item?')) {
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
    triggerAvatarUpload() {
      // 创建文件输入元素
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            // 更新头像
            document.querySelector('.avatar').src = event.target.result
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
    },
    
    // 加载用户信息
    async loadUserInfo() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.log('未找到token，尝试从localStorage获取用户信息')
          // 尝试从localStorage获取用户信息作为后备
          const savedUser = localStorage.getItem('userInfo')
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser)
              this.userInfo = {
                full_name: parsedUser.full_name || parsedUser.name || '',
                username: parsedUser.username || '',
                email: parsedUser.email || '',
                role: parsedUser.role || 'Teacher',
                college: 'JI',
                department: 'COMPUTER SCIENCE',
              }
              console.log('从localStorage加载的教师信息:', this.userInfo)
            } catch (parseError) {
              console.error('解析localStorage用户信息失败:', parseError)
            }
          }
          return
        }

        console.log('正在从API获取教师信息...')
        const result = await getProfile()
        
        if (result.code === 1 && result.data) {
          const data = result.data
          this.userInfo = {
            full_name: data.full_name || data.name || '',
            username: data.username || '',
            email: data.email || '',
            role: data.role || 'Teacher',
            college: 'JI',
            department: 'COMPUTER SCIENCE',
          }
          console.log('从API加载的教师信息:', this.userInfo)
          
          // 同步更新localStorage
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
        } else {
          console.log('API返回无效数据，使用localStorage备用方案')
          // API失败时使用localStorage作为后备
          const savedUser = localStorage.getItem('userInfo')
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser)
              this.userInfo = {
                full_name: parsedUser.full_name || parsedUser.name || '',
                username: parsedUser.username || '',
                email: parsedUser.email || '',
                role: parsedUser.role || 'Teacher',
                college: 'JI',
                department: 'COMPUTER SCIENCE',
              }
            } catch (parseError) {
              console.error('解析localStorage用户信息失败:', parseError)
            }
          }
        }
      } catch (error) {
        console.error('加载教师信息失败:', error)
        // API失败时使用localStorage作为后备
        const savedUser = localStorage.getItem('userInfo')
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser)
            this.userInfo = {
              full_name: parsedUser.full_name || parsedUser.name || '',
              username: parsedUser.username || '',
              email: parsedUser.email || '',
              role: parsedUser.role || 'Teacher',
              college: 'JI',
              department: 'COMPUTER SCIENCE',
            }
            console.log('错误回退：从localStorage加载的教师信息:', this.userInfo)
          } catch (parseError) {
            console.error('解析localStorage用户信息失败:', parseError)
          }
        }
      } finally {
        this.loading = false
      }
    }
  },
  async mounted() {
    console.log('教师个人中心页面已加载')
    await this.loadUserInfo()
  }
}
</script>

<style scoped>
@import '@/assets/css/profile.css'; /* 或者直接引入 */
</style>