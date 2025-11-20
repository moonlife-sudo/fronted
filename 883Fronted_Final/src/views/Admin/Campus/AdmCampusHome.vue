<template>
  <div class="home-page">
    <main class="container">
      <section class="welcome-section">
        <h1>欢迎使用校园生活系统</h1>
      </section>

      <!-- 管理员视图 -->
      <div v-if="currentRole === 'admin'" class="role-view admin-view active">
        <div class="dashboard-grid">
          <div class="card stat-card">
            <div class="card-header">
              <i class="bi bi-house-door"></i>
              <h3>宿舍统计</h3>
            </div>
            <div class="card-body">
              <div class="stat-item">
                <span class="stat-value">24</span>
                <span class="stat-label">总宿舍数</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">18</span>
                <span class="stat-label">已分配</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">6</span>
                <span class="stat-label">空余</span>
              </div>
            </div>
          </div>

          <div class="card quick-action-card">
            <div class="card-header">
              <i class="bi bi-speedometer2"></i>
              <h3>快速操作</h3>
            </div>
            <div class="card-body">
              <router-link to="/admin/dorm" class="action-btn">
                <i class="bi bi-gear"></i>
                <span>宿舍管理</span>
              </router-link>
              <router-link to="/admin/dormassign" class="action-btn">
                <i class="bi bi-people"></i>
                <span>宿舍分配</span>
              </router-link>

            </div>
          </div>

          <div class="card notice-card">
            <div class="card-header">
              <i class="bi bi-megaphone"></i>
              <h3>通知公告</h3>
            </div>
            <div class="card-body">
              <div class="notice-item">
                <h4>宿舍安全检查通知</h4>
                <p>下周三将进行全校宿舍安全检查，请各位老师提前通知学生做好准备。</p>
                <small>2023-06-15</small>
              </div>
              <div class="notice-item">
                <h4>暑期宿舍安排</h4>
                <p>暑期留校学生宿舍安排表已发布，请及时查看并通知相关学生。</p>
                <small>2023-06-10</small>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdmCampusHome',
  data() {
    return {
      currentRole: 'admin', // 默认显示管理员视图
      post: {
        title: '',
        content: ''
      }
    }
  },
  methods: {
    switchRole(role) {
      this.currentRole = role
    },
    submitPost() {
      if (!this.post.title || !this.post.content) {
        alert('请填写标题和内容')
        return
      }
      
      // 这里可以添加实际的提交逻辑
      alert(`帖子"${this.post.title}"已发布成功!`)
      this.post.title = ''
      this.post.content = ''
    }
  },
  mounted() {
    // 默认显示管理员视图
    this.currentRole = 'admin'
  }
}
</script>

<style>
/* 移除 scoped 属性，使用全局样式 */
.home-page {
  --primary-color: #2A5CAA;
  --primary-light: #E8F0FE;
  --secondary-color: #4CAF50;
  --secondary-light: #E8F5E9;
  --text-color: #333;
  --text-light: #666;
  --text-lighter: #999;
  --bg-color: #F9F9F9;
  --card-bg: #FFF;
  --border-color: #E0E0E0;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --radius: 8px;
  --transition: all 0.3s ease;
}

.home-page * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-page {
  font-family: 'Roboto', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
}

.home-page a {
  text-decoration: none;
  color: inherit;
}

.home-page img {
  max-width: 100%;
  height: auto;
}

/* 容器布局 */
.home-page .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 20px;
}

/* 欢迎区域 */
.home-page .welcome-section {
  text-align: center;
  margin: 30px 0 40px;
}

.home-page .welcome-section h1 {
  font-size: 2.2rem;
  color: var(--primary-color);
  margin-bottom: 10px;
}

.home-page .welcome-section .subtitle {
  font-size: 1.1rem;
  color: var(--text-light);
}

/* 角色选择器 */
.home-page .role-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 10px;
}

.home-page .role-btn {
  padding: 10px 20px;
  border: none;
  background-color: #EEE;
  color: var(--text-light);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
}

.home-page .role-btn:hover {
  background-color: #DDD;
}

.home-page .role-btn.active {
  background-color: var(--primary-color);
  color: white;
}

/* 角色视图 */
.home-page .role-view {
  display: none;
}

.home-page .role-view.active {
  display: block;
}

/* 仪表盘网格布局 */
.home-page .dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

/* 卡片通用样式 */
.home-page .card {
  background-color: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition);
}

.home-page .card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.home-page .card-header {
  background-color: var(--primary-color);
  color: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.home-page .card-header h3 {
  font-size: 1.2rem;
  font-weight: 500;
}

.home-page .card-header i {
  font-size: 1.2rem;
}

.home-page .card-body {
  padding: 20px;
}

/* 统计卡片 */
.home-page .stat-card .card-body {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.home-page .stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-page .stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
}

.home-page .stat-label {
  font-size: 0.9rem;
  color: var(--text-light);
}

/* 快速操作卡片 */
.home-page .action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: var(--radius);
  transition: var(--transition);
  text-decoration: none;
}

.home-page .action-btn:hover {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.home-page .action-btn i {
  font-size: 1.2rem;
}

/* 近期活动卡片 */
.home-page .activity-item {
  display: flex;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.home-page .activity-item:last-child {
  border-bottom: none;
}

.home-page .activity-icon {
  width: 36px;
  height: 36px;
  background-color: var(--primary-light);
  color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-page .activity-icon i {
  font-size: 1rem;
}

.home-page .activity-content p {
  margin-bottom: 4px;
}

.home-page .activity-content small {
  color: var(--text-lighter);
  font-size: 0.8rem;
}

/* 通知卡片 */
.home-page .notice-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.home-page .notice-item:last-child {
  border-bottom: none;
}

.home-page .notice-item h4 {
  margin-bottom: 8px;
  color: var(--primary-color);
}

.home-page .notice-item p {
  margin-bottom: 8px;
  color: var(--text-light);
}

.home-page .notice-item small {
  color: var(--text-lighter);
  font-size: 0.8rem;
}

/* 按钮样式 */
.home-page .primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
}

.home-page .primary-btn:hover {
  background-color: #3d8b40;
}

/* 表单样式 */
.home-page .form-group {
  margin-bottom: 15px;
}

.home-page .form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.home-page .form-group input,
.home-page .form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-family: inherit;
  transition: var(--transition);
}

.home-page .form-group input:focus,
.home-page .form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.2);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .home-page .welcome-section h1 {
    font-size: 1.8rem;
  }
  
  .home-page .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .home-page .role-selector {
    flex-direction: column;
    align-items: stretch;
  }
  
  .home-page .role-btn {
    width: 100%;
  }
  
  .home-page .container {
    padding: 80px 15px 20px;
  }
}
</style>