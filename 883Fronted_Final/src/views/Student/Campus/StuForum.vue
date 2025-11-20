<template>
  <div class="forum-page">
    <main class="forum-container">
      <div class="forum-header">
        <h1>交流平台</h1>
        <div class="search-container">
          <input 
            type="text" 
            placeholder="搜索帖子..." 
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
              <span class="post-date">{{ post.date }}</span>
            </div>
          </div>
          <div class="post-content">
            <p>{{ post.content }}</p>
          </div>
          <div class="post-footer">
            <!-- 🎯 点击"阅读更多"跳转到帖子详情页 -->
            <button class="read-more" @click.stop="goToPostDetail(post.id)">阅读更多</button>
            <div class="post-actions">
              <span class="comment-count">
                <i class="bi bi-chat-left-text"></i> {{ post.commentCount }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <button 
        class="create-post-btn" 
        aria-label="创建新帖子"
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
      posts: [
        {
          id: 1,
          title: '关于宿舍卫生检查的通知',
          author: '张老师',
          date: '2023-10-15',
          content: '本周五下午3点将进行全校宿舍卫生检查，请各位同学提前做好宿舍卫生清洁工作。检查内容包括床铺整理、地面清洁、物品摆放等...',
          commentCount: 12
        },
        {
          id: 2,
          title: '宿舍热水供应时间调整',
          author: '李同学',
          date: '2023-10-12',
          content: '由于季节变化，从下周一开始宿舍热水供应时间调整为：早上6:30-8:30，中午12:00-14:00，晚上17:30-23:30。请大家合理安排时间...',
          commentCount: 8
        },
        {
          id: 3,
          title: '寻找丢失的校园卡',
          author: '王同学',
          date: '2023-10-10',
          content: '今天下午在图书馆附近丢失校园卡一张，卡号为20231001，卡套为蓝色。如有拾到者请联系13812345678，非常感谢！...',
          commentCount: 5
        },
        {
          id: 4,
          title: '宿舍楼自习室开放通知',
          author: '赵老师',
          date: '2023-10-08',
          content: '为方便同学们学习，宿舍楼1楼自习室即日起延长开放时间至晚上11点。请同学们保持安静，爱护公共设施，离开时带走个人物品...',
          commentCount: 15
        }
      ]
    }
  },
  computed: {
    filteredPosts() {
      if (!this.searchTerm) {
        return this.posts
      }
      
      const term = this.searchTerm.toLowerCase()
      return this.posts.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.content.toLowerCase().includes(term)
      )
    }
  },
  methods: {
    searchPosts() {
      if (this.searchTerm && this.filteredPosts.length === 0) {
        alert('没有找到匹配的帖子')
      }
    },
    goToPostDetail(postId) {
      // 🎯 跳转到帖子详情页 - 使用正确的路径 /student/postdetail
      this.$router.push('/student/postdetail')
    },
    createNewPost() {
      // 跳转到创建新帖子页面
      console.log('创建新帖子')
      // this.$router.push('/post/new')
    }

    /*
    //详情页显示特定帖子的内容
    goToPostDetail(postId) {
    this.$router.push(`/student/postdetail/${postId}`) }
     })
    }
    */
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
  max-width: 1200px;
  margin: 80px auto 40px;
  padding: 0 var(--spacing);
}

.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing);
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
  max-width: 400px;
  width: 100%;
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
  margin-top: var(--spacing);
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
  margin-bottom: var(--small-spacing);
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
  margin-bottom: var(--spacing);
  color: var(--text-color);
}

.post-content p {
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
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

.comment-count {
  color: var(--light-text);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.create-post-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 56px;
  height: 56px;
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
    max-width: 100%;
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