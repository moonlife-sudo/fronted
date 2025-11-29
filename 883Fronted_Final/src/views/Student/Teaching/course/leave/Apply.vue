<template>
  <div class="leave-apply">
    <div class="card form-card">
      <h3>📅 填写请假申请</h3>
      <div class="form-group">
        <label>课程</label>
        <input type="text" :value="courseName" readonly style="background:#f5f5f5; color:#666;">
      </div>
      <div class="form-group">
        <label>请假类型</label>
        <select v-model="form.type">
          <option value="sick">病假</option>
          <option value="personal">事假</option>
        </select>
      </div>
      <div class="form-group">
        <label>时间范围</label>
        <div class="date-row">
          <input type="datetime-local" v-model="form.start"> 至 <input type="datetime-local" v-model="form.end">
        </div>
      </div>
      <div class="form-group">
        <label>请假事由</label>
        <textarea v-model="form.reason" rows="4" placeholder="请详细说明请假原因..."></textarea>
      </div>
      <button class="submit-btn" @click="submit" :disabled="submitting">
        {{ submitting ? '提交中...' : '提交申请' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const submitting = ref(false)
const courseName = ref('')
const form = reactive({ type: 'sick', start: '', end: '', reason: '' })

onMounted(() => {
  courseName.value = localStorage.getItem('currentCourseName') || 'Modern Cryptography'
})

const submit = () => {
  if (!form.reason) return alert('请填写理由')
  submitting.value = true

  // 模拟请求
  setTimeout(() => {
    submitting.value = false
    alert('申请已提交，等待老师审批')
    router.push('records')
  }, 800)
}
</script>

<style scoped>
.leave-apply { padding: 24px; max-width: 800px; margin: 0 auto; }
.card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }
h3 { margin-top: 0; margin-bottom: 24px; color: #333; }
.form-group { margin-bottom: 20px; }
label { display: block; margin-bottom: 8px; font-weight: 500; color: #666; }
select, input, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
.date-row { display: flex; gap: 10px; align-items: center; }
.submit-btn { background: #2A5CAA; color: white; border: none; padding: 12px 30px; border-radius: 4px; cursor: pointer; font-size: 16px; width: 100%; margin-top: 10px; }
.submit-btn:hover { opacity: 0.9; }
</style>