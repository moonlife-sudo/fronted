<template>
  <div class="student-library">
    <main class="library-container">
      <!-- 标签页切换 -->
      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'books' }"
          @click="activeTab = 'books'"
        >
          兴趣推送
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'myBorrowings' }"
          @click="activeTab = 'myBorrowings'"
        >
          我的借阅
        </button>
      </div>
      
      <!-- 图书借阅标签页 -->
      <div class="tab-content" :class="{ active: activeTab === 'books' }">
        <section class="search-filter-section">
          <div class="search-box">
            <input 
              type="text" 
              placeholder="搜索书籍..." 
              v-model="searchQuery"
              @input="filterBooks"
            >
            <button class="search-btn"><i class="bi bi-search"></i></button>
          </div>
          <div class="filter-options">
            <select v-model="categoryFilter" @change="filterBooks">
              <option value="">所有分类</option>
              <option value="文学">文学</option>
              <option value="科技">科技</option>
              <option value="历史">历史</option>
              <option value="艺术">艺术</option>
            </select>
            <select v-model="sortBy" @change="sortBooks">
              <option value="">排序方式</option>
              <option value="popular">热门度</option>
              <option value="newest">最新上架</option>
              <option value="title">书名</option>
            </select>
          </div>
        </section>

        <section class="books-section">
          <div class="books-grid">
            <div 
              v-for="book in paginatedBooks" 
              :key="book.id" 
              class="book-card"
            >
              <img loading="lazy" :src="book.image" :alt="book.title" class="book-image">
              <div class="book-info">
                <h3 class="book-title">{{ book.title }}</h3>
                <p class="book-author">{{ book.author }}</p>
                <div class="tags">
                  <span v-for="tag in book.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
                <div class="book-meta">
                  <div class="meta-row">
                    <span class="book-current-count">当前数量: {{ book.currentCount }}/{{ book.totalCount }}</span>
                    <span class="book-status" :class="`status-${book.currentCount === 0 ? 'borrowed' : 'available'}`">
                      {{ book.currentCount === 0 ? '不可借阅' : '可借阅' }}
                    </span>
                  </div>
                  <button 
                    class="borrow-button" 
                    @click="borrowBook(book.id)"
                    :disabled="book.currentCount === 0"
                  >
                    借阅
                  </button>
                </div>
              </div>
            </div>
            
            <div v-if="filteredBooks.length === 0" class="no-books">
              没有找到匹配的书籍
            </div>
          </div>
        </section>
      </div>
      
      <!-- 我的借阅标签页 -->
      <div class="tab-content" :class="{ active: activeTab === 'myBorrowings' }">
        <section class="borrowings-section">
          <div class="borrowings-list">
            <div 
              v-for="borrowing in myBorrowings" 
              :key="borrowing.id" 
              class="borrowing-item"
            >
              <div class="borrowing-header">
                <span class="borrowing-title">{{ borrowing.bookTitle }}</span>
                <span class="borrowing-status" :class="`status-${borrowing.status}`">
                  {{ getBorrowingStatusText(borrowing.status) }}
                </span>
              </div>
              <div class="borrowing-details">
                <div class="borrowing-detail">
                  <i class="bi bi-person"></i>
                  <span>{{ borrowing.author }}</span>
                </div>
                <div class="borrowing-detail">
                  <i class="bi bi-calendar"></i>
                  <span>借阅日期: {{ borrowing.borrowDate }}</span>
                </div>
                <div class="borrowing-detail">
                  <i class="bi bi-clock"></i>
                  <span>应还日期: {{ borrowing.dueDate }}</span>
                </div>
                <div class="borrowing-detail" v-if="borrowing.returnDate">
                  <i class="bi bi-check-circle"></i>
                  <span>归还日期: {{ borrowing.returnDate }}</span>
                </div>
              </div>
              <div class="borrowing-actions">
                <button 
                  v-if="borrowing.status === 'borrowed'" 
                  class="btn btn-secondary" 
                  @click="renewBook(borrowing.id)"
                >
                  <i class="bi bi-arrow-clockwise"></i> 续借
                </button>
              </div>
            </div>
            <div v-if="myBorrowings.length === 0" class="no-borrowings">
              暂无借阅记录
            </div>
          </div>
        </section>
      </div>
    </main>
  
    <!-- 消息提示 -->
    <div v-if="message.show" class="message" :class="`message-${message.type}`">
      {{ message.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentLibrary',
  data() {
    return {
      activeTab: 'books',
      // 书籍数据
      books: [
        {
          id: 1,
          title: "JavaScript高级程序设计",
          author: "Nicholas C. Zakas",
          image: "https://placeholder.pics/svg/250x180/DEDEDE/555555/JS高级",
          tags: ["编程", "前端"],
          status: "available",
          totalCount: 5,
          currentCount: 3
        },
        {
          id: 2,
          title: "CSS权威指南",
          author: "Eric A. Meyer",
          image: "https://placeholder.pics/svg/250x180/DEDEDE/555555/CSS权威",
          tags: ["前端", "设计"],
          status: "available",
          totalCount: 3,
          currentCount: 0
        },
        {
          id: 3,
          title: "深入浅出Node.js",
          author: "朴灵",
          image: "https://placeholder.pics/svg/250x180/DEDEDE/555555/Node.js",
          tags: ["后端", "JavaScript"],
          status: "borrowed",
          totalCount: 4,
          currentCount: 1
        },
        {
          id: 4,
          title: "算法导论",
          author: "Thomas H. Cormen",
          image: "https://placeholder.pics/svg/250x180/DEDEDE/555555/算法导论",
          tags: ["计算机", "算法"],
          status: "available",
          totalCount: 6,
          currentCount: 2
        },
        {
          id: 5,
          title: "设计心理学",
          author: "Donald A. Norman",
          image: "https://placeholder.pics/svg/250x180/DEDEDE/555555/设计心理",
          tags: ["设计", "心理学"],
          status: "available",
          totalCount: 3,
          currentCount: 3
        },
        {
          id: 6,
          title: "人类简史",
          author: "Yuval Noah Harari",
          image: "https://placeholder.pics/svg/250x180/DEDEDE/555555/人类简史",
          tags: ["历史", "社会学"],
          status: "available",
          totalCount: 8,
          currentCount: 5
        },
        {
          id: 7,
          title: "Python编程：从入门到实践",
          author: "Eric Matthes",
          image: "https://placeholder.pics/svg/250x180/DEDEDE/555555/Python",
          tags: ["编程", "Python"],
          status: "borrowed",
          totalCount: 4,
          currentCount: 0
        },
        {
          id: 8,
          title: "经济学原理",
          author: "N. Gregory Mankiw",
          image: "https://placeholder.pics/svg/250x180/DEDEDE/555555/经济学",
          tags: ["经济", "教材"],
          status: "available",
          totalCount: 5,
          currentCount: 2
        },
        {
          id: 9,
          title: "百年孤独",
          author: "加西亚·马尔克斯",
          image: "https://placeholder.pics/svg/250x180/DEDEDE/555555/百年孤独",
          tags: ["文学", "经典"],
          status: "available",
          totalCount: 7,
          currentCount: 3
        },
        {
          id: 10,
          title: "活着",
          author: "余华",
          image: "https://placeholder.pics/svg/250x180/DEDEDE/555555/活着",
          tags: ["文学", "小说"],
          status: "available",
          totalCount: 6,
          currentCount: 4
        },
        {
          id: 11,
          title: "三体",
          author: "刘慈欣",
          image: "https://placeholder.pics/svg/250x180/DEDEDE/555555/三体",
          tags: ["科幻", "文学"],
          status: "available",
          totalCount: 5,
          currentCount: 1
        },
        {
          id: 12,
          title: "数据结构与算法",
          author: "严蔚敏",
          image: "https://placeholder.pics/svg/250x180/DEDEDE/555555/数据结构",
          tags: ["计算机", "算法"],
          status: "available",
          totalCount: 4,
          currentCount: 4
        }
      ],
      // 我的借阅数据
      myBorrowings: [
        {
          id: 1,
          bookId: 1,
          bookTitle: "JavaScript高级程序设计",
          author: "Nicholas C. Zakas",
          borrowDate: "2023-06-01",
          dueDate: "2023-07-01",
          status: "borrowed"
        },
        {
          id: 2,
          bookId: 4,
          bookTitle: "算法导论",
          author: "Thomas H. Cormen",
          borrowDate: "2023-05-20",
          dueDate: "2023-06-20",
          returnDate: "2023-06-15",
          status: "returned"
        },
        {
          id: 3,
          bookId: 9,
          bookTitle: "百年孤独",
          author: "加西亚·马尔克斯",
          borrowDate: "2023-06-10",
          dueDate: "2023-07-10",
          status: "borrowed"
        }
      ],
      // 筛选和搜索
      searchQuery: '',
      categoryFilter: '',
      sortBy: '',
      // 分页
      currentPage: 1,
      pageSize: 12,
      // 消息提示
      message: {
        show: false,
        text: '',
        type: 'success'
      }
    }
  },
  computed: {
    // 筛选后的书籍
    filteredBooks() {
      let filtered = this.books
      
      // 搜索筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(book => 
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query) ||
          book.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      // 分类筛选
      if (this.categoryFilter) {
        filtered = filtered.filter(book => 
          book.tags.some(tag => tag === this.categoryFilter)
        )
      }
      
      return filtered
    },
    // 排序后的书籍
    sortedBooks() {
      const books = [...this.filteredBooks]
      
      switch (this.sortBy) {
        case 'title':
          return books.sort((a, b) => a.title.localeCompare(b.title))
        case 'newest':
          return books.sort((a, b) => b.id - a.id)
        case 'popular':
          // 模拟热门度排序（这里简单使用ID倒序）
          return books.sort((a, b) => b.id - a.id)
        default:
          return books
      }
    },
    // 分页后的书籍
    paginatedBooks() {
      const startIndex = (this.currentPage - 1) * this.pageSize
      return this.sortedBooks.slice(startIndex, startIndex + this.pageSize)
    },
    // 总页数
    totalPages() {
      return Math.ceil(this.sortedBooks.length / this.pageSize)
    }
  },
  methods: {
    // 借阅书籍
    borrowBook(bookId) {
      const book = this.books.find(b => b.id === bookId)
      if (book && book.currentCount > 0) {
        book.currentCount--
        
        // 添加到我的借阅记录
        const newBorrowing = {
          id: Date.now(),
          bookId: book.id,
          bookTitle: book.title,
          author: book.author,
          borrowDate: new Date().toISOString().split('T')[0],
          dueDate: this.calculateDueDate(30), // 默认借阅30天
          status: 'borrowed'
        }
        this.myBorrowings.unshift(newBorrowing)
        
        this.showMessage(`成功借阅《${book.title}》`, 'success')
        
        // 重置到第一页，确保用户能看到变化
        this.currentPage = 1
      }
    },
    
    // 归还书籍
    returnBook(borrowingId) {
      const borrowing = this.myBorrowings.find(b => b.id === borrowingId)
      if (borrowing) {
        // 更新书籍库存
        const book = this.books.find(b => b.id === borrowing.bookId)
        if (book) {
          book.currentCount++
        }
        
        // 更新借阅记录状态
        borrowing.status = 'returned'
        borrowing.returnDate = new Date().toISOString().split('T')[0]
        
        this.showMessage(`成功归还《${borrowing.bookTitle}》`, 'success')
      }
    },
    
    // 续借书籍
    renewBook(borrowingId) {
      const borrowing = this.myBorrowings.find(b => b.id === borrowingId)
      if (borrowing) {
        // 延长应还日期（续借30天）
        borrowing.dueDate = this.calculateDueDate(30)
        this.showMessage(`成功续借《${borrowing.bookTitle}》`, 'success')
      }
    },
    
    // 计算应还日期
    calculateDueDate(days) {
      const date = new Date()
      date.setDate(date.getDate() + days)
      return date.toISOString().split('T')[0]
    },
    
    // 获取借阅状态文本
    getBorrowingStatusText(status) {
      const statusMap = {
        borrowed: '借阅中',
        returned: '已归还',
        overdue: '已逾期'
      }
      return statusMap[status] || status
    },
    
    // 筛选书籍
    filterBooks() {
      this.currentPage = 1 // 重置到第一页
    },
    
    // 排序书籍
    sortBooks() {
      this.currentPage = 1 // 重置到第一页
    },
    
    // 显示消息
    showMessage(text, type = 'success') {
      this.message.text = text
      this.message.type = type
      this.message.show = true
      
      setTimeout(() => {
        this.message.show = false
      }, 3000)
    }
  },
  watch: {
    // 当筛选条件变化时重置页码
    searchQuery() {
      this.currentPage = 1
    },
    categoryFilter() {
      this.currentPage = 1
    }
  }
}
</script>

