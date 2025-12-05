<template>
  <div class="post-detail-page">
    <main class="post-detail-container">
      <article class="post-card">
        <div class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <div class="author-info">
              <img 
                loading="lazy" 
                :src="post.authorAvatar" 
                :alt="post.author + '\'s avatar'" 
                class="author-avatar"
              >
              <span class="author-name">{{ post.author }}</span>
            </div>
            <div class="post-time">
              <i class="bi bi-clock"></i>
              <span>{{ post.time }}</span>
            </div>
          </div>
        </div>
        
        <div class="post-content" v-html="post.content"></div>
        
        <div class="post-actions">
          <button 
            class="btn btn-like" 
            :class="{ 'liked': isLiked }"
            @click="toggleLike"
          >
            <i :class="isLiked ? 'bi bi-hand-thumbs-up-fill' : 'bi bi-hand-thumbs-up'"></i>
            <span>Like ({{ likeCount }})</span>
          </button>
          <button class="btn btn-comment">
            <i class="bi bi-chat-left-text"></i>
            <span>Comment ({{ comments.length }})</span>
          </button>
          <div class="admin-actions" v-if="isAdmin">
            <button class="btn btn-edit" @click="editPost">
              <i class="bi bi-pencil"></i>
              <span>Edit</span>
            </button>
            <button class="btn btn-delete" @click="deletePost">
              <i class="bi bi-trash"></i>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </article>
      
      <section class="comment-section">
        <h2 class="section-title">Comments ({{ comments.length }})</h2>
        
        <form class="comment-form" @submit.prevent="submitComment">
          <img 
            loading="lazy" 
            :src="currentUser.avatar" 
            :alt="currentUser.name + '\'s avatar'" 
            class="user-avatar"
          >
          <div class="form-group">
            <textarea 
              v-model="newComment" 
              placeholder="Write your comment..." 
              rows="3" 
              required
            ></textarea>
            <button type="submit" class="btn btn-submit">Post Comment</button>
          </div>
        </form>
        
        <div class="comment-list">
          <div 
            v-for="comment in displayedComments" 
            :key="comment.id"
            class="comment-item"
          >
            <img 
              loading="lazy" 
              :src="comment.avatar" 
              :alt="comment.author + '\'s avatar'" 
              class="comment-avatar"
            >
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
              <div class="comment-actions">
                <button class="btn btn-reply" @click="replyToComment(comment)">
                  Reply
                </button>
                <button 
                  v-if="canDeleteComment(comment)"
                  class="btn btn-delete-comment" 
                  @click="deleteComment(comment.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <button 
            v-if="hasMoreComments" 
            class="btn btn-load-more" 
            @click="loadMoreComments"
          >
            Load More Comments
          </button>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'PostDetail',
  data() {
    return {
      isLiked: false,
      likeCount: 24,
      newComment: '',
      commentsPerPage: 5,
      currentPage: 1,
      post: {
        id: 1,
        title: 'Notice on Adjustment of Dormitory Hot Water Supply Time',
        author: 'Logistics Management Office',
        authorAvatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/Avatar',
        time: '2023-10-15 14:30',
        content: `
          <p>Dear students:</p>
          <p>According to the school's energy management requirements, the hot water supply time in the dormitory area will be adjusted from November 1, 2023, as follows:</p>
          <ul>
            <li>Morning: 6:30-8:30</li>
            <li>Evening: 17:30-23:30</li>
          </ul>
          <p>Please arrange your washing time reasonably. In case of special circumstances, you can contact the dormitory administrator.</p>
          <p>Notice is hereby given.</p>
          <p>Logistics Management Office</p>
          <p>October 15, 2023</p>
        `
      },
      comments: [
        {
          id: 1,
          author: 'Zhang San',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/Avatar',
          time: '2023-10-15 15:20',
          content: 'Is the hot water supply time the same on weekends?',
          userId: 2
        },
        {
          id: 2,
          author: 'Li Si',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/Avatar',
          time: '2023-10-15 16:05',
          content: 'The morning time is a bit tight, can we consider extending it to 9:00?',
          userId: 3
        },
        {
          id: 3,
          author: 'Teacher Wang',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/Avatar',
          time: '2023-10-15 16:30',
          content: 'We will collect students\' opinions and feedback to the logistics department, thank you for your understanding and cooperation.',
          userId: 4
        },
        {
          id: 4,
          author: 'Student Zhao',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/Avatar',
          time: '2023-10-15 17:15',
          content: 'Support this adjustment, the evening time is reasonable.',
          userId: 5
        },
        {
          id: 5,
          author: 'Student Qian',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/Avatar',
          time: '2023-10-15 18:00',
          content: 'Hope the morning time can be extended by another half hour.',
          userId: 6
        },
        {
          id: 6,
          author: 'Student Sun',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/Avatar',
          time: '2023-10-15 19:20',
          content: 'This time arrangement is scientific, support it!',
          userId: 7
        },
        {
          id: 7,
          author: 'Teacher Zhou',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/Avatar',
          time: '2023-10-15 20:10',
          content: 'We will consider adjustments based on actual conditions, thank you for your suggestion.',
          userId: 8
        },
        {
          id: 8,
          author: 'Student Wu',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/Avatar',
          time: '2023-10-15 21:05',
          content: 'The evening time is acceptable, the morning is indeed a bit early.',
          userId: 9
        }
      ],
      currentUser: {
        id: 1,
        name: 'Current User',
        avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/Avatar',
        isAdmin: false
      },
      isAdmin: false // 根据实际用户权限设置
    }
  },
  computed: {
    displayedComments() {
      return this.comments.slice(0, this.currentPage * this.commentsPerPage)
    },
    hasMoreComments() {
      return this.displayedComments.length < this.comments.length
    }
  },
  methods: {
    toggleLike() {
      this.isLiked = !this.isLiked
      this.likeCount = this.isLiked ? this.likeCount + 1 : this.likeCount - 1
    },
    submitComment() {
      if (!this.newComment.trim()) {
        alert('Please enter comment content')
        return
      }

      const newComment = {
        id: Date.now(),
        author: this.currentUser.name,
        avatar: this.currentUser.avatar,
        time: 'Just now',
        content: this.newComment,
        userId: this.currentUser.id
      }

      this.comments.unshift(newComment)
      this.newComment = ''
    },
    deleteComment(commentId) {
      if (confirm('Are you sure you want to delete this comment?')) {
        const index = this.comments.findIndex(comment => comment.id === commentId)
        if (index !== -1) {
          this.comments.splice(index, 1)
        }
      }
    },
    deletePost() {
      if (confirm('Are you sure you want to delete this post?')) {
        alert('Post deleted, returning to communication platform')
        this.$router.push('/forum')
      }
    },
    editPost() {
      alert('Enter edit mode')
      // In actual application, this will redirect to edit page or display edit form
    },
    replyToComment(comment) {
      this.newComment = `@${comment.author} `
      // Focus on comment input
      this.$nextTick(() => {
        const textarea = this.$el.querySelector('textarea')
        if (textarea) {
          textarea.focus()
        }
      })
    },
    canDeleteComment(comment) {
      // Admin or comment author can delete the comment
      return this.isAdmin || comment.userId === this.currentUser.id
    },
    loadMoreComments() {
      this.currentPage += 1
    }
  },
  mounted() {
    // 模拟加载用户权限信息
    // 在实际应用中，这里应该从Vuex或localStorage获取用户信息
    this.isAdmin = false // 根据实际用户权限设置
  }
}
</script>

