<template>
  <div class="student-detail">
    <div class="page-header">
      <h1>学生管理</h1>
      <p>当前课程：{{ courseName }} (共 45 人)</p>
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
        <tr>
          <th>头像</th>
          <th>学号</th>
          <th>姓名</th>
          <th>专业</th>
          <th>考勤率</th>
          <th>平时分</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="stu in students" :key="stu.id">
          <td>
            <div class="avatar">{{ stu.name[0] }}</div>
          </td>
          <td>{{ stu.id }}</td>
          <td>{{ stu.name }}</td>
          <td>{{ stu.major }}</td>
          <td>
            <span :class="{'low-rate': stu.attendance < 80}">{{ stu.attendance }}%</span>
          </td>
          <td>{{ stu.score }}</td>
          <td><button class="btn-link">详情</button></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseName = ref('')
const students = ref([
  { id: '2023001', name: '李明', major: '计算机科学', attendance: 98, score: 92 },
  { id: '2023002', name: '张伟', major: '软件工程', attendance: 100, score: 95 },
  { id: '2023003', name: '王芳', major: '网络安全', attendance: 85, score: 88 },
  { id: '2023004', name: '赵强', major: '计算机科学', attendance: 60, score: 70 },
  { id: '2023005', name: '陈静', major: '软件工程', attendance: 95, score: 90 },
])

onMounted(() => {
  courseName.value = sessionStorage.getItem('selectedCourseName') || 'Modern Cryptography'
})
</script>

<style scoped>
.student-detail { padding: 24px; }
.card { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 15px 20px; text-align: left; border-bottom: 1px solid #f5f5f5; }
.data-table th { background: #f9fafb; color: #666; font-weight: 600; }

.avatar { width: 32px; height: 32px; background: #2A5CAA; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.low-rate { color: #ff4d4f; font-weight: bold; }
.btn-link { background: none; border: none; color: #2A5CAA; cursor: pointer; }
</style>