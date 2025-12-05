<template>
  <div class="grades-page">
    <div class="overview-card">
      <div class="score-circle">
        <span class="label">Current Average</span>
        <span class="value">92.5</span>
      </div>
      <div class="rank-info">
        <p>Class Rank: <strong>3 / 45</strong></p>
        <p>Outperformed 93% of classmates</p>
      </div>
    </div>

    <div class="card detail-card">
      <h3>Grade Details: {{ courseName }}</h3>
      <table class="grade-table">
        <thead>
        <tr>
          <th>Assessment Item</th>
          <th>Weight</th>
          <th>Full Score</th>
          <th>My Score</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in gradeItems" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.weight * 100 }}%</td>
          <td>{{ item.maxScore }}</td>
          <td class="my-score">{{ item.myScore || '-' }}</td>
          <td>
            <span v-if="item.myScore" class="tag success">Graded</span>
            <span v-else class="tag waiting">Pending</span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseName = ref('')
const gradeItems = ref([
  { id: 1, name: 'Regular Attendance', weight: 0.1, maxScore: 100, myScore: 100 },
  { id: 2, name: 'Lab 1: Basic Encryption', weight: 0.1, maxScore: 100, myScore: 95 },
  { id: 3, name: 'Lab 2: DES/AES', weight: 0.1, maxScore: 100, myScore: 90 },
  { id: 4, name: 'Midterm Exam', weight: 0.3, maxScore: 100, myScore: 88 },
  { id: 5, name: 'Lab 3: RSA Algorithm', weight: 0.1, maxScore: 100, myScore: null },
  { id: 6, name: 'Final Exam', weight: 0.3, maxScore: 100, myScore: null }
])

onMounted(() => {
  courseName.value = localStorage.getItem('currentCourseName') || 'Modern Cryptography'
})
</script>

<style scoped>
/* 复用之前的样式，无需改动 */
.grades-page { padding: 24px; max-inline-size: 1000px; margin: 0 auto; }
.overview-card { background: linear-gradient(135deg, #2A5CAA 0%, #5C6BC0 100%); color: white; padding: 30px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; margin-block-end: 24px; }
.score-circle { text-align: center; }
.score-circle .label { display: block; font-size: 14px; opacity: 0.9; margin-block-end: 5px; }
.score-circle .value { font-size: 48px; font-weight: bold; }
.rank-info { text-align: end; font-size: 14px; opacity: 0.9; }
.card { background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }
.grade-table { inline-size: 100%; border-collapse: collapse; }
.grade-table th { text-align: start; color: #666; padding: 12px; background: #f9f9f9; }
.grade-table td { padding: 12px; border-block-end: 1px solid #eee; color: #333; }
.my-score { font-weight: bold; color: #2A5CAA; }
.tag { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.tag.success { background: #f6ffed; color: #52c41a; }
.tag.waiting { background: #f5f5f5; color: #999; }
</style>