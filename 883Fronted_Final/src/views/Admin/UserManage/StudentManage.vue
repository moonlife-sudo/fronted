<template>
  <div class="student-manage">
    <div class="page-header">
      <h1>学生管理</h1>
      <button class="btn-primary" @click="showAddModal">
        <i class="bi bi-plus-lg"></i> 添加学生
      </button>
    </div>

    <div class="search-bar">
      <input type="text" v-model="searchForm.full_name" placeholder="搜索学生姓名..." class="search-input">
      <input type="text" v-model="searchForm.student_id_number" placeholder="学号" class="search-input">
      <input type="text" v-model="searchForm.major" placeholder="专业" class="search-input">
      <input type="text" v-model="searchForm.class_name" placeholder="班级" class="search-input">
      <select v-model="searchForm.status" class="search-select">
        <option value="">全部状态</option>
        <option value="1">激活</option>
        <option value="2">禁用</option>
      </select>
      <button class="btn-search" @click="loadStudents">搜索</button>
      <button class="btn-reset" @click="resetSearch">重置</button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll"></th>
            <th>学号</th>
            <th>姓名</th>
            <th>专业</th>
            <th>班级</th>
            <th>年级</th>
            <th>邮箱</th>
            <th>手机</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.user_id">
            <td><input type="checkbox" :value="student.user_id" v-model="selectedIds"></td>
            <td>{{ student.student_id_number || student.username }}</td>
            <td>{{ student.full_name }}</td>
            <td>{{ student.major || '-' }}</td>
            <td>{{ student.class_name || '-' }}</td>
            <td>{{ student.grade || '-' }}</td>
            <td>{{ student.email || '-' }}</td>
            <td>{{ student.phone_number || '-' }}</td>
            <td>
              <span :class="student.status === 1 ? 'status-active' : 'status-inactive'">
                {{ student.status === 1 ? '激活' : '禁用' }}
              </span>
            </td>
            <td>
              <button class="btn-edit" @click="editStudent(student)">编辑</button>
              <button class="btn-delete" @click="deleteStudent(student.user_id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="toolbar">
      <button class="btn-delete" @click="batchDelete" :disabled="selectedIds.length === 0">
        批量删除
      </button>
      <div class="pagination">
        <button @click="changePage(-1)" :disabled="currentPage <= 1">上一页</button>
        <span>第 {{ currentPage }} 页，共 {{ totalPages }} 页，共 {{ total }} 条</span>
        <button @click="changePage(1)" :disabled="currentPage >= totalPages">下一页</button>
      </div>
    </div>

    <!-- 添加/编辑对话框 -->
    <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
      <div class="dialog">
        <h3>{{ dialogMode === 'add' ? '添加学生' : '编辑学生' }}</h3>
        <form @submit.prevent="saveStudent">
          <div class="form-row">
            <div class="form-group">
              <label>学号 *</label>
              <input type="text" v-model="formData.username" required :readonly="dialogMode === 'edit'">
            </div>
            <div class="form-group">
              <label>姓名 *</label>
              <input type="text" v-model="formData.full_name" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>密码 {{ dialogMode === 'add' ? '*' : '' }}</label>
              <input type="password" v-model="formData.password" :required="dialogMode === 'add'">
            </div>
            <div class="form-group">
              <label>性别</label>
              <select v-model="formData.gender">
                <option value="">请选择</option>
                <option value="0">未知</option>
                <option value="1">男</option>
                <option value="2">女</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>专业</label>
              <input type="text" v-model="formData.major">
            </div>
            <div class="form-group">
              <label>班级</label>
              <input type="text" v-model="formData.class_name">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>年级</label>
              <input type="text" v-model="formData.grade">
            </div>
            <div class="form-group">
              <label>入学日期</label>
              <input type="date" v-model="formData.enrollment_date">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>邮箱</label>
              <input type="email" v-model="formData.email">
            </div>
            <div class="form-group">
              <label>手机</label>
              <input type="tel" v-model="formData.phone_number">
            </div>
          </div>
          <div class="form-group" v-if="dialogMode === 'edit'">
            <label>状态</label>
            <select v-model="formData.status">
              <option value="1">激活</option>
              <option value="2">禁用</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeDialog">取消</button>
            <button type="submit" class="btn-submit" :disabled="loading">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getStudents, addStudent, updateStudent, deleteStudents as deleteStudentsApi, getStudentById } from '@/api/admin'

