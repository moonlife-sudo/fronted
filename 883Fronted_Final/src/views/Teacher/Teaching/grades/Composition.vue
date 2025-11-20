<!-- src/views/teaching/grades/Composition.vue -->
<template>
  <div class="grades-composition">
    <div class="page-header">
      <h1>管理成绩组成</h1>
      <p class="page-description">设置班级成绩组成项及其权重</p>
    </div>

    <!-- 查询区域 -->
    <section class="card filter-card">
      <div class="filter-form">
        <div class="form-row">
          <div class="form-group">
            <label for="class_id" class="form-label required">班级ID</label>
            <input
              id="class_id"
              v-model="queryForm.class_id"
              type="text"
              placeholder="请输入班级ID"
              class="input"
            />
          </div>
          <div class="form-actions-inline">
            <button type="button" class="button" @click="loadComponents" :disabled="loading">
              <span v-if="loading">查询中...</span>
              <span v-else>查询</span>
            </button>
            <button type="button" class="button" @click="showAddModal = true">添加成绩项</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 成绩组成列表 -->
    <section v-if="components.length > 0" class="card components-card">
      <header class="card-header">
        <h3>成绩组成列表</h3>
      </header>
      <div class="components-table-wrapper">
        <table class="components-table">
          <thead>
            <tr>
              <th>成绩项ID</th>
              <th>成绩项名称</th>
              <th>权重</th>
              <th>满分</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="component in components" :key="component.component_id">
              <td>{{ component.component_id }}</td>
              <td>{{ component.component_name }}</td>
              <td>{{ (component.weight * 100).toFixed(1) }}%</td>
              <td>{{ component.max_score }}</td>
              <td>
                <button type="button" class="button button--outline button--small" @click="editComponent(component)">修改</button>
                <button
                  type="button"
                  class="button button--outline button--small"
                  style="margin-left: 8px;"
                  @click="deleteComponent(component.component_id)"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 添加/修改模态框 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? '修改成绩组成' : '添加成绩组成' }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-group">
            <label for="component_name" class="form-label required">成绩项名称</label>
            <input
              id="component_name"
              v-model="formData.component_name"
              type="text"
              placeholder="如：平时作业"
              class="input"
              :class="{ 'input--error': errors.component_name }"
            />
            <p v-if="errors.component_name" class="form-error">{{ errors.component_name }}</p>
          </div>
          <div class="form-group">
            <label for="weight" class="form-label required">权重</label>
            <input
              id="weight"
              v-model.number="formData.weight"
              type="number"
              placeholder="如：0.3（表示30%）"
              class="input"
              :class="{ 'input--error': errors.weight }"
              min="0"
              max="1"
              step="0.01"
            />
            <p v-if="errors.weight" class="form-error">{{ errors.weight }}</p>
          </div>
          <div class="form-group">
            <label for="max_score" class="form-label required">满分</label>
            <input
              id="max_score"
              v-model.number="formData.max_score"
              type="number"
              placeholder="如：100"
              class="input"
              :class="{ 'input--error': errors.max_score }"
              min="0"
              step="0.01"
            />
            <p v-if="errors.max_score" class="form-error">{{ errors.max_score }}</p>
          </div>
          <div class="modal-actions">
            <button type="button" class="button button--secondary" @click="closeModal">取消</button>
            <button type="submit" class="button" :disabled="submitting">
              <span v-if="submitting">保存中...</span>
              <span v-else>保存</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 空状态 -->
    <section v-if="!loading && components.length === 0 && queryForm.class_id" class="card empty-card">
      <div class="empty-state">
        <p>暂无成绩组成项，请添加</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

defineOptions({
  name: 'GradesComposition'
})

const queryForm = reactive({
  class_id: ''
})

const formData = reactive({
  component_id: null,
  component_name: '',
  weight: null,
  max_score: null
})

const errors = reactive({})
const loading = ref(false)
const submitting = ref(false)
const components = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)

onMounted(() => {
  const classId = sessionStorage.getItem('selectedClassId')
  if (classId) {
    queryForm.class_id = classId
  }
})

