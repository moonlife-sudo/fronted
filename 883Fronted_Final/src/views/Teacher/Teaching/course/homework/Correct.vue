<!-- src/views/teaching/homework/Correct.vue -->
<template>
  <div class="homework-correct">
    <div class="page-header">
      <h1>批改作业</h1>
      <p class="page-description">批改学生提交的作业，支持AI辅助批改</p>
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
          <div class="form-actions-inline">
            <button type="button" class="button" @click="loadSubmissions" :disabled="loading">
              <span v-if="loading">查询中...</span>
              <span v-else>查询</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- AI批改区域 -->
    <section v-if="selectedSubmission" class="card ai-card">
      <header class="card-header">
        <h3>AI辅助批改</h3>
      </header>
      <div class="ai-section">
        <div class="ai-placeholder">
          <p>AI批改功能开发中，敬请期待...</p>
          <p class="ai-hint">未来将支持自动评分、评语生成等功能</p>
        </div>
      </div>
    </section>

    <!-- 提交列表 -->
    <section v-if="submissions.length > 0" class="card submissions-card">
      <header class="card-header">
        <h3>作业提交列表</h3>
      </header>
      <div class="submissions-list">
        <div
          v-for="submission in submissions"
          :key="submission.submission_id"
          class="submission-item"
          :class="{ active: selectedSubmission?.submission_id === submission.submission_id }"
          @click="selectSubmission(submission)"
        >
          <div class="submission-info">
            <span class="student-name">{{ submission.student_name }}</span>
            <span class="submission-time">提交时间：{{ formatTime(submission.submitted_at) }}</span>
            <span :class="['status-badge', `status-${submission.status}`]">
              {{ getStatusName(submission.status) }}
            </span>
            <span v-if="submission.grade !== null" class="grade-badge">
              得分：{{ submission.grade }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 批改表单 -->
    <section v-if="selectedSubmission" class="card grade-card">
      <header class="card-header">
        <div class="card-header__content">
          <h3>批改作业</h3>
          <span class="student-info">学生：{{ selectedSubmission.student_name }}</span>
        </div>
      </header>
      <form @submit.prevent="handleGrade" class="grade-form">
        <div class="form-group">
          <label for="grade" class="form-label required">作业得分</label>
          <input
            id="grade"
            v-model.number="gradeForm.grade"
            type="number"
            placeholder="请输入得分"
            class="input"
            :class="{ 'input--error': errors.grade }"
            min="0"
            step="0.01"
          />
        </div>

        <div class="form-group">
          <label for="teacher_feedback" class="form-label">教师评语</label>
          <textarea
            id="teacher_feedback"
            v-model="gradeForm.teacher_feedback"
            class="form-textarea"
            placeholder="请输入评语（可选）"
            rows="6"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="button" :disabled="grading">
            <span v-if="grading">保存中...</span>
            <span v-else>保存批改</span>
          </button>
        </div>
      </form>
    </section>

    <!-- 空状态 -->
    <section v-if="!loading && submissions.length === 0 && queryForm.class_id && queryForm.homework_id" class="card empty-card">
      <div class="empty-state">
        <p>暂无作业提交</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

defineOptions({
  name: 'HomeworkCorrect'
})

const queryForm = reactive({
  class_id: '',
  homework_id: ''
})

const gradeForm = reactive({
  grade: null,
  teacher_feedback: null
})

const errors = reactive({})
const loading = ref(false)
const grading = ref(false)
const submissions = ref([])
const selectedSubmission = ref(null)

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
    const response = await fetch(
      `http://127.0.0.1:8081/teacher/homeworks/${queryForm.homework_id}/submissions?page=1&pageSize=100`,
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
      if (submissions.value.length > 0) {
        selectSubmission(submissions.value[0])
      }
    } else {
      throw new Error(result.msg || '查询失败')
    }
  } catch (error) {
    console.error('查询作业提交失败:', error)
    alert(error instanceof Error ? error.message : '查询失败，请稍后重试')
    submissions.value = []
  } finally {
    loading.value = false
  }
}

const selectSubmission = submission => {
  selectedSubmission.value = submission
  gradeForm.grade = submission.grade
  gradeForm.teacher_feedback = submission.teacher_feedback
}

const handleGrade = async () => {
  if (!selectedSubmission.value) return

  if (gradeForm.grade === null || gradeForm.grade < 0) {
    errors.grade = '请输入有效的得分'
    return
  }
  delete errors.grade

  grading.value = true

  try {
    const requestBody = {
      grade: gradeForm.grade
    }
    if (gradeForm.teacher_feedback && gradeForm.teacher_feedback.trim()) {
      requestBody.teacher_feedback = gradeForm.teacher_feedback.trim()
    }

    const response = await fetch(
      `http://127.0.0.1:8081/teacher/submissions/${selectedSubmission.value.submission_id}/grade`,
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
      alert('批改成功！')
      // 更新本地数据
      if (selectedSubmission.value) {
        selectedSubmission.value.grade = gradeForm.grade
        selectedSubmission.value.teacher_feedback = gradeForm.teacher_feedback
      }
    } else {
      throw new Error(result.msg || '批改失败')
    }
  } catch (error) {
    console.error('批改作业失败:', error)
    alert(error instanceof Error ? error.message : '批改失败，请稍后重试')
  } finally {
    grading.value = false
  }
}
</script>

<style scoped>
.homework-correct {
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
.ai-card,
.submissions-card,
.grade-card,
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
  border-block-end: 1px solid #f0f0f0;
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
  min-inline-size: 200px;
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

.form-actions-inline {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.ai-section {
  padding: 24px;
}

.ai-placeholder {
  padding: 60px 20px;
  text-align: center;
  background: #f5f7fa;
  border-radius: 8px;
  border: 2px dashed #d9d9d9;
}

.ai-placeholder p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 16px;
}

.ai-hint {
  font-size: 12px;
  color: #999;
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.submission-item {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  background: #fff;
}

.submission-item:hover {
  border-color: #2A5CAA;
  box-shadow: 0 2px 8px rgba(42, 92, 170, 0.1);
}

.submission-item.active {
  border-color: #2A5CAA;
  background: #f0f7ff;
}

.submission-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.student-name {
  font-weight: 600;
  color: #333;
}

.submission-time {
  font-size: 12px;
  color: #999;
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

.grade-badge {
  padding: 2px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.student-info {
  font-size: 14px;
  color: #666;
  margin-inline-start: 16px;
}

.grade-form {
  padding: 24px;
}

.form-textarea {
  inline-size: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  background-color: #fff;
  outline: none;
  transition: all 0.3s;
  resize: vertical;
}

.form-textarea:focus {
  border-color: #2A5CAA;
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-block-start: 24px;
}

.empty-state {
  padding: 48px;
  text-align: center;
  color: #999;
  font-size: 16px;
}
</style>
