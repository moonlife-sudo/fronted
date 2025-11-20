<template>
  <div class="admin-classroom">
    
    <main class="container">
      <div class="page-header">
        <h1>教室管理</h1>
        <div class="actions">
          <button @click="showAddModal" class="btn primary">
            <i class="bi bi-plus-lg"></i> 添加教室
          </button>
        </div>
      </div>

      <div class="search-filter">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="搜索教室名称或编号..."
          >
        </div>
        <div class="filter-group">
          <select v-model="statusFilter">
            <option value="all">所有状态</option>
            <option value="active">可用</option>
            <option value="inactive">停用</option>
          </select>
          <select v-model="capacityFilter">
            <option value="all">所有容量</option>
            <option value="small">小型 (1-30人)</option>
            <option value="medium">中型 (31-60人)</option>
            <option value="large">大型 (61+人)</option>
          </select>
        </div>
      </div>

      <div class="classroom-list">
        <div 
          v-for="classroom in filteredClassrooms" 
          :key="classroom.id" 
          class="classroom-card"
        >
          <div class="classroom-header">
            <h3>{{ classroom.name }}</h3>
            <p>编号: {{ classroom.number }}</p>
          </div>
          <div class="classroom-body">
            <div class="classroom-info">
              <div class="classroom-info-item">
                <i class="bi bi-people-fill"></i>
                <span>容量: {{ classroom.capacity }}人</span>
              </div>
              <div class="classroom-info-item">
                <i class="bi bi-geo-alt-fill"></i>
                <span>位置: {{ classroom.location }}</span>
              </div>
              <div class="classroom-info-item">
                <i class="bi bi-pc-display"></i>
                <span>设备: {{ classroom.equipment || '无' }}</span>
              </div>
              <div class="classroom-info-item">
                <i class="bi bi-circle-fill"></i>
                <span>状态: 
                  <span class="classroom-status" :class="{
                    'status-active': classroom.status === 'active',
                    'status-inactive': classroom.status === 'inactive'
                  }">
                    {{ classroom.status === 'active' ? '可用' : '停用' }}
                  </span>
                </span>
              </div>
            </div>
            <div class="classroom-actions">
              <button 
                @click="toggleStatus(classroom.id)"
                class="btn" 
                :class="classroom.status === 'active' ? 'danger' : 'secondary'"
              >
                {{ classroom.status === 'active' ? '停用' : '启用' }}
              </button>
              <button 
                @click="editClassroom(classroom)"
                class="btn outline"
              >
                <i class="bi bi-pencil-fill"></i> 编辑
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredClassrooms.length === 0" class="no-results">
          没有找到匹配的教室
        </div>
      </div>

      <!-- 添加教室模态框 -->
      <div v-if="showModal" class="modal show">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ editingClassroom ? '编辑教室' : '添加新教室' }}</h2>
            <button @click="closeModal" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveClassroom">
              <div class="form-group">
                <label for="classroom-name">教室名称</label>
                <input 
                  type="text" 
                  id="classroom-name"
                  v-model="formData.name"
                  required
                >
              </div>
              <div class="form-group">
                <label for="classroom-number">教室编号</label>
                <input 
                  type="text" 
                  id="classroom-number"
                  v-model="formData.number"
                  required
                >
              </div>
              <div class="form-group">
                <label for="classroom-capacity">容量</label>
                <input 
                  type="number" 
                  id="classroom-capacity"
                  v-model.number="formData.capacity"
                  min="1"
                  required
                >
              </div>
              <div class="form-group">
                <label for="classroom-location">位置</label>
                <input 
                  type="text" 
                  id="classroom-location"
                  v-model="formData.location"
                  required
                >
              </div>
              <div class="form-group">
                <label for="classroom-equipment">设备配置</label>
                <textarea 
                  id="classroom-equipment" 
                  rows="3"
                  v-model="formData.equipment"
                ></textarea>
              </div>
              <div class="form-actions">
                <button type="button" @click="closeModal" class="btn secondary">取消</button>
                <button type="submit" class="btn primary">保存</button>
              </div>
            </form>
          </div>
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
  name: 'AdminClassroom',
  components: {

  },
  data() {
    return {
      // 教室数据
      classrooms: [
        {
          id: 1,
          name: "多媒体教室A",
          number: "101",
          capacity: 50,
          location: "主教学楼1楼",
          equipment: "投影仪、电脑、音响",
          status: "active"
        },
        {
          id: 2,
          name: "计算机实验室B",
          number: "205",
          capacity: 40,
          location: "科技楼2楼",
          equipment: "电脑40台、投影仪",
          status: "active"
        },
        {
          id: 3,
          name: "会议室C",
          number: "310",
          capacity: 30,
          location: "行政楼3楼",
          equipment: "会议桌、投影仪、电话",
          status: "inactive"
        },
        {
          id: 4,
          name: "语音实验室D",
          number: "412",
          capacity: 45,
          location: "外语楼4楼",
          equipment: "语音设备45套",
          status: "active"
        },
        {
          id: 5,
          name: "美术教室E",
          number: "108",
          capacity: 25,
          location: "艺术楼1楼",
          equipment: "画架、静物台",
          status: "active"
        },
        {
          id: 6,
          name: "物理实验室F",
          number: "209",
          capacity: 35,
          location: "科技楼2楼",
          equipment: "实验台、仪器",
          status: "inactive"
        }
      ],
      // 筛选条件
      searchQuery: '',
      statusFilter: 'all',
      capacityFilter: 'all',
      // 模态框状态
      showModal: false,
      editingClassroom: null,
      // 表单数据
      formData: {
        name: '',
        number: '',
        capacity: '',
        location: '',
        equipment: ''
      },
      // Toast 提示
      toast: {
        show: false,
        message: ''
      }
    }
  },
  computed: {
    // 筛选后的教室列表
    filteredClassrooms() {
      return this.classrooms.filter(classroom => {
        // 搜索条件
        const matchesSearch = 
          classroom.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
          classroom.number.toLowerCase().includes(this.searchQuery.toLowerCase())
        
        // 状态条件
        const matchesStatus = 
          this.statusFilter === 'all' || 
          (this.statusFilter === 'active' && classroom.status === 'active') || 
          (this.statusFilter === 'inactive' && classroom.status === 'inactive')
        
        // 容量条件
        let matchesCapacity = true
        if (this.capacityFilter !== 'all') {
          if (this.capacityFilter === 'small') {
            matchesCapacity = classroom.capacity <= 30
          } else if (this.capacityFilter === 'medium') {
            matchesCapacity = classroom.capacity > 30 && classroom.capacity <= 60
          } else if (this.capacityFilter === 'large') {
            matchesCapacity = classroom.capacity > 60
          }
        }
        
        return matchesSearch && matchesStatus && matchesCapacity
      })
    }
  },
  methods: {
    // 显示添加模态框
    showAddModal() {
      this.editingClassroom = null
      this.formData = {
        name: '',
        number: '',
        capacity: '',
        location: '',
        equipment: ''
      }
      this.showModal = true
    },
    // 关闭模态框
    closeModal() {
      this.showModal = false
      this.editingClassroom = null
      this.formData = {
        name: '',
        number: '',
        capacity: '',
        location: '',
        equipment: ''
      }
    },
    // 保存教室
    saveClassroom() {
      if (this.editingClassroom) {
        // 编辑现有教室
        const index = this.classrooms.findIndex(c => c.id === this.editingClassroom.id)
        if (index !== -1) {
          this.classrooms[index] = {
            ...this.editingClassroom,
            ...this.formData
          }
          this.showToast('教室更新成功')
        }
      } else {
        // 添加新教室
        const newClassroom = {
          id: Date.now(),
          ...this.formData,
          status: "active"
        }
        this.classrooms.unshift(newClassroom)
        this.showToast('教室添加成功')
      }
      this.closeModal()
    },
    // 切换教室状态
    toggleStatus(id) {
      const index = this.classrooms.findIndex(c => c.id === id)
      if (index !== -1) {
        this.classrooms[index].status = this.classrooms[index].status === 'active' ? 'inactive' : 'active'
        this.showToast(`教室已${this.classrooms[index].status === 'active' ? '启用' : '停用'}`)
      }
    },
    // 编辑教室
    editClassroom(classroom) {
      this.editingClassroom = classroom
      this.formData = { ...classroom }
      this.showModal = true
    },
    // 显示 Toast 提示
    showToast(message) {
      this.toast.message = message
      this.toast.show = true
      setTimeout(() => {
        this.toast.show = false
      }, 3000)
    }
  }
}
</script>

