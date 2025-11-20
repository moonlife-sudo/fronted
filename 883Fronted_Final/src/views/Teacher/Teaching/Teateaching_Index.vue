<!-- src/views/teaching/Index.vue -->
<template>
  <div class="teaching-index">
    <div class="page-header">
      <h1>我的课程</h1>
      <p class="page-description">选择要管理的课程</p>
    </div>

    <div class="courses-grid">
      <div
        v-for="course in courses"
        :key="course.class_id"
        class="course-card"
        @click="selectCourse(course)"
      >
        <div class="course-cover">
          <img
            v-if="course.cover_url"
            :src="course.cover_url"
            :alt="course.course_name"
            class="cover-image"
          />
          <div v-else class="cover-placeholder">
            <span class="placeholder-text">{{ course.course_name.charAt(0) }}</span>
          </div>
        </div>
        <div class="course-info">
          <h3 class="course-name">{{ course.course_name }}</h3>
          <p class="course-teacher">
            <span class="teacher-label">任课老师：</span>
            <span class="teacher-name">{{ course.teacher_name }}</span>
          </p>
          <div class="course-meta">
            <span class="meta-item">学期：{{ course.semester }}</span>
            <span class="meta-item">选课人数：{{ course.current_enrollment }}/{{ course.max_capacity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && courses.length === 0" class="empty-state">
      <p>暂无课程</p>
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

onMounted(() => {
  loadCourses()
})

const loadCourses = async () => {
  loading.value = true
  try {
    const response = await fetch('http://127.0.0.1:8081/teacher/classes?page=1&pageSize=100', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`)
    }

    const result = await response.json()

    if (result.code === 1 && result.data) {
      courses.value = result.data.rows || []
    } else {
      // 如果接口失败，使用示例数据
      courses.value = [
        {
          class_id: 501,
          course_id: 101,
          course_name: '计算机导论',
          teacher_id: 2001,
          teacher_name: '周嘉仪',
          semester: '2025-Fall',
          max_capacity: 100,
          current_enrollment: 80,
          status: 3,
          cover_url: undefined
        },
        {
          class_id: 502,
          course_id: 102,
          course_name: '数据结构',
          teacher_id: 2001,
          teacher_name: '周嘉仪',
          semester: '2025-Fall',
          max_capacity: 80,
          current_enrollment: 65,
          status: 3,
          cover_url: undefined
        },
        {
          class_id: 503,
          course_id: 103,
          course_name: '算法设计',
          teacher_id: 2001,
          teacher_name: '周嘉仪',
          semester: '2025-Fall',
          max_capacity: 60,
          current_enrollment: 45,
          status: 3,
          cover_url: undefined
        }
      ]
    }
  } catch (error) {
    console.error('加载课程列表失败:', error)
    // 使用示例数据
    courses.value = [
      {
        class_id: 501,
        course_id: 101,
        course_name: '计算机导论',
        teacher_id: 2001,
        teacher_name: '周嘉仪',
        semester: '2025-Fall',
        max_capacity: 100,
        current_enrollment: 80,
        status: 3,
        cover_url: undefined
      },
      {
        class_id: 502,
        course_id: 102,
        course_name: '数据结构',
        teacher_id: 2001,
        teacher_name: '周嘉仪',
        semester: '2025-Fall',
        max_capacity: 80,
        current_enrollment: 65,
        status: 3,
        cover_url: undefined
      },
      {
        class_id: 503,
        course_id: 103,
        course_name: '算法设计',
        teacher_id: 2001,
        teacher_name: '周嘉仪',
        semester: '2025-Fall',
        max_capacity: 60,
        current_enrollment: 45,
        status: 3,
        cover_url: undefined
      }
    ]
  } finally {
    loading.value = false
  }
}

const selectCourse = course => {
  // 将选中的课程ID存储到sessionStorage，供其他页面使用
  sessionStorage.setItem('selectedClassId', course.class_id.toString())
  sessionStorage.setItem('selectedCourseName', course.course_name)
  
  // 跳转到考勤管理页面（默认）
  router.push('/teacher/attendance')
}
</script>

<style scoped>
.teaching-index {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-block-end: 32px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-description {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.course-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.course-cover {
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.placeholder-text {
  font-size: 64px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.course-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.course-teacher {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
}

.teacher-label {
  color: #999;
}

.teacher-name {
  color: #2A5CAA;
  font-weight: 500;
}

.course-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-block-start: auto;
  padding-block-start: 12px;
  border-block-start: 1px solid #e8e8e8;
  font-size: 12px;
  color: #999;
}

.meta-item {
  display: flex;
  align-items: center;
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
  color: #999;
  font-size: 16px;
}

@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>