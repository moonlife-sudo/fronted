<template>
  <div class="teacher-manage">
    <div class="page-header">
      <h1>教师管理</h1>
      <button class="btn-primary" @click="showAddModal">
        <i class="bi bi-plus-lg"></i> 添加教师
      </button>
    </div>

    <div class="search-bar">
      <input type="text" v-model="searchForm.full_name" placeholder="搜索教师姓名..." class="search-input">
      <input type="text" v-model="searchForm.teacher_id_number" placeholder="工号" class="search-input">
      <input type="text" v-model="searchForm.department" placeholder="院系" class="search-input">
      <input type="text" v-model="searchForm.title" placeholder="职称" class="search-input">
      <select v-model="searchForm.status" class="search-select">
        <option value="">全部状态</option>
        <option value="1">激活</option>
        <option value="2">禁用</option>
      </select>
      <button class="btn-search" @click="loadTeachers">搜索</button>
      <button class="btn-reset" @click="resetSearch">重置</button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll"></th>
            <th>工号</th>
            <th>姓名</th>
            <th>院系</th>
            <th>职称</th>
            <th>办公室</th>
            <th>邮箱</th>
            <th>手机</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="teacher in teachers" :key="teacher.user_id">
            <td><input type="checkbox" :value="teacher.user_id" v-model="selectedIds"></td>
            <td>{{ teacher.teacher_id_number || teacher.username }}</td>
            <td>{{ teacher.full_name }}</td>
            <td>{{ teacher.department || '-' }}</td>
            <td>{{ teacher.title || '-' }}</td>
            <td>{{ teacher.office_location || '-' }}</td>
            <td>{{ teacher.email || '-' }}</td>
            <td>{{ teacher.phone_number || '-' }}</td>
            <td>
              <span :class="teacher.status === 1 ? 'status-active' : 'status-inactive'">
                {{ teacher.status === 1 ? '激活' : '禁用' }}
              </span>
            </td>
            <td>
              <button class="btn-edit" @click="editTeacher(teacher)">编辑</button>
              <button class="btn-delete" @click="deleteTeacher(teacher.user_id)">删除</button>
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
        <h3>{{ dialogMode === 'add' ? '添加教师' : '编辑教师' }}</h3>
        <form @submit.prevent="saveTeacher">
          <div class="form-row">
            <div class="form-group">
              <label>工号 *</label>
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
              <label>院系</label>
              <input type="text" v-model="formData.department">
            </div>
            <div class="form-group">
              <label>职称</label>
              <input type="text" v-model="formData.title">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>办公室</label>
              <input type="text" v-model="formData.office_location">
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input type="email" v-model="formData.email">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>手机</label>
              <input type="tel" v-model="formData.phone_number">
            </div>
            <div class="form-group" v-if="dialogMode === 'edit'">
              <label>状态</label>
              <select v-model="formData.status">
                <option value="1">激活</option>
                <option value="2">禁用</option>
              </select>
            </div>
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
import { getTeachers, addTeacher, updateTeacher, deleteTeachers as deleteTeachersApi, getTeacherById } from '@/api/admin'

