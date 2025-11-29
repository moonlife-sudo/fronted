<template>
  <div class="grades-detail">
    <div class="page-header">
      <h1>成绩册详情</h1>
      <p>当前课程：{{ courseName }} (ID: {{ classId }})</p>
    </div>

    <section class="card gradebook-card">
      <header class="card-header">
        <h3>全班成绩总览</h3>
        <div class="header-actions">
          <button class="btn btn-primary" @click="$router.push('input')">录入成绩</button>
          <button class="btn btn-outline" @click="$router.push('composition')">设置权重</button>
        </div>
      </header>

      <div v-if="loading" class="loading-state">正在加载数据...</div>

      <div v-if="!loading && gradebook" class="gradebook-content">
        <div class="students-table-wrapper">
          <table class="students-table">
            <thead>
            <tr>
              <th>学号</th>
              <th>姓名</th>
              <th v-for="component in gradebook.components" :key="component.component_id">
                {{ component.component_name }}<br>
                <span class="weight-text">({{ (component.weight * 100).toFixed(0) }}%)</span>
              </th>
              <th>总成绩</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="student in gradebook.students" :key="student.student_id">
              <td>{{ student.student_id_number || student.student_id }}</td>
              <td>{{ student.full_name }}</td>
              <td v-for="component in gradebook.components" :key="component.component_id">
                  <span v-if="getStudentScore(student, component.component_id) !== null">
                    {{ getStudentScore(student, component.component_id) }}
                  </span>
                <span v-else class="text-muted">-</span>
              </td>
              <td>
                  <span v-if="student.final_score !== null" class="final-score">
                    {{ student.final_score.toFixed(2) }}
                  </span>
                <span v-else class="text-muted">-</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else-if="!loading" class="empty-state">暂无成绩数据</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseName = ref('')
const classId = ref('')
const loading = ref(false)
const gradebook = ref(null)

const mockGradebook = {
  components: [
    { component_id: 1, component_name: '平时作业', weight: 0.4, max_score: 100 },
    { component_id: 2, component_name: '期中测试', weight: 0.3, max_score: 100 },
    { component_id: 3, component_name: '期末项目', weight: 0.3, max_score: 100 },
  ],
  students: [
    { student_id: 1001, full_name: '张三', student_id_number: '2023001',
      scores: { 1: 90, 2: 85, 3: 92 }, final_score: 88.6 },
    { student_id: 1002, full_name: '李四', student_id_number: '2023002',
      scores: { 1: 75, 2: 80, 3: 85 }, final_score: 80.0 },
    { student_id: 1003, full_name: '王五', student_id_number: '2023003',
      scores: { 1: 95, 2: 90, 3: null }, final_score: null }, // 缺少期末成绩
    { student_id: 1004, full_name: '赵六', student_id_number: '2023004',
      scores: { 1: 60, 2: 55, 3: 60 }, final_score: 58.5 }, // 不及格
  ],
};

onMounted(() => {
  courseName.value = sessionStorage.getItem('selectedCourseName') || 'Modern Cryptography'
  classId.value = sessionStorage.getItem('selectedClassId') || '1'
  loadGradebook()
})

const loadGradebook = async () => {
  loading.value = true
  const url = `http://127.0.0.1:8081/teacher/classes/${classId.value}/gradebook`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'token': localStorage.getItem('token') }
    })
    const result = await response.json();

    if (result.code === 1 && result.data) {
      gradebook.value = result.data; // 成功：使用真数据
    } else {
      gradebook.value = mockGradebook; // 失败：使用假数据
    }
  } catch (error) {
    gradebook.value = mockGradebook; // 网络错误：使用假数据
  } finally {
    loading.value = false;
  }
}

const getStudentScore = (student, componentId) => {
  // scores 中的 key 可能是 String，确保匹配
  return student.scores[componentId.toString()] ?? null
}
</script>

<style scoped>
/* 移除查询区域样式 */
.page-header { margin-bottom: 24px; }
.page-header h1 { font-size: 24px; font-weight: 600; color: #333; margin: 0 0 8px 0; }
.page-header p { color: #666; font-size: 14px; margin: 0; }

.gradebook-card { margin-top: 24px; background: #fff; border-radius: 8px; box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05); }

.card-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px; border-bottom: 1px solid #f0f0f0;
}
.card-header h3 { margin: 0; font-size: 18px; font-weight: 600; color: #333; }
.header-actions { display: flex; gap: 10px; }

.btn { padding: 8px 16px; border-radius: 4px; cursor: pointer; border: none; font-size: 14px; }
.btn-primary { background: #2A5CAA; color: white; }
.btn-outline { background: white; border: 1px solid #ddd; color: #333; }

.gradebook-content { padding: 16px; }
.students-table-wrapper { overflow-x: auto; }
.students-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.students-table th, .students-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e8e8e8; }
.students-table th { background: #fafafa; font-weight: 600; color: #333; }
.weight-text { font-size: 12px; font-weight: normal; color: #999; }
.final-score { font-weight: 600; color: #2A5CAA; }
.text-muted { color: #999; }

.loading-state, .empty-state { padding: 48px; text-align: center; color: #999; font-size: 16px; }
</style>