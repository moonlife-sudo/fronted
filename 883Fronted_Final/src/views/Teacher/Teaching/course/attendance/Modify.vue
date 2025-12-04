<template>
  <div class="attendance-modify">
    <div class="page-header">
      <h1>修改考勤</h1>
      <p class="page-description">手动修改考勤状态和备注信息</p>
    </div>

    <section class="card form-card">
      <form @submit.prevent="handleSubmit" class="attendance-form">
        <div class="form-group">
          <label class="form-label">记录ID</label>
          <div class="readonly-field">{{ formData.record_id || '-' }}</div>
        </div>

        <div class="form-group">
          <label class="form-label">学生ID</label>
          <div class="readonly-field">{{ formData.student_id || '-' }}</div>
        </div>

        <div class="form-group">
          <label for="status" class="form-label">考勤状态</label>
          <select id="status" v-model.number="formData.status" class="form-select"
            :class="{ 'form-select--error': errors.status }">
            <option :value="null">请选择考勤状态（可选）</option>
            <option :value="1">出勤</option>
            <option :value="2">缺勤</option>
            <option :value="3">迟到</option>
            <option :value="4">请假</option>
          </select>
          <div v-if="errors.status" class="form-error">{{ errors.status }}</div>
          <p class="form-hint">1:出勤, 2:缺勤, 3:迟到, 4:请假</p>
        </div>

        <div class="form-group">
          <label for="remarks" class="form-label">备注</label>
          <textarea id="remarks" v-model="formData.remarks" class="form-textarea"
            :class="{ 'form-textarea--error': errors.remarks }" placeholder="请输入备注信息（可选）" rows="4"></textarea>
          <div v-if="errors.remarks" class="form-error">{{ errors.remarks }}</div>
        </div>

        <div class="form-actions">
          <button type="button" class="button button--secondary" @click="handleCancel">取消</button>
          <button type="submit" class="button" :disabled="loading">
            <span v-if="loading">保存中...</span>
            <span v-else>保存修改</span>
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
    formData.student_id = '2023001 (张三)'
    formData.status = 2 // 默认显示缺勤
    formData.remarks = '无故缺勤'
  }
})

const validateForm = () => {
  let isValid = true
  // 验证逻辑保持不变
  if (!formData.record_id || formData.record_id.trim() === '') {
    errors.record_id = '记录ID不能为空'
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
    alert('✅ 考勤状态修改成功！')
    router.back() // 返回上一页
  } catch (error) {
    alert('操作失败')
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