<template>
  <div class="dorm-admin">
    <main class="container">
      <h1 class="page-title">宿舍管理</h1>
      
      <div class="admin-controls">
        <section class="card dorm-status-section">
          <h2><i class="bi bi-building"></i> 宿舍状态设置</h2>
          <form id="dorm-status-form" class="dorm-form" @submit.prevent="updateDormStatus">
            <div class="form-group">
              <label for="building-select">宿舍楼</label>
              <select id="building-select" v-model="dormStatusForm.building" class="form-control" required>
                <option value="">请选择宿舍楼</option>
                <option value="1">1号楼</option>
                <option value="2">2号楼</option>
                <option value="3">3号楼</option>
                <option value="4">4号楼</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="room-number">房间号</label>
              <input type="text" id="room-number" v-model="dormStatusForm.room" class="form-control" placeholder="如：101" required>
            </div>
            
            <div class="form-group">
              <label for="status-select">状态</label>
              <select id="status-select" v-model="dormStatusForm.status" class="form-control" required>
                <option value="">请选择状态</option>
                <option value="available">可入住</option>
                <option value="occupied">已入住</option>
                <option value="maintenance">维修中</option>
                <option value="reserved">预留</option>
              </select>
            </div>
            
            <button type="submit" class="btn primary-btn">更新状态</button>
          </form>
        </section>
        
        <section class="card search-section">
          <h2><i class="bi bi-search"></i> 空余宿舍查询</h2>
          <form id="vacant-search-form" class="search-form" @submit.prevent="searchVacantDorms">
            <div class="form-group">
              <label for="search-building">宿舍楼</label>
              <select id="search-building" v-model="searchForm.building" class="form-control">
                <option value="">全部宿舍楼</option>
                <option value="1">1号楼</option>
                <option value="2">2号楼</option>
                <option value="3">3号楼</option>
                <option value="4">4号楼</option>
              </select>
            </div>
            
            <button type="submit" class="btn primary-btn">查询</button>
          </form>
          
          <div class="table-container">
            <table id="vacant-dorms-table" class="data-table">
              <thead>
                <tr>
                  <th>宿舍楼</th>
                  <th>房间号</th>
                  <th>床位数</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(dorm, index) in filteredVacantDorms" :key="index">
                  <td>{{ dorm.building }}</td>
                  <td>{{ dorm.room }}</td>
                  <td>{{ dorm.beds }}</td>
                  <td><span class="status-badge" :class="getStatusClass(dorm.status)">{{ dorm.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      
      <section class="card assignment-section">
        <h2><i class="bi bi-people-fill"></i> 宿舍分配结果</h2>
        <div class="table-container">
          <table id="assignment-table" class="data-table">
            <thead>
              <tr>
                <th>学号</th>
                <th>姓名</th>
                <th>宿舍楼</th>
                <th>房间号</th>
                <th>床号</th>
                <th>分配日期</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(assignment, index) in assignmentData" :key="index">
                <td>{{ assignment.studentId }}</td>
                <td>{{ assignment.name }}</td>
                <td>{{ assignment.building }}</td>
                <td>{{ assignment.room }}</td>
                <td>{{ assignment.bed }}</td>
                <td>{{ assignment.date }}</td>
              </tr>
            </tbody>
          </table>
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
      // 宿舍状态表单数据
      dormStatusForm: {
        building: '',
        room: '',
        status: ''
      },
      // 搜索表单数据
      searchForm: {
        building: ''
      },
      // 空余宿舍数据
      vacantDormsData: [
        { building: "1号楼", room: "101", beds: 4, status: "可入住" },
        { building: "1号楼", room: "102", beds: 4, status: "可入住" },
        { building: "2号楼", room: "201", beds: 4, status: "可入住" },
        { building: "2号楼", room: "202", beds: 4, status: "可入住" },
        { building: "3号楼", room: "301", beds: 4, status: "可入住" },
        { building: "3号楼", room: "302", beds: 4, status: "可入住" },
      ],
      // 分配结果数据
      assignmentData: [
        { studentId: "20230001", name: "张三", building: "1号楼", room: "101", bed: "1", date: "2023-09-01" },
        { studentId: "20230002", name: "李四", building: "1号楼", room: "101", bed: "2", date: "2023-09-01" },
        { studentId: "20230003", name: "王五", building: "1号楼", room: "102", bed: "1", date: "2023-09-01" },
        { studentId: "20230004", name: "赵六", building: "2号楼", room: "201", bed: "1", date: "2023-09-02" },
        { studentId: "20230005", name: "钱七", building: "2号楼", room: "201", bed: "2", date: "2023-09-02" },
      ]
    }
  },
  computed: {
    // 过滤后的空余宿舍数据
    filteredVacantDorms() {
      if (!this.searchForm.building) {
        return this.vacantDormsData;
      }
      return this.vacantDormsData.filter(item => 
        item.building === `${this.searchForm.building}号楼`
      );
    }
  },
  methods: {
    // 更新宿舍状态
    updateDormStatus() {
      const { building, room, status } = this.dormStatusForm;
      
      if (!building || !room || !status) {
        alert("请填写完整信息");
        return;
      }
      
      // 模拟API调用
      setTimeout(() => {
        alert(`宿舍状态更新成功：${building}号楼 ${room} 状态设置为 ${this.getStatusText(status)}`);
        this.dormStatusForm = {
          building: '',
          room: '',
          status: ''
        };
      }, 500);
    },
    
    // 搜索空余宿舍
    searchVacantDorms() {
      // 数据已通过computed属性自动过滤
      console.log('执行搜索，筛选条件：', this.searchForm.building);
    },
    
    // 获取状态对应的CSS类
    getStatusClass(status) {
      switch(status) {
        case "可入住": return "available";
        case "已入住": return "occupied";
        case "维修中": return "maintenance";
        case "预留": return "reserved";
        default: return "";
      }
    },
    
    // 获取状态文本
    getStatusText(statusValue) {
      switch(statusValue) {
        case "available": return "可入住";
        case "occupied": return "已入住";
        case "maintenance": return "维修中";
        case "reserved": return "预留";
        default: return "";
      }
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
:root {
  --primary-color: #2A5CAA;
  --primary-light: #E8F0FE;
  --secondary-color: #4CAF50;
  --text-color: #333;
  --text-light: #666;
  --border-color: #E0E0E0;
  --bg-color: #F9F9F9;
  --card-bg: #FFF;
  --error-color: #E53935;
  --success-color: #43A047;
  --warning-color: #FB8C00;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--primary-color);
  font-weight: 600;
}

/* 卡片样式 */
.card {
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  margin-bottom: 2rem;
  transition: var(--transition);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.card h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 表单样式 */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-control {
  width: 100%;
  padding: 0.75rem;
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

/* 按钮样式 */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  text-align: center;
}

.primary-btn {
  background-color: var(--primary-color);
  color: white;
}

.primary-btn:hover {
  background-color: #1E4B8F;
}

.primary-btn:active {
  background-color: #153A75;
}

/* 表格样式 */
.table-container {
  overflow-x: auto;
  margin-top: 1.5rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.data-table th,
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background-color: var(--primary-light);
  color: var(--primary-color);
  font-weight: 600;
}

.data-table tr:hover {
  background-color: rgba(42, 92, 170, 0.05);
}

/* 布局样式 */
.admin-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.dorm-form {
  display: grid;
  gap: 1rem;
}

.search-form {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

/* 状态徽章样式 */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.available {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--success-color);
}

.status-badge.occupied {
  background-color: rgba(42, 92, 170, 0.1);
  color: var(--primary-color);
}

.status-badge.maintenance {
  background-color: rgba(251, 140, 0, 0.1);
  color: var(--warning-color);
}

.status-badge.reserved {
  background-color: rgba(156, 39, 176, 0.1);
  color: #9C27B0;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .admin-controls {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 0 1rem;
  }
  
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn {
    width: 100%;
  }
}
</style>