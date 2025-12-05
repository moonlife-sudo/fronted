<template>
  <div class="admin-dashboard">
    <!-- 数据卡片 -->
     <h3 class="section-title">Data Overview</h3>
    <div class="dashboard">
      <div 
        v-for="card in dashboardCards" 
        :key="card.id"
        class="card"
        @mouseenter="handleCardHover"
        @mouseleave="handleCardLeave"
      >
        <div class="card-title">{{ card.title }}</div>
        <div class="card-value">{{ card.value }}</div>
        <div class="card-icon">
          <i>{{ card.icon }}</i>
        </div>
      </div>
    </div>

    <!-- 功能模块 -->
    <div class="section">
      <h3 class="section-title">功能管理</h3>
      <div class="modules">
        <!-- 教室管理模块 -->
        <div 
          class="module-card"
          @mouseenter="handleCardHover"
          @mouseleave="handleCardLeave"
        >
          <div class="module-header">Classroom Management</div>
          <div class="module-content">
            <div class="module-item">
              <span>Set Classroom Information</span>
            </div>
            <div class="module-item">
              <span>Set Inactive Classrooms</span>
            </div>
            <div class="module-item">
              <span>Display Classroom Status</span>
            </div>
            <button class="action-btn" @click="goToClassroom">Enter Classroom Management</button>
          </div>
        </div>
        
        <!-- 图书馆模块 -->
        <div 
          class="module-card"
          @mouseenter="handleCardHover"
          @mouseleave="handleCardLeave"
        >
          <div class="module-header">Library Management</div>
          <div class="module-content">
            <div class="module-item">
              <span>Upload Book Information</span>
            </div>
            <div class="module-item">
              <span>Add Book Tags</span>
            </div>
            <div class="module-item">
              <span>Set Loan Duration</span>
            </div>
            <button class="action-btn" @click="goToLibrary">Manage Library</button>
          </div>
        </div>

        <!-- 预约审批模块 -->
        <div 
          class="module-card"
          @mouseenter="handleCardHover"
          @mouseleave="handleCardLeave"
        >
          <div class="module-header">Reservation Approval</div>
          <div class="module-content">
            <div class="module-item">
              <span>View Reservation Requests</span>
            </div>
            <div class="module-item">
              <span>Approve Reservation Requests</span>
            </div>
            <div class="module-item">
              <span>Reject Reservation Requests</span>
            </div>
            <button class="action-btn" @click="goToApproval">Process To-do Items</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      dashboardCards: [
        { id: 1, title: 'Available Classrooms', value: '42' },
        { id: 2, title: 'Pending Approvals', value: '16'},
        { id: 3, title: 'Books on Loan', value: '248' },
      ]
    }
  },
  methods: {
    handleCardHover(event) {
      const card = event.currentTarget;
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    },
    handleCardLeave(event) {
      const card = event.currentTarget;
      card.style.transform = '';
      card.style.boxShadow = '';
    },
    goToClassroom() {
      this.$router.push('/admin/classroom');
    },
    goToApproval() {
      this.$router.push('/admin/approve');
    },
    goToLibrary() {
      this.$router.push('/admin/library');
    },
    
    handleButtonClick(event) {
      const button = event.currentTarget;
      button.style.transform = 'scale(0.98)';
      setTimeout(() => {
        button.style.transform = '';
      }, 200);
      
      const moduleTitle = button.closest('.module-card').querySelector('.module-header').textContent;
      alert(`即将进入：${moduleTitle}模块`);
    }
  },
  mounted() {
    // 为所有按钮添加点击效果
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
      button.addEventListener('click', this.handleButtonClick);
    });
  },
  beforeUnmount() {
    // 清理事件监听器
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
      button.removeEventListener('click', this.handleButtonClick);
    });
  }
}
</script>

<style>
/* 全局CSS变量定义 */
:root {
  --primary: #2A5CAA;
  --accent: #4CAF50;
  --white: #FFFFFF;
  --gray-light: #F8F9FC;
  --gray: #E4E7EB;
  --dark: #34495E;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  --radius: 12px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
}
</style>

<style scoped>
.admin-dashboard {
  background-color: var(--gray-light);
  color: var(--dark);
  line-height: 1.6;
  padding: 32px;
  min-height: 100vh;
}

/* 数据卡片布局 */
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.card {
  background: var(--white);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 140px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 16px;
  color: var(--dark);
  margin-bottom: 12px;
  font-weight: 500;
}

.card-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 16px;
}

.card-icon {
  background: rgba(42, 92, 170, 0.1);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  position: absolute;
  right: 24px;
  bottom: 24px;
}

.card-icon i {
  color: var(--primary);
  font-size: 28px;
}

/* 功能模块区域 */
.section-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--primary);
}

.modules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.module-card {
  background: var(--white);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.module-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.module-header {
  background: var(--primary);
  color: white;
  padding: 18px 24px;
  font-weight: 600;
  font-size: 18px;
}

.module-content {
  padding: 24px;
}

.module-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--gray);
}

.module-item:last-child {
  border-bottom: none;
}

.module-icon {
  width: 40px;
  height: 40px;
  background: rgba(42, 92, 170, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: var(--primary);
  font-size: 18px;
}

.action-btn {
  margin-top: 16px;
  background: var(--accent);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-size: 16px;
}

.action-btn:hover {
  background: #3d8b40;
  transform: translateY(-2px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 24px 16px;
  }
  
  .dashboard {
    grid-template-columns: 1fr;
  }
  
  .modules {
    grid-template-columns: 1fr;
  }
  
  .card-value {
    font-size: 28px;
  }
}
</style>