<template>
  <div class="homework-submissions">
    <div class="page-header">
      <h1>提交情况</h1>
      <p class="page-description">当前课程：{{ courseName }}</p>
    </div>

    <section class="card">
      <div class="table-header">
        <h3>📄 作业1：密码学基础 (共 45 人)</h3>
        <button class="btn-export">导出数据</button>
      </div>

      <table class="data-table">
        <thead>
        <tr>
          <th>学号</th>
          <th>姓名</th>
          <th>提交时间</th>
          <th>状态</th>
          <th>查重率</th>
          <th>操作</th>
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
            <button class="btn-text">查看</button>
            <button class="btn-text">下载</button>
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
  { id: 1, studentId: '2023001', name: '陈同学', time: '2025-11-20 14:30', status: 'ontime', statusText: '准时', duplicate: 5 },
  { id: 2, studentId: '2023002', name: '林同学', time: '2025-11-20 15:10', status: 'ontime', statusText: '准时', duplicate: 8 },
  { id: 3, studentId: '2023003', name: '张同学', time: '2025-11-21 09:05', status: 'late', statusText: '迟交', duplicate: 12 },
  { id: 4, studentId: '2023004', name: '刘同学', time: '--', status: 'missing', statusText: '未交', duplicate: 0 },
  { id: 5, studentId: '2023005', name: '王同学', time: '2025-11-19 20:00', status: 'ontime', statusText: '准时', duplicate: 25 },
])

onMounted(() => {
  courseName.value = sessionStorage.getItem('selectedCourseName') || 'Modern Cryptography'
})
</script>

<style scoped>
.homework-submissions { padding: 24px; max-width: 1200px; margin: 0 auto; }
.card { background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; }
.table-header { padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.table-header h3 { margin: 0; font-size: 16px; color: #333; }

.btn-export { background: #2A5CAA; color: white; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 15px 20px; text-align: left; border-bottom: 1px solid #f5f5f5; font-size: 14px; }
.data-table th { background: #f9fafb; font-weight: 600; color: #666; }

.status-tag { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-tag.ontime { background: #e6f7ff; color: #1890ff; }
.status-tag.late { background: #fff7e6; color: #fa8c16; }
.status-tag.missing { background: #fff1f0; color: #ff4d4f; }

.high-risk { color: #ff4d4f; font-weight: bold; }
.btn-text { background: none; border: none; color: #2A5CAA; cursor: pointer; margin-right: 10px; }
</style>