<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <header class="home-header">
      <div class="header-title">智慧校园管理系统</div>
      <div class="user-info">
        <span>{{ userInfo.name }}</span>
        <button @click="handleLogout" class="logout-btn">退出登录</button>
        <div class="avatar">{{ userInfo.name.charAt(0) }}</div>
      </div>
    </header>

    <!-- 主要内容区 -->
    <div class="home-main-content">
      <!-- 左侧日程区域 -->
      <div class="schedule-section">
        <div class="schedule-title">今日日程</div>
        <div class="schedule-item" v-for="schedule in todaySchedules" :key="schedule.id">
          <div class="schedule-time">{{ schedule.time }}</div>
          <div class="schedule-desc">{{ schedule.description }}</div>
        </div>
        <div class="schedule-item" v-if="todaySchedules.length === 0">
          <div class="schedule-desc">今日暂无安排</div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="content-section">
        <div class="welcome-section">
          <div class="welcome-title">欢迎回来，{{ userInfo.name }}</div>
          <div class="todo-info">您当前有{{ userInfo.todoCount }}个待办事项，{{ userInfo.unreadCount }}条未读消息。</div>
        </div>

        <div class="cards-container">
          <!-- 智慧课堂系统卡片 -->
          <div class="card classroom-card">
            <div class="card-header">智慧课堂系统</div>
            <div class="card-content">
              <div>
                <div class="card-title">互动教学管理平台</div>
                <div class="card-desc">集成课程管理、在线教学、课堂互动、作业评测等模块，打造智能化教学环境。</div>
              </div>
              <!-- 🎯 点击跳转到 /student/teachinghome -->
              <button class="card-btn" @click="navigateToTeaching">进入</button>
            </div>
          </div>

          <!-- 资源管理系统卡片 -->
          <div class="card resource-card">
            <div class="card-header">资源管理系统</div>
            <div class="card-content">
              <div>
                <div class="card-title">教学资源共享平台</div>
                <div class="card-desc">集中管理教学资源，提供课件、题库、视频等资源一站式上传、分类与共享。</div>
              </div>
              <!-- 🎯 点击跳转到 /student/resourcehome -->
              <button class="card-btn" @click="navigateToResources">进入</button>
            </div>
          </div>

          <!-- 校园生活系统卡片 -->
          <div class="card life-card">
            <div class="card-header">校园生活系统</div>
            <div class="card-content">
              <div>
                <div class="card-title">智慧校园生活平台</div>
                <div class="card-desc">整合校园服务、社团活动、生活资讯等，提供便捷的校园生活服务。</div>
              </div>
              <!-- 🎯 点击跳转到 /student/campushome -->
              <button class="card-btn" @click="navigateToCampus">进入</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter()

    const userInfo = ref({
      name: 'A同学',
      todoCount: 3,
      unreadCount: 5
    })

    const todaySchedules = ref([
      {
        id: 1,
        time: '08:00 - 09:40',
        description: '计算机导论 - 教三楼301'
      },
      {
        id: 2,
        time: '10:00 - 11:40',
        description: '数据结构 - 教五楼201'
      },
      {
        id: 3,
        time: '14:00 - 15:40',
        description: '小组讨论 - 图书馆研讨室'
      },
      {
        id: 4,
        time: '16:00 - 17:00',
        description: '社团活动 - 学生活动中心'
      }
    ])

    onMounted(() => {
      // 从本地存储获取用户信息
      const savedUser = localStorage.getItem('userInfo')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        userInfo.value.name = userData.name || '用户'
      }
    })

    const navigateToTeaching = () => {
      // 🎯 跳转到智慧课堂系统首页
      router.push('/student/teachinghome')
    }

    const navigateToResources = () => {
      // 🎯 跳转到资源管理系统首页
      router.push('/student/resourcehome')
    }

    const navigateToCampus = () => {
      // 🎯 跳转到校园生活系统首页
      router.push('/student/campushome')
    }

    const handleLogout = () => {
      // 清除用户信息
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      // 跳转到登录页
      router.push('/login')
    }

    return {
      userInfo,
      todaySchedules,
      navigateToTeaching,
      navigateToResources,
      navigateToCampus,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* 首页样式 */
.home-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  color: #333;
  min-width: 1200px;
}

/* 顶部导航栏 */
.home-header {
  height: 60px;
  background-color: #1a66bf;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a66bf;
  font-weight: bold;
}

/* 主要内容区 - 修复高度问题 */
.home-main-content {
  margin-top: 60px;
  display: flex;
  min-height: calc(100vh - 60px);
  height: auto;
}

/* 左侧日程区域 */
.schedule-section {
  width: 25%;
  background-color: #fff;
  padding: 20px;
  border-right: 1px solid #e8e8e8;
  overflow-y: auto;
  min-height: calc(100vh - 60px);
}

.schedule-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a66bf;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}

.schedule-item {
  padding: 12px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  border-left: 4px solid #1a66bf;
}

.schedule-time {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.schedule-desc {
  font-size: 14px;
  color: #333;
}

/* 右侧内容区 */
.content-section {
  width: 75%;
  padding: 30px;
  overflow-y: auto;
  min-height: calc(100vh - 60px);
}

.welcome-section {
  margin-bottom: 40px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  line-height: 36px;
  color: #1a66bf;
  margin-bottom: 10px;
}

.todo-info {
  font-size: 16px;
  color: #666;
  line-height: 24px;
}

/* 修改卡片容器布局 */
.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: stretch;
}

/* 放大卡片尺寸 */
.card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 280px;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  height: 70px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

.card-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.card-desc {
  font-size: 14px;
  color: #666;
  line-height: 22px;
  margin-bottom: 20px;
  flex: 1;
}

.card-btn {
  width: 100px;
  height: 40px;
  background-color: #2a5caa;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  align-self: flex-start;
  transition: background-color 0.3s ease;
}

.card-btn:hover {
  background-color: #1a66bf;
}

/* 卡片颜色 */
.classroom-card .card-header {
  background-color: #87ceeb; /* 淡蓝 */
}

.resource-card .card-header {
  background-color: #90ee90; /* 淡绿 */
}

.life-card .card-header {
  background-color: #fffacd; /* 淡黄 */
  color: #333;
}

/* 响应式调整 */
@media (max-width: 1400px) {
  .cards-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }

  .card {
    min-height: 260px;
  }
}

@media (max-width: 1200px) {
  .cards-container {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }

  .home-container {
    min-width: auto;
  }
}

/* 退出登录按钮样式 */
.logout-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 15px;
  transition: all 0.3s ease;
  font-size: 12px;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}
</style>