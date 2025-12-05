<template>
  <div class="homework-submissions">
    <div class="page-header">
      <h1>Submission Status</h1>
      <p class="page-description">Current Course: {{ courseName }}</p>
    </div>

    <section class="card">
      <div class="table-header">
        <h3>📄 Assignment 1: Fundamentals of Cryptography (Total 45 students)</h3>
        <button class="btn-export">Export Data</button>
      </div>

      <table class="data-table">
        <thead>
        <tr>
          <th>Student ID</th>
          <th>Name</th>
          <th>Submission Time</th>
          <th>Status</th>
          <th>Plagiarism Rate</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="sub in submissions" :key="sub.id">
          <td>{{ sub.studentId }}</td>
          <td>{{ sub.name }}</td>
          <td>{{ sub.time }}</td>
          <td>
            <span :class="['status-tag', sub.status]">{{ sub.statusText }}</span>
          </td>
          <td>
            <span :class="{'high-risk': sub.duplicate > 20}">{{ sub.duplicate }}%</span>
          </td>
          <td>
            <button class="btn-text">View</button>
            <button class="btn-text">Download</button>
          </td>
        </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseName = ref('')
const submissions = ref([
  { id: 1, studentId: '2023001', name: 'Chen', time: '2025-11-20 14:30', status: 'ontime', statusText: 'On Time', duplicate: 5 },
  { id: 2, studentId: '2023002', name: 'Lin', time: '2025-11-20 15:10', status: 'ontime', statusText: 'On Time', duplicate: 8 },
  { id: 3, studentId: '2023003', name: 'Zhang', time: '2025-11-21 09:05', status: 'late', statusText: 'Late', duplicate: 12 },
  { id: 4, studentId: '2023004', name: 'Liu', time: '--', status: 'missing', statusText: 'Missing', duplicate: 0 },
  { id: 5, studentId: '2023005', name: 'Wang', time: '2025-11-19 20:00', status: 'ontime', statusText: 'On Time', duplicate: 25 },
])

onMounted(() => {
  courseName.value = sessionStorage.getItem('selectedCourseName') || 'Modern Cryptography'
})
</script>

<style scoped>
.homework-submissions { padding: 24px; max-inline-size: 1200px; margin: 0 auto; }
.card { background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; }
.table-header { padding: 20px; border-block-end: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.table-header h3 { margin: 0; font-size: 16px; color: #333; }

.btn-export { background: #2A5CAA; color: white; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; }

.data-table { inline-size: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 15px 20px; text-align: start; border-block-end: 1px solid #f5f5f5; font-size: 14px; }
.data-table th { background: #f9fafb; font-weight: 600; color: #666; }

.status-tag { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-tag.ontime { background: #e6f7ff; color: #1890ff; }
.status-tag.late { background: #fff7e6; color: #fa8c16; }
.status-tag.missing { background: #fff1f0; color: #ff4d4f; }

.high-risk { color: #ff4d4f; font-weight: bold; }
.btn-text { background: none; border: none; color: #2A5CAA; cursor: pointer; margin-inline-end: 10px; }
</style>