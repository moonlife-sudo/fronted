<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="$router.back()">← 返回列表</button>
      <h2>{{ homework.title }}</h2>
      <span :class="['status-badge', homework.status]">{{ getStatusText(homework.status) }}</span>
    </div>

    <div class="content-grid">
      <div class="card info-card">
        <h3>📝 作业要求</h3>
        <div class="desc">{{ homework.description }}</div>
        <div class="meta-row">
          <div class="meta-item">
            <label>截止时间</label>
            <span>{{ homework.deadline }}</span>
          </div>
          <div class="meta-item">
            <label>允许补交</label>
            <span>{{ homework.allowLate ? '是' : '否' }}</span>
          </div>
        </div>
        <div class="attachments" v-if="homework.files && homework.files.length">
          <h4>附件下载</h4>
          <div v-for="file in homework.files" :key="file.name" class="file-item">
            📄 {{ file.name }} <a href="#">下载</a>
          </div>
        </div>
      </div>

      <div class="card submit-card">
        <h3>📤 我的提交</h3>

        <div v-if="homework.status === 'pending' || homework.status === 'late'" class="submit-form">
          <textarea placeholder="请输入作业内容或备注..." rows="6" v-model="submitContent"></textarea>
          <div class="upload-box">
            <i class="icon">📎</i> 点击上传文件 (模拟)
          </div>
          <button class="btn-primary block" @click="submitHomework" :disabled="submitting">
            {{ submitting ? '提交中...' : '确认提交' }}
          </button>
        </div>

        <div v-else class="submission-info">
          <div class="result-row">
            <span>提交时间：</span>
            <span>{{ homework.submitTime }}</span>
          </div>
          <div class="result-row" v-if="homework.score">
            <span>得分：</span>
            <span class="score">{{ homework.score }}</span>
          </div>
          <div class="feedback-box" v-if="homework.feedback">
            <h4>👨‍🏫 老师评语：</h4>
            <p>{{ homework.feedback }}</p>
          </div>
          <button class="btn-outline block" v-if="!homework.score">修改提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const submitting = ref(false)
const submitContent = ref('')

// 模拟数据 (实际应根据 route.query.id 获取)
const homework = ref({
  id: 1,
  title: '第一章：Vue基础练习',
  status: 'pending', // pending, submitted, graded
  description: '请完成课后习题 1-5，并编写一个简单的计数器组件。请将代码打包上传。',
  deadline: '2023-11-25 23:59',
  allowLate: true,
  files: [{ name: '习题说明.pdf' }],
  submitTime: null,
  score: null,
  feedback: null
})

const getStatusText = (s) => ({ pending: '未提交', submitted: '已提交', graded: '已批改', late: '迟交' }[s])

const submitHomework = () => {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    homework.value.status = 'submitted'
    homework.value.submitTime = new Date().toLocaleString()
    alert('提交成功！')
  }, 1000)
}
</script>

<style scoped>
.page-container {
  padding: 24px;
  max-inline-size: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-block-end: 24px;
}

.back-btn {
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
}

h2 {
  margin: 0;
  flex: 1;
  font-size: 20px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  background: #eee;
}

.status-badge.pending {
  background: #fffbe6;
  color: #faad14;
}

.status-badge.submitted {
  background: #e6f7ff;
  color: #1890ff;
}

.status-badge.graded {
  background: #f6ffed;
  color: #52c41a;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

h3 {
  margin-block-start: 0;
  margin-block-end: 20px;
  font-size: 16px;
  border-block-end: 1px solid #eee;
  padding-block-end: 10px;
}

.meta-row {
  display: flex;
  gap: 30px;
  margin: 20px 0;
  color: #666;
  font-size: 14px;
}

.desc {
  line-height: 1.6;
  color: #333;
}

.file-item {
  background: #f9f9f9;
  padding: 10px;
  margin-block-start: 10px;
  border-radius: 4px;
  font-size: 13px;
}

textarea {
  inline-size: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-block-end: 15px;
  box-sizing: border-box;
}

.upload-box {
  border: 2px dashed #ddd;
  padding: 20px;
  text-align: center;
  color: #999;
  cursor: pointer;
  margin-block-end: 15px;
  border-radius: 4px;
}

.btn-primary {
  background: #2A5CAA;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  inline-size: 100%;
  font-weight: 500;
}

.btn-primary:disabled {
  opacity: 0.7;
}

.btn-outline {
  background: white;
  border: 1px solid #ddd;
  color: #666;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  inline-size: 100%;
  margin-block-start: 10px;
}

.score {
  font-size: 24px;
  color: #2A5CAA;
  font-weight: bold;
}

.feedback-box {
  background: #f0f7ff;
  padding: 15px;
  border-radius: 4px;
  margin: 15px 0;
  font-size: 13px;
  color: #333;
}

.feedback-box h4 {
  margin: 0 0 5px 0;
  color: #2A5CAA;
  border: none;
  padding: 0;
  font-size: 13px;
}
</style>