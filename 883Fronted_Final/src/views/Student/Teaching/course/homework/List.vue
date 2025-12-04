<template>
  <div class="homework-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <i class="bi bi-arrow-clockwise spinner"></i>
      <span>加载中...</span>
    </div>
    
    <!-- 作业列表 -->
    <div v-else-if="homeworks.length > 0" class="homework-items">
      <div v-for="hw in homeworks" :key="hw.homework_id || hw.id" class="hw-item">
        <div class="hw-info" @click="viewHomeworkDetail(hw)">
          <h4>{{ hw.title || hw.homework_title }}</h4>
          <p class="hw-description">{{ hw.description || hw.homework_description || '暂无描述' }}</p>
          <span class="deadline">截止：{{ formatDate(hw.deadline || hw.due_date) }}</span>
        </div>
        
        <div class="hw-status">
          <span :class="['badge', getStatusClass(hw.status || hw.submission_status)]">{{ getStatusText(hw.status || hw.submission_status) }}</span>
          
          <!-- 分数显示 -->
          <span v-if="hw.grade || hw.score" class="score">{{ hw.grade || hw.score }}分</span>
          
          <!-- 学情分析按钮 - 只有已批改的作业才显示 -->
          <button 
            v-if="isGraded(hw.status || hw.submission_status) && (hw.grade || hw.score)"
            @click="generateAnalysis(hw)"
            class="analysis-btn"
            :disabled="analysisLoading[hw.homework_id || hw.id]"
          >
            <i v-if="analysisLoading[hw.homework_id || hw.id]" class="bi bi-arrow-clockwise spinner"></i>
            <i v-else class="bi bi-graph-up"></i>
            {{ analysisLoading[hw.homework_id || hw.id] ? '分析中...' : '学情分析' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="empty-state">
      <i class="bi bi-journal-text"></i>
      <p>暂无作业</p>
    </div>
    
    <!-- 学情分析弹窗 -->
    <div v-if="analysisModal.show" class="analysis-modal-overlay" @click="closeAnalysisModal">
      <div class="analysis-modal" @click.stop>
        <div class="modal-header">
          <h3>学情分析报告</h3>
          <button @click="closeAnalysisModal" class="close-btn">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="analysisModal.loading" class="analysis-loading">
            <i class="bi bi-arrow-clockwise spinner"></i>
            <p>AI正在分析中，请稍候...</p>
          </div>
          <div v-else-if="analysisModal.data" class="analysis-content">
            <div class="analysis-section">
              <h4><i class="bi bi-star-fill"></i> 优点与亮点</h4>
              <p>{{ analysisModal.data.strengths }}</p>
            </div>
            <div class="analysis-section">
              <h4><i class="bi bi-exclamation-triangle-fill"></i> 需要改进</h4>
              <p>{{ analysisModal.data.weaknesses }}</p>
            </div>
            <div class="analysis-section">
              <h4><i class="bi bi-lightbulb-fill"></i> 学习建议</h4>
              <p>{{ analysisModal.data.suggestions }}</p>
            </div>
            <div class="analysis-section score-analysis">
              <h4><i class="bi bi-graph-up"></i> 成绩分析</h4>
              <p>{{ analysisModal.data.score_analysis }}</p>
            </div>
          </div>
          <div v-else class="analysis-error">
            <i class="bi bi-exclamation-circle"></i>
            <p>{{ analysisModal.error || '分析失败，请重试' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHomeworkList, getHomeworkSubmissionDetail, generateStudentAnalysis } from '@/api/student'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const homeworks = ref([])
const analysisLoading = reactive({})
const analysisModal = reactive({
  show: false,
  loading: false,
  data: null,
  error: null
})

// 获取路由参数
const courseId = route.params.courseId

// 获取作业列表
const loadHomeworks = async () => {
  if (!courseId) {
    console.error('课程ID未找到')
    return
  }
  
  loading.value = true
  try {
    console.log('正在获取课程', courseId, '的作业列表')
    const result = await getHomeworkList(courseId)
    console.log('作业列表API响应:', result)
    
    if (result.code === 1 && result.data && result.data.length > 0) {
      // 处理分页数据或直接的数组数据
      homeworks.value = result.data.records || result.data || []
    } else {
      console.warn('获取作业列表失败或数据为空，使用模拟数据:', result.msg)
      homeworks.value = getMockHomeworks()
    }
  } catch (error) {
    console.error('获取作业列表失败:', error)
    console.log('使用模拟数据进行功能演示')
    // 使用模拟数据作为fallback
    homeworks.value = getMockHomeworks()
  } finally {
    loading.value = false
  }
}

// 获取模拟作业数据
const getMockHomeworks = () => [
  { 
    id: 1, 
    homework_id: 1,
    title: 'Vue.js基础练习', 
    description: '完成Vue组件的基本创建和使用，包括数据绑定、事件处理等核心概念',
    deadline: '2023-12-25 23:59', 
    status: 'pending', 
    score: null,
    due_date: '2023-12-25 23:59'
  },
  { 
    id: 2, 
    homework_id: 2,
    title: 'JavaScript算法题集', 
    description: '完成数组、字符串、排序算法等相关编程题目，共10道题',
    deadline: '2023-12-20 23:59', 
    status: 'graded', 
    score: 92,
    grade: 92,
    due_date: '2023-12-20 23:59'
  },
  { 
    id: 3, 
    homework_id: 3,
    title: '期中项目报告', 
    description: '根据课程要求完成项目开发并撰写详细的技术报告',
    deadline: '2023-12-15 23:59', 
    status: 'graded', 
    score: 88,
    grade: 88,
    due_date: '2023-12-15 23:59'
  },
  { 
    id: 4, 
    homework_id: 4,
    title: 'React组件开发', 
    description: '使用React技术栈开发一个完整的Todo应用，包含增删改查功能',
    deadline: '2023-12-10 23:59', 
    status: 'submitted', 
    score: null,
    due_date: '2023-12-10 23:59'
  },
  { 
    id: 5, 
    homework_id: 5,
    title: '数据库设计作业', 
    description: '设计一个学生管理系统的数据库，包含E-R图和SQL建表语句',
    deadline: '2023-12-05 23:59', 
    status: 'graded', 
    score: 95,
    grade: 95,
    due_date: '2023-12-05 23:59'
  }
]

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '未设置'
  try {
    return new Date(dateStr).toLocaleString('zh-CN')
  } catch {
    return dateStr
  }
}

// 获取状态样式类
const getStatusClass = (status) => {
  const statusMap = {
    'pending': 'pending',
    'submitted': 'submitted', 
    'graded': 'graded',
    'overdue': 'overdue',
    '未提交': 'pending',
    '已提交': 'submitted',
    '已批改': 'graded',
    '已逾期': 'overdue'
  }
  return statusMap[status] || 'pending'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'pending': '未提交',
    'submitted': '已提交', 
    'graded': '已批改',
    'overdue': '已逾期',
    '未提交': '未提交',
    '已提交': '已提交',
    '已批改': '已批改',
    '已逾期': '已逾期'
  }
  return statusMap[status] || '未知状态'
}

// 判断是否已批改
const isGraded = (status) => {
  return status === 'graded' || status === '已批改'
}

// 查看作业详情
const viewHomeworkDetail = (homework) => {
  const hwId = homework.homework_id || homework.id
  router.push(`/student/course/${courseId}/homework/detail?id=${hwId}`)
}

// 生成学情分析
const generateAnalysis = async (homework) => {
  const hwId = homework.homework_id || homework.id
  
  // 设置加载状态
  analysisLoading[hwId] = true
  
  try {
    // 尝试获取作业提交详情
    console.log('获取作业提交详情，作业ID:', hwId)
    let submission = null
    
    try {
      const submissionResult = await getHomeworkSubmissionDetail(hwId)
      if (submissionResult && submissionResult.code === 1) {
        submission = submissionResult.data
      }
    } catch (error) {
      console.log('无法获取真实提交详情，使用模拟数据:', error.message)
    }
    
    // 如果无法获取真实数据，使用模拟数据
    if (!submission) {
      submission = getMockSubmission(homework)
    }
    
    // 准备AI分析请求数据
    const analysisRequest = {
      homework_title: homework.title || homework.homework_title || '未命名作业',
      homework_description: homework.description || homework.homework_description || '暂无描述',
      student_content: submission.content || submission.submission_content || '模拟学生作业内容：本次作业中，我实现了Vue组件的基本功能，包括数据绑定、事件处理和组件通信。在开发过程中，我遇到了一些技术难点，通过查阅文档和实践最终解决了。整体来说，我对Vue的响应式原理有了更深入的理解。',
      teacher_feedback: submission.teacher_feedback || submission.feedback || '作业完成质量良好，逻辑清晰，代码规范。建议在异常处理方面进一步完善。',
      grade: homework.grade || homework.score || 0
    }
    
    console.log('调用AI分析接口，请求数据:', analysisRequest)
    
    // 显示分析弹窗
    analysisModal.show = true
    analysisModal.loading = true
    analysisModal.data = null
    analysisModal.error = null
    
    // 调用AI分析接口
    const analysisResult = await generateStudentAnalysis(analysisRequest)
    
    console.log('AI分析结果:', analysisResult)
    
    if (analysisResult.success && analysisResult.data) {
      analysisModal.data = analysisResult.data
    } else {
      analysisModal.error = '分析失败，请稍后重试'
    }
    
  } catch (error) {
    console.error('生成学情分析失败:', error)
    analysisModal.error = error.message || '分析失败，请稍后重试'
    analysisModal.show = true
    analysisModal.loading = false
  } finally {
    analysisLoading[hwId] = false
    analysisModal.loading = false
  }
}

// 获取模拟提交数据
const getMockSubmission = (homework) => {
  const mockContents = {
    1: '本次Vue基础练习中，我学习了组件化开发的核心思想。通过实际编写代码，我掌握了v-model数据绑定、v-for循环渲染、@click事件处理等基础语法。在完成todolist组件时，我遇到了父子组件通信的问题，通过props和emit成功解决。总的来说，我对Vue的响应式原理有了初步理解，但在复杂状态管理方面还需要进一步学习。',
    2: '算法题集完成情况：共完成8/10题。已完成的题目包括：数组去重、字符串反转、冒泡排序、二分查找等。在解决最长公共子序列问题时，我采用了动态规划的思路，时间复杂度为O(mn)。斐波那契数列使用了备忘录优化，避免了重复计算。还有两道关于图算法的题目由于时间关系未能完成，计划后续补充学习。代码实现注重了可读性和效率平衡。',
    3: '项目开发总结：本次项目采用前后端分离架构，前端使用Vue3+TypeScript，后端使用Spring Boot。实现了用户登录、数据CRUD、文件上传等核心功能。在开发过程中，我学会了RESTful API设计、JWT身份验证、MyBatis数据访问等技术。项目部署使用Docker容器化，配置了Nginx反向代理。遇到的主要难点是跨域问题和异步数据处理，通过合理的错误处理机制得到解决。',
    4: 'React Todo应用开发心得：使用函数式组件和Hooks重构了之前的类组件代码。useState管理本地状态，useEffect处理副作用，useContext实现了全局状态共享。组件拆分遵循单一职责原则，提高了代码的可维护性。添加了拖拽排序、本地存储、主题切换等增强功能。在性能优化方面，使用了useMemo和useCallback减少不必要的重渲染。整体架构清晰，用户体验良好。',
    5: '数据库设计说明：以学生管理系统为例，设计了用户表、学生表、课程表、选课表等核心实体。采用第三范式规范化，避免数据冗余。E-R图清晰展示了实体间的关系：学生与课程是多对多关系，通过选课表实现；学生与宿舍是多对一关系。设置了适当的约束条件，包括主键、外键、唯一性约束等。考虑了查询性能，在常用查询字段上建立了索引。数据库支持事务处理，保证数据一致性。'
  }
  
  const mockFeedbacks = {
    1: '代码结构清晰，Vue基础概念掌握良好。建议深入学习组件生命周期和watch机制。',
    2: '算法思路正确，代码实现规范。建议补充图算法相关知识，提升解题完整性。',
    3: '项目架构设计合理，技术栈运用恰当。文档撰写详细，展现了良好的工程实践能力。',
    4: 'React Hooks使用熟练，组件设计符合最佳实践。性能优化意识值得肯定。',
    5: '数据库设计规范，E-R图绘制准确。约束设置合理，体现了扎实的数据库理论基础。'
  }
  
  const hwId = homework.homework_id || homework.id
  return {
    content: mockContents[hwId] || mockContents[1],
    teacher_feedback: mockFeedbacks[hwId] || mockFeedbacks[1]
  }
}

// 关闭分析弹窗
const closeAnalysisModal = () => {
  analysisModal.show = false
  analysisModal.data = null
  analysisModal.error = null
}

// 页面加载时获取数据
onMounted(() => {
  loadHomeworks()
})
</script>

<style scoped>
.homework-list {
  padding: 20px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
}

.loading-state i, .empty-state i {
  font-size: 48px;
  margin-block-end: 15px;
  color: #999;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.homework-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.hw-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.3s ease;
  border: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.hw-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-color: #2A5CAA;
}

.hw-info {
  flex: 1;
  cursor: pointer;
  padding-inline-end: 20px;
}

.hw-info h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.hw-description {
  margin: 5px 0 10px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.deadline {
  font-size: 13px;
  color: #999;
  display: flex;
  align-items: center;
}

.deadline::before {
  content: '⏰';
  margin-inline-end: 5px;
}

.hw-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.badge.pending {
  background: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.badge.submitted {
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.badge.graded {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.badge.overdue {
  background: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.score {
  font-weight: 600;
  color: #2A5CAA;
  font-size: 15px;
}

.analysis-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.analysis-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.analysis-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.analysis-btn i {
  font-size: 12px;
}

/* 学情分析弹窗 */
.analysis-modal-overlay {
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  inset-inline-end: 0;
  inset-block-end: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.analysis-modal {
  background: white;
  border-radius: 16px;
  inline-size: 90%;
  max-inline-size: 700px;
  max-block-size: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  border-block-end: 1px solid #eee;
  background: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  inline-size: 32px;
  block-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #eee;
  color: #333;
}

.modal-body {
  padding: 30px;
  max-block-size: 60vh;
  overflow-y: auto;
}

.analysis-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #666;
}

.analysis-loading i {
  font-size: 32px;
  margin-block-end: 15px;
  color: #2A5CAA;
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.analysis-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border-inline-start: 4px solid;
}

.analysis-section:nth-child(1) {
  border-inline-start-color: #52c41a;
}

.analysis-section:nth-child(2) {
  border-inline-start-color: #faad14;
}

.analysis-section:nth-child(3) {
  border-inline-start-color: #1890ff;
}

.analysis-section.score-analysis {
  border-inline-start-color: #722ed1;
}

.analysis-section h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.analysis-section h4 i {
  font-size: 18px;
}

.analysis-section p {
  margin: 0;
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}

.analysis-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #ff4d4f;
}

.analysis-error i {
  font-size: 48px;
  margin-block-end: 15px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hw-item {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .hw-info {
    padding-inline-end: 0;
  }
  
  .hw-status {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .analysis-modal {
    inline-size: 95%;
    margin: 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
}
</style>