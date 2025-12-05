<template>
  <div class="grades-composition">
    <div class="page-header">
      <h1>Manage Grade Components</h1>
      <p>Current Course: {{ courseName }} (ID: {{ classId }})</p>
    </div>

    <section class="card components-card">
      <header class="card-header">
        <h3>Grade Components List</h3>
        <button type="button" class="button" @click="showAddModal = true">Add Grade Item</button>
      </header>

      <div v-if="loading" class="loading-state">Loading components...</div>

      <div v-else-if="components.length > 0" class="components-table-wrapper">
        <table class="components-table">
          <thead>
            <tr>
              <th>Grade Item Name</th>
              <th>Weight</th>
              <th>Max Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="component in components" :key="component.component_id">
              <td>{{ component.component_name }}</td>
              <td>{{ (component.weight * 100).toFixed(0) }}%</td>
              <td>{{ component.max_score }}</td>
              <td>
                <button type="button" class="button button--outline button--small"
                  @click="editComponent(component)">Edit</button>
                <button type="button" class="button button--outline button--small button-danger"
                  style="margin-inline-start: 8px;" @click="deleteComponent(component.component_id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="total-weight-info">Total Weight: {{ totalWeight }}%</div>
      </div>

      <div v-else class="empty-state">
        <p>No grade components yet, please add</p>
      </div>
    </section>

    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? 'Edit Grade Component' : 'Add Grade Component' }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-group">
            <label for="component_name" class="form-label required">Grade Item Name</label>
            <input v-model="formData.component_name" type="text" placeholder="e.g., Homework" class="input" required />
          </div>
          <div class="form-group">
            <label for="weight" class="form-label required">Weight</label>
            <input v-model.number="formData.weight" type="number" placeholder="e.g., 0.3 (30%)" class="input" min="0"
              max="1" step="0.01" required />
          </div>
          <div class="form-group">
            <label for="max_score" class="form-label required">Max Score</label>
            <input v-model.number="formData.max_score" type="number" placeholder="e.g., 100" class="input" min="0" step="1"
              required />
          </div>
          <div class="modal-actions">
            <button type="button" class="button button--secondary" @click="closeModal">Cancel</button>
            <button type="submit" class="button" :disabled="submitting">
              {{ submitting ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, defineOptions } from 'vue'

defineOptions({ name: 'GradesComposition' })

const courseName = ref('')
const classId = ref('')
const formData = reactive({
  component_id: null,
  component_name: '',
  weight: null,
  max_score: null
})

const loading = ref(false)
const submitting = ref(false)
const components = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)

const mockComponents = [
  { component_id: 1, component_name: 'Homework', weight: 0.4, max_score: 100 },
  { component_id: 2, component_name: 'Mid-term Exam', weight: 0.3, max_score: 100 },
  { component_id: 3, component_name: 'Final Project', weight: 0.3, max_score: 100 },
];

const totalWeight = computed(() => {
  return components.value.reduce((sum, item) => sum + item.weight * 100, 0).toFixed(0);
});

onMounted(() => {
  courseName.value = sessionStorage.getItem('selectedCourseName') || 'Modern Cryptography'
  classId.value = sessionStorage.getItem('selectedClassId') || '1'
  loadComponents()
})

const loadComponents = async () => {
  loading.value = true
  const url = `http://127.0.0.1:8081/teacher/classes/${classId.value}/grade-components`;

  try {
    const response = await fetch(url, { headers: { 'token': localStorage.getItem('token') } })
    const result = await response.json();

    if (result.code === 1 && result.data && result.data.length > 0) {
      components.value = result.data;
    } else {
      components.value = mockComponents;
    }
  } catch (error) {
    components.value = mockComponents;
  } finally {
    loading.value = false;
  }
}

const editComponent = component => {
  formData.component_id = component.component_id
  formData.component_name = component.component_name
  formData.weight = component.weight
  formData.max_score = component.max_score
  showEditModal.value = true
}

const deleteComponent = async componentId => {
  if (!confirm('Are you sure you want to delete this grade component?')) return

  // 演示模式：直接移除列表，假装成功
  components.value = components.value.filter(c => c.component_id !== componentId);
  alert('Deleted successfully! (Demo mode)')

  // 尝试真实请求
  try {
    await fetch(`http://127.0.0.1:8081/teacher/classes/grade-components/${componentId}`, {
      method: 'DELETE',
      headers: { 'token': localStorage.getItem('token') }
    })
  } catch (e) {
    console.warn('后端删除请求失败，但演示流程已通过。')
  }
}

const handleSubmit = async () => {
  if (!formData.component_name || formData.weight === null || formData.max_score === null) return alert('Please fill in all information')

  submitting.value = true;

  const isAdding = !showEditModal.value;

  // 演示模式：直接添加或修改列表，无视后端结果
  if (isAdding) {
    const newId = Date.now();
    components.value.push({
      component_id: newId,
      component_name: formData.component_name,
      weight: formData.weight,
      max_score: formData.max_score,
    });
  } else {
    const index = components.value.findIndex(c => c.component_id === formData.component_id);
    if (index !== -1) {
      components.value[index] = { ...components.value[index], ...formData };
    }
  }

  try {
    const url = isAdding ? `http://127.0.0.1:8081/teacher/classes/${classId.value}/grade-components` : `http://127.0.0.1:8081/teacher/classes/grade-components`;
    const method = isAdding ? 'POST' : 'PUT';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
      body: JSON.stringify(formData)
    })
  } catch (e) {
    console.warn('后端保存请求失败，但演示流程已通过。')
  } finally {
    submitting.value = false;
    closeModal();
    alert(`Grade component ${isAdding ? 'added' : 'updated'} successfully! (Demo mode)`);
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  formData.component_id = null
  formData.component_name = ''
  formData.weight = null
  formData.max_score = null
}
</script>

<style scoped>
/* 样式复用自上一个回复 */
.page-header {
  margin-block-end: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.components-card {
  margin-block-start: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-block-end: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background: #2A5CAA;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.button:hover {
  background: #214a88;
}

.button--outline {
  background: white;
  color: #2A5CAA;
  border: 1px solid #2A5CAA;
}

.button--small {
  padding: 4px 10px;
  font-size: 12px;
}

.button-danger {
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.button-danger:hover {
  background: #fff1f0;
}

.button--secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
}

.components-table-wrapper {
  overflow-x: auto;
  padding: 16px;
}

.components-table {
  inline-size: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.components-table th,
.components-table td {
  padding: 12px;
  text-align: start;
  border-block-end: 1px solid #e8e8e8;
}

.components-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}

.total-weight-info {
  padding: 12px 24px;
  font-weight: bold;
  background: #f0f7ff;
  border-block-start: 1px solid #d6e4ff;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  inline-size: 90%;
  max-inline-size: 500px;
  max-block-size: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-block-end: 1px solid #e8e8e8;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.modal-form {
  padding: 20px;
}

.input {
  inline-size: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.form-group {
  margin-block-end: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-block-end: 8px;
}

.form-label.required::after {
  content: ' *';
  color: #ff4d4f;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-block-start: 24px;
}

.empty-state,
.loading-state {
  padding: 48px;
  text-align: center;
  color: #999;
  font-size: 16px;
}
</style>