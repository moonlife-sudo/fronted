<template>
  <div class="teacher-student-classroom">
    <main class="container">
      
      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'available' }"
          @click="activeTab = 'available'"
        >
          Available Classrooms
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'bookings' }"
          @click="activeTab = 'bookings'"
        >
          My Bookings
        </button>
      </div>
      
      <!-- 搜索和筛选区域 - 修改为与 AdminLibrary 相同样式 -->
      <section class="search-filter-section">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search classroom name or number..." 
            v-model="searchQuery"
            @input="filterClassrooms"
          >
          <button class="search-btn"><i class="bi bi-search"></i></button>
        </div>
        <div class="filter-options">
          <select v-model="capacityFilter" @change="filterClassrooms">
            <option value="">All Capacities</option>
            <option value="30">Under 30 People</option>
            <option value="50">30-50 People</option>
            <option value="100">50-100 People</option>
            <option value="100+">Over 100 People</option>
          </select>
          <select v-model="timeFilter" @change="filterClassrooms">
            <option value="">All Times</option>
            <option value="morning">Morning (8:00-12:00)</option>
            <option value="afternoon">Afternoon (13:00-17:00)</option>
            <option value="evening">Evening (18:00-21:00)</option>
          </select>
        </div>
      </section>
      
      <!-- 可用教室标签页 -->
      <div class="tab-content" :class="{ active: activeTab === 'available' }">
        <div class="classroom-grid">
          <div 
            v-for="classroom in filteredClassrooms" 
            :key="classroom.id" 
            class="classroom-card"
          >
            <img 
              :src="classroom.image" 
              :alt="classroom.name" 
              class="classroom-img" 
              loading="lazy"
            >
            <div class="classroom-info">
              <h3 class="classroom-name">{{ classroom.name }}</h3>
              <div class="classroom-meta">
                <span class="classroom-capacity">
                  <i class="bi bi-people"></i> {{ classroom.capacity }} People
                </span>
                <span class="classroom-location">
                  <i class="bi bi-geo-alt"></i> {{ classroom.location }}
                </span>
              </div>
              <div class="classroom-schedule">
                <div 
                  v-for="slot in availableTimes(classroom).slice(0, 2)" 
                  :key="`${slot.date}-${slot.time}`" 
                  class="schedule-item"
                >
                  <span><i class="bi bi-calendar"></i> {{ slot.date }}</span>
                  <span><i class="bi bi-clock"></i> {{ slot.time }}</span>
                </div>
                <div v-if="availableTimes(classroom).length === 0" class="no-slots">
                  No available time slots
                </div>
              </div>
              <button 
                class="btn btn-primary" 
                @click="openBookingModal(classroom)"
                :disabled="availableTimes(classroom).length === 0"
              >
                {{ availableTimes(classroom).length === 0 ? 'Full' : 'Book Now' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 我的预约标签页 -->
      <div class="tab-content" :class="{ active: activeTab === 'bookings' }">
        <div class="bookings-list">
          <div 
            v-for="booking in bookings" 
            :key="booking.id" 
            class="booking-item"
          >
            <div class="booking-header">
              <span class="booking-title">{{ booking.classroom }}</span>
              <span class="booking-status" :class="`status-${booking.status}`">
                {{ getStatusText(booking.status) }}
              </span>
            </div>
            <div class="booking-details">
              <div class="booking-detail">
                <i class="bi bi-calendar"></i>
                <span>{{ booking.date }}</span>
              </div>
              <div class="booking-detail">
                <i class="bi bi-clock"></i>
                <span>{{ booking.time }}</span>
              </div>
              <div class="booking-detail">
                <i class="bi bi-journal-text"></i>
                <span>{{ booking.purpose }}</span>
              </div>
            </div>
            <button 
              v-if="booking.status === 'pending'" 
              class="btn btn-danger" 
              @click="cancelBooking(booking.id)"
            >
              <i class="bi bi-x-circle"></i> Cancel Booking
            </button>
          </div>
          <div v-if="bookings.length === 0" class="no-bookings">
            No bookings yet
          </div>
        </div>
      </div>
    </main>
    
    <!-- 预约模态框 -->
    <div class="modal" :class="{ show: showBookingModal }" @click="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close-btn" @click="closeModal">&times;</span>
        <h2>Book Classroom</h2>
        <form @submit.prevent="submitBooking">
          <div class="form-group">
            <label for="classroomName">Classroom Name</label>
            <input 
              type="text" 
              id="classroomName" 
              :value="selectedClassroom ? selectedClassroom.name : ''" 
              readonly
            >
          </div>
          <div class="form-group">
            <label for="bookingDate">Booking Date</label>
            <input type="date" id="bookingDate" v-model="bookingForm.date" required>
          </div>
          <div class="form-group">
            <label for="startTime">Start Time</label>
            <input type="time" id="startTime" v-model="bookingForm.startTime" required>
          </div>
          <div class="form-group">
            <label for="endTime">End Time</label>
            <input type="time" id="endTime" v-model="bookingForm.endTime" required>
          </div>
          <div class="form-group">
            <label for="purpose">Purpose</label>
            <textarea 
              id="purpose" 
              rows="3" 
              v-model="bookingForm.purpose" 
              required
              placeholder="Please enter the purpose of classroom use..."
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Submit Booking</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeacherStudentClassroom',
  data() {
    return {
      activeTab: 'available',
      searchQuery: '',
      capacityFilter: '',
      timeFilter: '',
      showBookingModal: false,
      selectedClassroom: null,
      bookingForm: {
        date: '',
        startTime: '',
        endTime: '',
        purpose: ''
      },
      // 模拟数据
      classrooms: [
        {
          id: 1,
          name: "Classroom 101",
          capacity: 50,
          location: "Main Teaching Building, Floor 1",
          image: "https://placeholder.pics/svg/300x200/DEDEDE/555555/Classroom%20101",
          schedule: [
            { date: "2023-06-01", time: "08:00-10:00", available: true },
            { date: "2023-06-01", time: "10:00-12:00", available: false },
            { date: "2023-06-01", time: "14:00-16:00", available: true }
          ]
        },
        {
          id: 2,
          name: "Multimedia Classroom 201",
          capacity: 80,
          location: "Main Teaching Building, Floor 2",
          image: "https://placeholder.pics/svg/300x200/DEDEDE/555555/Multimedia%20Classroom%20201",
          schedule: [
            { date: "2023-06-01", time: "08:00-10:00", available: false },
            { date: "2023-06-01", time: "10:00-12:00", available: true },
            { date: "2023-06-01", time: "14:00-16:00", available: true }
          ]
        },
        {
          id: 3,
          name: "Laboratory 301",
          capacity: 30,
          location: "Laboratory Building, Floor 3",
          image: "https://placeholder.pics/svg/300x200/DEDEDE/555555/Laboratory%20301",
          schedule: [
            { date: "2023-06-01", time: "08:00-10:00", available: true },
            { date: "2023-06-01", time: "10:00-12:00", available: true },
            { date: "2023-06-01", time: "14:00-16:00", available: false }
          ]
        },
        {
          id: 4,
          name: "Meeting Room 401",
          capacity: 20,
          location: "Administration Building, Floor 4",
          image: "https://placeholder.pics/svg/300x200/DEDEDE/555555/Meeting%20Room%20401",
          schedule: [
            { date: "2023-06-01", time: "08:00-10:00", available: true },
            { date: "2023-06-01", time: "10:00-12:00", available: true },
            { date: "2023-06-01", time: "14:00-16:00", available: true }
          ]
        },
        {
          id: 5,
          name: "Lecture Hall 501",
          capacity: 120,
          location: "Main Teaching Building, Floor 5",
          image: "https://placeholder.pics/svg/300x200/DEDEDE/555555/Lecture%20Hall%20501",
          schedule: [
            { date: "2023-06-01", time: "08:00-10:00", available: false },
            { date: "2023-06-01", time: "10:00-12:00", available: false },
            { date: "2023-06-01", time: "14:00-16:00", available: true }
          ]
        },
        {
          id: 6,
          name: "Computer Classroom 601",
          capacity: 60,
          location: "Information Building, Floor 6",
          image: "https://placeholder.pics/svg/300x200/DEDEDE/555555/Computer%20Classroom%20601",
          schedule: [
            { date: "2023-06-01", time: "08:00-10:00", available: true },
            { date: "2023-06-01", time: "10:00-12:00", available: true },
            { date: "2023-06-01", time: "14:00-16:00", available: false }
          ]
        }
      ],
      bookings: [
        {
          id: 1,
          classroom: "Multimedia Classroom 201",
          date: "2023-06-01",
          time: "10:00-12:00",
          purpose: "Class Meeting",
          status: "approved"
        },
        {
          id: 2,
          classroom: "Laboratory 301",
          date: "2023-06-02",
          time: "14:00-16:00",
          purpose: "Physics Experiment Class",
          status: "pending"
        },
        {
          id: 3,
          classroom: "Lecture Hall 501",
          date: "2023-06-03",
          time: "08:00-10:00",
          purpose: "Academic Lecture",
          status: "rejected"
        }
      ]
    }
  },
  computed: {
    filteredClassrooms() {
      let filtered = this.classrooms
      
      // 搜索条件
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(classroom => 
          classroom.name.toLowerCase().includes(query)
        )
      }
      
      // 容量条件
      if (this.capacityFilter) {
        filtered = filtered.filter(classroom => {
          switch(this.capacityFilter) {
            case '30':
              return classroom.capacity < 30
            case '50':
              return classroom.capacity >= 30 && classroom.capacity <= 50
            case '100':
              return classroom.capacity > 50 && classroom.capacity <= 100
            case '100+':
              return classroom.capacity > 100
            default:
              return true
          }
        })
      }
      
      // 时间条件
      if (this.timeFilter) {
        filtered = filtered.filter(classroom => {
          return classroom.schedule.some(slot => {
            const [startHour] = slot.time.split(':').map(Number)
            switch(this.timeFilter) {
              case 'morning':
                return startHour >= 8 && startHour < 12
              case 'afternoon':
                return startHour >= 13 && startHour < 17
              case 'evening':
                return startHour >= 18 && startHour < 21
              default:
                return true
            }
          })
        })
      }
      
      return filtered
    }
  },
  methods: {
    availableTimes(classroom) {
      return classroom.schedule.filter(slot => slot.available)
    },
    
    getStatusText(status) {
      const statusMap = {
        approved: 'Approved',
        pending: 'Pending',
        rejected: 'Rejected'
      }
      return statusMap[status] || status
    },
    
    openBookingModal(classroom) {
      this.selectedClassroom = classroom
      this.showBookingModal = true
    },
    
    closeModal() {
      this.showBookingModal = false
      this.selectedClassroom = null
      this.resetBookingForm()
    },
    
    resetBookingForm() {
      this.bookingForm = {
        date: '',
        startTime: '',
        endTime: '',
        purpose: ''
      }
    },
    
    submitBooking() {
      if (!this.selectedClassroom) return
      
      const newBooking = {
        id: this.bookings.length + 1,
        classroom: this.selectedClassroom.name,
        date: this.bookingForm.date,
        time: `${this.bookingForm.startTime}-${this.bookingForm.endTime}`,
        purpose: this.bookingForm.purpose,
        status: "pending"
      }
      
      this.bookings.unshift(newBooking)
      this.closeModal()
      alert('Booking submitted successfully, please wait for approval!')
    },
    
    cancelBooking(bookingId) {
      if (confirm('Are you sure you want to cancel this booking?')) {
        const index = this.bookings.findIndex(b => b.id === bookingId)
        if (index !== -1) {
          this.bookings.splice(index, 1)
          alert('Booking has been canceled')
        }
      }
    },
    
    filterClassrooms() {
      // 计算属性会自动更新，这里可以添加其他逻辑
      console.log('筛选条件已更新')
    }
  },
  mounted() {
    // 设置默认日期为明天
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    this.bookingForm.date = tomorrow.toISOString().split('T')[0]
  }
}
</script>

