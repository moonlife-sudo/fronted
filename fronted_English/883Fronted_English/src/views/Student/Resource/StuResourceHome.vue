<template>
  <div class="edu-resource-system">
    <!-- 搜索区域 -->
    <section class="search-section">
      <div class="container">
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Search classrooms, books or resources..."
            v-model="searchKeyword"
            @keypress.enter="handleSearch"
          >
          <button @click="handleSearch">
            <i class="fas fa-search"></i> Search
          </button>
        </div>
      </div>
    </section>

    <!-- 功能区 -->
    <section class="features">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-calendar-check"></i>
            </div>
            <h3>Classroom Booking</h3>
            <p>Search for available classrooms across the campus, select time and location for booking, check approval status in real-time, and cancel unstarted bookings anytime</p>
            <button class="feature-link" @click="goToClassroomBooking">Book Classroom</button>
          </div>
          <div class="feature-card secondary">
            <div class="feature-icon">
              <i class="fas fa-book"></i>
            </div>
            <h3>Book Borrowing</h3>
            <p>Browse library collections, borrow books online, set return reminders, check borrowing history, and manage personal reading lists</p>
            <button class="feature-link" @click="goToLibraryBooking">Borrow Books</button>
          </div>
          <!--
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-bell"></i>
            </div>
            <h3>订阅推送</h3>
            <p>根据您的专业和兴趣，系统会定期向您推送最新相关书籍和学术资源</p>
            <a href="#">管理订阅</a>
          </div>
          -->
        </div>
      </div>
    </section>

    <!-- 快速操作 -->
<!--    
    <section class="container">
      <div class="quick-actions">
        <div class="actions-grid">
          <div 
            v-for="action in quickActions" 
            :key="action.id"
            class="action-item"
            @click="handleQuickAction(action.id)"
          >
            <i :class="action.icon"></i>
            <span>{{ action.text }}</span>
          </div>
        </div>
      </div>
    </section>
