<template>
  <div class="leave-apply">
    <div class="card form-card">
      <h3>📅 Fill Leave Application</h3>
      <div class="form-group">
        <label>Course</label>
        <input type="text" :value="courseName" readonly class="course-input">
      </div>
      <div class="form-group">
        <label>Leave Type</label>
        <select v-model="form.type">
          <option value="sick">Sick Leave</option>
          <option value="personal">Personal Leave</option>
        </select>
      </div>
      <div class="form-group">
        <label>Time Range</label>
        <div class="date-row">
          <div class="datetime-container">
            <el-date-picker
              v-model="form.start"
              type="datetime"
              placeholder="YYYY-MM-DD HH:MM"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DDTHH:mm"
              language="en"
              class="datetime-picker"
            ></el-date-picker>
          </div>
          <span class="to-text">to</span>
          <div class="datetime-container">
            <el-date-picker
              v-model="form.end"
              type="datetime"
              placeholder="YYYY-MM-DD HH:MM"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DDTHH:mm"
              language="en"
              class="datetime-picker"
            ></el-date-picker>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Leave Reason</label>
        <textarea v-model="form.reason" rows="4" placeholder="Please explain the leave reason in detail..."></textarea>
      </div>
      <button class="submit-btn" @click="submit" :disabled="submitting">
        {{ submitting ? 'Submitting...' : 'Submit Application' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const submitting = ref(false)
const courseName = ref('')
const form = reactive({ type: 'sick', start: '', end: '', reason: '' })
onMounted(() => {
  courseName.value = localStorage.getItem('currentCourseName') || 'Modern Cryptography'
})

const submit = async () => {
  if (!form.reason) {
    alert('Please fill in the leave reason')
    return
  }
  
  if (!form.start || !form.end) {
    alert('Please select leave time')
    return
  }
  
  if (new Date(form.start) >= new Date(form.end)) {
    alert('End time must be later than start time')
    return
  }
  
  try {
    submitting.value = true
    
    // 通过Vuex提交请假申请
    await store.dispatch('submitLeaveApplication', {
      type: form.type,
      start: form.start,
      end: form.end,
      reason: form.reason,
      courseName: courseName.value
    })
    
    alert('Leave application submitted, waiting for teacher approval')
    
    // Navigate to records page
    router.push('records')
    
  } catch (error) {
    console.error('Failed to submit leave application:', error)
    alert('Submission failed, please try again later')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.leave-apply { padding: 24px; max-width: 800px; margin: 0 auto; }
.card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }
 h3 { margin-top: 0; margin-bottom: 24px; color: #333; }
.form-group { margin-bottom: 20px; }
label { display: block; margin-bottom: 8px; font-weight: 500; color: #666; }
select, textarea, .course-input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
.date-row { display: flex; gap: 0; align-items: center; width: 100%; }
.datetime-container {
    position: relative;
    flex: 1;
    margin: 0;
}

.datetime-picker {
  width: 100%;
  margin: 0;
  padding: 0;
}

:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-input) {
  width: 100%;
}
.course-input { background:#f5f5f5; color:#666; }
.to-text {
  margin: 0 3px;
  color: #666;
}
.submit-btn { background: #2A5CAA; color: white; border: none; padding: 12px 30px; border-radius: 4px; cursor: pointer; font-size: 16px; width: 100%; margin-top: 10px; }
.submit-btn:hover { opacity: 0.9; }
</style>