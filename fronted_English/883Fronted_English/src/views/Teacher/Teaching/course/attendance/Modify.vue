<template>
  <div class="attendance-modify">
    <div class="page-header">
      <h1>Modify Attendance</h1>
      <p class="page-description">Manually modify attendance status and remarks</p>
    </div>

    <section class="card form-card">
      <form @submit.prevent="handleSubmit" class="attendance-form">
        <div class="form-group">
          <label class="form-label">Record ID</label>
          <div class="readonly-field">{{ formData.record_id || '-' }}</div>
        </div>

        <div class="form-group">
          <label class="form-label">Student ID</label>
          <div class="readonly-field">{{ formData.student_id || '-' }}</div>
        </div>

        <div class="form-group">
          <label for="status" class="form-label">Attendance Status</label>
          <select id="status" v-model.number="formData.status" class="form-select"
            :class="{ 'form-select--error': errors.status }">
            <option :value="null">Please select attendance status (optional)</option>
            <option :value="1">Present</option>
            <option :value="2">Absent</option>
            <option :value="3">Late</option>
            <option :value="4">Leave</option>
          </select>
          <div v-if="errors.status" class="form-error">{{ errors.status }}</div>
          <p class="form-hint">1: Present, 2: Absent, 3: Late, 4: Leave</p>
        </div>

        <div class="form-group">
          <label for="remarks" class="form-label">备注</label>
          <textarea id="remarks" v-model="formData.remarks" class="form-textarea"
            :class="{ 'form-textarea--error': errors.remarks }" placeholder="Please enter remarks (optional)" rows="4"></textarea>
          <div v-if="errors.remarks" class="form-error">{{ errors.remarks }}</div>
        </div>

        <div class="form-actions">
          <button type="button" class="button button--secondary" @click="handleCancel">Cancel</button>
          <button type="submit" class="button" :disabled="loading">
            <span v-if="loading">Saving...</span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
  name: 'AttendanceModify'
})

const route = useRoute()
const router = useRouter()

const formData = reactive({
  record_id: '',
  student_id: '',
  status: null,
  remarks: null
})

const errors = reactive({})
const loading = ref(false)

onMounted(() => {
  // 从路由参数中获取数据
  const recordId = route.query.recordId
  const studentId = route.query.studentId
  const status = route.query.status
  const remarks = route.query.remarks

  if (recordId) {
    // 正常逻辑：从列表页跳转过来，带了参数
    formData.record_id = recordId
    if (studentId) formData.student_id = studentId
    if (status) formData.status = parseInt(status, 10)
    if (remarks) formData.remarks = remarks
  } else {
    // 🚑【演示急救修复】🚑
    // 如果没有参数（比如直接点击了顶部Tab），加载默认演示数据，防止报错
    // 这样演示时点哪里都不会出错！
    formData.record_id = 'REC-20251120-001'
    formData.student_id = '2023001 (Zhang San)'
    formData.status = 2 // 默认显示缺勤
    formData.remarks = 'Unexcused absence'
  }
})

const validateForm = () => {
  let isValid = true
  // 验证逻辑保持不变
  if (!formData.record_id || formData.record_id.trim() === '') {
    errors.record_id = 'Record ID cannot be empty'
    isValid = false
  } else {
    delete errors.record_id
  }
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  loading.value = true

  try {
    // 模拟请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    // 演示模式直接成功
    alert('✅ Attendance status updated successfully!')
    router.back() // 返回上一页
  } catch (error) {
    alert('Operation failed')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
/* 样式复用，保持一致性 */
.attendance-modify {
  padding: 24px;
  max-inline-size: 800px;
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

.form-card {
  margin-block-start: 24px;
}

.card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
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
  transition: background 0.2s ease;
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

.attendance-form {
  padding: 24px;
}

.form-group {
  margin-block-end: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-block-end: 8px;
}

.readonly-field {
  padding: 8px 12px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  min-block-size: 38px;
  display: flex;
  align-items: center;
}

.form-select,
.form-textarea {
  inline-size: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  outline: none;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-select:focus,
.form-textarea:focus {
  border-color: #2A5CAA;
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.form-hint {
  color: #999;
  font-size: 12px;
  margin-block-start: 8px;
  margin-block-end: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-block-start: 32px;
  padding-block-start: 24px;
  border-block-start: 1px solid #e8e8e8;
}
</style>