const loadComponents = async () => {
  if (!queryForm.class_id) {
    alert('请填写班级ID')
    return
  }

  loading.value = true
  try {
    const response = await fetch(
      `http://127.0.0.1:8081/teacher/classes/${queryForm.class_id}/grade-components`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.msg || `请求失败: ${response.status}`)
    }

    const result = await response.json()

    if (result.code === 1 && result.data) {
      components.value = result.data || []
    } else {
      throw new Error(result.msg || '查询失败')
    }
  } catch (error) {
    console.error('查询成绩组成失败:', error)
    alert(error instanceof Error ? error.message : '查询失败，请稍后重试')
    components.value = []
  } finally {
    loading.value = false
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
  if (!confirm('确定要删除这个成绩组成项吗？')) return

  try {
    const response = await fetch(
      `http://127.0.0.1:8081/teacher/classes/grade-components/${componentId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.msg || `请求失败: ${response.status}`)
    }

    const result = await response.json()

    if (result.code === 1) {
      alert('删除成功！')
      loadComponents()
    } else {
      throw new Error(result.msg || '删除失败')
    }
  } catch (error) {
    console.error('删除成绩组成失败:', error)
    alert(error instanceof Error ? error.message : '删除失败，请稍后重试')
  }
}

const validateForm = () => {
  let isValid = true

  if (!formData.component_name || formData.component_name.trim() === '') {
    errors.component_name = '成绩项名称不能为空'
    isValid = false
  } else {
    delete errors.component_name
  }

  if (formData.weight === null || formData.weight < 0 || formData.weight > 1) {
    errors.weight = '权重必须在0-1之间'
    isValid = false
  } else {
    delete errors.weight
  }

  if (formData.max_score === null || formData.max_score <= 0) {
    errors.max_score = '满分必须大于0'
    isValid = false
  } else {
    delete errors.max_score
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true

  try {
    const url = showEditModal.value
      ? 'http://127.0.0.1:8081/teacher/classes/grade-components'
      : `http://127.0.0.1:8081/teacher/classes/${queryForm.class_id}/grade-components`

    const method = showEditModal.value ? 'PUT' : 'POST'

    const requestBody = {
      component_name: formData.component_name.trim(),
      weight: formData.weight,
      max_score: formData.max_score
    }

    if (showEditModal.value && formData.component_id) {
      requestBody.component_id = formData.component_id
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.msg || `请求失败: ${response.status}`)
    }

    const result = await response.json()

    if (result.code === 1) {
      alert(showEditModal.value ? '修改成功！' : '添加成功！')
      closeModal()
      loadComponents()
    } else {
      throw new Error(result.msg || '操作失败')
    }
  } catch (error) {
    console.error('操作失败:', error)
    alert(error instanceof Error ? error.message : '操作失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  formData.component_id = null
  formData.component_name = ''
  formData.weight = null
  formData.max_score = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}
</script>

<style scoped>
.grades-composition {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-block-end: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-description {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.filter-card,
.components-card,
.empty-card {
  margin-block-start: 24px;
}

.card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.input {
  inline-size: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
}

.input:focus {
  border-color: #2A5CAA;
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.1);
}

.input--error {
  border-color: #ff4d4f;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background: #2A5CAA;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.button:hover:not(:disabled) {
  background: #214a88;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button--secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
}

.button--outline {
  background: #fff;
  color: #2A5CAA;
  border: 1px solid #2A5CAA;
}

.button--small {
  padding: 4px 10px;
  font-size: 12px;
}

.filter-form {
  padding: 24px;
}

.form-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 200px;
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

.form-actions-inline {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.components-table-wrapper {
  overflow-x: auto;
  padding: 16px;
}

.components-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.components-table th,
.components-table td {
  padding: 12px;
  text-align: left;
  border-block-end: 1px solid #e8e8e8;
}

.components-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}

.components-table tbody tr:hover {
  background: #f5f7fa;
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
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
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
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #333;
}

.modal-form {
  padding: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-block-start: 24px;
}

.empty-state {
  padding: 48px;
  text-align: center;
  color: #999;
  font-size: 16px;
}
</style>
