<template>
  <div class="role-manage">
    <div class="page-header">
      <h1>Role Management</h1>
      <button class="btn-primary" @click="showAddModal">
        <i class="bi bi-plus-lg"></i> Add Role
      </button>
    </div>

    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchForm.role_name" 
        placeholder="Search role name..."
        class="search-input"
      >
      <button class="btn-search" @click="loadRoles">Search</button>
      <button class="btn-reset" @click="resetSearch">Reset</button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Role ID</th>
            <th>Role Name</th>
            <th>Role Key</th>
            <th>Description</th>
            <th>System Role</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.role_id">
            <td>{{ role.role_id }}</td>
            <td>{{ role.role_name }}</td>
            <td>{{ role.role_key }}</td>
            <td>{{ role.description || '-' }}</td>
            <td>{{ role.is_system === 1 ? 'Yes' : 'No' }}</td>
            <td>{{ formatDate(role.created_at) }}</td>
            <td>
              <button class="btn-edit" @click="editRole(role)">Edit</button>
              <button 
                class="btn-delete" 
                @click="deleteRole(role.role_id)"
                :disabled="role.is_system === 1"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button @click="changePage(-1)" :disabled="currentPage <= 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="changePage(1)" :disabled="currentPage >= totalPages">Next</button>
    </div>

    <!-- Add/Edit Dialog -->
    <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
      <div class="dialog">
        <h3>{{ dialogMode === 'add' ? 'Add Role' : 'Edit Role' }}</h3>
        <form @submit.prevent="saveRole">
          <div class="form-group">
            <label>Role Name *</label>
            <input type="text" v-model="formData.role_name" required>
          </div>
          <div class="form-group">
            <label>Role Key *</label>
            <input type="text" v-model="formData.role_key" required>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="formData.description" rows="3"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeDialog">Cancel</button>
            <button type="submit" class="btn-submit" :disabled="loading">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getRoles, addRole, updateRole, deleteRole as deleteRoleApi, getRoleById } from '@/api/admin'

export default {
  name: 'RoleManage',
  data() {
    return {
      roles: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchForm: {
        role_name: ''
      },
      showDialog: false,
      dialogMode: 'add', // 'add' or 'edit'
      formData: {
        role_id: null,
        role_name: '',
        role_key: '',
        description: ''
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize)
    }
  },
  mounted() {
    this.loadRoles()
  },
  methods: {
    async loadRoles() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          ...this.searchForm
        }
        const result = await getRoles(params)
        if (result.code === 1) {
          this.roles = result.data.rows || []
          this.total = result.data.total || 0
        } else {
          alert(result.msg || 'Failed to load')
        }
      } catch (error) {
        console.error('Failed to load role list:', error)
        alert('Failed to load, please try again later')
      } finally {
        this.loading = false
      }
    },
    showAddModal() {
      this.dialogMode = 'add'
      this.formData = {
        role_id: null,
        role_name: '',
        role_key: '',
        description: ''
      }
      this.showDialog = true
    },
    async editRole(role) {
      this.dialogMode = 'edit'
      try {
        const result = await getRoleById(role.role_id)
        if (result.code === 1 && result.data) {
          this.formData = {
            role_id: result.data.role_id,
            role_name: result.data.role_name,
            role_key: result.data.role_key,
            description: result.data.description || ''
          }
          this.showDialog = true
        } else {
          alert(result.msg || 'Failed to load role information')
        }
      } catch (error) {
        console.error('Failed to load role information:', error)
        alert('Failed to load, please try again later')
      }
    },
    async saveRole() {
      if (this.loading) return
      
      this.loading = true
      try {
        let result
        if (this.dialogMode === 'add') {
          result = await addRole({
            role_name: this.formData.role_name,
            role_key: this.formData.role_key,
            description: this.formData.description
          })
        } else {
          result = await updateRole({
            role_id: this.formData.role_id,
            role_name: this.formData.role_name,
            role_key: this.formData.role_key,
            description: this.formData.description
          })
        }
        
        if (result.code === 1) {
          alert(this.dialogMode === 'add' ? 'Added successfully' : 'Updated successfully')
          this.closeDialog()
          this.loadRoles()
        } else {
          alert(result.msg || 'Operation failed')
        }
      } catch (error) {
        console.error('Save failed:', error)
        alert(error.message || 'Save failed, please try again later')
      } finally {
        this.loading = false
      }
    },
    async deleteRole(roleId) {
      if (!confirm('Are you sure you want to delete this role?')) return
      
      try {
        const result = await deleteRoleApi(roleId)
        if (result.code === 1) {
          alert('Delete successful')
          this.loadRoles()
        } else {
          alert(result.msg || 'Delete failed')
        }
      } catch (error) {
        console.error('Delete failed:', error)
        alert(error.message || 'Delete failed, please try again later')
      }
    },
    closeDialog() {
      this.showDialog = false
    },
    resetSearch() {
      this.searchForm.role_name = ''
      this.currentPage = 1
      this.loadRoles()
    },
    changePage(delta) {
      const newPage = this.currentPage + delta
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.currentPage = newPage
        this.loadRoles()
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      return date.toLocaleString('zh-CN')
    }
  }
}
</script>

<style scoped>
.role-manage {
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

.btn-primary:hover {
  background: #1e4b8b;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.btn-search, .btn-reset {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  background: white;
}

.btn-search:hover, .btn-reset:hover {
  background: #f5f5f5;
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
  color: #333;
}

.data-table tr:hover {
  background: #f9f9f9;
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

.btn-edit:hover {
  background: #1e4b8b;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-delete:hover {
  background: #d32f2f;
}

.btn-delete:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background: white;
}

.pagination button:hover:not(:disabled) {
  background: #f5f5f5;
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
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dialog h3 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2A5CAA;
  box-shadow: 0 0 0 3px rgba(42, 92, 170, 0.1);
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
  font-size: 14px;
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

.btn-submit:hover {
  background: #1e4b8b;
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>

