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
                :alt="post.author + '的头像'" 
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
            <span>点赞 ({{ likeCount }})</span>
          </button>
          <button class="btn btn-comment">
            <i class="bi bi-chat-left-text"></i>
            <span>评论 ({{ comments.length }})</span>
          </button>
          <div class="admin-actions" v-if="isAdmin">
            <button class="btn btn-edit" @click="editPost">
              <i class="bi bi-pencil"></i>
              <span>编辑</span>
            </button>
            <button class="btn btn-delete" @click="deletePost">
              <i class="bi bi-trash"></i>
              <span>删除</span>
            </button>
          </div>
        </div>
      </article>
      
      <section class="comment-section">
        <h2 class="section-title">评论 ({{ comments.length }})</h2>
        
        <form class="comment-form" @submit.prevent="submitComment">
          <img 
            loading="lazy" 
            :src="currentUser.avatar" 
            :alt="currentUser.name + '的头像'" 
            class="user-avatar"
          >
          <div class="form-group">
            <textarea 
              v-model="newComment" 
              placeholder="写下你的评论..." 
              rows="3" 
              required
            ></textarea>
            <button type="submit" class="btn btn-submit">发表评论</button>
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
              :alt="comment.author + '的头像'" 
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
                  回复
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
          加载更多评论
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
        title: '关于宿舍热水供应时间调整的通知',
        author: '后勤管理处',
        authorAvatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/头像',
        time: '2023-10-15 14:30',
        content: `
          <p>各位同学：</p>
          <p>根据学校能源管理要求，自2023年11月1日起，宿舍区热水供应时间将调整为：</p>
          <ul>
            <li>早上：6:30-8:30</li>
            <li>晚上：17:30-23:30</li>
          </ul>
          <p>请同学们合理安排洗漱时间。如遇特殊情况，可联系宿舍管理员。</p>
          <p>特此通知。</p>
          <p>后勤管理处</p>
          <p>2023年10月15日</p>
        `
      },
      comments: [
        {
          id: 1,
          author: '张三',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/头像',
          time: '2023-10-15 15:20',
          content: '请问周末的热水供应时间是否相同？',
          userId: 2
        },
        {
          id: 2,
          author: '李四',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/头像',
          time: '2023-10-15 16:05',
          content: '早上时间有点紧张，能否考虑延长到9点？',
          userId: 3
        },
        {
          id: 3,
          author: '王老师',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/头像',
          time: '2023-10-15 16:30',
          content: '同学们的意见我们会收集并反馈给后勤部门，感谢大家的理解与配合。',
          userId: 4
        },
        {
          id: 4,
          author: '赵同学',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/头像',
          time: '2023-10-15 17:15',
          content: '支持这个调整，晚上时间很合理。',
          userId: 5
        },
        {
          id: 5,
          author: '钱同学',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/头像',
          time: '2023-10-15 18:00',
          content: '希望早上能再延长半小时。',
          userId: 6
        },
        {
          id: 6,
          author: '孙同学',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/头像',
          time: '2023-10-15 19:20',
          content: '这个时间安排很科学，支持！',
          userId: 7
        },
        {
          id: 7,
          author: '周老师',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/头像',
          time: '2023-10-15 20:10',
          content: '会根据实际情况考虑调整，谢谢建议。',
          userId: 8
        },
        {
          id: 8,
          author: '吴同学',
          avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/头像',
          time: '2023-10-15 21:05',
          content: '晚上时间可以接受，早上确实有点早。',
          userId: 9
        }
      ],
      currentUser: {
        id: 1,
        name: '当前用户',
        avatar: 'https://placeholder.pics/svg/40x40/DEDEDE/555555/头像',
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
        alert('请输入评论内容')
        return
      }

      const newComment = {
        id: Date.now(),
        author: this.currentUser.name,
        avatar: this.currentUser.avatar,
        time: '刚刚',
        content: this.newComment,
        userId: this.currentUser.id
      }

      this.comments.unshift(newComment)
      this.newComment = ''
    },
    deleteComment(commentId) {
      if (confirm('确定要删除这条评论吗？')) {
        const index = this.comments.findIndex(comment => comment.id === commentId)
        if (index !== -1) {
          this.comments.splice(index, 1)
        }
      }
    },
    deletePost() {
      if (confirm('确定要删除这篇帖子吗？')) {
        alert('帖子已删除，将返回交流平台')
        this.$router.push('/forum')
      }
    },
    editPost() {
      alert('进入编辑模式')
      // 实际应用中这里会跳转到编辑页面或显示编辑表单
    },
    replyToComment(comment) {
      this.newComment = `@${comment.author} `
      // 聚焦到评论框
      this.$nextTick(() => {
        const textarea = this.$el.querySelector('textarea')
        if (textarea) {
          textarea.focus()
        }
      })
    },
    canDeleteComment(comment) {
      // 管理员或评论作者可以删除评论
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