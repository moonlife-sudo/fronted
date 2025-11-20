<template>
  <div class="admin-approve">
    <main class="container">
      <div class="page-header">
        <h1>审批管理</h1>
      </div>

      <div class="search-filter">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input 
            type="text" 
            v-model="searchTerm"
            placeholder="搜索申请人、教室或日期..." 
          >
        </div>
        
        <div class="filter-group">
          <select v-model="statusFilter">
            <option value="all">所有状态</option>
            <option value="pending" selected>待审批</option>
            <option value="approved">已批准</option>
            <option value="rejected">已拒绝</option>
          </select>
          
          <select v-model="dateFilter">
            <option value="all">所有日期</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
          </select>
        </div>
      </div>
      
      <div class="approval-list">
        <div 
          class="approval-card" 
          v-for="application in filteredApplications" 
          :key="application.id"
        >
          <div class="approval-header">
            <h3>{{ application.type }}</h3>
            <span class="approval-status" :class="application.status">
              {{ getStatusText(application.status) }}
            </span>
          </div>
          
          <div class="approval-body">
            <div class="approval-info">
              <div class="approval-info-item">
                <i class="bi bi-person"></i>
                <span>申请人: {{ application.applicant }}</span>
              </div>
              <div class="approval-info-item">
                <i class="bi bi-building"></i>
                <span>教室: {{ application.location }}</span>
              </div>
              <div class="approval-info-item">
                <i class="bi bi-calendar"></i>
                <span>日期: {{ application.date }}</span>
              </div>
              <div class="approval-info-item">
                <i class="bi bi-clock"></i>
                <span>时间: {{ application.time }}</span>
              </div>
              <div class="approval-info-item">
                <i class="bi bi-journal-text"></i>
                <span>用途: {{ application.purpose }}</span>
              </div>
            </div>
            
            <div class="approval-actions">
              <button 
                v-if="application.status === 'pending'" 
                class="btn primary" 
                @click="approveApplication(application.id)"
              >
                <i class="bi bi-check-circle"></i> 批准
              </button>
              <button 
                v-if="application.status === 'pending'" 
                class="btn danger" 
                @click="rejectApplication(application.id)"
              >
                <i class="bi bi-x-circle"></i> 拒绝
              </button>
              <button 
                v-if="application.status !== 'pending'" 
                class="btn outline" 
                @click="undoApplication(application.id)"
              >
                <i class="bi bi-arrow-counterclockwise"></i> 撤销
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredApplications.length === 0" class="no-results">
          没有找到匹配的申请
        </div>
      </div>
      
      <div class="pagination">
        <button class="btn pagination-btn" :disabled="currentPage === 1" @click="prevPage">
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="current-page">{{ currentPage }}</span>
        <button class="btn pagination-btn" @click="nextPage">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminApprove',
  data() {
    return {
      searchTerm: '',
      statusFilter: 'pending',
      dateFilter: 'all',
      currentPage: 1,
      applications: [
        {
          id: 1,
          type: '教室预约申请',
          applicant: '张老师',
          location: '教学楼A-201',
          date: '2023-11-15',
          time: '14:00 - 16:00',
          purpose: '计算机科学研讨会',
          status: 'pending'
        },
        {
          id: 2,
          type: '教室预约申请',
          applicant: '李教授',
          location: '图书馆报告厅',
          date: '2023-11-18',
          time: '09:00 - 12:00',
          purpose: '学术讲座',
          status: 'pending'
        },
        {
          id: 3,
          type: '教室预约申请',
          applicant: '王同学',
          location: '实验楼B-105',
          date: '2023-11-20',
          time: '16:00 - 18:00',
          purpose: '学生社团活动',
          status: 'pending'
        }
      ]
    }
  },
  computed: {
    filteredApplications() {
      return this.applications.filter(app => {
        // 搜索过滤
        const searchMatch = !this.searchTerm || 
          Object.values(app).some(value => 
            String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
          )
        
        // 状态过滤
        const statusMatch = this.statusFilter === 'all' || app.status === this.statusFilter
        
        // 日期过滤
        let dateMatch = true
        if (this.dateFilter !== 'all') {
          const today = new Date()
          const appDate = new Date(app.date)
          
          if (this.dateFilter === 'today') {
            dateMatch = appDate.toDateString() === today.toDateString()
          } else if (this.dateFilter === 'week') {
            const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
            const weekEnd = new Date(today.setDate(today.getDate() + 6))
            dateMatch = appDate >= weekStart && appDate <= weekEnd
          } else if (this.dateFilter === 'month') {
            dateMatch = appDate.getMonth() === today.getMonth() && 
                       appDate.getFullYear() === today.getFullYear()
          }
        }
        
        return searchMatch && statusMatch && dateMatch
      })
    }
  },
  methods: {
    getStatusText(status) {
      const statusMap = {
        pending: '待审批',
        approved: '已批准',
        rejected: '已拒绝'
      }
      return statusMap[status] || status
    },
    
    approveApplication(id) {
      const app = this.applications.find(a => a.id === id)
      if (app && confirm('确定批准此申请吗？')) {
        app.status = 'approved'
      }
    },
    
    rejectApplication(id) {
      const app = this.applications.find(a => a.id === id)
      if (app && confirm('确定拒绝此申请吗？')) {
        app.status = 'rejected'
      }
    },
    
    undoApplication(id) {
      const app = this.applications.find(a => a.id === id)
      if (app) {
        app.status = 'pending'
      }
    },
    
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.loadPageData()
      }
    },
    
    nextPage() {
      this.currentPage++
      this.loadPageData()
    },
    
    loadPageData() {
      // 模拟加载更多数据
      if (this.currentPage > 1) {
        const newApp = {
          id: this.applications.length + 1,
          type: '教室预约申请',
          applicant: '新加载用户',
          location: '新加载教室',
          date: '2023-11-25',
          time: '10:00 - 12:00',
          purpose: '新加载用途',
          status: 'pending'
        }
        this.applications.push(newApp)
      }
    }
  }
}
</script>

