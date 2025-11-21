<template>
  <div class="leave-apply">
    <div class="card form-card">
      <h3>📅 填写请假申请</h3>
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
      <button class="submit-btn" @click="submit">提交申请</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ type: 'sick', start: '', end: '', reason: '' })

const submit = () => {
  if (!form.reason) return alert('请填写理由')
  alert('申请已提交，等待老师审批')
  // 提交成功后跳转到记录页
  // 注意：这里的跳转路径是相对路径，或者需要根据当前路由结构调整
  // 简单起见，我们暂时回退或去记录页
  router.push('records')
}
</script>

<style scoped>
.leave-apply {
  padding: 24px;
  max-inline-size: 800px;
  margin: 0 auto;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

h3 {
  margin-block-start: 0;
  margin-block-end: 24px;
  color: #333;
}

.form-group {
  margin-block-end: 20px;
}

label {
  display: block;
  margin-block-end: 8px;
  font-weight: 500;
  color: #666;
}

select,
input,
textarea {
  inline-size: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.date-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.submit-btn {
  background: #2A5CAA;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:hover {
  opacity: 0.9;
}
</style>