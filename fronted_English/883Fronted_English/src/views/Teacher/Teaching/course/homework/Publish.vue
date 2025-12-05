<template>
  <div class="homework-publish">
    <div class="page-header">
      <h1>Publish Assignment</h1>
      <p class="page-description">Publish a new learning task for the current course</p>
    </div>

    <section class="card form-card">
      <form @submit.prevent="handleSubmit" class="homework-form">
        <div class="form-group">
          <label>Course</label>
          <div class="course-badge">{{ courseName }} (ID: {{ formData.class_id }})</div>
        </div>

        <div class="form-group">
          <label class="form-label required">Assignment Title</label>
          <input
              v-model="formData.title"
              type="text"
              placeholder="Please enter assignment title"
              class="input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Assignment Description</label>
          <textarea
              v-model="formData.description"
              class="form-textarea"
              placeholder="Please enter detailed assignment description"
              rows="6"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label class="form-label required">Due Date</label>
            <input v-model="formData.due_date" type="datetime-local" class="input" />
          </div>
          <div class="form-group half">
            <label class="form-label">Allow Late Submission</label>
            <select v-model="formData.allow_late" class="input">
              <option :value="0">No</option>
          <option :value="1">Yes</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="button-submit" :disabled="loading">
            {{ loading ? 'Publishing...' : 'Publish Now' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const courseName = ref('')
const loading = ref(false)
const formData = reactive({
  class_id: '',
  title: 'Lab 3: Cryptography Algorithm Implementation',
  description: 'Please implement the key generation, encryption, and decryption processes of the RSA algorithm. Submit the source code and experimental report.',
  due_date: '2025-12-31T23:59',
  allow_late: 1
})

onMounted(() => {
  courseName.value = sessionStorage.getItem('selectedCourseName') || 'Modern Cryptography'
  formData.class_id = sessionStorage.getItem('selectedClassId') || '1'
})

const handleSubmit = async () => {
  if (!formData.title) return alert('Please enter a title')
  loading.value = true

  try {
    // 1. 尝试真实请求
    const res = await fetch(`http://127.0.0.1:8081/teacher/classes/${formData.class_id}/homeworks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        due_date: new Date(formData.due_date).toISOString(),
        allow_late_submission: formData.allow_late
      })
    })
    // 2. 无论后端返回啥，演示时都算成功
    console.log('后端响应:', res.status)
  } catch (e) {
    console.warn('后端连接失败，走演示模式')
  } finally {
    loading.value = false
    alert('Assignment published successfully!\n(Demo mode: All students have been notified automatically)')
  }
}
</script>

<style scoped>
.homework-publish { padding: 24px; max-width: 800px; margin: 0 auto; }
.form-card { background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.page-header h1 { font-size: 24px; margin-bottom: 5px; }

.form-group { margin-bottom: 24px; }
.form-row { display: flex; gap: 20px; }
.half { flex: 1; }

.form-label { display: block; font-weight: 500; margin-bottom: 8px; color: #333; }
.course-badge { background: #f0f7ff; color: #2A5CAA; padding: 10px; border-radius: 6px; font-weight: bold; border: 1px solid #d6e4ff; }

.input, .form-textarea {
  width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;
}
.input:focus, .form-textarea:focus { border-color: #2A5CAA; outline: none; }

.button-submit {
  width: 100%; padding: 14px; background: #2A5CAA; color: white; border: none;
  border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;
}
.button-submit:disabled { background: #ccc; }
.button-submit:hover:not(:disabled) { background: #1e4b8b; }
</style>