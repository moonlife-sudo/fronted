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
                            <button class="card-btn" @click="navigateToCampus">进入</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

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
    // 从store获取用户信息
    if (authStore.user) {
        userInfo.value.name = authStore.user.name || '用户'
    }

    // 这里可以添加获取今日日程的API调用
    // fetchTodaySchedules()
})

const navigateToTeaching = () => {
    router.push('/teaching')
}

const navigateToResources = () => {
    router.push('/resources')
}

const navigateToCampus = () => {
    router.push('/campus')
}

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}
</script>

<style scoped>
/* 引入首页样式 */
@import '@/assets/styles/pages/home.css';

/* 退出登录按钮样式 */
.logout-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 5px 12px;
    border-radius: 15px;
    cursor: pointer;
    margin-inline-end: 15px;
    transition: all 0.3s ease;
    font-size: 12px;
}

.logout-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
}
</style>