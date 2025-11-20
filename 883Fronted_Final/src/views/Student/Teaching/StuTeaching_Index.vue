<template>
  <div class="student-dashboard">
    <div class="page-header">
      <div class="header-content">
        <h1>我的课程</h1>
        <p>共 {{ courses.length }} 门正在进行的课程</p>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>正在加载课程信息...</p>
    </div>

    <div v-else-if="courses.length === 0" class="empty-state">
      <div class="empty-icon">📚</div>
      <p>本学期暂无课程安排</p>
    </div>

    <div v-else class="course-grid">
      <div v-for="course in courses" :key="course.class_id" class="course-card" @click="enterCourse(course)">
        <div class="card-cover" :style="{ backgroundColor: getCourseColor(course.class_id) }">
          <span class="semester-tag">{{ course.semester }}</span>
        </div>
        <div class="card-content">
          <h3 class="course-title">{{ course.course_name }}</h3>
          <div class="course-meta">
            <div class="meta-item">
              <i class="icon">👨‍🏫</i>
              <span>{{ course.teacher_name }}</span>
            </div>
            <div class="meta-item">
              <i class="icon">🎓</i>
              <span>{{ course.status === 3 ? '已结课' : '进行中' }}</span>
            </div>
          </div>
          <button class="enter-btn">进入课程</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'StudentTeachingIndex',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const courses = ref([])

    // 生成随机柔和背景色
    const getCourseColor = (id) => {
      const colors = ['#5C6BC0', '#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC']
      return colors[id % colors.length]
    }

    const loadCourses = async () => {
      loading.value = true
      try {
        // 模拟数据，请替换为真实 API 调用
        setTimeout(() => {
          courses.value = [
            { 
              class_id: 501, 
              course_name: '计算机导论', 
              teacher_name: '张三', 
              semester: '2025-Fall', 
              status: 2 
            },
            { 
              class_id: 502, 
              course_name: '高等数学', 
              teacher_name: '李四', 
              semester: '2025-Fall', 
              status: 2 
            },
            { 
              class_id: 503, 
              course_name: 'Web前端开发', 
              teacher_name: '王五', 
              semester: '2025-Fall', 
              status: 2 
            },
          ]
          loading.value = false
        }, 500)
      } catch (e) {
        loading.value = false
      }
    }

    const enterCourse = (course) => {
      // 1. 持久化存储当前课程信息，防止刷新丢失
      localStorage.setItem('currentClassId', course.class_id.toString())
      localStorage.setItem('currentCourseName', course.course_name)
      localStorage.setItem('currentTeacherName', course.teacher_name)
      
      // 2. 跳转到考勤页面（作为课程首页）
      router.push({
        path: '/student/attendance',
        query: { 
          classId: course.class_id,
          courseName: course.course_name,
          teacherName: course.teacher_name
        }
      })
    }

    onMounted(() => {
      loadCourses()
    })

    return {
      loading,
      courses,
      getCourseColor,
      loadCourses,
      enterCourse
    }
  }
}
</script>

<style scoped>
.student-dashboard {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  color: var(--text-black, #333);
  margin-bottom: 8px;
}

.page-header p {
  color: var(--text-gray, #666);
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
  border: 1px solid var(--border-light, #eee);
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-cover {
  height: 120px;
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

.card-content {
  padding: 20px;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  line-height: 1.4;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.enter-btn {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid var(--primary-color, #2A5CAA);
  color: var(--primary-color, #2A5CAA);
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
}

.course-card:hover .enter-btn {
  background: var(--primary-color, #2A5CAA);
  color: #fff;
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2A5CAA;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>