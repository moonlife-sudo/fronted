<!-- src/views/teaching/leave/Records.vue -->
<template>
  <div class="leave-records">
    <div class="page-header">
      <h1>Leave Records</h1>
      <p class="page-description">View all leave application records</p>
    </div>

    <!-- 筛选区域 -->
    <section class="card filter-card">
      <div class="filter-form">
        <div class="form-row">
          <div class="form-group">
            <label for="status_filter" class="form-label">Status Filter</label>
            <select id="status_filter" v-model.number="queryForm.status" class="form-select">
              <option :value="null">All</option>
        <option :value="1">Pending</option>
        <option :value="2">Approved</option>
        <option :value="3">Rejected</option>
            </select>
          </div>
          <div class="form-actions-inline">
            <button type="button" class="button" @click="loadRecords" :disabled="loading">
              <span v-if="loading">Searching...</span>
          <span v-else>Search</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 请假记录列表 -->
    <section v-if="records.length > 0" class="card records-card">
      <header class="card-header">
        <h3>Leave Records</h3>
      </header>
      <div class="records-table-wrapper">
        <table class="records-table">
          <thead>
            <tr>
              <th>Application ID</th>
          <th>Reason</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Status</th>
          <th>Approval Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.request_id">
              <td>{{ record.request_id }}</td>
              <td>{{ record.reason }}</td>
              <td>{{ formatTime(record.start_time) }}</td>
              <td>{{ formatTime(record.end_time) }}</td>
              <td>
                <span :class="['status-badge', `status-${record.status}`]">
                  {{ getStatusName(record.status) }}
                </span>
              </td>
              <td>
                <span v-if="record.approval_remarks">{{ record.approval_remarks }}</span>
                <span v-else class="text-muted">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 空状态 -->
    <section v-if="!loading && records.length === 0" class="card empty-card">
      <div class="empty-state">
        <p>No leave records available</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

defineOptions({
  name: 'LeaveRecords'
})

const queryForm = reactive({
  status: null
})

const loading = ref(false)
const records = ref([])

onMounted(() => {
  loadRecords()
})

const loadRecords = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', '1')
    params.append('pageSize', '100')
    if (queryForm.status !== null) {
      params.append('status', queryForm.status.toString())
    }

    const response = await fetch(
      `http://127.0.0.1:8081/teacher/leave-requests/pending?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.msg || `Request failed: ${response.status}`)
    }

    const result = await response.json()

    if (result.code === 1 && result.data) {
      records.value = result.data.rows || []
    } else {
      throw new Error(result.msg || 'Search failed')
    }
  } catch (error) {
    console.error('Failed to search leave records:', error)
    alert(error instanceof Error ? error.message : 'Search failed, please try again later')
    records.value = []
  } finally {
    loading.value = false
  }
}

const getStatusName = status => {
  const statusMap = {
    1: 'Pending',
    2: 'Approved',
    3: 'Rejected'
  }
  return statusMap[status] || 'Unknown'
}

const formatTime = time => {
  if (!time) return '-'
  try {
    const date = new Date(time)
    return date.toLocaleString('en-US')
  } catch {
    return time
  }
}
</script>

<style scoped>
.leave-records {
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

.filter-card,
.records-card,
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

.filter-form {
  padding: 24px;
}

.form-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-inline-size: 200px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-block-end: 8px;
}

.form-select {
  inline-size: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  outline: none;
  transition: all 0.3s;
}

.form-select:focus {
  border-color: #2A5CAA;
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.1);
}

.form-actions-inline {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.records-table-wrapper {
  overflow-x: auto;
  padding: 16px;
}

.records-table {
  inline-size: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.records-table th,
.records-table td {
  padding: 12px;
  text-align: start;
  border-block-end: 1px solid #e8e8e8;
}

.records-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}

.records-table tbody tr:hover {
  background: #f5f7fa;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-1 {
  background: #fff2e8;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.status-2 {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-3 {
  background: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.text-muted {
  color: #999;
}

.empty-state {
  padding: 48px;
  text-align: center;
  color: #999;
  font-size: 16px;
}
</style>
