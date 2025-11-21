<template>
    <div class="course-overview">
        <div class="hero-banner">
            <div class="course-info">
                <h1>{{ courseName }}</h1>
                <p class="teacher-name">授课教师：{{ teacherName }}</p>
            </div>
            <div class="progress-card">
                <div class="progress-label">
                    <span>学习进度</span>
                    <span>35%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="inline-size: 35%"></div>
                </div>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="main-column">
                <div class="section-header">
                    <h3>📅 待办事项</h3>
                </div>
                <div class="todo-list">
                    <div class="todo-item urgent">
                        <div class="icon">⏰</div>
                        <div class="content">
                            <h4>Vue基础练习作业</h4>
                            <p>截止时间：今天 23:59</p>
                        </div>
                        <button class="action-btn" @click="$router.push('homework/detail?id=1')">去提交</button>
                    </div>
                    <div class="todo-item">
                        <div class="icon">📖</div>
                        <div class="content">
                            <h4>预习第三章课件</h4>
                            <p>建议完成时间：明天</p>
                        </div>
                        <button class="action-btn" @click="$router.push('resources/list')">去查看</button>
                    </div>
                </div>

                <div class="section-header" style="margin-block-start: 30px;">
                    <h3>📢 课程公告</h3>
                </div>
                <div class="notice-list">
                    <div class="notice-item">
                        <span class="tag">通知</span>
                        <span class="text">下周三的课改在教三-201教室上。</span>
                        <span class="date">11-20</span>
                    </div>
                    <div class="notice-item">
                        <span class="tag important">重要</span>
                        <span class="text">期中考试安排已发布，请查看。</span>
                        <span class="date">11-18</span>
                    </div>
                </div>
            </div>

            <div class="side-column">
                <div class="quick-actions">
                    <h3>🚀 快速开始</h3>
                    <button class="quick-btn" @click="$router.push('attendance/index')">
                        <span class="emoji">📍</span> 考勤签到
                    </button>
                    <button class="quick-btn" @click="$router.push('homework/list')">
                        <span class="emoji">📝</span> 我的作业
                    </button>
                    <button class="quick-btn" @click="$router.push('resources/list')">
                        <span class="emoji">📂</span> 课件资料
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseName = ref('加载中...')
const teacherName = ref('')

onMounted(() => {
    // 从本地存储获取之前在列表页存入的信息
    courseName.value = localStorage.getItem('currentCourseName') || '未知课程'
    teacherName.value = localStorage.getItem('currentTeacherName') || '教师'
})
</script>

<style scoped>
.course-overview {
    padding: 24px;
    max-inline-size: 1200px;
    margin: 0 auto;
}

/* 顶部 Banner */
.hero-banner {
    background: linear-gradient(135deg, #2A5CAA 0%, #5C6BC0 100%);
    border-radius: 12px;
    padding: 30px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block-end: 30px;
    box-shadow: 0 4px 12px rgba(42, 92, 170, 0.2);
}

.course-info h1 {
    margin: 0 0 8px 0;
    font-size: 24px;
}

.teacher-name {
    margin: 0;
    opacity: 0.9;
    font-size: 14px;
}

.progress-card {
    background: rgba(255, 255, 255, 0.15);
    padding: 15px;
    border-radius: 8px;
    inline-size: 200px;
    backdrop-filter: blur(5px);
}

.progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-block-end: 6px;
}

.progress-bar {
    block-size: 6px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    block-size: 100%;
    background: #4ade80;
    border-radius: 3px;
}

/* 布局 */
.dashboard-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
}

/* 列表样式 */
.section-header h3 {
    margin: 0 0 15px 0;
    font-size: 18px;
    color: #333;
    border-inline-start: 4px solid #2A5CAA;
    padding-inline-start: 10px;
}

.todo-item {
    background: white;
    padding: 15px;
    border-radius: 8px;
    margin-block-end: 12px;
    display: flex;
    align-items: center;
    gap: 15px;
    border: 1px solid #eee;
    transition: transform 0.2s;
}

.todo-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.todo-item.urgent {
    border-inline-start: 4px solid #ff4d4f;
}

.icon {
    font-size: 24px;
    background: #f5f7fa;
    inline-size: 40px;
    block-size: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.content {
    flex: 1;
}

.content h4 {
    margin: 0 0 4px 0;
    font-size: 15px;
    color: #333;
}

.content p {
    margin: 0;
    font-size: 12px;
    color: #666;
}

.action-btn {
    padding: 6px 12px;
    border: 1px solid #2A5CAA;
    color: #2A5CAA;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}

.action-btn:hover {
    background: #f0f7ff;
}

/* 公告 */
.notice-item {
    background: white;
    padding: 12px;
    border-block-end: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
}

.tag {
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
    background: #f0f0f0;
    color: #666;
}

.tag.important {
    background: #fff1f0;
    color: #ff4d4f;
}

.text {
    flex: 1;
    color: #333;
}

.date {
    color: #999;
    font-size: 12px;
}

/* 右侧快捷入口 */
.quick-actions {
    background: white;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #eee;
}

.quick-actions h3 {
    margin-block-start: 0;
    font-size: 16px;
    margin-block-end: 15px;
}

.quick-btn {
    inline-size: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    margin-block-end: 10px;
    border: 1px solid #eee;
    background: #f9fafb;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: start;
    color: #333;
    font-weight: 500;
}

.quick-btn:hover {
    background: #eef2ff;
    border-color: #2A5CAA;
    color: #2A5CAA;
}

.emoji {
    font-size: 18px;
}
</style>