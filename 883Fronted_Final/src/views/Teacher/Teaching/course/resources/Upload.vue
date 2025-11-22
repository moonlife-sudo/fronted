<!-- src/views/teaching/resources/Upload.vue -->
<template>
  <div class="resources-upload">
    <div class="page-header">
      <h1>上传课程资源</h1>
      <p class="page-description">上传课程相关的公告、文件等资源</p>
    </div>

    <section class="card form-card">
      <form @submit.prevent="handleSubmit" class="upload-form">
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
          <label for="file" class="form-label required">选择文件</label>
          <input
            id="file"
            type="file"
            @change="handleFileChange"
            class="file-input"
          />
          <div v-if="selectedFile" class="file-info">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
          </div>
          <div v-if="errors.file" class="form-error">{{ errors.file }}</div>
        </div>

        <div class="form-group">
          <label for="description" class="form-label">资源描述</label>
          <textarea
            id="description"
            v-model="formData.description"
            class="form-textarea"
            placeholder="请输入资源描述（可选）"
            rows="4"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="button button--secondary" @click="handleReset">重置</button>
          <button type="submit" class="button" :disabled="loading">
            <span v-if="loading">上传中...</span>
            <span v-else>上传</span>
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

defineOptions({
  name: 'ResourcesUpload'
})

const formData = reactive({
  class_id: '',
  description: null
})

const errors = reactive({})
const loading = ref(false)
const selectedFile = ref(null)

onMounted(() => {
  const classId = sessionStorage.getItem('selectedClassId')
  if (classId) {
    formData.class_id = classId
  }
})

const handleFileChange = event => {
  const target = event.target
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    delete errors.file
  }
}

const formatFileSize = size => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

const validateForm = () => {
  let isValid = true

  if (!formData.class_id || formData.class_id.trim() === '') {
    errors.class_id = '班级ID不能为空'
    isValid = false
  } else {
    delete errors.class_id
  }

  if (!selectedFile.value) {
    errors.file = '请选择要上传的文件'
    isValid = false
  } else {
    delete errors.file
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const formDataToSend = new FormData()
    formDataToSend.append('file', selectedFile.value)
    if (formData.description && formData.description.trim()) {
      formDataToSend.append('description', formData.description.trim())
    }

    const response = await fetch(
      `http://127.0.0.1:8081/classes/${formData.class_id}/resources/upload`,
      {
        method: 'POST',
        body: formDataToSend
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.msg || `请求失败: ${response.status}`)
    }

    const result = await response.json()

    if (result.code === 1) {
      alert('上传成功！')
      handleReset()
    } else {
      throw new Error(result.msg || '上传失败')
    }
  } catch (error) {
    console.error('上传资源失败:', error)
    alert(error instanceof Error ? error.message : '上传失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  formData.description = null
  selectedFile.value = null
  const fileInput = document.getElementById('file')
  if (fileInput) {
    fileInput.value = ''
  }
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}
</script>

<style scoped>
.resources-upload {
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

.upload-form {
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

.file-input {
  inline-size: 100%;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.file-info {
  margin-block-start: 8px;
  font-size: 14px;
  color: #666;
}

.file-name {
  font-weight: 500;
}

.file-size {
  color: #999;
  margin-inline-start: 8px;
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
