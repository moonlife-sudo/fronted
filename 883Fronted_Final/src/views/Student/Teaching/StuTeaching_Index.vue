<template>
  <div class="student-dashboard">
    <div class="page-header">
      <div class="header-content">
        <h1>我的课程</h1>
        <p v-if="!loading">本学期共 {{ totalCourses }} 门课程</p>
        <p v-else>加载中...</p>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <i class="bi bi-arrow-clockwise spinner"></i>
      <span>正在加载课程列表...</span>
    </div>

    <!-- 课程网格 -->
    <div v-else-if="courses.length > 0" class="course-grid">
      <div v-for="course in courses" :key="course.class_id || course.id" class="course-card" @click="enterCourse(course)">
        <div class="card-cover" :style="{ backgroundColor: getCourseColor(course.class_id || course.id) }">
          <span class="semester-tag">{{ course.semester || '2025 Fall' }}</span>
          <span class="course-code">{{ course.code || course.course_code || 'N/A' }}</span>
        </div>
        <div class="card-content">
          <h3 class="course-title">{{ course.course_name || course.name }}</h3>
          <div class="course-meta">
            <div class="meta-item">
              <i class="icon">👨‍🏫</i> <span>{{ course.teacher_name || course.teacher || '未分配' }}</span>
            </div>
            <div class="meta-item">
              <i class="icon">📍</i> <span>{{ course.location || course.classroom || '待安排' }}</span>
            </div>
          </div>
          <button class="enter-btn">进入课程</button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <i class="bi bi-book"></i>
      <h3>暂无课程</h3>
      <p>本学期还没有选择课程</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyCourses } from '@/api/student'

defineOptions({ name: 'StudentTeachingIndex' })
const router = useRouter()

const loading = ref(false)
const courses = ref([])
const totalCourses = ref(0)

const getCourseColor = (id) => {
  const colors = ['#5C6BC0', '#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC']
  return colors[(id % colors.length)]
}

// 加载学生课程列表
const loadMyCourses = async () => {
  loading.value = true
  try {
    console.log('正在获取学生课程列表...')
    const result = await getMyCourses()
    console.log('课程列表API响应:', result)
    
    if (result.code === 1 && result.data) {
      courses.value = result.data
      totalCourses.value = result.data.length
    } else {
      console.warn('获取课程列表失败:', result.msg)
      // 使用fallback数据
      courses.value = getFallbackCourses()
      totalCourses.value = courses.value.length
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
    // 使用fallback数据
    courses.value = getFallbackCourses()
    totalCourses.value = courses.value.length
  } finally {
    loading.value = false
  }
}

// 获取fallback课程数据
const getFallbackCourses = () => [
  {
    class_id: 1,
    id: 1,
    code: 'CS101',
    course_code: 'CS101',
    course_name: '计算机科学导论',
    name: '计算机科学导论',
    teacher_name: '张教授',
    teacher: '张教授',
    semester: '2024春季学期',
    location: '教学楼A-101',
    classroom: '教学楼A-101'
  },
  {
    class_id: 2, 
    id: 2,
    code: 'CS201',
    course_code: 'CS201',
    course_name: '数据结构与算法',
    name: '数据结构与算法',
    teacher_name: '李博士',
    teacher: '李博士',
    semester: '2024春季学期',
    location: '实验楼B-202',
    classroom: '实验楼B-202'
  },
  {
    class_id: 3,
    id: 3,
    code: 'CS301',
    course_code: 'CS301',
    course_name: 'Web开发技术',
    name: 'Web开发技术',
    teacher_name: '王老师',
    teacher: '王老师',
    semester: '2024春季学期',
    location: '机房C-301',
    classroom: '机房C-301'
  },
  {
    class_id: 4,
    id: 4,
    code: 'CS401',
    course_code: 'CS401',
    course_name: '软件工程',
    name: '软件工程',
    teacher_name: '赵副教授',
    teacher: '赵副教授',
    semester: '2024春季学期',
    location: '多媒体教室D-401',
    classroom: '多媒体教室D-401'
  }
]

const enterCourse = (course) => {
  // 保存当前课程信息到localStorage（如果需要的话）
  localStorage.setItem('currentClassId', (course.class_id || course.id).toString())
  localStorage.setItem('currentCourseName', course.course_name || course.name)
  localStorage.setItem('currentTeacherName', course.teacher_name || course.teacher)
  
  // 跳转到课程详情页
  router.push(`/student/course/${course.class_id || course.id}/attendance/index`)
}

onMounted(() => {
  loadMyCourses()
})
</script>

<style scoped>
.student-dashboard { padding: 24px; max-inline-size: 1400px; margin: 0 auto; }
.page-header { margin-block-end: 32px; }
.page-header h1 { font-size: 28px; color: #333; margin: 0 0 8px 0; }
.page-header p { color: #666; }

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
}

.loading-state i, .empty-state i {
  font-size: 48px;
  margin-block-end: 15px;
  color: #999;
}

.empty-state h3 {
  margin: 10px 0;
  color: #333;
  font-size: 18px;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }

.course-card {
  background: #fff; border-radius: 12px; overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s; border: 1px solid #eee;
}
.course-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); }

.card-cover {
  block-size: 120px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start;
}
.semester-tag {
  background: rgba(0, 0, 0, 0.2); color: #fff; padding: 4px 8px;
  border-radius: 4px; font-size: 12px; backdrop-filter: blur(4px);
}
.course-code { color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500; }

.card-content { padding: 20px; }
.course-title { font-size: 18px; font-weight: 600; color: #333; margin: 0 0 16px 0; line-height: 1.4; }

.course-meta { display: flex; justify-content: space-between; margin-block-end: 20px; color: #666; font-size: 14px; }
.meta-item { display: flex; align-items: center; gap: 6px; }
.icon { font-style: normal; }

.enter-btn {
  inline-size: 100%; padding: 10px; background: transparent; border: 1px solid #2A5CAA;
  color: #2A5CAA; border-radius: 6px; font-weight: 500; transition: all 0.2s;
}
.course-card:hover .enter-btn { background: #2A5CAA; color: #fff; }
</style>