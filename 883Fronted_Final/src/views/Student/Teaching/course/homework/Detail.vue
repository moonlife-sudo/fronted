<template>
  <div class="homework-detail">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <h1>{{ homework.title }}</h1>
    </div>

    <div class="content-grid">
      <div class="card left">
        <h3>作业要求</h3>
        <div class="desc">{{ homework.description }}</div>
        <div class="attachments">
          <div class="file" v-for="f in homework.files" :key="f">
            📄 {{ f }} <a href="#">下载</a>
          </div>
        </div>
        <div class="meta">
          <p>截止时间：{{ homework.deadline }}</p>
          <p>分数占比：{{ homework.weight }}%</p>
        </div>
      </div>

      <div class="card right">
        <h3>我的提交</h3>
        <div v-if="!submitted" class="submit-area">
          <textarea placeholder="请输入作业备注..." rows="5"></textarea>
          <div class="upload-box">
            <i class="bi bi-cloud-upload"></i> 点击上传作业文件
          </div>
          <button class="btn-submit" @click="submit" :disabled="submitting">
            {{ submitting ? '上传中...' : '提交作业' }}
          </button>
        </div>
        <div v-else class="result-area">
          <div class="success-icon"><i class="bi bi-check-circle"></i></div>
          <h3>已提交</h3>
          <p>提交时间：{{ submitTime }}</p>
          <button class="btn-outline" @click="submitted = false">重新提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const submitting = ref(false)
const submitted = ref(false)
const submitTime = ref('')

const homework = reactive({
  title: 'Lab 3: 密码学算法实现',
  description: '请使用 Java 或 Python 实现 RSA 算法。要求：\n1. 实现 KeyGen, Encrypt, Decrypt 三个函数。\n2. 能够处理大整数。\n3. 提交源代码和 PDF 格式的实验报告。',
  deadline: '2025-12-31 23:59',
  weight: 20,
  files: ['Lab3-Guide.pdf', 'TestCases.zip']
})

const submit = () => {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    submitted.value = true
    submitTime.value = new Date().toLocaleString()
  }, 1000)
}
</script>

<style scoped>
.homework-detail { padding: 24px; }
.page-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
.back-btn { background: none; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
.content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
.card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

.desc { line-height: 1.6; margin-bottom: 20px; white-space: pre-wrap; }
.attachments { background: #f9f9f9; padding: 10px; border-radius: 6px; margin-bottom: 20px; }
.file { margin-bottom: 5px; font-size: 14px; }
.meta { color: #666; font-size: 13px; border-top: 1px solid #eee; padding-top: 10px; }

.upload-box { border: 2px dashed #ddd; padding: 30px; text-align: center; border-radius: 8px; margin: 15px 0; color: #999; cursor: pointer; }
.upload-box:hover { border-color: #2A5CAA; color: #2A5CAA; }
textarea { width: 100%; border: 1px solid #ddd; border-radius: 4px; padding: 10px; }

.btn-submit { width: 100%; background: #2A5CAA; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; }
.btn-submit:hover { background: #1e4b8b; }

.result-area { text-align: center; padding: 20px 0; }
.success-icon { font-size: 48px; color: #52c41a; }
.btn-outline { background: white; border: 1px solid #ddd; padding: 8px 20px; border-radius: 4px; margin-top: 10px; cursor: pointer; }
</style>