<template>
  <div class="homework-detail-page">
      <div class="header-actions">
        <button class="back-btn" @click="goBackToCourses">返回课程列表</button>
      </div>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="detail" class="content">

      <div class="section-card">
        <h1 class="hw-title">{{ detail.homework.title }}</h1>
        <div class="hw-meta">
          <span>📅 截止：{{ formatTime(detail.homework.due_date) }}</span>
          <span v-if="isOverdue" class="tag-overdue">已截止</span>
        </div>
        <div class="hw-desc">
          <p>{{ detail.homework.description }}</p>
        </div>
      </div>

      <div v-if="detail.my_submission" class="section-card submission-info">
        <h3>我的提交</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>提交时间</label>
            <span>{{ formatTime(detail.my_submission.submitted_at) }}</span>
          </div>
          <div class="info-item">
            <label>分数</label>
            <span class="score">{{ detail.my_submission.grade ?? '待批改' }}</span>
          </div>
        </div>

        <div class="submitted-content">
          <p><strong>文本内容：</strong>{{ detail.my_submission.content }}</p>
          <div v-if="detail.my_submission.files?.length" class="file-list">
            <div v-for="file in detail.my_submission.files" :key="file.file_id" class="file-item">
              📄 <a :href="file.file_url" target="_blank">{{ file.file_name }}</a>
            </div>
          </div>
        </div>

        <div v-if="detail.my_submission.teacher_feedback" class="feedback-box">
          <strong>👨‍🏫 教师评语：</strong>
          <p>{{ detail.my_submission.teacher_feedback }}</p>
        </div>
      </div>

      <div v-if="!detail.my_submission || (!isOverdue && !detail.my_submission.grade)" class="section-card form-card">
        <h3>{{ detail.my_submission ? '重新提交' : '提交作业' }}</h3>

        <div class="form-group">
          <label>文本内容</label>
          <textarea v-model="submitForm.content" rows="6" placeholder="在此输入作业内容..."></textarea>
        </div>

        <div class="form-group">
          <label>附件上传</label>
          <div class="upload-box">
            <input type="file" @change="handleFileUpload" :disabled="uploading">
            <span v-if="uploading">上传中...</span>
          </div>
          <div class="uploaded-files">
            <div v-for="(url, index) in submitForm.file_urls" :key="index" class="file-tag">
              📎 附件 {{ index + 1 }}
              <span class="remove" @click="removeFile(index)">×</span>
            </div>
          </div>
        </div>

        <button class="submit-btn" @click="submitHomework" :disabled="submitting || uploading">
          {{ submitting ? '提交中...' : '确认提交' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'StuHomework_Detail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const homeworkId = route.query.homeworkId

    const detail = ref(null)
    const loading = ref(false)
    const uploading = ref(false)
    const submitting = ref(false)

    const goBackToCourses = () => {
      router.push({ path: '/student/teachinghome' })
    }
    // 提交表单数据
    const submitForm = ref({
      content: '',
      file_urls: []
    })

    // 计算是否已截止
    const isOverdue = computed(() => {
      if (!detail.value) return false
      return new Date() > new Date(detail.value.homework.due_date)
    })

    onMounted(() => {
      fetchDetail()
    })

    // 获取详情
    const fetchDetail = async () => {
      loading.value = true
      try {
        const res = await fetch(`http://127.0.0.1:8081/student/homeworks/${homeworkId}`)
        const result = await res.json()
        if (result.code === 1) {
          detail.value = result.data
          // 如果已有提交，回显内容到表单方便修改（可选）
          if (detail.value?.my_submission) {
            submitForm.value.content = detail.value.my_submission.content
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    }

    // 文件上传
    const handleFileUpload = async (event) => {
      const input = event.target
      if (!input.files?.length) return

      const file = input.files[0]
      const formData = new FormData()
      formData.append('file', file)

      uploading.value = true
      try {
        const res = await fetch('http://127.0.0.1:8081/upload', {
          method: 'POST',
          body: formData
        })
        const result = await res.json()
        if (result.code === 1 && result.data) {
          // 返回的是URL字符串
          submitForm.value.file_urls.push(result.data)
        } else {
          alert('上传失败')
        }
      } catch (e) {
        alert('上传出错')
      } finally {
        uploading.value = false
        input.value = '' // 清空input
      }
    }

    const removeFile = (index) => {
      submitForm.value.file_urls.splice(index, 1)
    }

    // 提交作业
    const submitHomework = async () => {
      if (!submitForm.value.content && submitForm.value.file_urls.length === 0) {
        alert('请填写内容或上传附件')
        return
      }

      submitting.value = true
      try {
        const res = await fetch(`http://127.0.0.1:8081/student/homeworks/${homeworkId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitForm.value)
        })
        const result = await res.json()
        if (result.code === 1) {
          alert('提交成功！')
          fetchDetail() // 刷新详情
        } else {
          alert('提交失败：' + result.msg)
        }
      } catch (e) {
        console.error(e)
        alert('网络错误')
      } finally {
        submitting.value = false
      }
    }

    const formatTime = (t) => new Date(t).toLocaleString()

    return {
      router,
      homeworkId,
      detail,
      loading,
      uploading,
      submitting,
      submitForm,
      isOverdue,
      goBackToCourses,
      fetchDetail,
      handleFileUpload,
      removeFile,
      submitHomework,
      formatTime
    }
  }
}
</script>

<style scoped>
.homework-detail-page {
  padding: 20px;
  max-inline-size: 800px;
  margin: 0 auto;
}

.header {
  margin-block-end: 20px;
}

.back-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
}

.section-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-block-end: 20px;
}

.hw-title {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #333;
}

.hw-meta {
  color: #666;
  font-size: 14px;
  display: flex;
  gap: 10px;
  align-items: center;
  margin-block-end: 15px;
  border-block-end: 1px solid #eee;
  padding-block-end: 15px;
}

.tag-overdue {
  background: #fff1f0;
  color: #f5222d;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.hw-desc {
  line-height: 1.6;
  color: #444;
}

.submission-info h3 {
  margin-block-start: 0;
  border-block-end: 1px solid #eee;
  padding-block-end: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-block-end: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-size: 12px;
  color: #999;
}

.score {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.feedback-box {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  margin-block-start: 15px;
}

.form-group {
  margin-block-end: 20px;
}

.form-group label {
  display: block;
  margin-block-end: 8px;
  font-weight: 500;
}

textarea {
  inline-size: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.submit-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:disabled {
  background: #ccc;
}

.file-tag {
  display: inline-block;
  background: #f0f5ff;
  padding: 4px 8px;
  border-radius: 4px;
  margin-inline-end: 8px;
  font-size: 12px;
  color: #1890ff;
}

.remove {
  cursor: pointer;
  margin-inline-start: 4px;
  color: #999;
}

.file-item {
  margin-block-start: 5px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #999;
}

.upload-box {
  margin-block-end: 10px;
}

.uploaded-files {
  margin-block-start: 10px;
}
</style>