<style scoped>
/* 使用与 AdminLibrary 相同的样式变量 */
.teacher-student-classroom {
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

.teacher-student-classroom {
  font-family: 'Roboto', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--dark-color);
  background-color: var(--gray-color);
  line-height: 1.6;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

/* 标签页样式 */
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

/* 搜索和筛选区域 - 与 AdminLibrary 相同样式 */
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

/* 按钮样式 - 与 AdminLibrary 相同 */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  display: block !important;
  width: 100% !important;
  padding: 12px !important;
  margin-top: 15px !important;
  background-color: var(--secondary-color) !important;
  color: white !important;
  border: none !important;
  border-radius: var(--border-radius) !important;
  cursor: pointer !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  transition: var(--transition) !important;
  opacity: 1 !important;
  visibility: visible !important;
  position: relative !important;
  z-index: 1 !important;
  text-align: center !important;
  text-decoration: none !important;
  line-height: 1.4 !important;
  font-family: inherit !important;
}

.btn-primary:hover {
  background-color: #3e8e41 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}

.btn-primary:disabled {
  background-color: #cccccc !important;
  color: #666666 !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

.btn-primary:disabled:hover {
  background-color: #cccccc !important;
  transform: none !important;
  box-shadow: none !important;
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--light-color);
}

.btn-secondary:hover {
  background-color: #3E8E41;
  transform: translateY(-2px);
}

.btn-danger {
  background-color: var(--danger-color);
  color: var(--light-color);
  /* 添加大小控制 */
  padding: 8px 16px; /* 调整内边距 */
  font-size: 12px;   /* 调整字体大小 */
  min-width: 100px;  /* 设置最小宽度 */
  margin-left: 0;
  margin-top: 10px;
}

.btn-danger:hover {
  background-color: #D32F2F;
  transform: translateY(-2px);
}

/* 教室网格布局 */
.classroom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.classroom-card {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-color);
  overflow: hidden;
  transition: var(--transition);
}

