<template>
  <div class="homework-detail">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">← Back</button>
      <h1>{{ homework.title }}</h1>
    </div>

    <div class="content-grid">
      <!-- 左侧：作业要求 -->
      <div class="card left">
        <h3>Homework Requirements</h3>
        <div class="desc">{{ homework.description }}</div>
        <div class="attachments">
          <div class="file" v-for="f in homework.files" :key="f">
            📄 {{ f }} <a href="#">Download</a>
          </div>
        </div>
        <div class="meta">
          <p>Due Date: {{ homework.deadline }}</p>
          <p>Weight: {{ homework.weight }}%</p>
        </div>
      </div>

      <!-- 右侧：提交区域 -->
      <div class="card right">
        <h3>My Submission</h3>

        <div v-if="!submitted" class="submit-area">
          <textarea placeholder="Please enter homework remarks..." rows="5" v-model="remark"></textarea>

          <!-- Upload area -->
          <div class="upload-box" @click="triggerFileSelect">
            <i class="bi bi-cloud-upload"></i>
            <div v-if="!file">Click to upload homework file</div>
            <div v-else class="uploaded-file">
              ✅ Selected: {{ file.name }}
            </div>
            <input type="file" ref="fileInput" style="display:none" @change="handleFileSelect" />
          </div>

          <button class="btn-submit" @click="submit" :disabled="submitting || !file">
            {{ submitting ? 'Uploading...' : 'Submit Homework' }}
          </button>
        </div>

        <div v-else class="result-area">
          <div class="success-icon"><i class="bi bi-check-circle"></i></div>
          <h3>Submitted</h3>
          <p>Submission Time: {{ submitTime }}</p>
          <p>Submitted File: {{ file?.name }}</p>
          <p v-if="remark">Remarks: {{ remark }}</p>
          <button class="btn-outline" @click="redoSubmit">Resubmit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const submitting = ref(false)
const submitted = ref(false)
const submitTime = ref('')
const file = ref(null)
const remark = ref('')

const fileInput = ref(null)

const homework = reactive({
  title: 'Lab 3: Cryptographic Algorithm Implementation',
  description:
    'Please implement RSA algorithm using Java or Python. Requirements:\n1. Implement KeyGen, Encrypt, Decrypt three functions.\n2. Be able to handle large integers.\n3. Submit source code and experimental report in PDF format.',
  deadline: '2025-12-31 23:59',
  weight: 20,
  files: ['Lab3-Guide.pdf', 'TestCases.zip']
})

// Trigger file selection
const triggerFileSelect = () => {
  fileInput.value.click()
}

// Handle file selection
const handleFileSelect = (event) => {
  const selectedFile = event.target.files[0]
  if (selectedFile) {
    file.value = selectedFile
  }
}

// Simulate submission
const submit = () => {
  if (!file.value) return alert('Please select a file first!')

  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    submitted.value = true
    submitTime.value = new Date().toLocaleString()
  }, 1500)
}

// 重新提交
const redoSubmit = () => {
  submitted.value = false
  file.value = null
  remark.value = ''
}
</script>

<style scoped>
.homework-detail {
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-block-end: 20px;
}

.back-btn {
  background: none;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.desc {
  line-height: 1.6;
  margin-block-end: 20px;
  white-space: pre-wrap;
}

.attachments {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 6px;
  margin-block-end: 20px;
}

.file {
  margin-block-end: 5px;
  font-size: 14px;
}

.meta {
  color: #666;
  font-size: 13px;
  border-block-start: 1px solid #eee;
  padding-block-start: 10px;
}

/* 上传框样式 */
.upload-box {
  border: 2px dashed #ddd;
  padding: 30px;
  text-align: center;
  border-radius: 8px;
  margin: 15px 0;
  color: #999;
  cursor: pointer;
  transition: 0.2s;
}

.upload-box:hover {
  border-color: #2a5caa;
  color: #2a5caa;
}

.uploaded-file {
  color: #333;
  font-weight: 500;
}

/* 按钮与结果样式 */
textarea {
  inline-size: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.btn-submit {
  inline-size: 100%;
  background: #2a5caa;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-submit:hover {
  background: #1e4b8b;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-area {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 48px;
  color: #52c41a;
}

.btn-outline {
  background: white;
  border: 1px solid #ddd;
  padding: 8px 20px;
  border-radius: 4px;
  margin-block-start: 10px;
  cursor: pointer;
}
</style>
