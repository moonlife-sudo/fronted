<template>
  <div class="grades-detail">
    <div class="page-header">
      <h1>成绩管理</h1>
      <p>当前课程：{{ courseName }}</p>
    </div>

    <div class="card">
      <div class="toolbar">
        <button class="btn btn-primary" @click="$router.push('input')">录入成绩</button>
        <button class="btn btn-outline" @click="$router.push('composition')">设置权重</button>
        <span class="info">总人数: {{ students.length }}</span>
      </div>

      <table class="data-table">
        <thead>
        <tr>
          <th>学号</th>
          <th>姓名</th>
          <th>平时 (30%)</th>
          <th>期中 (30%)</th>
          <th>期末 (40%)</th>
          <th>总成绩</th>
          <th>状态</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="stu in students" :key="stu.id">
          <td>{{ stu.id }}</td>
          <td>{{ stu.name }}</td>
          <td>{{ stu.score1 || '-' }}</td>
          <td>{{ stu.score2 || '-' }}</td>
          <td>{{ stu.score3 || '-' }}</td>
          <td class="total">{{ stu.total }}</td>
          <td><span class="tag" :class="stu.total >= 60 ? 'pass' : 'fail'">{{ stu.total >= 60 ? '及格' : '不及格' }}</span></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseName = ref('')
const students = ref([])

// 假数据生成器
const mockStudents = [
  { id: '2023001', name: '陈同学', score1: 85, score2: 88, score3: 90, total: 88.1 },
  { id: '2023002', name: '林同学', score1: 90, score2: 92, score3: 95, total: 92.6 },
  { id: '2023003', name: '张同学', score1: 70, score2: 65, score3: 58, total: 63.7 },
  { id: '2023004', name: '刘同学', score1: 60, score2: 55, score3: 40, total: 50.5 },
  { id: '2023005', name: '王同学', score1: 95, score2: 96, score3: 98, total: 96.5 },
]

onMounted(async () => {
  courseName.value = sessionStorage.getItem('selectedCourseName') || 'Modern Cryptography'
  const classId = sessionStorage.getItem('selectedClassId')

  try {
    // 尝试从后端获取
    const res = await fetch(`http://127.0.0.1:8081/teacher/classes/${classId}/gradebook`, {
      headers: { 'token': localStorage.getItem('token') }
    })
    const data = await res.json()
    if (data.code === 1 && data.data && data.data.students && data.data.students.length > 0) {
      students.value = data.data.students // 使用真数据
    } else {
      students.value = mockStudents // 使用假数据
    }
  } catch (e) {
    students.value = mockStudents // 出错也用假数据
  }
})
</script>

<style scoped>
.grades-detail { padding: 24px; }
.card { background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.toolbar { display: flex; gap: 10px; margin-bottom: 20px; align-items: center; }
.info { margin-left: auto; color: #666; font-size: 14px; }

.btn { padding: 8px 16px; border-radius: 4px; cursor: pointer; border: none; font-size: 14px; }
.btn-primary { background: #2A5CAA; color: white; }
.btn-outline { background: white; border: 1px solid #ddd; color: #333; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
.data-table th { background: #f9fafb; font-weight: 600; color: #555; }
.total { font-weight: bold; color: #2A5CAA; }

.tag { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.tag.pass { background: #f6ffed; color: #52c41a; }
.tag.fail { background: #fff2f0; color: #ff4d4f; }
</style>