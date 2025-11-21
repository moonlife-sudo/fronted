<template>
  <div class="attendance-page">
    <div class="card active-session-card" v-if="activeSession">
      <div class="card-header">
        <h3>📢 正在签到</h3>
        <div class="timer">剩余时间：{{ countdownStr }}</div>
      </div>
      <div class="card-body">
        <div class="session-info">
          <p><strong>类型：</strong>{{ getSessionType(activeSession.type) }}</p>
          <p><strong>时间：</strong>{{ activeSession.startTime }} - {{ activeSession.endTime }}</p>
        </div>
        <button class="btn-primary" @click="doCheckIn" :disabled="checkingIn">
          {{ checkingIn ? '签到中...' : '立即签到' }}
        </button>
      </div>
    </div>

    <div class="card history-card">
      <div class="card-header">
        <h3>考勤记录</h3>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td>{{ record.date }}</td>
            <td>{{ record.time }}</td>
            <td><span :class="['status-tag', record.status]">{{ getStatusText(record.status) }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const checkingIn = ref(false)
const activeSession = ref({
  type: 'qrcode',
  startTime: '10:00',
  endTime: '10:10',
  remaining: 300
})

const records = ref([
  { id: 1, date: '2023-11-20', time: '10:01', status: 'present' },
  { id: 2, date: '2023-11-18', time: '--:--', status: 'absent' },
  { id: 3, date: '2023-11-15', time: '10:05', status: 'late' }
])

const countdownStr = computed(() => {
  const m = Math.floor(activeSession.value.remaining / 60)
  const s = activeSession.value.remaining % 60
  return `${m}分${s}秒`
})

const getSessionType = (type) => ({ qrcode: '二维码', gps: '定位' }[type] || '普通')
const getStatusText = (status) => ({ present: '出勤', absent: '缺勤', late: '迟到' }[status])

const doCheckIn = () => {
  checkingIn.value = true
  setTimeout(() => {
    checkingIn.value = false
    alert('签到成功！')
    activeSession.value = null // 隐藏卡片
    records.value.unshift({ id: 4, date: '今天', time: '刚刚', status: 'present' })
  }, 1500)
}
</script>

<style scoped>
.attendance-page {
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-block-end: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-block-end: 15px;
  border-block-end: 1px solid #eee;
  padding-block-end: 10px;
}

.timer {
  color: #ff4d4f;
  font-weight: bold;
}

.session-info p {
  margin: 5px 0;
  color: #666;
}

.btn-primary {
  background: #2A5CAA;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-block-start: 15px;
  inline-size: 100%;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.data-table {
  inline-size: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: start;
  border-block-end: 1px solid #eee;
}

.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.present {
  color: #52c41a;
  background: #f6ffed;
}

.status-tag.absent {
  color: #ff4d4f;
  background: #fff1f0;
}

.status-tag.late {
  color: #faad14;
  background: #fffbe6;
}
</style>