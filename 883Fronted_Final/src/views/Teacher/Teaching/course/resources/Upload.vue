<template>
  <div class="resources-upload">
    <div class="page-header">
      <h1>上传课程资源</h1>
      <p class="page-description">上传课程相关的公告、文件等资源</p>
    </div>

    <section class="card form-card">
      <form @submit.prevent="handleSubmit" class="upload-form">
        <!-- 文件上传 -->
        <div class="form-group">
          <label class="form-label required">选择文件</label>
          <div class="file-upload">
            <input id="file" type="file" @change="handleFileChange" class="file-input-hidden" />
            <button type="button" class="file-select-button" @click="triggerFileSelect">
              {{ selectedFile ? '重新选择文件' : '选择文件' }}
            </button>
            <div v-if="selectedFile" class="file-info">
              <span class="file-name">{{ selectedFile.name }}</span>
              <span class="file-size">（{{ formatFileSize(selectedFile.size) }}）</span>
            </div>
            <p v-if="errors.file" class="form-error">{{ errors.file }}</p>
          </div>
        </div>

        <!-- 资源描述 -->
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

        <!-- 操作按钮 -->
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
import { ref, reactive } from 'vue'

defineOptions({
  name: 'ResourcesUpload'
})

const formData = reactive({
  description: null
})

const errors = reactive({})
const loading = ref(false)
const selectedFile = ref(null)

// 触发文件选择框
const triggerFileSelect = () => {
  const input = document.getElementById('file')
  if (input) input.click()
}

// 文件选择
const handleFileChange = e => {
  const file = e.target.files?.[0]
  if (file) {
    selectedFile.value = file
    delete errors.file
  }
}

// 格式化文件大小
const formatFileSize = size => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

// 校验
const validateForm = () => {
  let isValid = true
  if (!selectedFile.value) {
    errors.file = '请选择要上传的文件'
    isValid = false
  } else {
    delete errors.file
  }
  return isValid
}

// 提交
const handleSubmit = async () => {
  if (!validateForm()) return
  loading.value = true

  try {
    const formDataToSend = new FormData()
    formDataToSend.append('file', selectedFile.value)
    if (formData.description?.trim()) {
      formDataToSend.append('description', formData.description.trim())
    }

    // 假设当前课程 ID 从 sessionStorage 获取
    const courseId = sessionStorage.getItem('currentCourseId')
    const response = await fetch(
        `http://127.0.0.1:8081/courses/${courseId}/resources/upload`,
        { method: 'POST', body: formDataToSend }
    )

    const result = await response.json()
    if (result.code === 1) {
      alert('上传成功！')
      handleReset()
    } else {
      throw new Error(result.msg || '上传失败')
    }
  } catch (error) {
    console.error('上传失败:', error)
    alert(error.message || '上传失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 重置
const handleReset = () => {
  formData.description = null
  selectedFile.value = null
  const fileInput = document.getElementById('file')
  if (fileInput) fileInput.value = ''
  Object.keys(errors).forEach(k => delete errors[k])
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
}

.page-description {
  color: #666;
  font-size: 14px;
}

.card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

/* 表单样式 */
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

/* 文件上传区域 */
.file-upload {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.file-input-hidden {
  display: none;
}

.file-select-button {
  background: linear-gradient(135deg, #2A5CAA 0%, #1e40af 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(42, 92, 170, 0.25);
}
.file-select-button:hover {
  background: linear-gradient(135deg, #1e40af 0%, #1939b7 100%);
  transform: translateY(-1px);
}

.file-info {
  font-size: 14px;
  color: #333;
  background: #f6f9ff;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #d0e3ff;
}
.file-name {
  font-weight: 500;
}
.file-size {
  color: #777;
  margin-inline-start: 8px;
}

/* 描述输入框 */
.form-textarea {
  inline-size: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  transition: all 0.3s ease;
}
.form-textarea:focus {
  border-color: #2A5CAA;
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.1);
}

/* 错误提示 */
.form-error {
  color: #ff4d4f;
  font-size: 12px;
  margin-block-start: 4px;
}

/* 操作按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-block-start: 32px;
  padding-block-start: 24px;
  border-block-start: 1px solid #e8e8e8;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 22px;
  border-radius: 6px;
  border: none;
  background: linear-gradient(135deg, #2A5CAA 0%, #1e40af 100%);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.button:hover:not(:disabled) {
  background: linear-gradient(135deg, #1e40af 0%, #1939b7 100%);
  box-shadow: 0 4px 12px rgba(42, 92, 170, 0.3);
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

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column-reverse;
  }
  .form-actions .button {
    inline-size: 100%;
  }
}
</style>
