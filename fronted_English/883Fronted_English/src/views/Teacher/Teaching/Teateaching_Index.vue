<template>
  <div class="teaching-index">
    <div class="page-header">
      <div class="header-content">
        <h1>My Teaching</h1>
        <p>2025-2026 Academic Year Fall Semester</p>
      </div>
    </div>

    <div class="course-grid">
      <div v-for="course in courses" :key="course.class_id" class="course-card" @click="selectCourse(course)">
        <div class="card-cover" :style="{ backgroundColor: getCourseColor(course.class_id) }">
          <span class="semester-tag">{{ course.semester }}</span>
          <span class="course-code">{{ course.code }}</span>
        </div>

        <div class="card-content">
          <h3 class="course-title">{{ course.course_name }}</h3>
          <div class="course-meta">
            <div class="meta-item">
              <i class="bi bi-people-fill icon"></i>
              <span>{{ course.current_enrollment }} students enrolled</span>
            </div>
            <div class="meta-item">
              <i class="bi bi-geo-alt-fill icon"></i>
              <span>{{ course.location }}</span>
            </div>
          </div>
          <button class="enter-btn">Enter Management</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'TeachingIndex' })
const router = useRouter()

// 恢复颜色生成函数
const getCourseColor = (id) => {
  const colors = ['#5C6BC0', '#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC']
  return colors[id % colors.length]
}

// === 更新为你指定的4门课程 ===
const courses = ref([
  {
    class_id: 1,
    code: 'CSCI971 (JI125)',
    course_name: 'Modern Cryptography',
    semester: '2025 Fall',
    location: 'Building A-101',
    current_enrollment: 45
  },
  {
    class_id: 2,
    code: 'CSIT881 (JI125)',
    course_name: 'Programming and Data Structures',
    semester: '2025 Fall',
    location: 'Lab B-202',
    current_enrollment: 60
  },
  {
    class_id: 3,
    code: 'CSIT882 (JI125)',
    course_name: 'Data Management Systems',
    semester: '2025 Fall',
    location: 'Lecture Hall C',
    current_enrollment: 38
  },
  {
    class_id: 4,
    code: 'CSIT883 (JI125)',
    course_name: 'System Analysis and Project Management',
    semester: '2025 Fall',
    location: 'Room D-305',
    current_enrollment: 52
  }
])

const selectCourse = (course) => {
  sessionStorage.setItem('selectedClassId', course.class_id);
  sessionStorage.setItem('selectedCourseName', course.course_name);
  router.push(`/teacher/course/${course.class_id}/overview`);
}
</script>

<style scoped>
.teaching-index { padding: 24px; max-width: 1400px; margin: 0 auto; }
.page-header { margin-bottom: 32px; }
.page-header h1 { font-size: 28px; color: #333; margin: 0 0 8px 0; }
.page-header p { color: #666; }

.course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }

.course-card {
  background: #fff; border-radius: 12px; overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s; border: 1px solid #eee;
  display: flex; flex-direction: column;
}
.course-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); }

.card-cover {
  height: 120px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start;
}
.semester-tag {
  background: rgba(0, 0, 0, 0.2); color: #fff; padding: 4px 8px;
  border-radius: 4px; font-size: 12px; backdrop-filter: blur(4px);
}
.course-code { color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500; }

.card-content { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.course-title { font-size: 18px; font-weight: 600; color: #333; margin: 0 0 16px 0; line-height: 1.4; }

.course-meta { display: flex; justify-content: space-between; margin-bottom: 20px; color: #666; font-size: 14px; }
.meta-item { display: flex; align-items: center; gap: 6px; }
.icon { font-size: 16px; color: #999; }

.enter-btn {
  width: 100%; padding: 10px; background: transparent; border: 1px solid #2A5CAA;
  color: #2A5CAA; border-radius: 6px; font-weight: 500; transition: all 0.2s; margin-top: auto;
}
.course-card:hover .enter-btn { background: #2A5CAA; color: #fff; }
</style>