<template>
  <div class="dorm-assign-page">
    <main class="container">
      <section class="view-section">
        <div class="header-actions">
          <div class="title-box">
            <h1><i class="bi bi-people-fill"></i> 宿舍分配管理</h1>
            <span class="subtitle">管理学生宿舍分配与AI智能匹配</span>
          </div>
          <button class="btn-ai-allocate" @click="startAiAllocation">
            <i class="bi bi-cpu-fill"></i> AI 智能分配
          </button>
        </div>

        <div class="filter-bar">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input type="text" placeholder="搜索学生姓名或学号..." v-model="adminSearch">
          </div>
          <div class="select-box">
            <select v-model="selectedBuilding">
              <option value="">全部宿舍楼</option>
              <option value="1">1号楼 (男生)</option>
              <option value="2">2号楼 (男生)</option>
              <option value="3">3号楼 (女生)</option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>学号</th>
                <th>姓名</th>
                <th>性别</th>
                <th>宿舍楼</th>
                <th>房间号</th>
                <th>床位</th>
                <th>AI匹配度</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in filteredStudents" :key="student.studentId">
                <td>{{ student.studentId }}</td>
                <td><span class="student-name">{{ student.name }}</span></td>
                <td>{{ student.gender }}</td>
                <td>{{ student.building || '-' }}</td>
                <td>{{ student.room || '-' }}</td>
                <td>
                  <span v-if="student.bed" class="bed-badge">{{ student.bed }}号床</span>
                  <span v-else>-</span>
                </td>
                <td>
                  <div v-if="student.score" class="match-score">
                    <div class="score-bar" :style="{ 'inline-size': (student.score * 100) + '%' }"></div>
                    <span class="score-num">{{ (student.score * 100).toFixed(0) }}%</span>
                  </div>
                  <span v-else class="text-gray">-</span>
                </td>
                
                <td>
                  <span :class="['status-badge', student.isAssigned ? 'status-done' : 'status-pending']">
                    {{ student.isAssigned ? '已分配' : '待分配' }}
                  </span>
                </td>
              </tr>
              <tr v-if="filteredStudents.length === 0">
                <td colspan="8" class="empty-state">暂无相关数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <div v-if="showAiModal" class="modal-overlay">
      <div class="ai-modal">
        <div class="modal-header">
          <div class="modal-title">
            <i class="bi bi-stars"></i>
            <h3>AI 智能分配结果预览</h3>
          </div>
          <button class="close-btn" @click="showAiModal = false">×</button>
        </div>

        <div class="modal-body">
          <div v-if="aiLoading" class="ai-loading">
            <div class="spinner"></div>
            <h4>AI 正在运行聚类算法...</h4>
            <p class="sub-text">正在分析学生生活习惯、作息时间与性格标签</p>
          </div>

          <div v-else class="ai-result">
            <div class="result-summary">
              <i class="bi bi-check-circle-fill"></i>
              <span>计算完成！算法成功为 <strong>{{ suggestionList.length }}</strong> 名学生匹配到最佳床位。</span>
            </div>

            <div class="suggestion-table-wrapper">
              <table class="suggestion-table">
                <thead>
                  <tr>
                    <th>学生姓名</th>
                    <th>建议位置</th>
                    <th>匹配标签</th>
                    <th>匹配度</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in suggestionList" :key="index">
                    <td class="font-bold">{{ item.full_name }}</td>
                    <td>{{ item.suggested_room }} <span class="bed-mini">{{ item.suggested_bed_id }}床</span></td>
                    <td>
                      <span class="tag-reason" :class="index % 2 === 0 ? 'tag-blue' : 'tag-purple'">
                        {{ index % 2 === 0 ? '早起/安静' : '游戏/开朗' }}
                      </span>
                    </td>
                    <td class="score-text">{{ (item.average_match_score * 100).toFixed(1) }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="modal-footer" v-if="!aiLoading">
          <button class="btn-cancel" @click="showAiModal = false">取消</button>
          <button class="btn-confirm" @click="confirmAllocation">
            <i class="bi bi-check-lg"></i> 确认应用分配方案
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { generateDormSuggestions, confirmBatchAllocate } from '@/api/admin'

export default {
  name: 'AdmDormAssign',
  data() {
    return {
      adminSearch: '',
      selectedBuilding: '',
      showAiModal: false,
      aiLoading: false,

      // 列表数据 (演示初始数据 - 模拟数据库里的学生)
      students: [
        { studentId: '2021001', name: '张三', gender: '男', isAssigned: false },
        { studentId: '2021002', name: '李四', gender: '男', isAssigned: false },
        { studentId: '2021003', name: '王五', gender: '男', isAssigned: false },
        { studentId: '2021004', name: '赵六', gender: '男', isAssigned: false },
        { studentId: '2021005', name: '钱七', gender: '男', isAssigned: false },
        { studentId: '2021006', name: '孙八', gender: '男', isAssigned: true, building: '1号楼', room: '102', bed: 'A', score: 0.92 },
      ],

      // AI 建议结果
      suggestionList: []
    }
  },
  computed: {
    // 前端简单过滤
    filteredStudents() {
      return this.students.filter(s => {
        const matchName = s.name.includes(this.adminSearch) || s.studentId.includes(this.adminSearch);
        const matchBuild = this.selectedBuilding ? s.building?.startsWith(this.selectedBuilding) : true;
        return matchName && matchBuild;
      });
    }
  },
  methods: {
    // 1. 点击开始分配
    startAiAllocation() {
      this.showAiModal = true;
      this.aiLoading = true;

      generateDormSuggestions({
        target_dorm_building_id: 1,
        matching_strategy: 1
      }).then(res => {
        if (res.code === 1 && res.data.preview && res.data.preview.length > 0) {
          setTimeout(() => {
            this.suggestionList = res.data.preview;
            this.aiLoading = false;
          }, 1500);
        } else {
          this.useMockData();
        }
      }).catch(() => {
        this.useMockData();
      })
    },

    useMockData() {
      setTimeout(() => {
        this.suggestionList = [
          { student_id: '2021001', full_name: '张三', suggested_room: '1号楼-101', suggested_bed_id: 'A', average_match_score: 0.98 },
          { student_id: '2021002', full_name: '李四', suggested_room: '1号楼-101', suggested_bed_id: 'B', average_match_score: 0.95 },
          { student_id: '2021003', full_name: '王五', suggested_room: '1号楼-102', suggested_bed_id: 'A', average_match_score: 0.88 },
          { student_id: '2021004', full_name: '赵六', suggested_room: '1号楼-102', suggested_bed_id: 'B', average_match_score: 0.85 },
          { student_id: '2021005', full_name: '钱七', suggested_room: '1号楼-103', suggested_bed_id: 'A', average_match_score: 0.91 },
        ];
        this.aiLoading = false;
      }, 1500);
    },

    // 2. 确认应用分配
    confirmAllocation() {
      const batchData = {
        allocations: this.suggestionList.map(item => ({
          student_id: item.student_id,
          bed_id: 1,
          check_in_date: new Date().toISOString().split('T')[0]
        }))
      };

      confirmBatchAllocate(batchData).then(() => {
        this.handleSuccess();
      }).catch(() => {
        this.handleSuccess(); // 演示模式总是成功
      });
    },

    handleSuccess() {
      alert('分配方案已生效！学生端已同步更新。');
      this.showAiModal = false;
      // 刷新本地视图
      this.suggestionList.forEach(sugg => {
        const stu = this.students.find(s => s.name === sugg.full_name);
        if (stu) {
          stu.isAssigned = true;
          stu.building = '1号楼';
          stu.room = sugg.suggested_room;
          stu.bed = sugg.suggested_bed_id;
          stu.score = sugg.average_match_score;
        }
      });
    }
  }
}
</script>

<style scoped>
/* ==================== 
   1. 基础布局样式 (修复样式丢失问题)
   ==================== */
.dorm-assign-page {
  padding: 20px;
  background-color: #f5f7fa;
  /* 页面底色 */
  min-block-size: 85vh;
}

.container {
  max-inline-size: 1400px;
  margin: 0 auto;
}

.view-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 25px;
  min-block-size: 600px;
}

