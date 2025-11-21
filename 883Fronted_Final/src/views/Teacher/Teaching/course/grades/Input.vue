<!-- src/views/teaching/grades/Input.vue -->
<template>
  <div class="grades-input">
    <div class="page-header">
      <h1>录入成绩</h1>
      <p class="page-description">批量录入或修改学生的单项成绩</p>
    </div>

    <!-- 查询区域 -->
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
          <div class="form-actions-inline">
            <button type="button" class="button" @click="loadGradebook" :disabled="loading">
              <span v-if="loading">查询中...</span>
              <span v-else>查询成绩册</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 成绩册 -->
    <section v-if="gradebook" class="card gradebook-card">
      <header class="card-header">
        <h3>成绩册</h3>
        <div class="header-actions">
          <select v-model="selectedComponentId" class="component-select">
            <option :value="null">选择成绩项</option>
            <option
              v-for="component in gradebook.components"
              :key="component.component_id"
              :value="component.component_id"
            >
              {{ component.component_name }}
            </option>
          </select>
        </div>
      </header>

      <div v-if="selectedComponentId" class="gradebook-content">
        <div class="students-table-wrapper">
          <table class="students-table">
            <thead>
              <tr>
                <th>学生ID</th>
                <th>姓名</th>
                <th>学号</th>
                <th>当前得分</th>
                <th>录入成绩</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in gradebook.students" :key="student.student_id">
                <td>{{ student.student_id }}</td>
                <td>{{ student.full_name }}</td>
                <td>{{ student.student_id_number }}</td>
                <td>
                  <span v-if="getStudentScore(student, selectedComponentId) !== null">
                    {{ getStudentScore(student, selectedComponentId) }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td>
                  <input
                    v-model.number="studentScores[student.student_id]"
                    type="number"
                    class="score-input"
                    placeholder="请输入成绩"
                    min="0"
                    step="0.01"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="form-actions">
          <button type="button" class="button" @click="handleSubmit" :disabled="submitting">
            <span v-if="submitting">保存中...</span>
            <span v-else>保存成绩</span>
          </button>
        </div>
      </div>
      <div v-else class="empty-hint">
        <p>请先选择要录入的成绩项</p>
      </div>
    </section>

    <!-- 空状态 -->
    <section v-if="!loading && !gradebook && queryForm.class_id" class="card empty-card">
      <div class="empty-state">
        <p>暂无成绩册数据</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

defineOptions({
  name: 'GradesInput'
})

const queryForm = reactive({
  class_id: ''
})

const loading = ref(false)
const submitting = ref(false)
const gradebook = ref(null)
const selectedComponentId = ref(null)
const studentScores = reactive({})

onMounted(() => {
  const classId = sessionStorage.getItem('selectedClassId')
  if (classId) {
    queryForm.class_id = classId
  }
})

const loadGradebook = async () => {
  if (!queryForm.class_id) {
    alert('请填写班级ID')
    return
  }

  loading.value = true
  try {
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

    if (result.code === 1 && result.data) {
      gradebook.value = result.data
      // 初始化学生成绩
      if (gradebook.value.students) {
        gradebook.value.students.forEach(student => {
          studentScores[student.student_id] = null
        })
      }
    } else {
      throw new Error(result.msg || '查询失败')
    }
  } catch (error) {
    console.error('查询成绩册失败:', error)
    alert(error instanceof Error ? error.message : '查询失败，请稍后重试')
    gradebook.value = null
  } finally {
    loading.value = false
  }
}

const getStudentScore = (student, componentId) => {
  if (!componentId) return null
  return student.scores[componentId.toString()] ?? null
}

const handleSubmit = async () => {
  if (!selectedComponentId.value) {
    alert('请选择成绩项')
    return
  }

  const scores = Object.entries(studentScores)
    .filter(([_, score]) => score !== null)
    .map(([studentId, score]) => ({
      student_id: parseInt(studentId, 10),
      score: score
    }))

  if (scores.length === 0) {
    alert('请至少录入一个学生的成绩')
    return
  }

  submitting.value = true

  try {
    const response = await fetch(
      'http://127.0.0.1:8081/teacher/grades/batch',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          component_id: selectedComponentId.value,
          scores
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.msg || `请求失败: ${response.status}`)
    }

    const result = await response.json()

    if (result.code === 1) {
      alert('成绩录入成功！')
      loadGradebook()
      // 清空输入
      Object.keys(studentScores).forEach(key => {
        studentScores[parseInt(key, 10)] = null
      })
    } else {
      throw new Error(result.msg || '录入失败')
    }
  } catch (error) {
    console.error('录入成绩失败:', error)
    alert(error instanceof Error ? error.message : '录入失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.grades-input {
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
.gradebook-card,
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

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.component-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  outline: none;
}

.gradebook-content {
  padding: 16px;
}

.students-table-wrapper {
  overflow-x: auto;
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

.score-input {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 120px;
  outline: none;
}

.score-input:focus {
  border-color: #2A5CAA;
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.1);
}

.text-muted {
  color: #999;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-block-start: 24px;
  padding-block-start: 24px;
  border-block-start: 1px solid #e8e8e8;
}

.empty-hint {
  padding: 48px;
  text-align: center;
  color: #999;
  font-size: 16px;
}

.empty-state {
  padding: 48px;
  text-align: center;
  color: #999;
  font-size: 16px;
}
</style>
