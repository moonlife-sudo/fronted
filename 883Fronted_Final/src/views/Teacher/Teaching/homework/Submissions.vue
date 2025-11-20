<!-- src/views/teaching/homework/Submissions.vue -->
<template>
  <div class="homework-submissions">
    <div class="page-header">
      <h1>查看作业提交情况</h1>
      <p class="page-description">查看学生作业提交情况，支持导出数据</p>
    </div>

    <!-- 筛选区域 -->
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
              class="input"
            />
          </div>
          <div class="form-group">
            <label for="homework_id" class="form-label required">作业ID</label>
            <input
              id="homework_id"
              v-model="queryForm.homework_id"
              type="text"
              placeholder="请输入作业ID"
              class="input"
            />
          </div>
          <div class="form-group">
            <label for="status_filter" class="form-label">状态筛选</label>
            <select id="status_filter" v-model.number="queryForm.status" class="form-select">
              <option :value="null">全部</option>
              <option :value="1">准时</option>
              <option :value="2">迟交</option>
              <option :value="3">未提交</option>
            </select>
          </div>
          <div class="form-actions-inline">
            <button type="button" class="button" @click="loadSubmissions" :disabled="loading">
              <span v-if="loading">查询中...</span>
              <span v-else>查询</span>
            </button>
            <button
              type="button"
              class="button button--outline"
              @click="exportData"
              :disabled="submissions.length === 0"
            >
              导出
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 提交列表 -->
    <section v-if="submissions.length > 0" class="card submissions-card">
      <header class="card-header">
        <h3>提交情况列表</h3>
        <span class="total-info">共 {{ totalSubmissions }} 条记录</span>
      </header>
      <div class="submissions-table-wrapper">
        <table class="submissions-table">
          <thead>
            <tr>
              <th>提交ID</th>
              <th>学生姓名</th>
              <th>提交时间</th>
              <th>状态</th>
              <th>得分</th>
              <th>评语</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="submission in submissions" :key="submission.submission_id">
              <td>{{ submission.submission_id }}</td>
              <td>{{ submission.student_name }}</td>
              <td>{{ formatTime(submission.submitted_at) }}</td>
              <td>
                <span :class="['status-badge', `status-${submission.status}`]">
                  {{ getStatusName(submission.status) }}
                </span>
              </td>
              <td>
                <span v-if="submission.grade !== null">{{ submission.grade }}</span>
                <span v-else class="text-muted">-</span>
              </td>
              <td>
                <span v-if="submission.teacher_feedback" class="feedback-text">
                  {{ submission.teacher_feedback }}
                </span>
                <span v-else class="text-muted">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="totalSubmissions > 0" class="pagination">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>
        <span class="page-info">第 {{ currentPage }} 页，共 {{ Math.ceil(totalSubmissions / pageSize) }} 页</span>
        <button
          class="page-btn"
          :disabled="currentPage >= Math.ceil(totalSubmissions / pageSize)"
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </section>

    <!-- 空状态 -->
    <section v-if="!loading && submissions.length === 0 && queryForm.class_id && queryForm.homework_id" class="card empty-card">
      <div class="empty-state">
        <p>暂无提交记录</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

defineOptions({
  name: 'HomeworkSubmissions'
})

const queryForm = reactive({
  class_id: '',
  homework_id: '',
  status: null
})

const loading = ref(false)
const submissions = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalSubmissions = ref(0)

onMounted(() => {
  const classId = sessionStorage.getItem('selectedClassId')
  if (classId) {
    queryForm.class_id = classId
  }
})

const getStatusName = status => {
  const statusMap = {
    1: '准时',
    2: '迟交',
    3: '未提交'
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

const loadSubmissions = async () => {
  if (!queryForm.class_id || !queryForm.homework_id) {
    alert('请填写班级ID和作业ID')
    return
  }

  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', currentPage.value.toString())
    params.append('pageSize', pageSize.value.toString())
    if (queryForm.status !== null) {
      params.append('status', queryForm.status.toString())
    }

    const response = await fetch(
      `http://127.0.0.1:8081/teacher/homeworks/${queryForm.homework_id}/submissions?${params.toString()}`,
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
      submissions.value = result.data.rows || []
      totalSubmissions.value = result.data.total || 0
    } else {
      throw new Error(result.msg || '查询失败')
    }
  } catch (error) {
    console.error('查询作业提交失败:', error)
    alert(error instanceof Error ? error.message : '查询失败，请稍后重试')
    submissions.value = []
    totalSubmissions.value = 0
  } finally {
    loading.value = false
  }
}

const changePage = page => {
  if (page < 1) return
  currentPage.value = page
  loadSubmissions()
}

const exportData = () => {
  // 导出为CSV格式
  const headers = ['提交ID', '学生姓名', '提交时间', '状态', '得分', '评语']
  const rows = submissions.value.map(s => [
    s.submission_id.toString(),
    s.student_name,
    formatTime(s.submitted_at),
    getStatusName(s.status),
    s.grade !== null ? s.grade.toString() : '-',
    s.teacher_feedback || '-'
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `作业提交情况_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.homework-submissions {
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
.submissions-card,
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

.total-info {
  font-size: 14px;
  color: #666;
  margin-inline-start: 16px;
}

.submissions-table-wrapper {
  overflow-x: auto;
  padding: 16px;
}

.submissions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.submissions-table th,
.submissions-table td {
  padding: 12px;
  text-align: left;
  border-block-end: 1px solid #e8e8e8;
}

.submissions-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}

.submissions-table tbody tr:hover {
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

.text-muted {
  color: #999;
}

.feedback-text {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
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
</style>
