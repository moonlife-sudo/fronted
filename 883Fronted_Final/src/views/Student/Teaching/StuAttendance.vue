<template>
  <div class="page-container">
    <div class="content-header">
      <div class="header-left">
        <h2 class="page-title">课程考勤</h2>
        <div class="course-badge">
          当前课程：{{ currentCourseName }}
        </div>
      </div>
      <div class="header-actions">
        <button class="back-btn" @click="goBackToCourses">返回课程列表</button>
      </div>
    </div>

    <div class="layout-grid">
      <div class="action-section">
        <div class="card check-in-card">
          <div class="card-header">
            <h3>📝 实时签到</h3>
            <span v-if="hasActiveSession" class="status-badge active">进行中</span>
            <span v-else class="status-badge">暂无任务</span>
          </div>

          <div class="card-body">
            <div v-if="loading" class="state-text">正在获取签到任务...</div>

            <div v-else-if="!hasActiveSession" class="empty-session">
              <div class="icon-circle">💤</div>
              <p>当前没有正在进行的考勤</p>
              <p class="sub-text">请留意老师通知</p>
            </div>

            <div v-else class="active-session-content">
              <div class="timer-display" :class="{ expired: countdown <= 0 }">
                <div class="timer-label">{{ countdown > 0 ? '剩余时间' : '已截止' }}</div>
                <div class="timer-value">{{ formatCountdown(countdown) }}</div>
              </div>

              <div class="session-details">
                <div class="detail-row">
                  <span>类型</span>
                  <span>{{ getSessionTypeText(activeSession?.session_type) }}</span>
                </div>
                <div class="detail-row">
                  <span>时间</span>
                  <span>{{ formatTime(activeSession?.start_time) }} - {{ formatTime(activeSession?.end_time) }}</span>
                </div>
              </div>

              <div v-if="!hasCheckedIn" class="action-area">
                <button v-if="[2, 3].includes(activeSession?.session_type)" type="button" class="tool-btn"
                  @click="getLocation" :class="{ 'success': locationGot }">
                  <i class="icon">📍</i> {{ locationGot ? '定位已获取' : '获取定位' }}
                </button>

                <button class="primary-btn block-btn" @click="submitCheckIn" :disabled="submitting || countdown <= 0">
                  {{ submitting ? '正在提交...' : '立即签到' }}
                </button>
              </div>

              <div v-else class="success-feedback">
                <i class="icon-success">✅</i>
                <p>您已成功签到</p>
                <span class="time-stamp">{{ formatTime(checkInResult?.check_in_time) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="history-section">
        <div class="card">
          <div class="card-header">
            <h3>📊 考勤记录</h3>
          </div>
          <div class="table-container">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>日期</th>
                  <th>时间</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in attendanceRecords" :key="record.session_id">
                  <td>{{ formatDate(record.session_start_time) }}</td>
                  <td>{{ record.my_check_in_time ? formatTime(record.my_check_in_time) : '--:--' }}</td>
                  <td>
                    <span :class="['status-tag', getStatusClass(record.my_status)]">
                      {{ getStatusText(record.my_status) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="attendanceRecords.length === 0">
                  <td colspan="3" class="text-center">暂无记录</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'StuAttendance',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    // 优先从 Query 取，取不到从 LocalStorage 取
    const classId = computed(() => route.query.classId || localStorage.getItem('currentClassId'))
    
    // 获取课程名称：优先从路由参数，然后从本地存储
    const currentCourseName = computed(() => {
      return route.query.courseName || localStorage.getItem('currentCourseName') || '未知课程'
    })
    
    const locationGot = ref(false)

    // 演示数据
    const hasActiveSession = ref(true)
    const loading = ref(false)
    const countdown = ref(300)
    const submitting = ref(false)
    const hasCheckedIn = ref(false)
    const activeSession = ref({ session_type: 1, start_time: new Date(), end_time: new Date() })
    const checkInResult = ref(null)
    const attendanceRecords = ref([
      { session_id: 1, session_start_time: new Date(), my_check_in_time: new Date(), my_status: 1 },
      { session_id: 2, session_start_time: new Date(), my_check_in_time: null, my_status: 2 },
    ])

    // 返回课程列表
    const goBackToCourses = () => {
      router.push({ path: '/student/teachinghome' })
    }

    // 组件挂载时，如果没有课程信息，尝试从本地存储获取
    onMounted(() => {
      if (!route.query.courseName && localStorage.getItem('currentCourseName')) {
        // 如果路由参数没有课程名，但本地存储有，可以在这里处理
        console.log('从本地存储加载课程信息:', localStorage.getItem('currentCourseName'))
      }
    })

    const formatCountdown = (s) => {
      const m = Math.floor(s / 60).toString().padStart(2, '0')
      const sec = (s % 60).toString().padStart(2, '0')
      return `${m}:${sec}`
    }

    const getSessionTypeText = (t) => {
      const types = ['未知', '人脸', '定位', '混合']
      return types[t] || '普通'
    }

    const formatTime = (d) => {
      if (!d) return '--:--'
      return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const formatDate = (d) => {
      if (!d) return '--'
      return new Date(d).toLocaleDateString()
    }

    const getStatusText = (s) => {
      const status = ['未知', '出勤', '缺勤', '迟到', '请假']
      return status[s] || '未知'
    }

    const getStatusClass = (s) => {
      const classes = ['unknown', 'present', 'absent', 'late', 'leave']
      return classes[s] || 'unknown'
    }

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('位置获取成功:', position)
            locationGot.value = true
          },
          (error) => {
            console.error('位置获取失败:', error)
            alert('位置获取失败，请检查定位权限')
          }
        )
      } else {
        alert('浏览器不支持地理位置功能')
      }
    }

    const submitCheckIn = () => {
      submitting.value = true
      setTimeout(() => {
        submitting.value = false
        hasCheckedIn.value = true
        checkInResult.value = { check_in_time: new Date() }
      }, 1000)
    }

    return {
      classId,
      currentCourseName,
      locationGot,
      hasActiveSession,
      loading,
      countdown,
      submitting,
      hasCheckedIn,
      activeSession,
      checkInResult,
      attendanceRecords,
      goBackToCourses,
      formatCountdown,
      getSessionTypeText,
      formatTime,
      formatDate,
      getStatusText,
      getStatusClass,
      getLocation,
      submitCheckIn
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 20px;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 24px;
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
}

.course-badge {
  background: #e6f7ff;
  color: #1890ff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
}

.header-actions {
  flex-shrink: 0;
}

.back-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.back-btn:hover {
  background: #f5f5f5;
}

.layout-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 900px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

/* Card Styles */
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #eee;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.card-body {
  padding: 24px;
}

