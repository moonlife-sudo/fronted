<template>
  <div class="attendance-page">
    <div class="page-header">
      <h1>考勤签到</h1>
    </div>

    <div class="card active-session-card">
      <div class="card-header">
        <h3>📢 正在签到：{{ courseName }}</h3>
        <div class="timer">剩余时间：05:23</div>
      </div>
      <div class="card-body">
        <div class="session-info">
          <p><strong>签到类型：</strong>位置签到</p>
          <p><strong>要求位置：</strong>教学楼 B205 (半径 100米)</p>
          <p><strong>发起时间：</strong>10:00</p>
        </div>

        <div v-if="!isCheckedIn" class="action-area">
          <button class="btn-primary" @click="doCheckIn" :disabled="checking">
            {{ checking ? '定位中...' : '📍 立即签到' }}
          </button>
          <p class="gps-hint" v-if="checking">正在获取您的位置信息...</p>
        </div>
        <div v-else class="success-msg">
          <i class="bi bi-check-circle-fill"></i> 签到成功！
          <span>时间: {{ checkInTime }}</span>
        </div>
      </div>
    </div>

    <div class="card history-card">
      <h3>历史记录</h3>
      <table class="data-table">
        <thead>
        <tr>
          <th>日期</th>
          <th>课程</th>
          <th>状态</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="rec in history" :key="rec.id">
          <td>{{ rec.date }}</td>
          <td>{{ courseName }}</td>
          <td><span class="tag" :class="rec.status">{{ rec.text }}</span></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseName = ref('')
const checking = ref(false)
const isCheckedIn = ref(false)
const checkInTime = ref('')

const history = ref([
  { id: 1, date: '2025-11-25 10:00', status: 'present', text: '出勤' },
  { id: 2, date: '2025-11-18 10:05', status: 'late', text: '迟到' },
  { id: 3, date: '2025-11-11 10:00', status: 'present', text: '出勤' },
])

onMounted(() => {
  courseName.value = localStorage.getItem('currentCourseName') || 'Modern Cryptography'
})

const doCheckIn = () => {
  checking.value = true
  // 模拟延时和后端请求
  setTimeout(() => {
    checking.value = false
    isCheckedIn.value = true
    checkInTime.value = new Date().toLocaleTimeString()
    // 这里可以偷偷发个请求给后端记录一下
  }, 1500)
}
</script>

<style scoped>
.attendance-page { padding: 24px; }
.card { background: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.card-header { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px; }
.timer { color: #ff4d4f; font-weight: bold; font-size: 18px; }

.session-info p { margin: 8px 0; color: #555; }
.btn-primary { width: 100%; padding: 15px; background: #2A5CAA; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; margin-top: 10px; }
.btn-primary:disabled { background: #ccc; }

.success-msg { text-align: center; color: #52c41a; font-size: 18px; font-weight: bold; margin-top: 20px; }
.success-msg i { font-size: 24px; margin-right: 10px; }
.success-msg span { display: block; font-size: 14px; color: #999; font-weight: normal; margin-top: 5px; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table td, .data-table th { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
.tag.present { color: #52c41a; background: #f6ffed; padding: 2px 8px; border-radius: 4px; }
.tag.late { color: #faad14; background: #fffbe6; padding: 2px 8px; border-radius: 4px; }
</style>