<style scoped>
.post-detail-page {
  --primary-color: #2A5CAA;
  --secondary-color: #4CAF50;
  --light-color: #FFFFFF;
  --dark-color: #333333;
  --gray-color: #F5F5F5;
  --border-color: #E0E0E0;
  --text-color: #333333;
  --text-light: #757575;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --radius: 8px;
  --transition: all 0.3s ease;
}

.post-detail-page {
  font-family: 'Roboto', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--text-color);
  background-color: var(--gray-color);
  line-height: 1.6;
  min-height: 100vh;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: var(--radius);
  border: none;
  background-color: transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: var(--transition);
  font-size: 14px;
  gap: 6px;
}

.btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.btn i {
  font-size: 16px;
}

.btn-like.liked {
  color: #E53935;
}

.btn-comment {
  color: var(--primary-color);
}

.btn-edit {
  color: var(--primary-color);
}

.btn-delete, .btn-delete-comment {
  color: #E53935;
}

.btn-submit {
  background-color: var(--primary-color);
  color: var(--light-color);
  padding: 8px 20px;
}

.btn-submit:hover {
  background-color: #1E4B8F;
  color: var(--light-color);
}

.btn-load-more {
  width: 100%;
  margin-top: 20px;
  border: 1px solid var(--border-color);
  background-color: var(--light-color);
}

.btn-load-more:hover {
  background-color: var(--gray-color);
}

/* 主容器 */
.post-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 80px 20px 40px;
}

/* 帖子卡片 */
.post-card {
  background-color: var(--light-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 24px;
  margin-bottom: 24px;
}

.post-header {
  margin-bottom: 20px;
}

.post-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--dark-color);
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-light);
  font-size: 14px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 500;
  color: var(--text-color);
}

.post-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.post-content {
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.8;
}

.post-content >>> p {
  margin-bottom: 12px;
}

.post-content >>> ul {
  margin-left: 24px;
  margin-bottom: 12px;
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.admin-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

/* 评论区域 */
.comment-section {
  background-color: var(--light-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

.comment-form {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  resize: none;
  font-family: inherit;
  font-size: 14px;
  transition: var(--transition);
}

.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.2);
}

/* 评论列表 */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.comment-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 500;
  color: var(--text-color);
}

.comment-time {
  font-size: 12px;
  color: var(--text-light);
}

.comment-text {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-reply {
  font-size: 12px;
  color: var(--text-light);
  padding: 4px 8px;
}

.btn-reply:hover {
  color: var(--primary-color);
}

.btn-delete-comment {
  padding: 4px;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-detail-container {
    padding: 80px 16px 40px;
  }
  
  .post-card, .comment-section {
    padding: 16px;
  }
  
  .post-title {
    font-size: 20px;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .post-actions {
    flex-wrap: wrap;
  }
  
  .admin-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
  
  .comment-form {
    flex-direction: column;
  }
  
  .user-avatar {
    align-self: flex-start;
  }
}
</style>