<style scoped>
/* CSS变量定义 */
.admin-classroom {
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

.admin-classroom {
  min-height: 100vh;
  background-color: var(--bg-color);
  font-family: 'Roboto', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
}

/* 主要内容区域 */
.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px 0;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 500;
  color: var(--primary-color);
  margin: 0;
}

.actions {
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

.btn.primary {
  background-color: var(--primary-color);
  color: var(--white);
  border: 1px solid var(--primary-color);
}

.btn.primary:hover {
  background-color: #1E4B8B;
  border-color: #1E4B8B;
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.btn.secondary {
  background-color: var(--secondary-color);
  color: var(--white);
  border: 1px solid var(--secondary-color);
}

.btn.secondary:hover {
  background-color: #3E9D44;
  border-color: #3E9D44;
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.btn.danger {
  background-color: var(--danger-color);
  color: var(--white);
  border: 1px solid var(--danger-color);
}

.btn.danger:hover {
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
.search-filter {
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

.filter-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-group select {
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

.filter-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.2);
}

/* 教室列表 */
.classroom-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: var(--text-light);
  font-size: 16px;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

/* 教室卡片 */
.classroom-card {
  background-color: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  position: relative;
}

.classroom-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}

.classroom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.classroom-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, var(--white) 0%, var(--bg-color) 100%);
}

.classroom-header h3 {
  font-size: 18px;
  margin-bottom: 4px;
  color: var(--primary-color);
  font-weight: 600;
}

.classroom-header p {
  font-size: 14px;
  color: var(--text-light);
  margin: 0;
}

.classroom-body {
  padding: 16px;
}

.classroom-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.classroom-info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.classroom-info-item i {
  color: var(--text-light);
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.classroom-info-item span {
  font-size: 14px;
  color: var(--text-color);
}

/* 状态标签 */
.classroom-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-active {
  background-color: var(--secondary-light);
  color: var(--secondary-color);
  border: 1px solid var(--secondary-color);
}

.status-inactive {
  background-color: var(--danger-light);
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
}

.classroom-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.classroom-actions .btn {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  padding: 8px 12px;
}

/* 模态框 */
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

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-light);
  transition: var(--transition);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  color: var(--text-color);
  background-color: var(--bg-color);
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input,
.form-group textarea,
.form-group select {
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
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.2);
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
  padding-top: 20px;
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
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .actions {
    width: 100%;
  }
  
  .actions .btn {
    flex: 1;
  }
  
  .search-filter {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .filter-group {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-group select {
    width: 100%;
  }
  
  .classroom-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .classroom-actions {
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
  .container {
    padding: 0 16px;
    margin: 16px auto;
  }
  
  .page-header h1 {
    font-size: 20px;
  }
  
  .classroom-header,
  .classroom-body {
    padding: 12px;
  }
  
  .modal-body {
    padding: 16px;
  }
  
  .modal-header {
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

/* 加载状态 */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  color: var(--text-light);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态增强 */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.no-results i {
  font-size: 48px;
  color: var(--border-color);
  margin-bottom: 8px;
}

.no-results h3 {
  font-size: 18px;
  color: var(--text-color);
  margin: 0;
}

.no-results p {
  font-size: 14px;
  color: var(--text-light);
  margin: 0;
  text-align: center;
}

/* 卡片悬停效果增强 */
.classroom-card {
  position: relative;
  overflow: hidden;
}

.classroom-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.classroom-card:hover::after {
  left: 100%;
}

/* 输入框焦点效果增强 */
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  transform: translateY(-1px);
}

/* 按钮点击效果 */
.btn:active {
  transform: translateY(0) scale(0.98);
}

/* 模态框背景模糊效果 */
.modal {
  backdrop-filter: blur(4px);
}
</style>