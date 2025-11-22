<template>
  <div class="home-page">
    <main class="container">
      <section class="welcome-section">
        <h1>欢迎使用校园生活系统</h1>
      </section>

      <!-- 学生视图 -->
      <div v-if="currentRole === 'student'" class="role-view student-view active">
        <div class="dashboard-grid">
          <div class="card dorm-info-card">
            <div class="card-header">
              <i class="bi bi-door-open"></i>
              <h3>我的宿舍</h3>
            </div>
            <div class="card-body">
              <div class="dorm-info">
                <div class="dorm-pending">
                  <i class="bi bi-hourglass-split"></i>
                  <h4>您的宿舍分配结果尚未公布</h4>
                  <p>请先填写宿舍偏好问卷，系统将根据您的偏好进行智能分配</p>
                </div>
              </div>
              <router-link to="/student/studorm" class="primary-btn">
                <i class="bi bi-pencil"></i>
                <span>修改宿舍偏好</span>
              </router-link>
            </div>
          </div>

          <div class="card forum-posts-card">
            <div class="card-header">
              <i class="bi bi-newspaper"></i>
              <h3>最新帖子</h3>
            </div>
            <div class="card-body">
              <div class="post-item">
                <h4>宿舍热水供应时间调整</h4>
                <p class="post-excerpt">从下周一开始，宿舍热水供应时间调整为...</p>
                <div class="post-meta">
                  <span>王老师</span>
                  <span>2023-06-14</span>
                </div>
              </div>
              <div class="post-item">
                <h4>关于宿舍安全检查的通知</h4>
                <p class="post-excerpt">下周三将进行全校宿舍安全检查，请各位同学...</p>
                <div class="post-meta">
                  <span>李老师</span>
                  <span>2023-06-12</span>
                </div>
              </div>
              <router-link to="/student/forum" class="text-link">
                查看更多帖子 <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>

          <div class="card quick-post-card">
            <div class="card-header">
              <i class="bi bi-pencil-square"></i>
              <h3>快速发帖</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitPost">
                <div class="form-group">
                  <label for="post-title">标题</label>
                  <input 
                    type="text" 
                    id="post-title" 
                    v-model="post.title"
                    placeholder="输入帖子标题"
                  >
                </div>
                <div class="form-group">
                  <label for="post-content">内容</label>
                  <textarea 
                    id="post-content" 
                    rows="3" 
                    v-model="post.content"
                    placeholder="输入帖子内容"
                  ></textarea>
                </div>
                <button type="submit" class="primary-btn">
                  <i class="bi bi-send"></i>
                  <span>发布</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'StuCampusHome',
  data() {
    return {
      currentRole: 'student', // 默认显示学生视图
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
    // 默认显示学生视图
    this.currentRole = 'student'
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
  max-inline-size: 100%;
  block-size: auto;
}

/* 容器布局 */
.home-page .container {
  max-inline-size: 1200px;
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
  margin-block-end: 10px;
}

.home-page .welcome-section .subtitle {
  font-size: 1.1rem;
  color: var(--text-light);
}

/* 角色选择器 */
.home-page .role-selector {
  display: flex;
  justify-content: center;
  margin-block-end: 30px;
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
  margin-block-end: 40px;
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

/* 宿舍待分配样式 */
.home-page .dorm-pending {
  text-align: center;
  padding: 20px 0;
  color: var(--text-light);
}

.home-page .dorm-pending i {
  font-size: 3rem;
  color: var(--primary-color);
  margin-block-end: 15px;
  display: block;
}

.home-page .dorm-pending h4 {
  color: var(--primary-color);
  margin-block-end: 10px;
  font-size: 1.2rem;
}

.home-page .dorm-pending p {
  color: var(--text-light);
  line-height: 1.5;
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
  margin-block-end: 10px;
  border-radius: var(--radius);
  transition: var(--transition);
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
  border-block-end: 1px solid var(--border-color);
}

.home-page .activity-item:last-child {
  border-block-end: none;
}

.home-page .activity-icon {
  inline-size: 36px;
  block-size: 36px;
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
  margin-block-end: 4px;
}

.home-page .activity-content small {
  color: var(--text-lighter);
  font-size: 0.8rem;
}

/* 通知卡片 */
.home-page .notice-item {
  padding: 12px 0;
  border-block-end: 1px solid var(--border-color);
}

.home-page .notice-item:last-child {
  border-block-end: none;
}

.home-page .notice-item h4 {
  margin-block-end: 8px;
  color: var(--primary-color);
}

.home-page .notice-item p {
  margin-block-end: 8px;
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
  text-decoration: none;
  justify-content: center;
  inline-size: 100%;
  margin-block-start: 15px;
}

.home-page .primary-btn:hover {
  background-color: #3d8b40;
}

/* 表单样式 */
.home-page .form-group {
  margin-block-end: 15px;
}

.home-page .form-group label {
  display: block;
  margin-block-end: 8px;
  font-weight: 500;
}

.home-page .form-group input,
.home-page .form-group textarea {
  inline-size: 100%;
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

/* 帖子卡片 */
.home-page .post-item {
  padding: 12px 0;
  border-block-end: 1px solid var(--border-color);
}

.home-page .post-item:last-child {
  border-block-end: none;
}

.home-page .post-item h4 {
  margin-block-end: 8px;
  color: var(--primary-color);
}

.home-page .post-excerpt {
  margin-block-end: 8px;
  color: var(--text-light);
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.home-page .post-meta {
  display: flex;
  justify-content: space-between;
  color: var(--text-lighter);
  font-size: 0.9rem;
}

.home-page .text-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--secondary-color);
  margin-block-start: 10px;
  font-weight: 500;
}

/* 快速链接卡片 */
.home-page .link-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: var(--radius);
  transition: var(--transition);
}

.home-page .link-item:hover {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.home-page .link-item i {
  font-size: 1.2rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .home-page .welcome-section h1 {
    font-size: 1.8rem;
  }
  
  .home-page .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .home-page .dorm-info {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .home-page .role-selector {
    flex-direction: column;
    align-items: stretch;
  }
  
  .home-page .role-btn {
    inline-size: 100%;
  }
  
  .home-page .container {
    padding: 80px 15px 20px;
  }
}
</style>