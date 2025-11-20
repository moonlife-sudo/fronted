<!-- src/views/teaching/attendance/Detail.vue -->
<template>
  <div class="attendance-detail">
    <div class="page-header">
      <h1>查看考勤详情</h1>
      <p class="page-description">查询班级考勤任务，查看学生考勤情况</p>
    </div>

    <!-- 筛选和搜索区域 -->
    <section class="card filter-card">
      <div class="filter-form">
        <div class="form-row">
          <div class="form-group">
            <label for="class_id" class="form-label required">班级ID</label>
            <input
              id="class_id"
              v-model="queryForm.class_id"
              type="text"
              placeholder="请输入班级ID"
              :class="['input', { 'input--error': errors.class_id }]"
            />
          </div>
          <div class="form-group">
            <label for="status_filter" class="form-label">状态筛选</label>
            <select id="status_filter" v-model.number="queryForm.status" class="form-select">
              <option :value="null">全部</option>
              <option :value="1">出勤</option>
              <option :value="2">缺勤</option>
              <option :value="3">迟到</option>
              <option :value="4">请假</option>
            </select>
          </div>
          <div class="form-group">
            <label for="student_search" class="form-label">搜索学生</label>
            <input
              id="student_search"
              v-model="queryForm.student_name"
              type="text"
              placeholder="请输入学生姓名或学号"
              class="input"
            />
          </div>
          <div class="form-actions-inline">
            <button type="button" class="button" @click="handleQuery" :disabled="loading">
              <span v-if="loading">查询中...</span>
              <span v-else>查询</span>
            </button>
            <button type="button" class="button button--secondary" @click="handleReset">重置</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 考勤情况列表 -->
    <section v-if="attendanceList.length > 0" class="card attendance-list-card">
      <header class="card-header">
        <div class="card-header__content">
          <h3>考勤情况</h3>
          <span v-if="selectedSessionId" class="session-info-text">
            任务ID: {{ selectedSessionId }}
          </span>
        </div>
      </header>
      <div class="attendance-list">
        <div v-for="record in attendanceList" :key="record.record_id" class="attendance-item">
          <div class="attendance-main">
            <span class="student-name">{{ record.student_name || `学生${record.student_id}` }}</span>
            <span class="student-id">学号：{{ record.student_id_number || record.student_id }}</span>
            <span class="attendance-count">第{{ getAttendanceIndex(record) }}次</span>
            <span :class="['status-badge', `status-${record.status}`]">
              {{ getStatusName(record.status) }}
            </span>
          </div>
          <div v-if="record.check_in_time" class="attendance-time">
            签到时间：{{ formatTime(record.check_in_time) }}
          </div>
          <div v-if="record.remarks" class="attendance-remarks">
            备注：{{ record.remarks }}
          </div>
          <div class="attendance-actions">
            <button type="button" class="button button--outline button--small" @click="handleModify(record)">
              修改
            </button>
          </div>
        </div>
      </div>
      <div v-if="totalSessions > 0" class="pagination">
        <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
          上一页
        </button>
        <span class="page-info">第 {{ currentPage }} 页，共 {{ Math.ceil(totalSessions / pageSize) }} 页</span>
        <button class="page-btn" :disabled="currentPage >= Math.ceil(totalSessions / pageSize)"
          @click="changePage(currentPage + 1)">
          下一页
        </button>
      </div>
    </section>

    <!-- 空状态 -->
    <section v-if="!loading && (!queryForm.class_id || attendanceList.length === 0)" class="card empty-card">
      <div class="empty-state">
        <p v-if="!queryForm.class_id">请输入班级ID并查询</p>
        <p v-else>暂无考勤记录</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'AttendanceDetail'
})

const router = useRouter()

const queryForm = reactive({
  class_id: '',
  status: null,
  student_name: ''
})

const errors = reactive({})
const loading = ref(false)
const sessions = ref([])
const records = ref([])
const selectedSessionId = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const totalSessions = ref(0)

// 计算过滤后的考勤列表
const attendanceList = computed(() => {
  let filtered = records.value

  // 按状态筛选
  if (queryForm.status !== null) {
    filtered = filtered.filter(r => r.status === queryForm.status)
  }

  // 按学生姓名或学号搜索
  if (queryForm.student_name && queryForm.student_name.trim()) {
    const search = queryForm.student_name.trim().toLowerCase()
    filtered = filtered.filter(r => {
      const name = (r.student_name || '').toLowerCase()
      const idNumber = (r.student_id_number || '').toLowerCase()
      return name.includes(search) || idNumber.includes(search)
    })
  }

  return filtered
})