<style scoped>
/* 其他原有样式保持不变 */
.student-library {
 --primary-color: #2A5CAA;
  --secondary-color: #4CAF50;
  --light-color: #FFFFFF;
  --dark-color: #333333;
  --gray-color: #F5F5F5;
  --border-color: #E0E0E0;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --success-color: #4CAF50;
  --warning-color: #FF9800;
  --danger-color: #F44336;
  --border-radius: 8px;
  --transition: all 0.3s ease;
}

.student-library {
  font-family: 'Roboto', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--dark-color);
  background-color: var(--gray-color);
  line-height: 1.6;
  min-height: 100vh;
}

.library-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 标签页样式 - 与教室预约页面保持一致 */
.tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.tab-btn {
  padding: 12px 24px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--dark-color);
  position: relative;
  transition: var(--transition);
}

.tab-btn.active {
  color: var(--primary-color);
  font-weight: 500;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

/* 我的借阅列表样式 */
.borrowings-list {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-color);
  overflow: hidden;
}

.borrowing-item {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.borrowing-item:hover {
  background-color: #f9f9f9;
}

.borrowing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.borrowing-title {
  font-weight: 500;
  color: var(--primary-color);
  font-size: 18px;
}

.borrowing-status {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-borrowed {
  background-color: #FFF3CD;
  color: #856404;
}

.status-returned {
  background-color: #D4EDDA;
  color: #155724;
}

.status-overdue {
  background-color: #F8D7DA;
  color: #721C24;
}

.borrowing-details {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 15px;
}

.borrowing-detail {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.borrowing-detail i {
  margin-right: 8px;
  color: #666;
}

.borrowing-actions {
  display: flex;
  gap: 10px;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}


.btn-secondary {
  background-color: var(--primary-color);
  color: white;
}

.btn-secondary:hover {
  background-color: #1E4B8B;
}

/* 空状态 */
.no-borrowings {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

/* 其他样式保持不变 */
.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.book-current-count {
  font-size: 0.85rem;
  color: #666;
}

.book-status {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

.status-available {
  background-color: #E8F5E9;
  color: var(--secondary-color);
}

.status-borrowed {
  background-color: #FFEBEE;
  color: #E53935;
}

.book-meta {
  display: flex;
  flex-direction: column;
  margin-top: 15px;
}

.borrow-button {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: var(--transition);
  width: 100%;
}

.borrow-button:hover:not(:disabled) {
  background-color: #3D8B40;
}

.borrow-button:disabled {
  background-color: #BDBDBD;
  cursor: not-allowed;
}

/* 搜索和筛选区域 - 更新为与AdminLibrary一致的样式 */
.search-filter-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: var(--light-color);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 8px var(--shadow-color);
}

.search-box {
  display: flex;
  flex: 1;
  min-width: 300px;
}

.search-box input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.search-btn {
  padding: 0 1.25rem;
  background-color: var(--primary-color);
  color: var(--light-color);
  border: none;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  cursor: pointer;
  transition: var(--transition);
}

.search-btn:hover {
  background-color: #1E4B8B;
}

.filter-options {
  display: flex;
  gap: 1rem;
}

.filter-options select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: var(--light-color);
  transition: var(--transition);
}

.filter-options select:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* 书籍列表样式 */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
  width: 100%;
  max-width: 100%;
  grid-auto-flow: dense;
}

.book-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: var(--transition);
  width: 100%;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--hover-shadow);
}

