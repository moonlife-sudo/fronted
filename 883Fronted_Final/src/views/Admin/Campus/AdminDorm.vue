<template>
  <div class="dorm-admin-page">
    <main class="dorm-admin-container">
      <h1 class="page-title">宿舍管理</h1>
      
      <section class="dorm-control-section">
        <div class="section-header">
          <h2><i class="bi bi-gear"></i> 宿舍状态设置</h2>
        </div>
        
        <form @submit.prevent="submitDormStatus" class="dorm-status-form">
          <div class="form-group">
            <label for="dorm-building">宿舍楼</label>
            <select id="dorm-building" v-model="form.building" class="form-control" required>
              <option value="">请选择宿舍楼</option>
              <option value="1">1号楼</option>
              <option value="2">2号楼</option>
              <option value="3">3号楼</option>
              <option value="4">4号楼</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="dorm-room">宿舍号</label>
            <select id="dorm-room" v-model="form.room" class="form-control" required>
              <option value="">请先选择宿舍楼</option>
              <option v-for="room in availableRooms" :key="room" :value="room">{{ room }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="dorm-status">宿舍状态</label>
            <select id="dorm-status" v-model="form.status" class="form-control" required>
              <option value="">请选择状态</option>
              <option value="available">可用</option>
              <option value="maintenance">维修中</option>
              <option value="reserved">预留</option>
              <option value="full">已满</option>
            </select>
          </div>
          
          <button type="submit" class="btn-submit">
            <i class="bi bi-check-circle"></i> 提交更改
          </button>
        </form>
      </section>
      
      <section class="dorm-vacancy-section">
        <div class="section-header">
          <h2><i class="bi bi-house-door"></i> 空余床位查看</h2>
          <div class="search-box">
            <input 
              type="text" 
              placeholder="搜索宿舍号..." 
              v-model="searchTerm"
              @keypress.enter="searchDorms"
            >
            <button class="search-btn" @click="searchDorms">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="dorm-vacancy-table">
            <thead>
              <tr>
                <th>宿舍楼</th>
                <th>宿舍号</th>
                <th>床位总数</th>
                <th>已占用</th>
                <th>空余</th>
                <th>当前状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dorm in filteredDorms" :key="dorm.id">
                <td>{{ dorm.building }}号楼</td>
                <td>{{ dorm.room }}</td>
                <td>{{ dorm.totalBeds }}</td>
                <td>{{ dorm.occupied }}</td>
                <td>{{ dorm.vacant }}</td>
                <td>
                  <span :class="`status-badge ${dorm.status}`">
                    {{ getStatusText(dorm.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="pagination">
          <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
            <i class="bi bi-chevron-left"></i>
          </button>
          <button 
            v-for="page in totalPages" 
            :key="page"
            class="page-btn" 
            :class="{ active: page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'DormAdmin',
  data() {
    return {
      form: {
        building: '',
        room: '',
        status: ''
      },
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 5,
      dorms: [
        { id: 1, building: '1', room: '101', totalBeds: 4, occupied: 3, vacant: 1, status: 'available' },
        { id: 2, building: '1', room: '102', totalBeds: 4, occupied: 4, vacant: 0, status: 'full' },
        { id: 3, building: '2', room: '201', totalBeds: 4, occupied: 2, vacant: 2, status: 'available' },
        { id: 4, building: '2', room: '202', totalBeds: 4, occupied: 0, vacant: 4, status: 'maintenance' },
        { id: 5, building: '3', room: '301', totalBeds: 4, occupied: 3, vacant: 1, status: 'reserved' },
        { id: 6, building: '3', room: '302', totalBeds: 4, occupied: 2, vacant: 2, status: 'available' },
        { id: 7, building: '4', room: '401', totalBeds: 4, occupied: 1, vacant: 3, status: 'available' }
      ]
    }
  },
  computed: {
    availableRooms() {
      if (!this.form.building) return []
      const baseRoom = parseInt(this.form.building) * 100
      const rooms = []
      for (let i = 1; i <= 10; i++) {
        rooms.push(baseRoom + i)
      }
      return rooms
    },
    filteredDorms() {
      let filtered = this.dorms
      
      // 搜索过滤
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase()
        filtered = filtered.filter(dorm => 
          dorm.building.includes(term) || 
          dorm.room.includes(term) ||
          this.getStatusText(dorm.status).toLowerCase().includes(term)
        )
      }
      
      // 分页
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return filtered.slice(start, end)
    },
    totalPages() {
      const total = this.searchTerm 
        ? this.dorms.filter(dorm => 
            dorm.building.includes(this.searchTerm) || 
            dorm.room.includes(this.searchTerm) ||
            this.getStatusText(dorm.status).toLowerCase().includes(this.searchTerm)
          ).length
        : this.dorms.length
      return Math.ceil(total / this.itemsPerPage)
    }
  },
  methods: {
    submitDormStatus() {
      if (!this.form.building || !this.form.room || !this.form.status) {
        this.showAlert('请填写完整信息', 'error')
        return
      }
      
      // 模拟提交到服务器
      setTimeout(() => {
        this.updateDormStatus(this.form.building, this.form.room, this.form.status)
        this.showAlert(`宿舍 ${this.form.building}号楼${this.form.room} 状态已更新为 ${this.getStatusText(this.form.status)}`, 'success')
        this.resetForm()
      }, 1000)
    },
    updateDormStatus(building, room, status) {
      const dorm = this.dorms.find(d => d.building === building && d.room === room)
      if (dorm) {
        dorm.status = status
        
        // 根据状态更新床位信息
        if (status === 'full') {
          dorm.occupied = dorm.totalBeds
          dorm.vacant = 0
        } else if (status === 'maintenance') {
          dorm.occupied = 0
          dorm.vacant = dorm.totalBeds
        } else if (status === 'available' && dorm.occupied === dorm.totalBeds) {
          // 如果从已满改为可用，重置为默认状态
          dorm.occupied = Math.floor(dorm.totalBeds / 2)
          dorm.vacant = dorm.totalBeds - dorm.occupied
        }
      }
    },
    resetForm() {
      this.form = {
        building: '',
        room: '',
        status: ''
      }
    },
    getStatusText(status) {
      const statusMap = {
        'available': '可用',
        'maintenance': '维修中',
        'reserved': '预留',
        'full': '已满'
      }
      return statusMap[status] || status
    },
    searchDorms() {
      this.currentPage = 1 // 搜索时重置到第一页
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
    showAlert(message, type) {
      // 这里可以使用更完善的提示组件，暂时使用原生 alert
      alert(message)
    }
  }
}
</script>

<style>
.dorm-admin-page {
  --primary-color: #2A5CAA;
  --primary-light: #E8F0FE;
  --secondary-color: #4CAF50;
  --secondary-light: #E8F5E9;
  --text-color: #333;
  --text-light: #666;
  --border-color: #E0E0E0;
  --bg-color: #F9F9F9;
  --card-bg: #FFF;
  --error-color: #F44336;
  --warning-color: #FF9800;
  --success-color: #4CAF50;
  --info-color: #2196F3;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

.dorm-admin-page * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dorm-admin-page {
  font-family: 'Roboto', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
}

.dorm-admin-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
  font-weight: 600;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dorm-control-section, .dorm-vacancy-section {
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.dorm-control-section:hover, .dorm-vacancy-section:hover {
  box-shadow: var(--shadow-md);
}

.dorm-status-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-light);
}

.form-control {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  transition: var(--transition);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.2);
}

.btn-submit {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  align-self: flex-end;
  margin-top: auto;
}

.btn-submit:hover {
  background-color: #3d8b40;
  transform: translateY(-2px);
}

.btn-submit:active {
  transform: translateY(0);
}

.search-box {
  display: flex;
  align-items: center;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: var(--transition);
}

.search-box:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.2);
}

.search-box input {
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  flex: 1;
  min-width: 200px;
}

.search-box input:focus {
  outline: none;
}

.search-btn {
  background-color: var(--primary-light);
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: var(--primary-color);
  transition: var(--transition);
}

.search-btn:hover {
  background-color: #D8E4FC;
}

.table-responsive {
  overflow-x: auto;
  margin-top: 1rem;
}

.dorm-vacancy-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.dorm-vacancy-table th, 
.dorm-vacancy-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.dorm-vacancy-table th {
  background-color: var(--primary-light);
  color: var(--primary-color);
  font-weight: 500;
}

.dorm-vacancy-table tr:hover {
  background-color: var(--bg-color);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.available {
  background-color: var(--secondary-light);
  color: var(--success-color);
}

.status-badge.maintenance {
  background-color: #FFF3E0;
  color: var(--warning-color);
}

.status-badge.full {
  background-color: #FFEBEE;
  color: var(--error-color);
}

.status-badge.reserved {
  background-color: #E3F2FD;
  color: var(--info-color);
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.page-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .dorm-status-form {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-box {
    width: 100%;
  }
  
  .dorm-vacancy-table th, 
  .dorm-vacancy-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>