const getStatusName = status => {
  const statusMap = {
    1: '出勤',
    2: '缺勤',
    3: '迟到',
    4: '请假'
  }
  return statusMap[status] || '未知'
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

const getAttendanceIndex = record => {
  // 根据session_id计算这是第几次考勤
  const sessionIndex = sessions.value.findIndex(s => s.session_id === record.session_id)
  return sessionIndex >= 0 ? sessionIndex + 1 : 1
}

const handleQuery = async () => {
  if (!queryForm.class_id || queryForm.class_id.trim() === '') {
    errors.class_id = '班级ID不能为空'
    return
  }
  delete errors.class_id

  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', currentPage.value.toString())
    params.append('pageSize', pageSize.value.toString())

    const response = await fetch(
      `http://127.0.0.1:8081/teacher/classes/${queryForm.class_id}/attendance?${params.toString()}`,
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
      sessions.value = result.data.rows || []
      totalSessions.value = result.data.total || 0

      // 加载所有任务的考勤记录
      const firstSession = sessions.value[0]
      if (firstSession) {
        selectedSessionId.value = firstSession.session_id
        await loadAllRecords()
      } else {
        records.value = []
        selectedSessionId.value = null
      }
    } else {
      throw new Error(result.msg || '查询失败')
    }
  } catch (error) {
    console.error('查询考勤任务失败:', error)
    alert(error instanceof Error ? error.message : '查询失败，请稍后重试')
    sessions.value = []
    records.value = []
    selectedSessionId.value = null
  } finally {
    loading.value = false
  }
}

const loadAllRecords = async () => {
  const allRecords = []

  for (const session of sessions.value) {
    try {
      const params = new URLSearchParams()
      if (queryForm.status !== null) {
        params.append('status', queryForm.status.toString())
      }

      const url = `http://127.0.0.1:8081/teacher/attendance/${session.session_id}/records${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.code === 1 && result.data) {
          allRecords.push(...result.data)
        }
      }
    } catch (error) {
      console.error(`加载任务 ${session.session_id} 的记录失败:`, error)
    }
  }

  records.value = allRecords
}

const changePage = page => {
  if (page < 1) return
  currentPage.value = page
  handleQuery()
}

const handleReset = () => {
  queryForm.class_id = ''
  queryForm.status = null
  queryForm.student_name = ''
  sessions.value = []
  records.value = []
  selectedSessionId.value = null
  currentPage.value = 1
  totalSessions.value = 0
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

const handleModify = record => {
  router.push({
    path: '/teaching/attendance/modify',
    query: {
      recordId: record.record_id.toString(),
      studentId: record.student_id.toString(),
      status: record.status.toString(),
      remarks: record.remarks || ''
    }
  })
}
</script>

<style scoped>
.attendance-detail {
  padding: 24px;
  max-width: 1400px;
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
.attendance-list-card,
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header__content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.input {
  inline-size: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
}

.input:focus {
  border-color: #2A5CAA;
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.1);
}

.input--error {
  border-color: #ff4d4f;
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

.button--secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
}

.button--outline {
  background: #fff;
  color: #2A5CAA;
  border: 1px solid #2A5CAA;
}

.button--small {
  padding: 4px 10px;
  font-size: 12px;
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
  min-width: 200px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-block-end: 8px;
}

.form-label.required::after {
  content: ' *';
  color: #ff4d4f;
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

.session-info-text {
  font-size: 14px;
  color: #666;
  margin-inline-start: 16px;
}

.attendance-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.attendance-item {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  transition: all 0.3s;
}

.attendance-item:hover {
  border-color: #2A5CAA;
  box-shadow: 0 2px 8px rgba(42, 92, 170, 0.1);
}

.attendance-main {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-block-end: 8px;
}

.student-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.student-id {
  font-size: 14px;
  color: #666;
}

.attendance-count {
  font-size: 14px;
  color: #999;
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-1 {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-2 {
  background: #fff2e8;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.status-3 {
  background: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.status-4 {
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.attendance-time,
.attendance-remarks {
  font-size: 12px;
  color: #999;
  margin-block-start: 4px;
}

.attendance-actions {
  margin-block-start: 12px;
  padding-block-start: 12px;
  border-block-start: 1px solid #f0f0f0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-block-start: 1px solid #e8e8e8;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #2A5CAA;
  color: #2A5CAA;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.empty-state {
  padding: 48px;
  text-align: center;
  color: #999;
  font-size: 16px;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .form-actions-inline {
    width: 100%;
  }

  .form-actions-inline .button {
    flex: 1;
  }

  .attendance-main {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