export default {
  name: 'StudentManage',
  data() {
    return {
      students: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      selectedIds: [],
      searchForm: {
        full_name: '',
        student_id_number: '',
        major: '',
        class_name: '',
        status: ''
      },
      showDialog: false,
      dialogMode: 'add',
      formData: {
        user_id: null,
        username: '',
        password: '',
        full_name: '',
        email: '',
        phone_number: '',
        gender: '',
        major: '',
        class_name: '',
        grade: '',
        enrollment_date: '',
        status: 1
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize)
    },
    selectAll: {
      get() {
        return this.students.length > 0 && this.selectedIds.length === this.students.length
      },
      set(value) {
        if (value) {
          this.selectedIds = this.students.map(s => s.user_id)
        } else {
          this.selectedIds = []
        }
      }
    }
  },
  mounted() {
    this.loadStudents()
  },
  methods: {
    async loadStudents() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          ...this.searchForm
        }
        const result = await getStudents(params)
        if (result.code === 1) {
          // 后端返回的是驼峰命名，需要转换为前端使用的格式
          this.students = (result.data.rows || []).map(student => ({
            user_id: student.userId || student.user_id,
            username: student.username,
            full_name: student.fullName || student.full_name,
            email: student.email,
            phone_number: student.phoneNumber || student.phone_number,
            avatar_url: student.avatarUrl || student.avatar_url,
            status: student.status,
            student_id_number: student.studentIdNumber || student.student_id_number,
            gender: student.gender,
            major: student.major,
            class_name: student.className || student.class_name,
            grade: student.grade,
            enrollment_date: student.enrollmentDate || student.enrollment_date
          }))
          this.total = result.data.total || 0
          // 调试：打印学生数据，确保user_id存在
          if (this.students.length > 0) {
            console.log('学生数据示例:', this.students[0])
          }
        } else {
          alert(result.msg || '加载失败')
        }
      } catch (error) {
        console.error('加载学生列表失败:', error)
        alert('加载失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    showAddModal() {
      this.dialogMode = 'add'
      this.formData = {
        user_id: null,
        username: '',
        password: '',
        full_name: '',
        email: '',
        phone_number: '',
        gender: '',
        major: '',
        class_name: '',
        grade: '',
        enrollment_date: '',
        status: 1
      }
      this.showDialog = true
    },
    async editStudent(student) {
      this.dialogMode = 'edit'
      
      // 确保有有效的user_id
      const userId = student.user_id || student.userId
      if (!userId) {
        alert('学生ID不能为空，无法编辑')
        console.error('学生对象:', student)
        return
      }
      
      try {
        console.log('编辑学生，ID:', userId)
        const result = await getStudentById(userId)
        if (result.code === 1 && result.data) {
          const data = result.data
          // 后端返回驼峰命名，需要处理
          this.formData = {
            user_id: data.userId || data.user_id,
            username: data.username,
            password: '',
            full_name: data.fullName || data.full_name,
            email: data.email || '',
            phone_number: data.phoneNumber || data.phone_number || '',
            gender: data.gender?.toString() || '',
            major: data.major || '',
            class_name: data.className || data.class_name || '',
            grade: data.grade || '',
            enrollment_date: data.enrollmentDate || data.enrollment_date || '',
            status: data.status || 1
          }
          this.showDialog = true
        } else {
          alert(result.msg || '加载学生信息失败')
        }
      } catch (error) {
        console.error('加载学生信息失败:', error)
        alert(error.message || '加载失败，请稍后重试')
      }
    },
    async saveStudent() {
      if (this.loading) return
      
      // 编辑模式下必须要有user_id
      if (this.dialogMode === 'edit' && !this.formData.user_id) {
        alert('学生ID不能为空，无法保存')
        console.error('formData:', this.formData)
        return
      }
      
      this.loading = true
      try {
        const data = { ...this.formData }
        // 编辑时不需要传password（除非要修改）
        if (this.dialogMode === 'edit' && !data.password) {
          delete data.password
        }
        
        // 确保user_id是数字类型（编辑模式）
        if (this.dialogMode === 'edit' && data.user_id) {
          data.user_id = typeof data.user_id === 'number' ? data.user_id : parseInt(data.user_id)
          if (isNaN(data.user_id)) {
            alert('学生ID格式错误')
            return
          }
        }
        
        console.log('保存学生数据:', this.dialogMode, data)
        
        let result
        if (this.dialogMode === 'add') {
          result = await addStudent(data)
        } else {
          result = await updateStudent(data)
        }
        
        if (result.code === 1) {
          alert(this.dialogMode === 'add' ? '添加成功' : '修改成功')
          this.closeDialog()
          this.loadStudents()
        } else {
          alert(result.msg || '操作失败')
        }
      } catch (error) {
        console.error('保存失败:', error)
        alert(error.message || '保存失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    async deleteStudent(userId) {
      if (!userId) {
        alert('学生ID不能为空')
        return
      }
      // 确保userId是数字
      const id = typeof userId === 'number' ? userId : parseInt(userId)
      if (isNaN(id) || id <= 0) {
        alert('学生ID格式错误: ' + userId)
        console.error('无效的学生ID:', userId)
        return
      }
      if (!confirm('确定要删除该学生吗？')) return
      await this.batchDelete([id])
    },
    async batchDelete(userIds = null) {
      const ids = userIds || this.selectedIds
      if (ids.length === 0) {
        alert('请选择要删除的学生')
        return
      }
      
      // 过滤掉无效的ID
      const validIds = ids.filter(id => id != null && id !== '')
      if (validIds.length === 0) {
        alert('请选择有效的学生')
        return
      }
      
      if (!confirm(`确定要删除选中的 ${validIds.length} 个学生吗？`)) return
      
      try {
        // 确保ID都是数字字符串
        const idsString = validIds.map(id => String(id)).join(',')
        console.log('删除学生ID:', idsString)
        
        const result = await deleteStudentsApi(idsString)
        if (result.code === 1) {
          alert('删除成功')
          this.selectedIds = []
          this.loadStudents()
        } else {
          alert(result.msg || '删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        alert(error.message || '删除失败，请稍后重试')
      }
    },
    toggleSelectAll() {
      // handled by computed setter
    },
    closeDialog() {
      this.showDialog = false
    },
    resetSearch() {
      this.searchForm = {
        full_name: '',
        student_id_number: '',
        major: '',
        class_name: '',
        status: ''
      }
      this.currentPage = 1
      this.loadStudents()
    },
    changePage(delta) {
      const newPage = this.currentPage + delta
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.currentPage = newPage
        this.loadStudents()
      }
    }
  }
}
</script>

<style scoped>
.student-manage {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  color: #333;
}

.btn-primary {
  padding: 10px 20px;
  background: #2A5CAA;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input, .search-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.search-input {
  flex: 1;
  min-width: 150px;
}

.search-select {
  width: 120px;
}

.btn-search, .btn-reset {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  background: white;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background: #f5f7fa;
  font-weight: 600;
}

.status-active {
  color: #4CAF50;
}

.status-inactive {
  color: #f44336;
}

.btn-edit, .btn-delete {
  padding: 6px 12px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-edit {
  background: #2A5CAA;
  color: white;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 20px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background: white;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dialog h3 {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  color: #666;
  font-weight: 500;
}

.form-group input,
.form-group select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-cancel, .btn-submit {
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.btn-submit {
  background: #2A5CAA;
  color: white;
  border: none;
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>

