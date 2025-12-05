<template>
  <div class="forum-page">
    <main class="forum-container">
      <div class="forum-header">
        <h1>Communication Platform</h1>
        <div class="search-container">
          <input 
            type="text" 
            placeholder="Search posts..." 
            class="search-input"
            v-model="searchTerm"
            @keypress.enter="searchPosts"
          >
          <button class="search-button" @click="searchPosts">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>

      <div class="post-list">
        <div v-if="loadingState" class="loading-state">
          <i class="bi bi-hourglass-split spinning"></i>
          <span>Loading...</span>
        </div>
        <div v-else-if="filteredPosts.length === 0" class="empty-state">
          <i class="bi bi-chat-dots"></i>
          <span>{{ searchTerm ? 'No matching posts found' : 'No posts yet, come and post the first one!' }}</span>
        </div>
        <article 
          v-for="post in filteredPosts" 
          :key="post.id"
          class="post-card"
          @click="goToPostDetail(post.id)"
        >
          <div class="post-header">
            <h2 class="post-title">{{ post.title }}</h2>
            <div class="post-meta">
              <span class="post-author">{{ post.author }}</span>
              <span class="post-date">{{ formatDate(post.createTime) }}</span>
            </div>
          </div>
          <div class="post-content">
            <p>{{ post.content }}</p>
          </div>
          <div class="post-footer">
            <!-- 🎯 Click "Read More" to go to post detail page -->
            <button class="read-more" @click.stop="goToPostDetail(post.id)">Read More</button>
            <div class="post-actions">
              <button class="like-btn" @click.stop="likePost(post.id)" :disabled="likingPosts.includes(post.id)">
                <i class="bi bi-heart"></i> {{ post.likes || 0 }}
              </button>
              <span class="comment-count">
                <i class="bi bi-chat-left-text"></i> {{ post.comments || 0 }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <button 
        class="create-post-btn" 
        aria-label="Create new post"
        @click="createNewPost"
      >
        <i class="bi bi-plus-lg"></i>
      </button>
    </main>
  </div>
</template>

<script>
export default {
  name: 'StuForum',
  data() {
    return {
      searchTerm: '',
      likingPosts: [] // 正在点赞的帖子ID列表
    }
  },
  computed: {
    // 从store获取所有帖子
    allPosts() {
      return this.$store.getters.getAllPosts
    },
    // 获取加载状态
    loadingState() {
      return this.$store.getters.getLoadingState
    },
    // 过滤搜索结果
    filteredPosts() {
      if (!this.searchTerm) {
        return this.allPosts
      }
      
      const term = this.searchTerm.toLowerCase()
      return this.allPosts.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.content.toLowerCase().includes(term)
      )
    }
  },
  methods: {
    searchPosts() {
      if (this.searchTerm && this.filteredPosts.length === 0) {
        alert('No matching posts found')
      }
    },
    goToPostDetail(postId) {
      // 🎯 Go to post detail page - use the correct path /student/postdetail
      this.$router.push('/student/postdetail')
    },
    createNewPost() {
      // 跳转到首页的快速发帖功能
      this.$router.push('/student/campus')
    },
    
    // 点赞帖子
    async likePost(postId) {
      if (this.likingPosts.includes(postId)) return
      
      try {
        this.likingPosts.push(postId)
        await this.$store.dispatch('likePost', postId)
      } catch (error) {
        console.error('点赞失败:', error)
        this.$message?.error('点赞失败，请稍后重试')
      } finally {
        this.likingPosts = this.likingPosts.filter(id => id !== postId)
      }
    },
    
    // 格式化日期
    formatDate(dateStr) {
      const date = new Date(dateStr)
      const now = new Date()
      const diff = now - date
      const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
          const diffHours = Math.floor(diff / (1000 * 60 * 60))
          const diffMinutes = Math.floor(diff / (1000 * 60))
          
          if (diffHours === 0) {
            if (diffMinutes < 1) return 'Just now'
            return `${diffMinutes} minutes ago`
          }
          return `${diffHours} hours ago`
        } else if (diffDays === 1) {
          return 'Yesterday'
        } else if (diffDays < 7) {
          return `${diffDays} days ago`
        } else {
          return date.toLocaleDateString('en-US', { 
            month: '2-digit', 
            day: '2-digit' 
          })
        }
    }
  },
  
  async mounted() {
    // 组件挂载时获取帖子数据
    try {
      await this.$store.dispatch('fetchPosts')
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    }
  }
}
</script>

<style>
/* 样式保持不变 */
:root {
  --primary-color: #2A5CAA;
  --secondary-color: #4CAF50;
  --text-color: #333;
  --light-text: #666;
  --lighter-text: #999;
  --bg-color: #f8f9fa;
  --card-bg: #fff;
  --border-color: #e0e0e0;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --radius: 8px;
  --spacing: 16px;
  --small-spacing: 8px;
}

.forum-page {
  font-family: 'Roboto', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

.forum-container {
  max-inline-size: 1200px;
  margin: 80px auto 40px;
  padding: 0 var(--spacing);
}

.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-end: var(--spacing);
  flex-wrap: wrap;
  gap: var(--spacing);
}

.forum-header h1 {
  color: var(--primary-color);
  margin: 0;
  font-size: 24px;
}

.search-container {
  display: flex;
  align-items: center;
  max-inline-size: 400px;
  inline-size: 100%;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius) 0 0 var(--radius);
  font-size: 16px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.search-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 0 var(--radius) var(--radius) 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #1e4a8a;
}

.post-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing);
  margin-block-start: var(--spacing);
}

.post-card {
  background-color: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: var(--spacing);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.post-header {
  margin-block-end: var(--small-spacing);
}

.post-title {
  font-size: 18px;
  margin: 0 0 var(--small-spacing);
  color: var(--primary-color);
}

.post-meta {
  display: flex;
  gap: var(--spacing);
  font-size: 14px;
  color: var(--light-text);
}

.post-content {
  margin-block-end: var(--spacing);
  color: var(--text-color);
}

.post-content p {
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.read-more {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--radius);
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.read-more:hover {
  background-color: var(--primary-color);
  color: white;
}

.post-actions {
  display: flex;
  align-items: center;
  gap: var(--small-spacing);
}

.like-btn {
  background: none;
  border: 1px solid #e0e0e0;
  color: var(--light-text);
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.like-btn:hover:not(:disabled) {
  background-color: #fff5f5;
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.like-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.comment-count {
  color: var(--light-text);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 加载和空状态样式 */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--lighter-text);
  text-align: center;
}

.loading-state i,
.empty-state i {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: var(--lighter-text);
}

.loading-state i.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.create-post-btn {
  position: fixed;
  inset-block-end: 30px;
  inset-inline-end: 30px;
  inline-size: 56px;
  block-size: 56px;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.create-post-btn:hover {
  background-color: #3d8b40;
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .forum-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-container {
    max-inline-size: 100%;
  }
  
  .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--small-spacing);
  }
  
  .post-actions {
    align-self: flex-end;
  }
}
</style>