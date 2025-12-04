<template>
  <div class="profile-container">
    <div class="profile-sidebar">
      <div class="user-card">
        <div class="avatar-container">
          <img 
            loading="lazy" 
            :src="getAvatarImage()" 
            alt="用户头像" 
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
          <h2>基本信息</h2>
          <button class="edit-btn" @click="enableEdit" v-if="!isEditing">
            <i class="bi bi-pencil-fill"></i> 编辑
          </button>
        </div>
        
        <form class="info-form" @submit.prevent="saveBasicInfo">
          <div class="form-group">
            <label for="name">姓名</label>
            <input 
              type="text" 
              id="name"
              :value="userInfo.full_name || userInfo.username"
              @input="userInfo.full_name = $event.target.value"
              :readonly="!isEditing"
            >
          </div>
          
          <div class="form-group">
            <label for="teacher-id">教师号</label>
            <input 
              type="text" 
              id="teacher-id" 
              v-model="userInfo.username" 
              readonly
            >
          </div>
          
          <div class="form-group">
            <label for="college">学院</label>
            <input 
              type="text" 
              id="college" 
              v-model="userInfo.college" 
              :readonly="!isEditing"
              placeholder="请填写学院"
            >
          </div>
          
          <div class="form-group">
            <label for="department">系别</label>
            <input 
              type="text" 
              id="department" 
              v-model="userInfo.department" 
              :readonly="!isEditing"
              placeholder="请填写系别"
            >
          </div>
          
          <div class="form-group">
            <label for="email">电子邮箱</label>
            <input 
              type="email" 
              id="email" 
              v-model="userInfo.email" 
              :readonly="!isEditing"
              placeholder="请填写邮箱地址"
            >
          </div>
          
          <div class="form-actions" v-if="isEditing">
            <button type="button" class="cancel-btn" @click="cancelEdit" :disabled="loading">取消</button>
            <button type="submit" class="save-btn" :disabled="loading">
              {{ loading ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </section>
      
      <!-- 账号安全 -->
      <section id="account-security" class="content-section" :class="{ active: activeSection === 'account-security' }">
        <div class="section-header">
          <h2>账号安全</h2>
        </div>
        
        <div class="security-item">
          <div class="security-info">
            <i class="bi bi-shield-lock-fill"></i>
            <div>
              <h3>登录密码</h3>
              <p>定期更改密码以确保账号安全</p>
            </div>
          </div>
          <button class="modify-btn" @click="modifyPassword">修改密码</button>
        </div>
        
        <div class="security-item">
          <div class="security-info">
            <i class="bi bi-envelope-fill"></i>
            <div>
              <h3>邮箱绑定</h3>
              <p>已绑定邮箱：{{ maskedEmail }}</p>
            </div>
          </div>
          <button class="modify-btn" @click="modifyEmail">更换邮箱</button>
        </div>
        
        <div class="security-tips">
          <i class="bi bi-info-circle-fill"></i>
          <p>为保障您的账号安全，建议定期修改密码并绑定邮箱</p>
        </div>
      </section>
      
      <!-- 消息通知 -->
      <section id="notifications" class="content-section" :class="{ active: activeSection === 'notifications' }">
        <div class="section-header">
          <h2>消息通知</h2>
          <button class="mark-all-read" @click="markAllAsRead">全部标记为已读</button>
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
          <h3>通知设置</h3>
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
          <h3>隐私设置</h3>
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
        role: '教师',
      },
      navItems: [
        { id: 'basic-info', text: '基本信息', icon: 'bi bi-person-fill' },
        { id: 'account-security', text: '账号安全', icon: 'bi bi-shield-lock-fill' },
        { id: 'notifications', text: '消息通知', icon: 'bi bi-bell-fill' },
        { id: 'settings', text: '系统设置', icon: 'bi bi-gear-fill' }
      ],
      notifications: [
        {
          id: 1,
          title: '系统公告：新学期选课通知',
          content: '新学期选课系统将于2023年9月1日开放，请同学们提前做好准备...',
          time: '2023-08-25 10:30',
          icon: 'bi bi-megaphone-fill',
          unread: true
        },
        {
          id: 2,
          title: '课程提醒：计算机组成原理',
          content: '您的计算机组成原理课程将于明天上午8:00在教三楼301教室上课...',
          time: '2023-08-24 15:45',
          icon: 'bi bi-calendar-event-fill',
          unread: false
        },
        {
          id: 3,
          title: '作业提醒：数据结构作业',
          content: '数据结构课程的第二次作业已发布，截止日期为2023年9月5日...',
          time: '2023-08-23 09:20',
          icon: 'bi bi-book-fill',
          unread: false
        }
      ],
      
      notificationSettings: [
        {
          id: 1,
          name: '课程提醒',
          description: '课程开始前提醒我',
          enabled: true
        },
        {
          id: 2,
          name: '作业截止提醒',
          description: '作业截止前提醒我',
          enabled: true
        },
        {
          id: 3,
          name: '系统公告',
          description: '接收系统公告和通知',
          enabled: true
        }
      ],
      privacySettings: [
        {
          id: 1,
          name: '公开个人信息',
          description: '允许其他同学查看我的基本信息',
          enabled: false
        },
      ],
      themeColors: ['blue', 'green', 'purple']
    }
  },
  computed: {
    maskedEmail() {
      return this.userInfo.email ? this.userInfo.email.replace(/(.{2}).*@(.*)/, '$1****@$2') : '未绑定'
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
                role: parsedUser.role || '教师',
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
            role: data.role || '教师',
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
                role: parsedUser.role || '教师',
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
              role: parsedUser.role || '教师',
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