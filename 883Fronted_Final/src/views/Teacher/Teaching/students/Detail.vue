<!-- src/views/teaching/students/Detail.vue -->
<template>
  <div class="students-detail">
    <div v-if="!selectedStudent" class="students-list-view">
      <div class="page-header">
        <h1>学生详情</h1>
        <p class="page-description">查看班级所有学生的信息</p>
      </div>

      <!-- 筛选和搜索区域 -->
      <section class="card filter-card">
        <div class="filter-form">
          <div class="form-row">
            <div class="form-group">
              <label for="class_id" class="form-label required">班级ID</label>
              <input
                id="class_id"
                v-model="queryForm.class_id"
                type="text"
                placeholder="请输入班级ID"
                class="input"
              />
            </div>
            <div class="form-group">
              <label for="student_search" class="form-label">搜索学生</label>
              <input
                id="student_search"
                v-model="queryForm.student_name"
                type="text"
                placeholder="请输入学生姓名或学号"
                class="input"
              />
            </div>
            <div class="form-actions-inline">
              <button type="button" class="button" @click="loadStudents" :disabled="loading">
                <span v-if="loading">查询中...</span>
                <span v-else>查询</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 学生列表 -->
      <section v-if="students.length > 0" class="card students-card">
        <header class="card-header">
          <h3>学生列表</h3>
        </header>
        <div class="students-table-wrapper">
          <table class="students-table">
            <thead>
              <tr>
                <th>学生ID</th>
                <th>姓名</th>
                <th>学号</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.student_id">
                <td>{{ student.student_id }}</td>
                <td>{{ student.full_name }}</td>
                <td>{{ student.student_id_number }}</td>
                <td>
                  <button
                    type="button"
                    class="button button--outline button--small"
                    @click="viewStudentDetail(student)"
                  >
                    查看详情
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 空状态 -->
      <section v-if="!loading && students.length === 0 && queryForm.class_id" class="card empty-card">
        <div class="empty-state">
          <p>暂无学生数据</p>
        </div>
      </section>
    </div>

    <!-- 学生详情视图 -->
    <div v-else class="student-detail-view">
      <div class="detail-header">
        <button type="button" class="button button--text" @click="backToList">← 返回列表</button>
        <h2>{{ selectedStudent.full_name }} 的详细信息</h2>
      </div>

      <section class="card student-info-card">
        <header class="card-header">
          <h3>基本信息</h3>
        </header>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">学生ID：</span>
            <span class="info-value">{{ selectedStudent.student_id }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">姓名：</span>
            <span class="info-value">{{ selectedStudent.full_name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">学号：</span>
            <span class="info-value">{{ selectedStudent.student_id_number }}</span>
          </div>
        </div>
      </section>

      <!-- 作业提交情况 -->
      <section class="card homework-card">
        <header class="card-header">
          <h3>作业提交情况</h3>
        </header>
        <div v-if="homeworkData.length > 0" class="homework-list">
          <div
            v-for="hw in homeworkData"
            :key="hw.homework_id"
            class="homework-item"
          >
            <div class="homework-title">{{ hw.title }}</div>
            <div class="homework-meta">
              <span>提交时间：{{ formatTime(hw.submitted_at) }}</span>
              <span>得分：{{ hw.grade !== null ? hw.grade : '-' }}</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-section">
          <p>暂无作业提交记录</p>
        </div>
      </section>

      <!-- 考勤记录 -->
      <section class="card attendance-card">
        <header class="card-header">
          <h3>考勤记录</h3>
        </header>
        <div v-if="attendanceData.length > 0" class="attendance-list">
          <div
            v-for="att in attendanceData"
            :key="att.record_id"
            class="attendance-item"
          >
            <div class="attendance-main">
              <span>第{{ att.session_index }}次</span>
              <span :class="['status-badge', `status-${att.status}`]">
                {{ getStatusName(att.status) }}
              </span>
            </div>
            <div class="attendance-time">签到时间：{{ formatTime(att.check_in_time) }}</div>
          </div>
        </div>
        <div v-else class="empty-section">
          <p>暂无考勤记录</p>
        </div>
      </section>

      <!-- 成绩信息 -->
      <section class="card grades-card">
        <header class="card-header">
          <h3>成绩信息</h3>
        </header>
        <div v-if="gradesData" class="grades-content">
          <div v-if="gradesData.components && gradesData.components.length > 0" class="grades-list">
            <div
              v-for="comp in gradesData.components"
              :key="comp.component_name"
              class="grade-item"
            >
              <span class="grade-name">{{ comp.component_name }}</span>
              <span class="grade-score">{{ comp.my_score !== null ? comp.my_score : '-' }}</span>
            </div>
          </div>
          <div v-if="gradesData.final_score !== null" class="final-grade">
            <span class="final-label">总成绩：</span>
            <span class="final-value">{{ gradesData.final_score.toFixed(2) }}</span>
          </div>
        </div>
        <div v-else class="empty-section">
          <p>暂无成绩数据</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

defineOptions({
  name: 'StudentsDetail'
})

const queryForm = reactive({
  class_id: '',
  student_name: ''
})

const loading = ref(false)
const students = ref([])
const selectedStudent = ref(null)
const homeworkData = ref([])
const attendanceData = ref([])
const gradesData = ref(null)

onMounted(() => {
  const classId = sessionStorage.getItem('selectedClassId')
  if (classId) {
    queryForm.class_id = classId
  }
})

const loadStudents = async () => {
  if (!queryForm.class_id) {
    alert('请填写班级ID')
    return
  }

  loading.value = true
  try {
    // 从成绩册接口获取学生列表
    const response = await fetch(
      `http://127.0.0.1:8081/teacher/classes/${queryForm.class_id}/gradebook`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.msg || `请求失败: ${response.status}`)
    }

    const result = await response.json()

    if (result.code === 1 && result.data && result.data.students) {
      let filtered = result.data.students

      // 按学生姓名或学号搜索
      if (queryForm.student_name && queryForm.student_name.trim()) {
        const search = queryForm.student_name.trim().toLowerCase()
        filtered = filtered.filter(s => {
          const name = (s.full_name || '').toLowerCase()
          const idNumber = (s.student_id_number || '').toLowerCase()
          return name.includes(search) || idNumber.includes(search)
        })
      }

      students.value = filtered
    } else {
      throw new Error(result.msg || '查询失败')
    }
  } catch (error) {
    console.error('查询学生列表失败:', error)
    alert(error instanceof Error ? error.message : '查询失败，请稍后重试')
    students.value = []
  } finally {
    loading.value = false
  }
}

const viewStudentDetail = async student => {
  selectedStudent.value = student
  await loadStudentData(student.student_id)
}

const loadStudentData = async studentId => {
  // 加载作业数据（需要从作业提交接口获取）
  // 加载考勤数据（需要从考勤记录接口获取）
  // 加载成绩数据
  try {
    // 这里需要根据实际接口实现
    // 暂时使用空数据
    homeworkData.value = []
    attendanceData.value = []
    gradesData.value = null
  } catch (error) {
    console.error('加载学生数据失败:', error)
  }
}

const backToList = () => {
  selectedStudent.value = null
  homeworkData.value = []
  attendanceData.value = []
  gradesData.value = null
}

const getStatusName = status => {
  const statusMap = {
    1: '出勤',
    2: '缺勤',
    3: '迟到',
    4: '请假'
  }
  return statusMap[status] || '未知'
}

const formatTime = time => {
  if (!time) return '-'
  try {
    const date = new Date(time)
    return date.toLocaleString('zh-CN')
  } catch {
    return time
  }
}
</script>

<style scoped>
.students-detail {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-block-end: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-description {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.filter-card,
.students-card,
.empty-card {
  margin-block-start: 24px;
}

.card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.input {
  inline-size: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
}

.input:focus {
  border-color: #2A5CAA;
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.1);
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background: #2A5CAA;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.button:hover:not(:disabled) {
  background: #214a88;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button--outline {
  background: #fff;
  color: #2A5CAA;
  border: 1px solid #2A5CAA;
}

.button--small {
  padding: 4px 10px;
  font-size: 12px;
}

.button--text {
  background: none;
  color: #2A5CAA;
  border: none;
  padding: 0;
}

.filter-form {
  padding: 24px;
}

.form-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 200px;
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

.form-actions-inline {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.students-table-wrapper {
  overflow-x: auto;
  padding: 16px;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.students-table th,
.students-table td {
  padding: 12px;
  text-align: left;
  border-block-end: 1px solid #e8e8e8;
}

.students-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}

.students-table tbody tr:hover {
  background: #f5f7fa;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-block-end: 24px;
}

.detail-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.student-info-card,
.homework-card,
.attendance-card,
.grades-card {
  margin-block-start: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: 500;
  color: #666;
  margin-inline-end: 8px;
}

.info-value {
  color: #333;
}

.homework-list,
.attendance-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.homework-item,
.attendance-item {
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: #fff;
}

.homework-title {
  font-weight: 500;
  color: #333;
  margin-block-end: 8px;
}

.homework-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

.attendance-main {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-block-end: 4px;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-1 {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-2 {
  background: #fff2e8;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.status-3 {
  background: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.status-4 {
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.attendance-time {
  font-size: 12px;
  color: #999;
}

.grades-content {
  padding: 16px;
}

.grades-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-block-end: 16px;
}

.grade-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-block-end: 1px solid #f0f0f0;
}

.grade-name {
  color: #666;
}

.grade-score {
  font-weight: 500;
  color: #333;
}

.final-grade {
  padding-block-start: 16px;
  border-block-start: 2px solid #e8e8e8;
  display: flex;
  align-items: center;
  gap: 8px;
}

.final-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.final-value {
  font-size: 20px;
  font-weight: 600;
  color: #2A5CAA;
}

.empty-section {
  padding: 24px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.empty-state {
  padding: 48px;
  text-align: center;
  color: #999;
  font-size: 16px;
}
</style>
