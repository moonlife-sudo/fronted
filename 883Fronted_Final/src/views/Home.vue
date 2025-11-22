<template>
  <div class="home-container">

    <div v-if="isAdminRoute" class="role-section admin-section">
      <div class="welcome-banner">
        <h1>管理员工作台</h1>
        <p>欢迎回来，{{ userInfo.name }}。请选择要管理的功能模块。</p>
      </div>

      <div class="admin-cards-container">
        <div class="card resource-card">
          <div class="card-header">资源管理系统</div>
          <div class="card-content">
            <div>
              <div class="card-title">教学资源与审批</div>
              <div class="card-desc">管理全校教室状态、图书馆书籍录入及借阅规则，审批各类预约申请。</div>
            </div>
            <button class="card-btn" @click="$router.push('/admin/resourcehome')">进入管理</button>
          </div>
        </div>

        <div class="card life-card">
          <div class="card-header">生活管理系统</div>
          <div class="card-content">
            <div>
              <div class="card-title">宿舍与生活服务</div>
              <div class="card-desc">管理学生宿舍分配、宿舍状态维护及校园生活相关事务。</div>
            </div>
            <button class="card-btn" @click="$router.push('/admin/campushome')">进入管理</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="role-section standard-section">
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

      <div class="content-section">
        <div class="welcome-header">
          <div class="welcome-title">欢迎回来，{{ userInfo.name }}</div>
          <div class="todo-info">您当前有{{ userInfo.todoCount }}个待办事项，{{ userInfo.unreadCount }}条未读消息。</div>
        </div>

        <div class="cards-grid">
          <div class="card classroom-card">
            <div class="card-header">智慧课堂系统</div>
            <div class="card-content">
              <div>
                <div class="card-title">互动教学管理平台</div>
                <div class="card-desc">
                  {{ isTeacherRoute ? '管理您的课程、发布作业、查看考勤与成绩。' : '查看课程、完成作业、签到及查阅资料。' }}
                </div>
              </div>
              <button class="card-btn" @click="navigateToTeaching">进入</button>
            </div>
          </div>

          <div class="card resource-card">
            <div class="card-header">资源管理系统</div>
            <div class="card-content">
              <div>
                <div class="card-title">教学资源共享平台</div>
                <div class="card-desc">预约教室、借阅图书及浏览公共教学资源。</div>
              </div>
              <button class="card-btn" @click="navigateToResources">进入</button>
            </div>
          </div>

          <div v-if="!isTeacherRoute && !isAdminRoute" class="card life-card">
            <div class="card-header">校园生活系统</div>
            <div class="card-content">
              <div>
                <div class="card-title">智慧校园生活平台</div>
                <div class="card-desc">宿舍分配结果查询、校园论坛交流及生活服务。</div>
              </div>
              <button class="card-btn" @click="navigateToCampus">进入</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const route = useRoute()

    // 核心修复：直接通过 URL 判断当前是哪个端，防止 localStorage 缓存导致视图错误
    const isAdminRoute = computed(() => route.path.startsWith('/admin'))
    const isTeacherRoute = computed(() => route.path.startsWith('/teacher'))

    const userInfo = ref({
      name: '用户',
      todoCount: 0,
      unreadCount: 0
    })

    const todaySchedules = ref([])

    onMounted(() => {
      const savedUser = localStorage.getItem('userInfo')
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          userInfo.value = { ...userInfo.value, ...userData }

          // 根据当前路由加载不同的模拟数据，而不是依赖 userData.role
          if (isTeacherRoute.value) {
            userInfo.value.todoCount = 8
            userInfo.value.unreadCount = 2
            todaySchedules.value = [
              { id: 1, time: '08:00 - 09:40', description: '授课：计算机导论' },
              { id: 2, time: '14:00 - 16:00', description: '教研组会议' }
            ]
          } else if (isAdminRoute.value) {
            // 管理员不需要日程
          } else {
            // 默认为学生
            userInfo.value.todoCount = 3
            userInfo.value.unreadCount = 5
            todaySchedules.value = [
              { id: 1, time: '08:00 - 09:40', description: '计算机导论 - 教三楼301' },
              { id: 2, time: '10:00 - 11:40', description: '数据结构 - 教五楼201' }
            ]
          }
        } catch (e) { console.error(e) }
      }
    })

    const navigateToTeaching = () => {
      if (isTeacherRoute.value) router.push('/teacher/teachinghome')
      else router.push('/student/teachinghome')
    }

    const navigateToResources = () => {
      if (isTeacherRoute.value) router.push('/teacher/resourcehome')
      else router.push('/student/resourcehome')
    }

    const navigateToCampus = () => {
      router.push('/student/campushome')
    }

    return {
      userInfo,
      todaySchedules,
      isAdminRoute,
      isTeacherRoute,
      navigateToTeaching,
      navigateToResources,
      navigateToCampus
    }
  }
}
</script>

<style scoped>
.home-container {
  min-block-size: calc(100vh - 60px);
  background-color: #f5f7fa;
  color: #333;
}

/* === 管理员视图样式 === */
.admin-section {
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-banner {
  text-align: center;
  margin-block-end: 50px;
}

.welcome-banner h1 {
  font-size: 32px;
  color: #2A5CAA;
  margin-block-end: 10px;
}

.admin-cards-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  inline-size: 100%;
  max-inline-size: 900px;
}

/* === 学生/教师视图样式 (左右布局) === */
.standard-section {
  display: flex;
  block-size: calc(100vh - 60px);
}

.schedule-section {
  inline-size: 280px;
  background-color: #fff;
  padding: 20px;
  border-inline-end: 1px solid #e8e8e8;
  overflow-y: auto;
}

.schedule-title {
  font-size: 18px;
  font-weight: 700;
  color: #2A5CAA;
  margin-block-end: 20px;
  padding-block-end: 10px;
  border-block-end: 1px solid #e8e8e8;
}

.schedule-item {
  padding: 12px;
  margin-block-end: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  border-inline-start: 4px solid #2A5CAA;
}

.schedule-time {
  font-size: 13px;
  color: #666;
  margin-block-end: 4px;
  font-weight: 600;
}

.schedule-desc {
  font-size: 14px;
  color: #333;
}

.content-section {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

.welcome-header {
  margin-block-end: 30px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  color: #2A5CAA;
  margin-block-end: 10px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

/* === 卡片通用样式 === */
.card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-block-size: 260px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  block-size: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
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
  margin-block-end: 12px;
}

.card-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-block-end: 20px;
}

.card-btn {
  align-self: flex-start;
  padding: 8px 24px;
  background-color: #2A5CAA;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.card-btn:hover {
  background-color: #1E4B8B;
}

/* 卡片配色 */
.classroom-card .card-header {
  background-color: #42A5F5;
}

.resource-card .card-header {
  background-color: #66BB6A;
}

.life-card .card-header {
  background-color: #FFA726;
}
</style>