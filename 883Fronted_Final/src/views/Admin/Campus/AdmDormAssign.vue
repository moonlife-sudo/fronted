<template>
  <div class="dorm-assign-page">
    <main class="container">
      <section class="view-section">
        <h1><i class="bi bi-people-fill"></i> 宿舍分配结果</h1>
        <div class="search-filter">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input 
              type="text" 
              placeholder="搜索学生姓名或学号..." 
              v-model="adminSearch"
              @input="filterAdminData"
            >
          </div>
          <select v-model="selectedBuilding" @change="filterAdminData">
            <option value="">所有宿舍楼</option>
            <option value="1">1号楼</option>
            <option value="2">2号楼</option>
            <option value="3">3号楼</option>
          </select>
        </div>
        
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>学号</th>
                <th>姓名</th>
                <th>性别</th>
                <th>宿舍楼</th>
                <th>房间号</th>
                <th>床位号</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="student in paginatedAdminData" 
                :key="student.id"
                :class="{ selected: selectedStudent === student.id }"
                @click="selectStudent(student.id)"
              >
                <td>{{ student.studentId }}</td>
                <td>{{ student.name }}</td>
                <td>{{ student.gender }}</td>
                <td>{{ student.building }}号楼</td>
                <td>{{ student.room }}</td>
                <td>{{ student.bed }}</td>
                <td>
                  <button class="btn-edit" @click.stop="editAssignment(student)">
                    <i class="bi bi-pencil-square"></i> 修改
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="pagination">
          <button 
            :disabled="adminCurrentPage === 1" 
            @click="changeAdminPage(adminCurrentPage - 1)"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <button 
            v-for="page in adminTotalPages" 
            :key="page"
            :class="{ active: page === adminCurrentPage }"
            @click="changeAdminPage(page)"
          >
            {{ page }}
          </button>
          <button 
            :disabled="adminCurrentPage === adminTotalPages" 
            @click="changeAdminPage(adminCurrentPage + 1)"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'DormAssign',
  data() {
    return {
      adminSearch: '',
      selectedBuilding: '',
      selectedStudent: null,
      adminCurrentPage: 1,
      adminPageSize: 4,
      
      // 管理员数据
      adminData: [
        { id: 1, studentId: '20230001', name: '张三', gender: '男', building: '1', room: '101', bed: 'A' },
        { id: 2, studentId: '20230002', name: '李四', gender: '男', building: '1', room: '101', bed: 'B' },
        { id: 3, studentId: '20230003', name: '王五', gender: '女', building: '2', room: '201', bed: 'A' },
        { id: 4, studentId: '20230004', name: '赵六', gender: '女', building: '2', room: '201', bed: 'B' },
        { id: 5, studentId: '20230005', name: '钱七', gender: '男', building: '1', room: '102', bed: 'A' },
        { id: 6, studentId: '20230006', name: '孙八', gender: '女', building: '3', room: '301', bed: 'A' }
      ],
      filteredAdminData: []
    }
  },
  computed: {
    filteredAdminData() {
      let filtered = this.adminData
      
      // 搜索过滤
      if (this.adminSearch) {
        const searchTerm = this.adminSearch.toLowerCase()
        filtered = filtered.filter(student => 
          student.name.toLowerCase().includes(searchTerm) ||
          student.studentId.includes(searchTerm)
        )
      }
      
      // 宿舍楼过滤
      if (this.selectedBuilding) {
        filtered = filtered.filter(student => student.building === this.selectedBuilding)
      }
      
      return filtered
    },
    paginatedAdminData() {
      const start = (this.adminCurrentPage - 1) * this.adminPageSize
      const end = start + this.adminPageSize
      return this.filteredAdminData.slice(start, end)
    },
    adminTotalPages() {
      return Math.ceil(this.filteredAdminData.length / this.adminPageSize)
    }
  },
  methods: {
    filterAdminData() {
      this.adminCurrentPage = 1 // 重置到第一页
    },
    selectStudent(studentId) {
      this.selectedStudent = studentId
    },
    editAssignment(student) {
      // 这里可以打开编辑模态框或跳转到编辑页面
      alert(`编辑 ${student.name} 的宿舍分配`)
    },
    changeAdminPage(page) {
      if (page >= 1 && page <= this.adminTotalPages) {
        this.adminCurrentPage = page
      }
    }
  },
  mounted() {
    // 初始化过滤数据
    this.filteredAdminData = [...this.adminData]
  }
}
</script>

<style>
.dorm-assign-page {
  --primary-color: #2A5CAA;
  --secondary-color: #4CAF50;
  --light-color: #F5F7FA;
  --dark-color: #333333;
  --gray-color: #E0E0E0;
  --border-radius: 8px;
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

.dorm-assign-page * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dorm-assign-page {
  font-family: 'Roboto', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--dark-color);
  background-color: var(--light-color);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

/* 视图区域 */
.view-section {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
}

.view-section h1 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 搜索和筛选 */
.search-filter {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-box input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid var(--gray-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.2);
}

.search-filter select {
  padding: 0.8rem 1rem;
  border: 1px solid var(--gray-color);
  border-radius: var(--border-radius);
  background-color: white;
  cursor: pointer;
  transition: var(--transition);
}

.search-filter select:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* 表格样式 */
.table-container {
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th, td {
  padding: 1rem;
  border-bottom: 1px solid var(--gray-color);
}

th {
  background-color: #f8f9fa;
  font-weight: 500;
  color: var(--primary-color);
}

tr:hover {
  background-color: #f8f9fa;
}

tr.selected {
  background-color: #e3f2fd;
}

.btn-edit {
  padding: 0.5rem 1rem;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);
}

.btn-edit:hover {
  background-color: #3e8e41;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--gray-color);
  background-color: white;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.pagination button:not(:disabled):hover {
  background-color: var(--gray-color);
}

.pagination button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-filter {
    flex-direction: column;
  }
  
  .search-box {
    min-width: 100%;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .view-section {
    padding: 1rem;
  }
  
  th, td {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  .btn-edit {
    padding: 0.3rem 0.5rem;
    font-size: 0.8rem;
  }
}
</style>