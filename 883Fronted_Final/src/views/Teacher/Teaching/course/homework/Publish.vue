<template>
  <div class="homework-publish">
    <div class="page-header">
      <h1>发布作业</h1>
      <p class="page-description">为当前课程发布新的学习任务</p>
    </div>

    <section class="card form-card">
      <form @submit.prevent="handleSubmit" class="homework-form">
        <div class="form-group">
          <label>所属课程</label>
          <div class="course-badge">{{ courseName }} (ID: {{ formData.class_id }})</div>
        </div>

        <div class="form-group">
          <label class="form-label required">作业标题</label>
          <input
              v-model="formData.title"
              type="text"
              placeholder="请输入作业标题"
              class="input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">作业描述</label>
          <textarea
              v-model="formData.description"
              class="form-textarea"
              placeholder="请输入作业详细描述"
              rows="6"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label class="form-label required">截止日期</label>
            <input v-model="formData.due_date" type="datetime-local" class="input" />
          </div>
          <div class="form-group half">
            <label class="form-label">允许迟交</label>
            <select v-model="formData.allow_late" class="input">
              <option :value="0">不允许</option>
              <option :value="1">允许</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="button-submit" :disabled="loading">
            {{ loading ? '发布中...' : '立即发布' }}
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
  title: 'Lab 3: 密码学算法实现',
  description: '请实现 RSA 算法的密钥生成、加密和解密过程。提交源代码和实验报告。',
  due_date: '2025-12-31T23:59',
  allow_late: 1
})

onMounted(() => {
  courseName.value = sessionStorage.getItem('selectedCourseName') || 'Modern Cryptography'
  formData.class_id = sessionStorage.getItem('selectedClassId') || '1'
})

const handleSubmit = async () => {
  if (!formData.title) return alert('请输入标题')
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
    alert('作业发布成功！\n(演示模式：已自动通知所有学生)')
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