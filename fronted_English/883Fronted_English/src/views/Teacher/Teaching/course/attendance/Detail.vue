<template>
  <div class="attendance-detail">
    <div class="page-header">
      <h1>Attendance Details</h1>
      <p class="page-description">Display student attendance records, can be modified directly</p>
    </div>

    <section class="card">
      <div class="toolbar">
        <button class="btn" @click="$router.push('launch')">Launch Attendance</button>
        <span class="info">共 {{ records.length }} 条记录</span>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Record ID</th>
            <th>Student Name</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td>{{ record.id }}</td>
            <td>{{ record.name }}</td>
            <td>
              <span :class="['status-tag', record.statusClass]">{{ record.statusText }}</span>
            </td>
            <td>{{ record.remarks || '-' }}</td>
            <td>
              <button class="btn-link" @click="openModify(record)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 修改弹窗 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Edit Attendance</h3>

        <div class="form-group">
          <label>Status</label>
          <select v-model="editData.status" class="input">
            <option disabled value="">Please select</option>
            <option v-for="(label, key) in statusOptions" :key="key" :value="key">
              {{ label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Remarks</label>
          <textarea v-model="editData.remarks" class="input" rows="3"></textarea>
        </div>

        <div class="modal-actions">
          <button class="btn" @click="confirmEdit">Save</button>
          <button class="btn-cancel" @click="showModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const records = ref([
  { id: 1, name: 'Zhang San', status: 1, statusText: 'Present', statusClass: 'present', remarks: '' },
  { id: 2, name: 'Li Si', status: 2, statusText: 'Absent', statusClass: 'absent', remarks: 'No leave' },
  { id: 3, name: 'Wang Wu', status: 3, statusText: 'Late', statusClass: 'late', remarks: '5 minutes late' }
])

const showModal = ref(false)
const editData = ref({})
const statusOptions = { 1: 'Present', 2: 'Absent', 3: 'Late', 4: 'Leave' }

const openModify = (record) => {
  editData.value = { ...record }
  showModal.value = true
}

const confirmEdit = () => {
  const idx = records.value.findIndex(r => r.id === editData.value.id)
  if (idx !== -1) {
    const label = statusOptions[editData.value.status]
    const classMap = { 1: 'present', 2: 'absent', 3: 'late', 4: 'leave' }
    records.value[idx] = {
      ...editData.value,
      statusText: label,
      statusClass: classMap[editData.value.status]
    }
  }
  showModal.value = false
}
</script>

<style scoped>
.attendance-detail {
  padding: 24px;
}

.page-header {
  margin-block-end: 24px;
}

.page-description {
  color: #666;
  font-size: 14px;
}

.card {
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-block-end: 16px;
}

.btn {
  background: #2A5CAA;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
}

.info {
  color: #666;
}

.data-table {
  inline-size: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  border-block-end: 1px solid #eee;
  text-align: start;
}

.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.present {
  background: #e6fffb;
  color: #13c2c2;
}

.status-tag.absent {
  background: #fff2f0;
  color: #ff4d4f;
}

.status-tag.late {
  background: #fffbe6;
  color: #faad14;
}

.status-tag.leave {
  background: #f6ffed;
  color: #52c41a;
}

.btn-link {
  background: none;
  border: none;
  color: #2A5CAA;
  cursor: pointer;
  text-decoration: underline;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  inline-size: 400px;
}

.modal-actions {
  margin-block-start: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel {
  background: #f0f0f0;
  border: 1px solid #ccc;
}

.input {
  inline-size: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
  margin-block-start: 6px;
}
</style>
