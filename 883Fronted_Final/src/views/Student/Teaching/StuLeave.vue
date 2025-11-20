<template>
  <div class="leave-page">
    <div class="page-header">
      <h2>请假管理</h2>
      <div class="actions">
        <button v-if="!showForm" class="primary-btn" @click="showForm = true">
          + 新建申请
        </button>
        <button v-else class="back-btn" @click="showForm = false">
          取消
        </button>
      </div>
    </div>

    <div v-if="showForm" class="apply-card">
      <h3>填写请假单</h3>
      <form @submit.prevent="submitApply">
        <div class="form-group">
          <label>请假原因</label>
          <textarea v-model="applyForm.reason" required placeholder="请详细描述请假原因..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>开始时间</label>
            <input type="datetime-local" v-model="applyForm.start_time" required>
          </div>
          <div class="form-group">
            <label>结束时间</label>
            <input type="datetime-local" v-model="applyForm.end_time" required>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="submitting">
            {{ submitting ? '提交中...' : '提交申请' }}
          </button>
        </div>
      </form>
    </div>

    <div v-else class="records-section">
      <div v-if="loading" class="loading">加载记录中...</div>
      <div v-else-if="records.length === 0" class="empty">暂无请假记录</div>

      <div v-else class="records-list">
        <div v-for="record in records" :key="record.request_id" class="record-card">
          <div class="card-header">
            <span class="time-range">
              {{ formatTime(record.start_time) }} 至 {{ formatTime(record.end_time) }}
            </span>
            <span class="status-tag" :class="getStatusClass(record.status)">
              {{ getStatusText(record.status) }}
            </span>
          </div>
          <div class="card-body">
            <p class="reason"><strong>理由：</strong>{{ record.reason }}</p>
            <p class="approver" v-if="record.approver_id">审批人ID: {{ record.approver_id }}</p>
            <p class="remarks" v-if="record.approval_remarks">
              <strong>审批意见：</strong>{{ record.approval_remarks }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'StuLeave',
  setup() {
    const route = useRoute()
    const classId = computed(() => route.query.classId || localStorage.getItem('currentClassId'))

    const showForm = ref(false)
    const loading = ref(false)
    const submitting = ref(false)
    const records = ref([])

    const applyForm = reactive({
      reason: '',
      start_time: '',
      end_time: ''
    })

    onMounted(() => {
      fetchRecords()
    })

    const goBackToCourses = () => {
      router.push({ path: '/student/teachinghome' })
    }
    // 查询申请记录 (接口文档 11.2)
    const fetchRecords = async () => {
      loading.value = true
      try {
        const res = await fetch('http://127.0.0.1:8081/student/leave-requests?page=1&pageSize=20')
        const result = await res.json()
        if (result.code === 1) {
          records.value = result.data.rows || []
        }
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    }

    // 提交申请 (接口文档 11.1)
    const submitApply = async () => {
      if (!classId.value) {
        alert('缺少班级信息，无法提交')
        return
      }
      submitting.value = true
      try {
        const payload = {
          class_id: Number(classId.value),
          reason: applyForm.reason,
          // 转换为 ISO 格式或后端要求的 Timestamp 格式
          start_time: new Date(applyForm.start_time).toISOString(),
          end_time: new Date(applyForm.end_time).toISOString()
        }

        const res = await fetch('http://127.0.0.1:8081/student/leave-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        const result = await res.json()
        if (result.code === 1) {
          alert('申请已提交')
          showForm.value = false
          // 重置表单
          applyForm.reason = ''
          applyForm.start_time = ''
          applyForm.end_time = ''
          fetchRecords() // 刷新列表
        } else {
          alert('提交失败: ' + result.msg)
        }
      } catch (e) {
        alert('提交出错')
      } finally {
        submitting.value = false
      }
    }

    // 辅助函数
    const formatTime = (t) => new Date(t).toLocaleString([], { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    
    const getStatusText = (s) => {
      const statusMap = { 1: '待审批', 2: '已批准', 3: '已驳回' }
      return statusMap[s] || '未知'
    }
    
    const getStatusClass = (s) => {
      const classMap = { 1: 'pending', 2: 'approved', 3: 'rejected' }
      return classMap[s] || ''
    }

    return {
      showForm,
      loading,
      submitting,
      records,
      applyForm,
      classId,
      goBackToCourses,
      fetchRecords,
      submitApply,
      formatTime,
      getStatusText,
      getStatusClass
    }
  }
}
</script>

<style scoped>
.leave-page {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.primary-btn {
  background: #2A5CAA;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.back-btn {
  background: white;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

/* 表单样式 */
.apply-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

textarea,
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

textarea {
  height: 100px;
  resize: vertical;
}

.submit-btn {
  width: 100%;
  background: #2A5CAA;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-actions {
  margin-top: 20px;
}

/* 列表样式 */
.records-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.record-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  background: #f8f9fa;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.card-body {
  padding: 20px;
}

.time-range {
  color: #666;
  font-size: 14px;
}

.reason {
  margin: 0 0 8px 0;
  color: #333;
}

.approver {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.remarks {
  color: #d9534f;
  font-size: 13px;
  margin-top: 10px;
  background: #fff5f5;
  padding: 8px;
  border-radius: 4px;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.status-tag.pending {
  background: #e6f7ff;
  color: #1890ff;
}

.status-tag.approved {
  background: #f6ffed;
  color: #52c41a;
}

.status-tag.rejected {
  background: #fff1f0;
  color: #ff4d4f;
}

.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>