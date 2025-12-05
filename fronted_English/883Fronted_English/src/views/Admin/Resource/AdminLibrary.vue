<template>
  <div class="admin-library">
    
    <main class="admin-library-container">
      <section class="library-controls">
        <h1 class="page-title">Library Management</h1>
        <div class="action-buttons">
          <button @click="openUploadModal" class="btn btn-primary">
            <i class="bi bi-plus-circle"></i> Upload New Book
          </button>
          <button @click="openLoanDurationModal" class="btn btn-secondary">
            <i class="bi bi-clock"></i> Set Loan Duration
          </button>
        </div>
      </section>

      <section class="search-filter-section">
        <div class="search-box">
           <i class="bi bi-search"></i>
          <input 
            type="text" 
            placeholder="Search books..." 
            v-model="searchQuery"

          >
        </div>
        <div class="filter-options">
          <select v-model="categoryFilter" @change="filterBooks">
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Literature">Literature</option>
            <option value="History">History</option>
            <option value="Art">Art</option>
          </select>
          <select v-model="statusFilter" @change="filterBooks">
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="borrowed">Unavailable</option>
          </select>
        </div>
      </section>

      <section class="book-list">
        <div class="book-list-header">
          <h2>Book List</h2>
          <span class="book-count">Total <span id="total-books">{{ filteredBooks.length }}</span> books</span>
        </div>
        
        <div class="books-grid">
          <div 
            v-for="book in filteredBooks" 
            :key="book.id" 
            class="book-card"
          >
            <img :src="book.cover" :alt="book.title" class="book-cover" loading="lazy">
            <div class="book-info">
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-author">{{ book.author }}</p>
              <div class="book-meta">
                <span class="book-category">{{ book.category }}</span>
                <span class="book-current-count">Current: {{ book.currentCount }}/{{ book.totalCount }}</span>
                <span class="book-status" :class="book.currentCount === 0 ? 'borrowed' : 'available'">
                  {{ book.currentCount === 0 ? 'Unavailable' : 'Available' }}
                </span>
              </div>
              <div class="book-actions">
                <button @click="editBook(book)" class="btn btn-secondary">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button @click="deleteBook(book.id)" class="btn btn-danger">
                  <i class="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="filteredBooks.length === 0" class="no-books">
            No matching books found
          </div>
        </div>
      </section>

      <!-- 上传书籍模态框 -->
      <div v-if="isUploadModalVisible" class="modal show" @click.self="closeModals">
        <div class="modal-content">
          <span class="close-modal" @click="closeModals">&times;</span>
          <h2>{{ editingBook ? 'Edit Book' : 'Upload New Book' }}</h2>
          <form @submit.prevent="handleBookSubmit">
            <div class="form-group">
              <label for="book-title">Title</label>
              <input type="text" id="book-title" v-model="bookForm.title" required>
            </div>
            <div class="form-group">
              <label for="book-author">Author</label>
              <input type="text" id="book-author" v-model="bookForm.author" required>
            </div>
            <div class="form-group">
              <label for="book-isbn">ISBN</label>
              <input type="text" id="book-isbn" v-model="bookForm.isbn" required>
            </div>
            <div class="form-group">
              <label for="book-category">Category</label>
              <select id="book-category" v-model="bookForm.category" required>
                <option value="">Select Category</option>
                <option value="Literature">Literature</option>
                <option value="Technology">Technology</option>
                <option value="History">History</option>
                <option value="Art">Art</option>
              </select>
            </div>
            <div class="form-group">
              <label for="book-total-count">Total Count</label>
              <input type="number" id="book-total-count" v-model.number="bookForm.totalCount" min="1" required>
            </div>
            <div class="form-group">
              <label for="book-current-count">Current Count</label>
              <input type="number" id="book-current-count" v-model.number="bookForm.currentCount" min="0" :max="bookForm.totalCount" required>
            </div>
            <div class="form-group">
              <label for="book-cover">Cover Image</label>
              <input type="file" id="book-cover" accept="image/*" @change="handleCoverUpload">
            </div>
            <div class="form-group">
              <label for="book-description">Description</label>
              <textarea id="book-description" rows="4" v-model="bookForm.description"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">
              {{ editingBook ? 'Update' : 'Upload' }}
            </button>
          </form>
        </div>
      </div>

      <!-- 设置借书时长模态框 -->
      <div v-if="isLoanDurationModalVisible" class="modal show" @click.self="closeModals">
        <div class="modal-content">
          <span class="close-modal" @click="closeModals">&times;</span>
          <h2>Set Loan Duration</h2>
          <form @submit.prevent="saveLoanDuration">
            <div class="form-group">
              <label for="loan-duration">Loan Duration (days)</label>
              <input type="number" id="loan-duration" v-model.number="loanDuration" min="1" max="30" required>
            </div>
            <button type="submit" class="btn btn-primary">Save Settings</button>
          </form>
        </div>
      </div>
    </main>
    

    <!-- Toast 提示 -->
    <div v-if="toast.show" class="toast show">
      {{ toast.message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLibrary',
  data() {
    return {
      // 书籍数据
      books: [
        {
          id: 1,
          title: "Professional JavaScript for Web Developers",
          author: "Nicholas C. Zakas",
          cover: "https://placeholder.pics/svg/300x200/DEDEDE/555555/JavaScript%20Advanced%20Programming",
          category: "Technology",
          isbn: "9787115275790",
          totalCount: 5,
          currentCount: 3,
          description: "This book details the core concepts and technical details of the JavaScript language."
        },
        {
          id: 2,
          title: "CSS Secrets",
          author: "Lea Verou",
          cover: "https://placeholder.pics/svg/300x200/DEDEDE/555555/CSS%20Secrets",
          category: "Technology",
          isbn: "9787115433459",
          totalCount: 3,
          currentCount: 0,
          description: "This book reveals 47 little-known CSS tricks."
        },
        {
          id: 3,
          title: "One Hundred Years of Solitude",
          author: "Gabriel García Márquez",
          cover: "https://placeholder.pics/svg/300x200/DEDEDE/555555/One%20Hundred%20Years%20of%20Solitude",
          category: "Literature",
          isbn: "9787544258974",
          totalCount: 8,
          currentCount: 2,
          description: "A masterpiece of Latin American magical realism literature."
        },
        {
          id: 4,
          title: "Sapiens: A Brief History of Humankind",
          author: "Yuval Noah Harari",
          cover: "https://placeholder.pics/svg/300x200/DEDEDE/555555/Sapiens%3A%20A%20Brief%20History%20of%20Humankind",
          category: "History",
          isbn: "9787508647357",
          totalCount: 4,
          currentCount: 4,
          description: "The human development journey from the Cognitive Revolution to the Scientific Revolution."
        },
        {
          id: 5,
          title: "The Story of Art",
          author: "E.H. Gombrich",
          cover: "https://placeholder.pics/svg/300x200/DEDEDE/555555/The%20Story%20of%20Art",
          category: "Art",
          isbn: "9787108018511",
          totalCount: 2,
          currentCount: 0,
          description: "A classic introductory book on art history."
        },
        {
          id: 6,
          title: "The Design of Everyday Things",
          author: "Donald A. Norman",
          cover: "https://placeholder.pics/svg/300x200/DEDEDE/555555/The%20Design%20of%20Everyday%20Things",
          category: "Technology",
          isbn: "9787121285862",
          totalCount: 6,
          currentCount: 1,
          description: "Exploring the relationship between everyday product design and user psychology."
        }
      ],
      // 筛选条件
      searchQuery: '',
      categoryFilter: '',
      statusFilter: '',
      // 模态框状态 - 重命名以避免与方法名冲突
      isUploadModalVisible: false,
      isLoanDurationModalVisible: false,
      editingBook: null,
      // 表单数据
      bookForm: {
        title: '',
        author: '',
        isbn: '',
        category: '',
        totalCount: 1,
        currentCount: 1,
        description: '',
        cover: null
      },
      // 借书时长
      loanDuration: 14,
      // Toast 提示
      toast: {
        show: false,
        message: ''
      }
    }
  },
  computed: {
    // 筛选后的书籍列表
    filteredBooks() {
      let filtered = this.books
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(book => 
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query)
        )
      }
      
      if (this.categoryFilter) {
        filtered = filtered.filter(book => book.category === this.categoryFilter)
      }
      
      if (this.statusFilter) {
        if (this.statusFilter === 'available') {
          filtered = filtered.filter(book => book.currentCount > 0)
        } else if (this.statusFilter === 'borrowed') {
          filtered = filtered.filter(book => book.currentCount === 0)
        }
      }
      
      return filtered
    }
  },
  methods: {
    // 显示上传模态框
    openUploadModal() {
      this.editingBook = null
      this.bookForm = {
        title: '',
        author: '',
        isbn: '',
        category: '',
        totalCount: 1,
        currentCount: 1,
        description: '',
        cover: null
      }
      this.isUploadModalVisible = true
    },
    // 显示借书时长模态框
    openLoanDurationModal() {
      this.isLoanDurationModalVisible = true
    },
    // 关闭所有模态框
    closeModals() {
      this.isUploadModalVisible = false
      this.isLoanDurationModalVisible = false
      this.editingBook = null
    },
    // 处理书籍提交（新增或编辑）
    handleBookSubmit() {
      if (this.editingBook) {
        // 更新书籍
        const index = this.books.findIndex(b => b.id === this.editingBook.id)
        if (index !== -1) {
          this.books[index] = {
            ...this.editingBook,
            ...this.bookForm
          }
          this.showToast('Book information updated successfully!')
        }
      } else {
        // 新增书籍
        const newBook = {
          id: Date.now(),
          ...this.bookForm,
          cover: this.bookForm.cover || `https://placeholder.pics/svg/300x200/DEDEDE/555555/${encodeURIComponent(this.bookForm.title)}`
        }
        this.books.unshift(newBook)
        this.showToast('Book uploaded successfully!')
      }
      
      this.closeModals()
    },
    // 编辑书籍
    editBook(book) {
      this.editingBook = book
      this.bookForm = { ...book }
      this.isUploadModalVisible = true
    },
    // 删除书籍
    deleteBook(bookId) {
      if (confirm('Are you sure you want to delete this book?')) {
        const index = this.books.findIndex(b => b.id === bookId)
        if (index !== -1) {
          this.books.splice(index, 1)
          this.showToast('Book deleted')
        }
      }
    },
    // 处理封面图片上传
    handleCoverUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // In a real application, this should upload to a server and get a URL
      // Here we simply use a local URL for preview
        this.bookForm.cover = URL.createObjectURL(file)
      }
    },
    // 保存借书时长设置
    saveLoanDuration() {
      // 在实际应用中，这里会发送到服务器保存设置
      console.log(`Loan duration set to: ${this.loanDuration} days`)
      this.showToast(`Loan duration set to ${this.loanDuration} days`)
      this.closeModals()
    },
    // 显示 Toast 提示
    showToast(message) {
      this.toast.message = message
      this.toast.show = true
      setTimeout(() => {
        this.toast.show = false
      }, 3000)
    },
    // 筛选书籍（用于搜索和筛选）
    filterBooks() {
      // 这个方法现在由 computed 属性 filteredBooks 自动处理
      // 保留这个方法是为了兼容模板中的 @input 和 @change 事件
    }
  },
  mounted() {
    console.log('AdminLibrary 组件已挂载')
    console.log('初始书籍数据:', this.books)
  }
}
</script>