export default {
  name: 'TeacherManage',
  data() {
    return {
      teachers: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      selectedIds: [],
      searchForm: {
        full_name: '',
        teacher_id_number: '',
        department: '',
        title: '',
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
        department: '',
        title: '',
        office_location: '',
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
        return this.teachers.length > 0 && this.selectedIds.length === this.teachers.length
      },
      set(value) {
        if (value) {
          this.selectedIds = this.teachers.map(t => t.user_id)
        } else {
          this.selectedIds = []
        }
      }
    }
  },
  mounted() {
    this.loadTeachers()
  },
  methods: {
    async loadTeachers() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          ...this.searchForm
        }
        const result = await getTeachers(params)
        if (result.code === 1) {
          // 后端返回的是驼峰命名，需要转换为前端使用的格式
          this.teachers = (result.data.rows || []).map(teacher => ({
            user_id: teacher.userId || teacher.user_id,
            username: teacher.username,
            full_name: teacher.fullName || teacher.full_name,
            email: teacher.email,
            phone_number: teacher.phoneNumber || teacher.phone_number,
            avatar_url: teacher.avatarUrl || teacher.avatar_url,
            status: teacher.status,
            teacher_id_number: teacher.teacherIdNumber || teacher.teacher_id_number,
            gender: teacher.gender,
            department: teacher.department,
            title: teacher.title,
            office_location: teacher.officeLocation || teacher.office_location
          }))
          this.total = result.data.total || 0
        } else {
          alert(result.msg || '加载失败')
        }
      } catch (error) {
        console.error('加载教师列表失败:', error)
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
        department: '',
        title: '',
        office_location: '',
        status: 1
      }
      this.showDialog = true
    },
    async editTeacher(teacher) {
      this.dialogMode = 'edit'
      
      // 确保有有效的user_id
      const userId = teacher.user_id || teacher.userId
      if (!userId) {
        alert('教师ID不能为空，无法编辑')
        console.error('教师对象:', teacher)
        return
      }
      
      try {
        console.log('编辑教师，ID:', userId)
        const result = await getTeacherById(userId)
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
            department: data.department || '',
            title: data.title || '',
            office_location: data.officeLocation || data.office_location || '',
            status: data.status || 1
          }
          this.showDialog = true
        } else {
          alert(result.msg || '加载教师信息失败')
        }
      } catch (error) {
        console.error('加载教师信息失败:', error)
        alert(error.message || '加载失败，请稍后重试')
      }
    },
    async saveTeacher() {
      if (this.loading) return
      
      // 编辑模式下必须要有user_id
      if (this.dialogMode === 'edit' && !this.formData.user_id) {
        alert('教师ID不能为空，无法保存')
        console.error('formData:', this.formData)
        return
      }
      
      this.loading = true
      try {
        const data = { ...this.formData }
        if (this.dialogMode === 'edit' && !data.password) {
          delete data.password
        }
        
        // 确保user_id是数字类型（编辑模式）
        if (this.dialogMode === 'edit' && data.user_id) {
          data.user_id = typeof data.user_id === 'number' ? data.user_id : parseInt(data.user_id)
          if (isNaN(data.user_id)) {
            alert('教师ID格式错误')
            return
          }
        }
        
        console.log('保存教师数据:', this.dialogMode, data)
        
        let result
        if (this.dialogMode === 'add') {
          result = await addTeacher(data)
        } else {
          result = await updateTeacher(data)
        }
        
        if (result.code === 1) {
          alert(this.dialogMode === 'add' ? '添加成功' : '修改成功')
          this.closeDialog()
          this.loadTeachers()
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
    async deleteTeacher(userId) {
      if (!userId) {
        alert('教师ID不能为空')
        return
      }
      // 确保userId是数字
      const id = typeof userId === 'number' ? userId : parseInt(userId)
      if (isNaN(id) || id <= 0) {
        alert('教师ID格式错误: ' + userId)
        console.error('无效的教师ID:', userId)
        return
      }
      if (!confirm('确定要删除该教师吗？')) return
      await this.batchDelete([id])
    },
    async batchDelete(userIds = null) {
      const ids = userIds || this.selectedIds
      if (ids.length === 0) {
        alert('请选择要删除的教师')
        return
      }
      
      // 过滤掉无效的ID
      const validIds = ids.filter(id => id != null && id !== '')
      if (validIds.length === 0) {
        alert('请选择有效的教师')
        return
      }
      
      if (!confirm(`确定要删除选中的 ${validIds.length} 个教师吗？`)) return
      
      try {
        // 确保ID都是数字字符串
        const idsString = validIds.map(id => String(id)).join(',')
        console.log('删除教师ID:', idsString)
        
        const result = await deleteTeachersApi(idsString)
        if (result.code === 1) {
          alert('删除成功')
          this.selectedIds = []
          this.loadTeachers()
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
        teacher_id_number: '',
        department: '',
        title: '',
        status: ''
      }
      this.currentPage = 1
      this.loadTeachers()
    },
    changePage(delta) {
      const newPage = this.currentPage + delta
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.currentPage = newPage
        this.loadTeachers()
      }
    }
  }
}
</script>

<style scoped>
.teacher-manage {
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