.classroom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.classroom-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.classroom-info {
  padding: 1.25rem;
}

.classroom-name {
  font-size: 18px;
  margin-bottom: 5px;
  color: var(--primary-color);
}

.classroom-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.classroom-capacity i,
.classroom-location i {
  margin-right: 5px;
}

.classroom-schedule {
  margin-top: 10px;
  font-size: 14px;
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px dashed #eee;
}

.schedule-item:last-child {
  border-bottom: none;
}

/* 预约列表样式 */
.bookings-list {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-color);
  overflow: hidden;
}

.booking-item {
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.booking-item:hover {
  background-color: #f9f9f9;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.booking-title {
  font-weight: 500;
  color: var(--primary-color);
}

.booking-status {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background-color: #FFF3CD;
  color: #856404;
}

.status-approved {
  background-color: #D4EDDA;
  color: #155724;
}

.status-rejected {
  background-color: #F8D7DA;
  color: #721C24;
}

.booking-details {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
  font-size: 14px;
}

.booking-detail {
  display: flex;
  align-items: center;
}

.booking-detail i {
  margin-right: 5px;
  color: #666;
}

/* 模态框样式 */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  justify-content: center;
  align-items: center;
}

.modal.show {
  display: flex;
}

.modal-content {
  background-color: white;
  width: 90%;
  max-width: 500px;
  padding: 20px;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: var(--transition);
}

.close-btn:hover {
  color: var(--dark-color);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 14px;
  transition: var(--transition);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .search-filter-section {
    flex-direction: column;
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .filter-options {
    width: 100%;
    flex-direction: column;
  }
  
  .classroom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .tab-btn {
    padding: 8px 15px;
    font-size: 14px;
  }
}

/* Vue 特定的样式调整 */
.no-slots {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 10px 0;
}

.no-bookings {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}
</style>