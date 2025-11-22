<template>
  <div class="teaching-index">
    <div class="page-header">
      <div class="header-content">
        <h1>我的授课</h1>
        <p>共 {{ courses.length }} 门正在管理的课程</p>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>正在加载课程信息...</p>
    </div>

    <div v-else-if="courses.length === 0" class="empty-state">
      <div class="empty-icon">📚</div>
      <p>暂无授课安排</p>
    </div>

    <div v-else class="course-grid">
      <div v-for="course in courses" :key="course.class_id" class="course-card" @click="selectCourse(course)">
        <div class="card-cover" :style="{ backgroundColor: getCourseColor(course.class_id) }">
          <span class="semester-tag">{{ course.semester }}</span>
        </div>

        <div class="card-content">
          <h3 class="course-title">{{ course.course_name }}</h3>
          <div class="course-meta">
            <div class="meta-item">
              <i class="bi bi-people-fill icon"></i>
              <span>{{ course.current_enrollment }} / {{ course.max_capacity }} 人</span>
            </div>
            <div class="meta-item">
              <i class="bi bi-mortarboard-fill icon"></i>
              <span>{{ getStatusText(course.status) }}</span>
            </div>
          </div>
          <button class="enter-btn">管理课程</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'TeachingIndex'
})

const router = useRouter()
const courses = ref([])
const loading = ref(false)

// 生成随机柔和背景色 (复用学生端逻辑)
const getCourseColor = (id) => {
  const colors = ['#5C6BC0', '#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC']
  return colors[id % colors.length]
}

const getStatusText = (status) => {
  const map = { 1: '待开放', 2: '选课中', 3: '授课中', 4: '已结课' }
  return map[status] || '进行中'
}

onMounted(() => {
  loadCourses()
})

const loadCourses = async () => {
  loading.value = true
  try {
    // 这里使用真实的 API 或 模拟数据
    const response = await fetch('http://127.0.0.1:8081/teacher/classes?page=1&pageSize=100', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    // 注意：如果后端没开或者报错，catch块会使用模拟数据
    if (response.ok) {
      const result = await response.json()
      if (result.code === 1) {
        courses.value = result.data.rows || []
        loading.value = false
        return
      }
    }
    throw new Error('API Error')
  } catch (error) {
    // 模拟数据 (保留你之前的逻辑，但格式对齐学生端)
    setTimeout(() => {
      courses.value = [
        {
          class_id: 501,
          course_name: '计算机导论',
          semester: '2025-Fall',
          max_capacity: 100,
          current_enrollment: 80,
          status: 3
        },
        {
          class_id: 502,
          course_name: '数据结构',
          semester: '2025-Fall',
          max_capacity: 80,
          current_enrollment: 65,
          status: 3
        },
        {
          class_id: 503,
          course_name: '算法设计',
          semester: '2025-Fall',
          max_capacity: 60,
          current_enrollment: 45,
          status: 2
        }
      ]
      loading.value = false
    }, 500)
  }
}

const selectCourse = (course) => {
  // 1. 存数据 (为了新页面能读取到课程名)
  sessionStorage.setItem('selectedClassId', course.class_id);
  sessionStorage.setItem('selectedCourseName', course.course_name);

  // 2. 跳转到新路由 (注意这里拼写了 /course/...)
  router.push(`/teacher/course/${course.class_id}/overview`);
}
</script>

<style scoped>
.teaching-index {
  padding: 24px;
  max-inline-size: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-block-end: 32px;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
  margin-block-end: 8px;
}

.page-header p {
  color: #666;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.course-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

/* 1. 顶部彩色封面区 */
.card-cover {
  block-size: 120px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.semester-tag {
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  backdrop-filter: blur(4px);
}

/* 2. 内容区 */
.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-block-end: 16px;
  line-height: 1.4;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  margin-block-end: 20px;
  color: #666;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon {
  font-size: 16px;
  color: #999;
}

.enter-btn {
  inline-size: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid #2A5CAA;
  color: #2A5CAA;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  margin-block-start: auto;
  /* 让按钮始终在底部 */
}

.course-card:hover .enter-btn {
  background: #2A5CAA;
  color: #fff;
}

/* Loading & Empty */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-block-start: 3px solid #2A5CAA;
  border-radius: 50%;
  inline-size: 40px;
  block-size: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.empty-icon {
  font-size: 64px;
  margin-block-end: 16px;
  opacity: 0.5;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>