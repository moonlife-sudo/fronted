<template>
  <div class="homework-correct">
    <div class="page-header">
      <h1>Teaching Suggestions</h1>
      <p class="page-description">AI-assisted Homework Teaching Suggestions</p>
    </div>

    <!-- AI 教学建议区域 -->
    <section class="card ai-card">
      <header class="card-header">
        <h3>Generate Teaching Suggestions</h3>
      </header>

      <div class="ai-section">
        <!-- 作业选择 -->
        <div class="form-group">
          <label for="homeworkSelect">Select Homework</label>
          <select id="homeworkSelect" v-model="selectedHomework" class="input">
            <option value="">Please select homework</option>
            <option v-for="homework in homeworkList" :key="homework.id" :value="homework">
              {{ homework.title }}
            </option>
          </select>
        </div>

        <!-- 学生选择 -->
        <div class="form-group">
          <label>Select Students</label>
          <div class="students-select">
            <div v-for="student in studentsList" :key="student.id" class="student-item"
              :class="{ active: selectedStudents.includes(student) }" @click="toggleStudent(student)">
              <input type="checkbox" :value="student" v-model="selectedStudents" />
              <label>{{ student.name }}</label>
            </div>
          </div>
        </div>

        <!-- 状态提示 -->
        <div class="selected-info">
          <p v-if="selectedStudents.length > 0">
            Selected {{ selectedStudents.length }} students
          </p>
          <p v-else class="text-muted">Please select at least one student</p>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <button type="button" class="button" @click="generateTeachingSuggestions"
            :disabled="generatingSuggestions || !selectedHomework || selectedStudents.length === 0">
            {{ generatingSuggestions ? 'Generating...' : 'Generate Teaching Suggestions' }}
          </button>
        </div>

        <!-- 加载/错误/结果展示 -->
        <div v-if="generatingSuggestions" class="loading-state">
          Generating teaching suggestions, please wait...
        </div>
        <div v-else-if="errorMessage" class="error-state">
          {{ errorMessage }}
        </div>
        <div v-else-if="teachingSuggestions && teachingSuggestions.length > 0" class="suggestions-result">
          <h4>Generated Teaching Suggestions</h4>
          <div class="suggestions-list">
            <div v-for="(suggestion, index) in teachingSuggestions" :key="index" class="suggestion-item">
              <h5>{{ suggestion.title }}</h5>
              <p>{{ suggestion.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineOptions({ name: 'HomeworkCorrect' })

// 模拟作业数据
const homeworkList = ref([
  { id: 1, title: 'Cryptography Basics Assignment', description: 'Complete the assignment on symmetric and asymmetric encryption principles.' },
  { id: 2, title: 'Network Security Protection Assignment', description: 'Analyze common network security threats and propose protection measures.' },
  { id: 3, title: 'Data Encryption Technology Assignment', description: 'Implement the AES algorithm and analyze its performance characteristics.' }
])

// 模拟学生数据
const studentsList = ref([
  { id: 1, name: 'Zhang San', grade: 85 },
  { id: 2, name: 'Li Si', grade: 92 },
  { id: 3, name: 'Wang Wu', grade: 78 },
  { id: 4, name: 'Zhao Liu', grade: 88 },
  { id: 5, name: 'Sun Qi', grade: 95 }
])

const selectedHomework = ref(null)
const selectedStudents = ref([])
const generatingSuggestions = ref(false)
const teachingSuggestions = ref([])
const errorMessage = ref('')

// 示例建议（AI 接口出错时显示）
const exampleSuggestions = [
  { title: 'Overall Mastery', content: 'Students have a good grasp of the knowledge points, with an average score around 85.' },
  { title: 'Common Mistakes', content: 'Some students confuse algorithm principles or application scenarios.' },
  { title: 'Teaching Strategies', content: 'Increase algorithm explanation and practice sessions.' },
  { title: 'Classroom Activities', content: 'Organize discussions and case analyses.' },
  { title: 'Follow-up Homework Suggestions', content: 'Design algorithm implementation and security assessment assignments.' }
]

onMounted(() => {
  if (homeworkList.value.length > 0) {
    selectedHomework.value = homeworkList.value[0]
  }
})

// 切换学生选中状态
const toggleStudent = student => {
  const index = selectedStudents.value.indexOf(student)
  if (index === -1) selectedStudents.value.push(student)
  else selectedStudents.value.splice(index, 1)
}

// 调用 AI 教学建议接口
const generateTeachingSuggestions = async () => {
  if (!selectedHomework.value || selectedStudents.value.length === 0) {
    errorMessage.value = 'Please select homework and students'
    return
  }

  generatingSuggestions.value = true
  errorMessage.value = ''
  teachingSuggestions.value = []

  try {
    const response = await fetch('http://127.0.0.1:8000/api/analyze/teaching', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        homework_title: selectedHomework.value.title,
        homework_description: selectedHomework.value.description,
        student_submissions: selectedStudents.value.map(s => ({
          student_name: s.name,
          content: `${s.name}'s homework content`,
          grade: s.grade
        }))
      })
    })

    const result = await response.json()
    if (result.success && result.data) {
      // 后端 AI 返回的数据结构决定这里怎么展示
      if (Array.isArray(result.data)) {
        teachingSuggestions.value = result.data
      } else if (typeof result.data === 'string') {
        teachingSuggestions.value = [{ title: 'AI 建议', content: result.data }]
      } else {
        teachingSuggestions.value = [...exampleSuggestions]
        errorMessage.value = 'AI returned unclear data format, using sample data'
      }
    } else {
      teachingSuggestions.value = [...exampleSuggestions]
      errorMessage.value = 'AI service call failed, displaying sample data'
    }
  } catch (err) {
      console.error(err)
      teachingSuggestions.value = [...exampleSuggestions]
      errorMessage.value = 'Unable to connect to AI service, please check if 127.0.0.1:8000 is running'
    } finally {
    generatingSuggestions.value = false
  }
}
</script>

<style scoped>
.homework-correct {
  padding: 24px;
  max-inline-size: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-block-end: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.page-description {
  color: #666;
  font-size: 14px;
}

/* 卡片样式 */
.card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.card-header {
  padding: 20px 24px;
  border-block-end: 1px solid #f0f0f0;
}

.card-header h3 {
  font-size: 18px;
  color: #2A5CAA;
}

.ai-section {
  padding: 24px;
}

/* 输入框与按钮 */
.input {
  inline-size: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
}

.button {
  background: linear-gradient(135deg, #2A5CAA 0%, #1e40af 100%);
  color: white;
  padding: 10px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button:hover:not(:disabled) {
  background: linear-gradient(135deg, #1e40af 0%, #1939b7 100%);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 学生选择区域 */
.students-select {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-block-start: 12px;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
}

.student-item.active {
  background: #2A5CAA;
  color: #fff;
}

/* 状态提示 */
.selected-info {
  margin-block-start: 20px;
  padding: 12px 16px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
  color: #52c41a;
  font-size: 14px;
}

.text-muted {
  color: #999;
}

/* 加载与错误 */
.loading-state,
.error-state {
  margin-block-start: 20px;
  padding: 20px;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
}

.error-state {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  color: #cf1322;
}

/* 建议显示区域 */
.suggestions-result {
  margin-block-start: 24px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
}

.suggestion-item {
  padding: 16px;
  border-inline-start: 4px solid #2A5CAA;
  border-radius: 6px;
  background: #f9fafb;
  margin-block-end: 16px;
}

.suggestion-item h5 {
  color: #2A5CAA;
  margin-block-end: 8px;
}
</style>