-->

    <!-- 近期预约 -->
    <section class="container">
      <div class="booking-history">
        <div class="history-header">
          <h3>My Recent Bookings</h3>
          <a href="#">View All <i class="fas fa-arrow-right"></i></a>
        </div>
        <table class="history-table">
          <thead>
            <tr>
              <th>Classroom</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in bookings" :key="booking.id">
              <td>{{ booking.room }}</td>
              <td>{{ booking.date }}</td>
              <td>{{ booking.time }}</td>
              <td>
                <span class="status" :class="booking.status">
                  {{ getStatusText(booking.status) }}
                </span>
              </td>
              <td>
                <button 
                  class="withdraw-btn" 
                  @click="withdrawBooking(booking.id)"
                  :disabled="booking.status === 'approved'"
                >
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 书籍推荐 -->
    <section class="container">
      <div class="book-recommendations">
        <h3>Recommended Books</h3>
        <div class="books-grid">
          <div 
            v-for="book in recommendedBooks" 
            :key="book.id"
            class="book-card"
          >
            <div class="book-cover">
              <i class="fas fa-book"></i>
            </div>
            <div class="book-info">
              <h4>{{ book.title }}</h4>
              <p>{{ book.author }}</p>
              <button 
                class="borrow-btn"
                :class="getBorrowButtonClass(book.borrowStatus)"
                :disabled="book.borrowStatus !== 'available'"
                @click="borrowBook(book.id)"
              >
                {{ getBorrowButtonText(book.borrowStatus) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 书籍标签 -->
    <section class="container">
      <div class="tags-section">
        <h3>My Book Tags</h3>
        <div class="tags-container">
          <div 
            v-for="tag in tags" 
            :key="tag.id"
            class="tag"
            :class="{ active: tag.active }"
            @click="toggleTag(tag.id)"
          >
            <i class="fas fa-tag"></i> {{ tag.name }}
          </div>
          <div class="tag" @click="addNewTag">
            <i class="fas fa-plus"></i> Add New Tag
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'EduResourceSystem',
  data() {
    return {
      searchKeyword: '',
 /*      
     quickActions: [
        { id: 1, icon: 'fas fa-search', text: 'Find Available Classrooms' },
        { id: 2, icon: 'fas fa-plus-circle', text: 'New Booking' },
        { id: 3, icon: 'fas fa-book-open', text: 'Browse Library' },
        { id: 4, icon: 'fas fa-bookmark', text: 'Manage Bookmarks' },
        { id: 5, icon: 'fas fa-history', text: 'View History' }
      ],
 */     
      bookings: [
        {
          id: 1,
          room: 'Teaching Building 1 Room 305',
          date: '2023-06-15',
          time: '14:00-16:00',
          status: 'approved'
        },
        {
          id: 2,
          room: 'Library Seminar Room A',
          date: '2023-06-17',
          time: '10:00-12:00',
          status: 'pending'
        },
        {
          id: 3,
          room: 'Experimental Building Room 102',
          date: '2023-06-20',
          time: '09:00-11:00',
          status: 'approved'
        }
      ],
      recommendedBooks: [
        {
          id: 1,
          title: 'Computer Systems: A Programmer\'s Perspective',
          author: 'Randal E.Bryant',
          borrowStatus: 'available' // available, applied, borrowed
        },
        {
          id: 2,
          title: 'Machine Learning in Action',
          author: 'Peter Harrington',
          borrowStatus: 'available'
        },
        {
          id: 3,
          title: 'The Design of Everyday Things',
          author: 'Donald A.Norman',
          borrowStatus: 'available'
        },
        {
          id: 4,
          title: 'Sapiens: A Brief History of Humankind',
          author: 'Yuval Noah Harari',
          borrowStatus: 'available'
        }
      ],
      tags: [
        { id: 1, name: 'Computer Science', active: true },
        { id: 2, name: 'Artificial Intelligence', active: false },
        { id: 3, name: 'Machine Learning', active: false },
        { id: 4, name: 'Data Structures', active: false },
        { id: 5, name: 'Design Patterns', active: false },
        { id: 6, name: 'Algorithms', active: false }
      ]
    }
  },
  methods: {
    //功能跳转
    goToClassroomBooking() {
    this.$router.push('/student/classroom');
    },
    goToLibraryBooking() {
    this.$router.push('/student/library');
    },


    handleSearch() {
      if (this.searchKeyword.trim()) {
        alert(`Searching: ${this.searchKeyword}`);
        // 实际应用中这里会有搜索逻辑
      }
    },
    handleQuickAction(actionId) {
      const action = this.quickActions.find(a => a.id === actionId);
      if (action) {
        alert(`Executing action: ${action.text}`);
        // 实际应用中这里会有相应的页面跳转或功能执行
      }
    },
    withdrawBooking(bookingId) {
      const booking = this.bookings.find(b => b.id === bookingId);
      if (booking) {
        const room = booking.room;
        const time = booking.date + ' ' + booking.time;
        
        if (confirm(`Are you sure you want to cancel the booking in ${room} at ${time}?`)) {
          this.bookings = this.bookings.filter(b => b.id !== bookingId);
          alert('Booking has been successfully canceled!');
        }
      }
    },
    borrowBook(bookId) {
      const book = this.recommendedBooks.find(b => b.id === bookId);
      if (book && book.borrowStatus === 'available') {
        book.borrowStatus = 'applied';
        alert(`Application to borrow "${book.title}" has been submitted! Please wait for approval`);
        
        // 模拟审核过程，3秒后状态变为已借阅
        setTimeout(() => {
          book.borrowStatus = 'borrowed';
          // 可以在这里添加通知功能
          this.$store.dispatch('addNotification', {
            id: Date.now(),
            type: 'library_approval',
            title: 'Borrowing Application Approved',
            message: `Your application to borrow "${book.title}" has been approved. Please pick it up at the library`,
            time: new Date().toLocaleString(),
            read: false
          });
        }, 3000);
      }
    },
    toggleTag(tagId) {
      const tag = this.tags.find(t => t.id === tagId);
      if (tag) {
        tag.active = !tag.active;
      }
    },
    addNewTag() {
      const newTagName = prompt('Please enter new tag name:');
      if (newTagName && newTagName.trim() !== '') {
        const newTag = {
          id: Date.now(),
          name: newTagName.trim(),
          active: false
        };
        this.tags.push(newTag);
      }
    },
    getStatusText(status) {
      const statusMap = {
        'approved': 'Approved',
        'pending': 'Pending Approval'
      };
      return statusMap[status] || status;
    },
    getBorrowButtonText(status) {
      const statusMap = {
        'available': 'Borrow Now',
        'applied': 'Application Submitted',
        'borrowed': 'Borrowed'
      };
      return statusMap[status] || 'Borrow Now';
    },
    getBorrowButtonClass(status) {
      const classMap = {
        'available': 'available',
        'applied': 'applied',
        'borrowed': 'borrowed'
      };
      return classMap[status] || 'available';
    }
  }
}
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

:root {
  --primary-color: #2A5CAA;
  --secondary-color: #4CAF50;
  --background-color: #F8FAFC;
  --text-color: #2D3748;
  --text-light: #718096;
  --white: #FFFFFF;
  --border-radius: 12px;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

/* 移除scoped，使用全局样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 头部样式 */
header {
  background: var(--white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo i {
  font-size: 28px;
  color: var(--primary-color);
  margin-right: 10px;
}

.logo h1 {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 24px;
}

.nav {
  display: flex;
  align-items: center;
}

.nav a {
  text-decoration: none;
  color: var(--text-color);
  margin-left: 25px;
  font-weight: 500;
  position: relative;
  transition: var(--transition);
}

.nav a.active {
  color: var(--primary-color);
}

.nav a.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--primary-color);
  border-radius: 3px;
}

.nav a:hover {
  color: var(--primary-color);
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-profile img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

/* 搜索区域样式 */
.search-section {
  padding: 30px 0;
  text-align: center;
}

.search-section h2 {
  font-size: 32px;
  margin-bottom: 20px;
  color: var(--primary-color);
  font-weight: 700;
}

.search-section p {
  max-width: 600px;
  margin: 0 auto 30px;
  color: var(--text-light);
}

.search-bar {
  display: flex;
  max-width: 1200px; /* 修改为与容器相同宽度 */
  margin: 0 auto;
  box-shadow: var(--shadow);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.search-bar input {
  flex: 1;
  border: none;
  padding: 15px 20px;
  font-size: 16px;
  outline: none;
}

.search-bar button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0 30px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.search-bar button:hover {
  background: #1e4a8a;
}

/* 功能卡片样式 */
.features {
  padding: 30px 0;
}

.section-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 3px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.feature-card {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--shadow);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: var(--primary-color);
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  z-index: -1;
}

.feature-icon {
  width: 70px;
  height: 70px;
  background: rgba(42, 92, 170, 0.1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
}

.feature-icon i {
  font-size: 30px;
  color: var(--primary-color);
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: var(--primary-color);
}

.feature-card p {
  color: var(--text-light);
  margin-bottom: 25px;
  font-size: 15px;
}

.feature-card a {
  display: inline-block;
  padding: 8px 20px;
  background: var(--white);
  color: var(--primary-color);
  text-decoration: none;
  border-radius: 50px;
  border: 2px solid var(--primary-color);
  font-weight: 500;
  transition: var(--transition);
}

.feature-card a:hover {
  background: var(--primary-color);
  color: var(--white);
}

.feature-card.secondary .feature-icon {
  background: rgba(76, 175, 80, 0.1);
}

.feature-card.secondary .feature-icon i {
  color: var(--secondary-color);
}

.feature-card.secondary h3 {
  color: var(--secondary-color);
}

.feature-card.secondary a {
  border-color: var(--secondary-color);
  color: var(--secondary-color);
}

.feature-card.secondary a:hover {
  background: var(--secondary-color);
  color: var(--white);
}

.feature-link {
  display: inline-block;
  padding: 8px 20px;
  background: var(--white);
  color: var(--primary-color);
  text-decoration: none;
  border-radius: 50px;
  border: 2px solid var(--primary-color);
  font-weight: 500;
  transition: var(--transition);
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

.feature-link:hover {
  background: var(--primary-color);
  color: var(--white);
}


/* 预约记录样式 */
.booking-history {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--shadow);
  margin-bottom: 40px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.history-header h3 {
  font-size: 22px;
  color: var(--primary-color);
}

.history-header a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th {
  text-align: left;
  padding: 15px;
  background: rgba(42, 92, 170, 0.05);
  color: var(--text-color);
  font-weight: 600;
}

.history-table td {
  padding: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  color: var(--text-light);
}

.status {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.status.approved {
  background: rgba(76, 175, 80, 0.15);
  color: var(--secondary-color);
}

.status.pending {
  background: rgba(255, 193, 7, 0.15);
  color: #FF9800;
}

.withdraw-btn {
  padding: 6px 15px;
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--transition);
}

.withdraw-btn:hover {
  background: rgba(244, 67, 54, 0.2);
}

.withdraw-btn:disabled {
  background: rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
}

/* 推荐书籍区域 */
.book-recommendations {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--shadow);
  margin-bottom: 40px;
}

.book-recommendations h3 {
  font-size: 22px;
  margin-bottom: 25px;
  color: var(--primary-color);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 25px;
}

.book-card {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: var(--transition);
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.book-cover {
  height: 200px;
  background: var(--background-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: var(--primary-color);
}

.book-info {
  padding: 15px;
}

.book-info h4 {
  font-size: 16px;
  margin-bottom: 8px;
  color: var(--text-color);
}

.book-info p {
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 15px;
}

.borrow-btn {
  width: 100%;
  padding: 8px 0;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
}

.borrow-btn:hover {
  background: #3d8e40;
}

/* 借阅按钮不同状态的样式 */
.borrow-btn.applied {
  background: #ff9800;
  cursor: not-allowed;
}

.borrow-btn.applied:hover {
  background: #ff9800;
}

.borrow-btn.borrowed {
  background: #9e9e9e;
  cursor: not-allowed;
}

.borrow-btn.borrowed:hover {
  background: #9e9e9e;
}

.borrow-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 标签区域 */
.tags-section {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--shadow);
  margin-bottom: 40px;
}

.tags-section h3 {
  font-size: 22px;
  margin-bottom: 25px;
  color: var(--primary-color);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  padding: 8px 15px;
  background: rgba(42, 92, 170, 0.1);
  color: var(--primary-color);
  border-radius: 50px;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
}

.tag:hover {
  background: rgba(42, 92, 170, 0.2);
}

.tag.active {
  background: var(--primary-color);
  color: white;
}

.tag i {
  margin-right: 5px;
}

/* 页脚样式 */
footer {
  background: var(--primary-color);
  color: white;
  padding: 40px 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.footer-column h4 {
  font-size: 18px;
  margin-bottom: 20px;
  position: relative;
}

.footer-column h4::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 2px;
  background: white;
}

.footer-column ul {
  list-style: none;
}

.footer-column ul li {
  margin-bottom: 12px;
}

.footer-column ul li a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: var(--transition);
}

.footer-column ul li a:hover {
  color: white;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.social-links a {
  width: 35px;
  height: 35px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition);
}

.social-links a:hover {
  background: white;
}

.social-links a:hover i {
  color: var(--primary-color);
}

.social-links a i {
  color: white;
  font-size: 16px;
}

.copyright {
  text-align: center;
  padding-top: 30px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.footer-description {
  color: rgba(255, 255, 255, 0.8);
  margin-top: 20px;
  line-height: 1.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav {
    display: none;
  }

  .search-section h2 {
    font-size: 24px;
  }

  .section-title {
    font-size: 22px;
  }
}
</style>