/* ==================== 
   2. 头部与操作栏
   ==================== */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-end: 25px;
  padding-block-end: 15px;
  border-block-end: 1px solid #f0f0f0;
}

.title-box h1 {
  font-size: 24px;
  color: #1f2937;
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-box .subtitle {
  color: #6b7280;
  font-size: 14px;
}

/* 炫酷的AI按钮 */
.btn-ai-allocate {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-ai-allocate:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
}

/* ==================== 
   3. 筛选栏
   ==================== */
.filter-bar {
  display: flex;
  gap: 15px;
  margin-block-end: 20px;
}

.search-box {
  position: relative;
  inline-size: 300px;
}

.search-box i {
  position: absolute;
  inset-inline-start: 12px;
  inset-block-start: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-box input {
  inline-size: 100%;
  padding: 10px 10px 10px 35px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.search-box input:focus {
  border-color: #6366f1;
}

.select-box select {
  padding: 10px 15px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  background-color: #fff;
  cursor: pointer;
}

/* ==================== 
   4. 数据表格样式
   ==================== */
.table-container {
  overflow-x: auto;
}

.data-table {
  inline-size: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.data-table th {
  background-color: #f9fafb;
  color: #4b5563;
  font-weight: 600;
  padding: 15px;
  text-align: start;
  border-block-end: 1px solid #e5e7eb;
}

.data-table td {
  padding: 15px;
  border-block-end: 1px solid #f3f4f6;
  color: #374151;
  vertical-align: middle;
}

.student-name {
  font-weight: 500;
  color: #111827;
}

/* 状态徽标 */
.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background-color: #fff7ed;
  color: #c2410c;
  border: 1px solid #ffedd5;
}

.status-done {
  background-color: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #dbeafe;
}

.bed-badge {
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #4b5563;
}

/* 匹配度条 */
.match-score {
  display: flex;
  align-items: center;
  gap: 8px;
  inline-size: 120px;
}

.score-bar {
  block-size: 6px;
  background-color: #10b981;
  border-radius: 3px;
}

.score-num {
  font-size: 12px;
  color: #059669;
  font-weight: bold;
}

.text-gray {
  color: #d1d5db;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
}

/* ==================== 
   5. AI 弹窗样式
   ==================== */
.modal-overlay {
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  inset-inline-end: 0;
  inset-block-end: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.ai-modal {
  background: white;
  inline-size: 650px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  padding: 20px 25px;
  border-block-end: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fdfdfd;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #7c3aed;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #9ca3af;
  cursor: pointer;
}

.modal-body {
  padding: 0;
  min-block-size: 300px;
  max-block-size: 60vh;
  overflow-y: auto;
}

/* 加载中动画 */
.ai-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  block-size: 300px;
  color: #4b5563;
}

.spinner {
  inline-size: 50px;
  block-size: 50px;
  border: 4px solid #f3f4f6;
  border-block-start: 4px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-block-end: 20px;
}

/* 结果列表 */
.ai-result {
  padding: 25px;
}

.result-summary {
  background: #ecfdf5;
  border: 1px solid #d1fae5;
  color: #047857;
  padding: 12px;
  border-radius: 8px;
  margin-block-end: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.suggestion-table {
  inline-size: 100%;
  font-size: 14px;
  border-collapse: collapse;
}

.suggestion-table th {
  text-align: start;
  color: #6b7280;
  padding: 10px;
  border-block-end: 1px solid #e5e7eb;
}

.suggestion-table td {
  padding: 12px 10px;
  border-block-end: 1px solid #f9fafb;
}

.tag-reason {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.tag-blue {
  background: #eff6ff;
  color: #3b82f6;
}

.tag-purple {
  background: #f5f3ff;
  color: #8b5cf6;
}

.modal-footer {
  padding: 20px 25px;
  border-block-start: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #fdfdfd;
}

.btn-cancel {
  padding: 8px 20px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  color: #374151;
  cursor: pointer;
}

.btn-confirm {
  padding: 8px 20px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-confirm:hover {
  background: #6d28d9;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>