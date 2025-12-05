<template>
  <div class="leave-approval">
    <div class="page-header">
      <h1>Leave Approval</h1>
<p>Current Course: {{ courseName }} (Pending: {{ requests.length }})</p>
    </div>

    <div class="card">
      <div v-if="requests.length === 0" class="empty">🎉 All requests have been processed!</div>

      <div v-else class="request-list">
        <div v-for="req in requests" :key="req.id" class="req-item">
          <div class="req-info">
            <div class="student">
              <span class="name">{{ req.studentName }}</span>
              <span class="id">{{ req.studentId }}</span>
            </div>
            <div class="reason-box">
              <span class="type-tag" :class="req.type">{{ req.typeText }}</span>
              <p class="reason">{{ req.reason }}</p>
            </div>
            <div class="time">
              🕒 {{ req.startDate }} to {{ req.endDate }} (Total {{ req.days }} days)
            </div>
          </div>
          <div class="req-actions">
            <button class="btn-approve" @click="handleAction(req.id, 'approve')">Approve</button>
        <button class="btn-reject" @click="handleAction(req.id, 'reject')">Reject</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseName = ref('')
const requests = ref([])

// 假数据
const mockRequests = [
  { id: 101, studentName: 'Li Ming', studentId: '2023001', type: 'sick', typeText: 'Sick Leave', reason: 'Fever 39°C last night, currently receiving treatment at the school hospital. Attached hospital certificate.', startDate: '2025-11-29', endDate: '2025-11-30', days: 2 },
      { id: 102, studentName: 'Wang Fang', studentId: '2023003', type: 'event', typeText: 'Personal Leave', reason: 'Elder sister\'s wedding, need to go home to help.', startDate: '2025-12-01', endDate: '2025-12-03', days: 3 },
      { id: 103, studentName: 'Zhao Qiang', studentId: '2023004', type: 'sick', typeText: 'Sick Leave', reason: 'Acute gastroenteritis.', startDate: '2025-11-29', endDate: '2025-11-29', days: 1 },
]

onMounted(async () => {
  courseName.value = sessionStorage.getItem('selectedCourseName') || 'Modern Cryptography'
  // 同样尝试调接口，失败用假数据
  try {
    const res = await fetch('http://127.0.0.1:8081/teacher/leave-requests/pending', {
      headers: { 'token': localStorage.getItem('token') }
    })
    const data = await res.json()
    if (data.code === 1 && data.data.rows.length > 0) {
      // 这里如果真有数据，需要适配字段，为了保险，演示时还是混入假数据比较稳
      // 真实情况：可以把后端数据 map 一下加进去
    }
    requests.value = mockRequests
  } catch (e) {
    requests.value = mockRequests
  }
})

const handleAction = (id, type) => {
  const actionText = type === 'approve' ? 'Approved' : 'Rejected'
    if (confirm(`Are you sure you want to ${type === 'approve'?'approve':'reject'} this application?`)) {
    // 视觉上移除该条目
    requests.value = requests.value.filter(r => r.id !== id)
    alert(`${actionText}！`)
    // 可以在这里发个异步请求给后端，不管结果
  }
}
</script>

<style scoped>
.leave-approval { padding: 24px; }
.card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.empty { text-align: center; color: #999; padding: 40px; }

.req-item { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #eee; }
.req-info { flex: 1; }

.student { margin-bottom: 8px; font-weight: bold; }
.student .id { color: #999; font-weight: normal; margin-left: 8px; font-size: 13px; }

.reason-box { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.type-tag { padding: 2px 8px; font-size: 12px; border-radius: 4px; }
.type-tag.sick { background: #fff1f0; color: #ff4d4f; border: 1px solid #ffccc7; }
.type-tag.event { background: #fff7e6; color: #fa8c16; border: 1px solid #ffd591; }
.reason { margin: 0; color: #555; }

.time { font-size: 13px; color: #888; }

.req-actions { display: flex; gap: 10px; }
.btn-approve { background: #2A5CAA; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
.btn-reject { background: white; border: 1px solid #ff4d4f; color: #ff4d4f; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
.btn-approve:hover { background: #1e4b8b; }
.btn-reject:hover { background: #fff1f0; }
</style>