<style scoped>
/* CSS变量定义 - 与classroom保持一致 */
.admin-approve {
  --primary-color: #2A5CAA;
  --primary-light: #E8F0FE;
  --secondary-color: #4CAF50;
  --secondary-light: #E8F5E9;
  --danger-color: #F44336;
  --danger-light: #FFEBEE;
  --text-color: #333;
  --text-light: #666;
  --border-color: #E0E0E0;
  --bg-color: #F9F9F9;
  --white: #FFFFFF;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --radius: 8px;
  --transition: all 0.3s ease;
}

.admin-approve {
  min-height: 100vh;
  background-color: var(--bg-color);
  font-family: 'Roboto', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
}

/* 主要内容区域 */
.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px 0;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 500;
  color: var(--primary-color);
  margin: 0;
}

/* 搜索和筛选区域 */
.search-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  align-items: center;
  background: var(--white);
  padding: 20px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  z-index: 1;
}

.search-box input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 14px;
  transition: var(--transition);
  background-color: var(--white);
  min-height: 40px;
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.2);
}

.filter-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-group select {
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 14px;
  background-color: var(--white);
  cursor: pointer;
  transition: var(--transition);
  min-height: 40px;
  min-width: 120px;
}

.filter-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.2);
}

/* 审批列表 */
.approval-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: var(--text-light);
  font-size: 16px;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

/* 审批卡片 */
.approval-card {
  background-color: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  position: relative;
}

.approval-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}

.approval-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.approval-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, var(--white) 0%, var(--bg-color) 100%);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.approval-header h3 {
  font-size: 18px;
  margin-bottom: 4px;
  color: var(--primary-color);
  font-weight: 600;
}

/* 状态标签 */
.approval-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.approval-status.pending {
  background-color: #FFF3CD;
  color: #856404;
  border: 1px solid #FFEAA7;
}

.approval-status.approved {
  background-color: var(--secondary-light);
  color: var(--secondary-color);
  border: 1px solid var(--secondary-color);
}

.approval-status.rejected {
  background-color: var(--danger-light);
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
}

.approval-body {
  padding: 16px;
}

.approval-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.approval-info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.approval-info-item i {
  color: var(--text-light);
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.approval-info-item span {
  font-size: 14px;
  color: var(--text-color);
}

.approval-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.approval-actions .btn {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  padding: 8px 12px;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: var(--radius);
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  gap: 8px;
  text-decoration: none;
  min-height: 40px;
}

.btn i {
  font-size: 16px;
}

.btn.primary {
  background-color: var(--primary-color);
  color: var(--white);
  border: 1px solid var(--primary-color);
}

.btn.primary:hover {
  background-color: #1E4B8B;
  border-color: #1E4B8B;
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.btn.secondary {
  background-color: var(--secondary-color);
  color: var(--white);
  border: 1px solid var(--secondary-color);
}

.btn.secondary:hover {
  background-color: #3E9D44;
  border-color: #3E9D44;
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.btn.danger {
  background-color: var(--danger-color);
  color: var(--white);
  border: 1px solid var(--danger-color);
}

.btn.danger:hover {
  background-color: #D32F2F;
  border-color: #D32F2F;
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.btn.outline {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.btn.outline:hover {
  background-color: var(--bg-color);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-1px);
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  padding: 20px;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.pagination-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: var(--white);
  border: 2px solid var(--border-color);
  color: var(--text-color);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  transform: scale(1.1);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.current-page {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 16px;
  padding: 8px 16px;
  background: var(--bg-color);
  border-radius: var(--radius);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .search-filter {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .filter-group {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-group select {
    width: 100%;
  }
  
  .approval-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .approval-actions {
    flex-direction: column;
  }
  
  .approval-header {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
    margin: 16px auto;
  }
  
  .page-header h1 {
    font-size: 20px;
  }
  
  .approval-header,
  .approval-body {
    padding: 12px;
  }
  
  .pagination {
    padding: 16px;
  }
}

/* 卡片悬停效果增强 */
.approval-card {
  position: relative;
  overflow: hidden;
}

.approval-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.approval-card:hover::after {
  left: 100%;
}

/* 按钮点击效果 */
.btn:active {
  transform: translateY(0) scale(0.98);
}
</style>