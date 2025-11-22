<!-- src/views/teaching/homework/Publish.vue -->
<template>
  <div class="homework-publish">
    <div class="page-header">
      <h1>发布作业</h1>
      <p class="page-description">为班级发布新的作业任务</p>
    </div>

    <section class="card form-card">
      <form @submit.prevent="handleSubmit" class="homework-form">
        <div class="form-group">
          <label for="class_id" class="form-label required">班级ID</label>
          <input
            id="class_id"
            v-model="formData.class_id"
            type="text"
            placeholder="请输入班级ID"
            class="input"
            :class="{ 'input--error': errors.class_id }"
          />
          <p v-if="errors.class_id" class="form-error">{{ errors.class_id }}</p>
        </div>

        <div class="form-group">
          <label for="title" class="form-label required">作业标题</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            placeholder="请输入作业标题"
            class="input"
            :class="{ 'input--error': errors.title }"
          />
          <p v-if="errors.title" class="form-error">{{ errors.title }}</p>
        </div>

        <div class="form-group">
          <label for="description" class="form-label">作业描述</label>
          <textarea
            id="description"
            v-model="formData.description"
            class="form-textarea"
            placeholder="请输入作业详细描述（可选）"
            rows="6"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="due_date" class="form-label required">截止日期</label>
          <input
            id="due_date"
            v-model="formData.due_date"
            type="datetime-local"
            class="input"
            :class="{ 'input--error': errors.due_date }"
          />
          <p v-if="errors.due_date" class="form-error">{{ errors.due_date }}</p>
        </div>

        <div class="form-group">
          <label for="allow_late_submission" class="form-label required">是否允许迟交</label>
          <select
            id="allow_late_submission"
            v-model.number="formData.allow_late_submission"
            class="form-select"
            :class="{ 'form-select--error': errors.allow_late_submission }"
          >
            <option :value="0">不允许</option>
            <option :value="1">允许</option>
          </select>
          <div v-if="errors.allow_late_submission" class="form-error">{{ errors.allow_late_submission }}</div>
        </div>

        <div class="form-actions">
          <button type="button" class="button button--secondary" @click="handleReset">重置</button>
          <button type="submit" class="button" :disabled="loading">
            <span v-if="loading">发布中...</span>
            <span v-else>发布作业</span>
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

defineOptions({
  name: 'HomeworkPublish'
})

const formData = reactive({
  class_id: '',
  title: '',
  description: null,
  due_date: '',
  allow_late_submission: 0
})

const errors = reactive({})
const loading = ref(false)

onMounted(() => {
  // 从sessionStorage获取班级ID
  const classId = sessionStorage.getItem('selectedClassId')
  if (classId) {
    formData.class_id = classId
  }
})

const validateForm = () => {
  let isValid = true

  if (!formData.class_id || formData.class_id.trim() === '') {
    errors.class_id = '班级ID不能为空'
    isValid = false
  } else {
    delete errors.class_id
  }

  if (!formData.title || formData.title.trim() === '') {
    errors.title = '作业标题不能为空'
    isValid = false
  } else {
    delete errors.title
  }

  if (!formData.due_date) {
    errors.due_date = '截止日期不能为空'
    isValid = false
  } else {
    delete errors.due_date
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // 转换日期格式为ISO格式
    const dueDate = new Date(formData.due_date).toISOString()

    const requestBody = {
      title: formData.title.trim(),
      due_date: dueDate,
      allow_late_submission: formData.allow_late_submission
    }
    if (formData.description && formData.description.trim()) {
      requestBody.description = formData.description.trim()
    }

    const response = await fetch(
      `http://127.0.0.1:8081/teacher/classes/${formData.class_id}/homeworks`,
      {
        method: 'POST',
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
      alert('作业发布成功！')
      handleReset()
    } else {
      throw new Error(result.msg || '作业发布失败')
    }
  } catch (error) {
    console.error('发布作业失败:', error)
    alert(error instanceof Error ? error.message : '发布作业失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  formData.title = ''
  formData.description = null
  formData.due_date = ''
  formData.allow_late_submission = 0
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}
</script>

<style scoped>
.homework-publish {
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

.homework-form {
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

.form-label.required::after {
  content: ' *';
  color: #ff4d4f;
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

.form-select--error {
  border-color: #ff4d4f;
}

.form-error {
  color: #ff4d4f;
  font-size: 12px;
  margin-block-start: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-block-start: 32px;
  padding-block-start: 24px;
  border-block-start: 1px solid #e8e8e8;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .button {
    inline-size: 100%;
  }
}
</style>