.book-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.book-info {
  padding: 15px;
}

.book-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
}

.book-author {
  color: var(--light-text);
  font-size: 14px;
  margin-bottom: 10px;
}

.tags {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  background-color: #E8F5E9;
  color: var(--secondary-color);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* 空状态 */
.no-books {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: var(--light-text);
  font-size: 1.1rem;
}

/* 消息提示样式 */
.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 4px;
  color: white;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease;
  z-index: 1000;
}

.message-success {
  background-color: var(--secondary-color);
}

.message-error {
  background-color: #E53935;
}

.message.show {
  opacity: 1;
  transform: translateX(0);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .search-filter-section {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .search-box {
    flex: 1;
  }
  
  .books-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
  
  .library-container {
    padding: 0 15px;
    margin: 15px auto;
  }
  
  .filter-options {
    flex-direction: column;
    gap: 10px;
  }
  
  .filter-options select {
    width: 100%;
  }
  
  .borrowing-details {
    flex-direction: column;
    gap: 10px;
  }
  
  .borrowing-actions {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .books-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .books-grid {
    grid-template-columns: 1fr;
  }
  
  .search-box {
    flex-direction: column;
  }
  
  .search-box input {
    border-radius: var(--border-radius);
    margin-bottom: 10px;
  }
  
  .search-btn {
    border-radius: var(--border-radius);
    padding: 12px;
  }
}
</style>