<style scoped>
/* 添加与classroom一致的CSS变量 */
.admin-library {
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

.admin-library {
  min-height: 100vh;
  background-color: var(--bg-color);
  font-family: 'Roboto', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
}

/* 主内容区域 */
.admin-library-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 500;
  color: var(--primary-color);
  margin: 0;
}

/* 控制区域 */
.library-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
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

.btn-primary {
  background-color: var(--primary-color);
  color: var(--white);
  border: 1px solid var(--primary-color);
}

.btn-primary:hover {
  background-color: #1E4B8B;
  border-color: #1E4B8B;
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--white);
  border: 1px solid var(--secondary-color);
}

.btn-secondary:hover {
  background-color: #3E9D44;
  border-color: #3E9D44;
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.btn-danger {
  background-color: var(--danger-color);
  color: var(--white);
  border: 1px solid var(--danger-color);
}

.btn-danger:hover {
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

/* 搜索和筛选区域 */
.search-filter-section {
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


.filter-options {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-options select {
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

.filter-options select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.2);
}

/* 书籍列表区域 */
.book-list {
  background-color: var(--white);
  padding: 20px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.book-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.book-list-header h2 {
  font-size: 18px;
  color: var(--primary-color);
  font-weight: 600;
  margin: 0;
}

.book-count {
  color: var(--text-color);
  font-weight: 500;
}

/* 书籍网格布局 */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.book-card {
  background-color: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  position: relative;
}

.book-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.book-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: #f0f0f0;
}

.book-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--primary-color);
}

.book-author {
  color: var(--text-light);
  margin-bottom: 12px;
  font-size: 14px;
}

.book-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.book-category {
  background-color: var(--primary-light);
  color: var(--primary-color);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  align-self: flex-start;
}

.book-current-count {
  font-size: 13px;
  color: var(--text-light);
}

.book-status {
  font-size: 13px;
  font-weight: 500;
}

.book-status.available {
  color: var(--secondary-color);
}

.book-status.borrowed {
  color: var(--danger-color);
}

.book-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.book-actions .btn {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  padding: 8px 12px;
}

/* 空状态 */
.no-books {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: var(--text-light);
  font-size: 16px;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

/* 模态框样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: none;
  justify-content: center;
  align-items: center;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal.show {
  display: flex;
}

.modal-content {
  background-color: var(--white);
  border-radius: var(--radius);
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, var(--white) 0%, var(--bg-color) 100%);
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 500;
  color: var(--primary-color);
  margin: 0;
}

.close-modal {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 1.5rem;
  color: #aaa;
  cursor: pointer;
  transition: var(--transition);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-modal:hover {
  color: var(--text-color);
  background-color: var(--bg-color);
}

.modal h2 {
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  padding: 0 20px;
  margin-top: 20px;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
  padding: 0 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 14px;
  transition: var(--transition);
  background-color: var(--white);
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.2);
  transform: translateY(-1px);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

.form-actions .btn {
  min-width: 80px;
}

/* Toast 提示 */
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 1100;
  font-size: 14px;
  font-weight: 500;
  max-width: 300px;
  text-align: center;
}

.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .library-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .action-buttons .btn {
    flex: 1;
  }
  
  .search-filter-section {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .filter-options {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-options select {
    width: 100%;
  }
  
  .books-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .book-actions {
    flex-direction: column;
  }
  
  .modal {
    padding: 10px;
  }
  
  .modal-content {
    margin: 0;
    max-height: 95vh;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .admin-library-container {
    padding: 0 16px;
    margin: 16px auto;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .book-info {
    padding: 12px;
  }
  
  .modal-content {
    padding: 0;
  }
  
  .modal h2 {
    padding: 0 16px;
    margin-top: 16px;
  }
  
  .form-group {
    padding: 0 16px;
  }
  
  .form-actions {
    padding: 16px;
  }
  
  .toast {
    bottom: 10px;
    left: 10px;
    right: 10px;
    transform: none;
    max-width: none;
  }
  
  .toast.show {
    transform: none;
  }
}

/* 卡片悬停效果增强 */
.book-card {
  position: relative;
  overflow: hidden;
}

.book-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.book-card:hover::after {
  left: 100%;
}

/* 按钮点击效果 */
.btn:active {
  transform: translateY(0) scale(0.98);
}

.book-current-count {
  font-size: 0.85rem;
  color: #666;
}

.book-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: auto;
}
</style>