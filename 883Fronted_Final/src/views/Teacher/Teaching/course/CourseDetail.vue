<template>
    <div class="course-detail-container">
        <div class="hero-banner">
            <div class="course-info">
                <h1>{{ courseName }}</h1>
                <p class="semester-badge">2025 秋季学期</p>
            </div>
            <div class="stats-row">
                <div class="stat-card">
                    <h3>85%</h3>
                    <span>平均出勤率</span>
                </div>
                <div class="stat-card">
                    <h3>42</h3>
                    <span>待批改作业</span>
                </div>
                <div class="stat-card">
                    <h3>3</h3>
                    <span>今日待办</span>
                </div>
            </div>
        </div>

        <div class="content-grid">
            <div class="main-panel">
                <h2>课程动态</h2>
                <div class="activity-list">
                    <div class="activity-item">
                        <div class="icon-box new">📢</div>
                        <div class="text">
                            <h4>发布了新公告：期中考试安排</h4>
                            <time>2小时前</time>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="icon-box update">🔄</div>
                        <div class="text">
                            <h4>更新了 "第三章：Vue组件化" 的课件</h4>
                            <time>昨天 14:30</time>
                        </div>
                    </div>
                </div>
            </div>

            <div class="side-panel">
                <h2>快速操作</h2>
                <button class="action-btn primary" @click="$router.push('homework/publish')">发布作业</button>
                <button class="action-btn" @click="$router.push('attendance/launch')">发起签到</button>
                <button class="action-btn" @click="$router.push('resources/upload')">上传资源</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseName = ref('加载中...')

onMounted(() => {
    // 从 sessionStorage 获取之前列表页存的名字
    courseName.value = sessionStorage.getItem('selectedCourseName') || '计算机导论'
})
</script>

<style scoped>
.course-detail-container {
    padding: 24px;
}

.hero-banner {
    background: linear-gradient(135deg, #2A5CAA 0%, #5C6BC0 100%);
    color: white;
    padding: 30px;
    border-radius: 16px;
    margin-block-end: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.semester-badge {
    background: rgba(255, 255, 255, 0.2);
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 14px;
    margin-block-start: 8px;
}

.stats-row {
    display: flex;
    gap: 20px;
}

.stat-card {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px 25px;
    border-radius: 12px;
    text-align: center;
    backdrop-filter: blur(5px);
}

.stat-card h3 {
    margin: 0;
    font-size: 24px;
}

.stat-card span {
    font-size: 12px;
    opacity: 0.8;
}

.content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
}

.main-panel,
.side-panel {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.activity-item {
    display: flex;
    gap: 15px;
    padding: 15px 0;
    border-block-end: 1px solid #eee;
}

.icon-box {
    inline-size: 40px;
    block-size: 40px;
    background: #f0f4f8;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn {
    inline-size: 100%;
    padding: 12px;
    margin-block-end: 10px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
}

.action-btn.primary {
    background: #2A5CAA;
    color: white;
    border: none;
}
</style>