/* Active Session Styles */
.timer-display {
  text-align: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.timer-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-color, #2A5CAA);
  font-family: monospace;
}

.timer-display.expired .timer-value {
  color: #999;
}

.session-details {
  margin-bottom: 24px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
  color: #666;
  font-size: 14px;
}

.empty-session {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.icon-circle {
  font-size: 40px;
  margin-bottom: 16px;
  background: #f5f5f5;
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 50%;
  margin: 0 auto 16px;
}

/* Buttons */
.primary-btn {
  background: var(--primary-color, #2A5CAA);
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.primary-btn:hover {
  opacity: 0.9;
}

.primary-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.block-btn {
  width: 100%;
  display: block;
}

.tool-btn {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
}

.tool-btn.success {
  border-color: #52c41a;
  color: #52c41a;
  background: #f6ffed;
}

/* Table Styles */
.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table th {
  text-align: start;
  padding: 12px 16px;
  background: #f8f9fa;
  color: #666;
  font-weight: 500;
  font-size: 13px;
}

.custom-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
  font-size: 14px;
}

.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.present {
  color: #52c41a;
  background: #f6ffed;
}

.status-tag.absent {
  color: #ff4d4f;
  background: #fff1f0;
}

.status-tag.late {
  color: #faad14;
  background: #fffbe6;
}

.status-tag.leave {
  color: #1890ff;
  background: #e6f7ff;
}

.success-feedback {
  text-align: center;
  color: #52c41a;
}

.icon-success {
  font-size: 48px;
  display: block;
  margin-bottom: 8px;
}

.text-center {
  text-align: center;
}

.state-text {
  text-align: center;
  color: #666;
  padding: 20px;
}

.sub-text {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: #f0f0f0;
  color: #666;
}

.status-badge.active {
  background: #e6f7ff;
  color: #1890ff;
}

.time-stamp {
  font-size: 12px;
  color: #999;
}
</style>