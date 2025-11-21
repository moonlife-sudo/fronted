<!-- src/views/teaching/leave/Approval.vue -->
<template>
  <div class="leave-approval">
    <div class="page-header">
      <h1>审批请假申请</h1>
      <p class="page-description">审批待处理的请假申请</p>
    </div>

    <!-- 待审批列表 -->
    <section v-if="pendingRequests.length > 0" class="card requests-card">
      <header class="card-header">
        <h3>待审批请假申请</h3>
      </header>
      <div class="requests-list">
        <div
          v-for="request in pendingRequests"
          :key="request.request_id"
          class="request-item"
        >
          <div class="request-info">
            <div class="request-header">
              <span class="request-id">申请ID: {{ request.request_id }}</span>
              <span class="request-status">状态: 待审批</span>
            </div>
            <div class="request-details">
              <div class="detail-item">
                <span class="detail-label">请假理由：</span>
                <span class="detail-value">{{ request.reason }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">开始时间：</span>
                <span class="detail-value">{{ formatTime(request.start_time) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">结束时间：</span>
                <span class="detail-value">{{ formatTime(request.end_time) }}</span>
              </div>
            </div>
          </div>
          <div class="request-actions">
            <button type="button" class="button" @click="approveRequest(request.request_id, 2)">
              批准
            </button>
            <button type="button" class="button button--outline" @click="approveRequest(request.request_id, 3)">
              驳回
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 空状态 -->
    <section v-if="!loading && pendingRequests.length === 0" class="card empty-card">
      <div class="empty-state">
        <p>暂无待审批的请假申请</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineOptions({
  name: 'LeaveApproval'
})

const loading = ref(false)
const pendingRequests = ref([])

onMounted(() => {
  loadPendingRequests()
})

const loadPendingRequests = async () => {
  loading.value = true
  try {
    const response = await fetch(
      'http://127.0.0.1:8081/teacher/leave-requests/pending?page=1&pageSize=100',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.msg || `请求失败: ${response.status}`)
    }

    const result = await response.json()

    if (result.code === 1 && result.data) {
      pendingRequests.value = result.data.rows || []
    } else {
      throw new Error(result.msg || '查询失败')
    }
  } catch (error) {
    console.error('查询待审批请假失败:', error)
    alert(error instanceof Error ? error.message : '查询失败，请稍后重试')
    pendingRequests.value = []
  } finally {
    loading.value = false
  }
}

const approveRequest = async (requestId, status) => {
  const action = status === 2 ? '批准' : '驳回'
  const remarks = prompt(`请输入${action}意见（可选）：`)

  try {
    const requestBody = {
      status
    }
    if (remarks && remarks.trim()) {
      requestBody.approval_remarks = remarks.trim()
    }

    const response = await fetch(
      `http://127.0.0.1:8081/teacher/leave-requests/${requestId}/approve`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.msg || `请求失败: ${response.status}`)
    }

    const result = await response.json()

    if (result.code === 1) {
      alert(`${action}成功！`)
      loadPendingRequests()
    } else {
      throw new Error(result.msg || `${action}失败`)
    }
  } catch (error) {
    console.error(`${action}失败:`, error)
    alert(error instanceof Error ? error.message : `${action}失败，请稍后重试`)
  }
}

const formatTime = time => {
  if (!time) return '-'
  try {
    const date = new Date(time)
    return date.toLocaleString('zh-CN')
  } catch {
    return time
  }
}
</script>

<style scoped>
.leave-approval {
  padding: 24px;
  max-inline-size: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-block-end: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-description {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.requests-card,
.empty-card {
  margin-block-start: 24px;
}

.card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
}

.card-header {
  padding: 20px 24px;
  border-block-end: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background: #2A5CAA;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.button:hover:not(:disabled) {
  background: #214a88;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button--outline {
  background: #fff;
  color: #2A5CAA;
  border: 1px solid #2A5CAA;
}

.requests-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.request-item {
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.request-info {
  flex: 1;
}

.request-header {
  display: flex;
  gap: 16px;
  margin-block-end: 12px;
  font-size: 14px;
}

.request-id {
  font-weight: 600;
  color: #333;
}

.request-status {
  color: #fa8c16;
  font-weight: 500;
}

.request-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  font-size: 14px;
}

.detail-label {
  color: #666;
  min-inline-size: 80px;
}

.detail-value {
  color: #333;
}

.request-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.empty-state {
  padding: 48px;
  text-align: center;
  color: #999;
  font-size: 16px;
}
</style>
