<template>
  <div class="teacher-student-classroom">
    <main class="container">
      
      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'available' }"
          @click="activeTab = 'available'"
        >
          可用教室
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'bookings' }"
          @click="activeTab = 'bookings'"
        >
          我的预约
        </button>
      </div>
      
      <!-- 搜索和筛选区域 - 修改为与 AdminLibrary 相同样式 -->
      <section class="search-filter-section">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="搜索教室名称或编号..." 
            v-model="searchQuery"
            @input="filterClassrooms"
          >
          <button class="search-btn"><i class="bi bi-search"></i></button>
        </div>
        <div class="filter-options">
          <select v-model="capacityFilter" @change="filterClassrooms">
            <option value="">所有容量</option>
            <option value="30">30人以下</option>
            <option value="50">30-50人</option>
            <option value="100">50-100人</option>
            <option value="100+">100人以上</option>
          </select>
          <select v-model="timeFilter" @change="filterClassrooms">
            <option value="">所有时间</option>
            <option value="morning">上午 (8:00-12:00)</option>
            <option value="afternoon">下午 (13:00-17:00)</option>
            <option value="evening">晚上 (18:00-21:00)</option>
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
                  <i class="bi bi-people"></i> {{ classroom.capacity }}人
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
                  暂无可用时间段
                </div>
              </div>
              <button 
                class="btn btn-primary" 
                @click="openBookingModal(classroom)"
                :disabled="availableTimes(classroom).length === 0"
              >
                {{ availableTimes(classroom).length === 0 ? '已约满' : '立即预约' }}
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
              <i class="bi bi-x-circle"></i> 取消预约
            </button>
          </div>
          <div v-if="bookings.length === 0" class="no-bookings">
            暂无预约记录
          </div>
        </div>
      </div>
    </main>
    
    <!-- 预约模态框 -->
    <div class="modal" :class="{ show: showBookingModal }" @click="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close-btn" @click="closeModal">&times;</span>
        <h2>预约教室</h2>
        <form @submit.prevent="submitBooking">
          <div class="form-group">
            <label for="classroomName">教室名称</label>
            <input 
              type="text" 
              id="classroomName" 
              :value="selectedClassroom ? selectedClassroom.name : ''" 
              readonly
            >
          </div>
          <div class="form-group">
            <label for="bookingDate">预约日期</label>
            <input type="date" id="bookingDate" v-model="bookingForm.date" required>
          </div>
          <div class="form-group">
            <label for="startTime">开始时间</label>
            <input type="time" id="startTime" v-model="bookingForm.startTime" required>
          </div>
          <div class="form-group">
            <label for="endTime">结束时间</label>
            <input type="time" id="endTime" v-model="bookingForm.endTime" required>
          </div>
          <div class="form-group">
            <label for="purpose">使用目的</label>
            <textarea 
              id="purpose" 
              rows="3" 
              v-model="bookingForm.purpose" 
              required
              placeholder="请填写教室使用目的..."
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary">提交预约</button>
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
          name: "101教室",
          capacity: 50,
          location: "主教学楼1楼",
          image: "https://placeholder.pics/svg/300x200/DEDEDE/555555/101教室",
          schedule: [
            { date: "2023-06-01", time: "08:00-10:00", available: true },
            { date: "2023-06-01", time: "10:00-12:00", available: false },
            { date: "2023-06-01", time: "14:00-16:00", available: true }
          ]
        },
        {
          id: 2,
          name: "201多媒体教室",
          capacity: 80,
          location: "主教学楼2楼",
          image: "https://placeholder.pics/svg/300x200/DEDEDE/555555/201多媒体教室",
          schedule: [
            { date: "2023-06-01", time: "08:00-10:00", available: false },
            { date: "2023-06-01", time: "10:00-12:00", available: true },
            { date: "2023-06-01", time: "14:00-16:00", available: true }
          ]
        },
        {
          id: 3,
          name: "301实验室",
          capacity: 30,
          location: "实验楼3楼",
          image: "https://placeholder.pics/svg/300x200/DEDEDE/555555/301实验室",
          schedule: [
            { date: "2023-06-01", time: "08:00-10:00", available: true },
            { date: "2023-06-01", time: "10:00-12:00", available: true },
            { date: "2023-06-01", time: "14:00-16:00", available: false }
          ]
        },
        {
          id: 4,
          name: "401会议室",
          capacity: 20,
          location: "行政楼4楼",
          image: "https://placeholder.pics/svg/300x200/DEDEDE/555555/401会议室",
          schedule: [
            { date: "2023-06-01", time: "08:00-10:00", available: true },
            { date: "2023-06-01", time: "10:00-12:00", available: true },
            { date: "2023-06-01", time: "14:00-16:00", available: true }
          ]
        },
        {
          id: 5,
          name: "501阶梯教室",
          capacity: 120,
          location: "主教学楼5楼",
          image: "https://placeholder.pics/svg/300x200/DEDEDE/555555/501阶梯教室",
          schedule: [
            { date: "2023-06-01", time: "08:00-10:00", available: false },
            { date: "2023-06-01", time: "10:00-12:00", available: false },
            { date: "2023-06-01", time: "14:00-16:00", available: true }
          ]
        },
        {
          id: 6,
          name: "601计算机教室",
          capacity: 60,
          location: "信息楼6楼",
          image: "https://placeholder.pics/svg/300x200/DEDEDE/555555/601计算机教室",
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
          classroom: "201多媒体教室",
          date: "2023-06-01",
          time: "10:00-12:00",
          purpose: "班级会议",
          status: "approved"
        },
        {
          id: 2,
          classroom: "301实验室",
          date: "2023-06-02",
          time: "14:00-16:00",
          purpose: "物理实验课",
          status: "pending"
        },
        {
          id: 3,
          classroom: "501阶梯教室",
          date: "2023-06-03",
          time: "08:00-10:00",
          purpose: "学术讲座",
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
        approved: '已批准',
        pending: '待审批',
        rejected: '已拒绝'
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
      alert('预约提交成功，请等待审批！')
    },
    
    cancelBooking(bookingId) {
      if (confirm('确定要取消此预约吗？')) {
        const index = this.bookings.findIndex(b => b.id === bookingId)
        if (index !== -1) {
          this.bookings.splice(index, 1)
          alert('预约已取消')
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