<!-- src/views/teaching/attendance/Launch.vue -->
<template>
  <div class="attendance-launch">
    <div class="page-header">
      <h1>发起签到</h1>
      <p class="page-description">创建新的签到会话，设置签到参数</p>
    </div>

    <section class="card form-card">
      <form @submit.prevent="handleSubmit" class="attendance-form">
        <div class="form-group">
          <label for="class_id" class="form-label required">班级ID</label>
          <input
            id="class_id"
            v-model="formData.class_id"
            type="text"
            placeholder="请输入班级ID"
            class="input"
            :class="{ 'input--error': errors.class_id }"
            @blur="validateClassId"
          />
          <p v-if="errors.class_id" class="form-error">{{ errors.class_id }}</p>
        </div>

        <div class="form-group">
          <label for="session_type" class="form-label">签到类型</label>
          <select id="session_type" v-model.number="formData.session_type" class="form-select"
            :class="{ 'form-select--error': errors.session_type }">
            <option :value="null">请选择签到类型（可选）</option>
            <option :value="1">人脸签到</option>
            <option :value="2">定位签到</option>
            <option :value="3">人脸+定位签到</option>
          </select>
          <div v-if="errors.session_type" class="form-error">{{ errors.session_type }}</div>
        </div>

        <div class="form-group">
          <label for="duration" class="form-label">签到时长（分钟）</label>
          <input
            id="duration"
            v-model.number="durationInput"
            type="number"
            placeholder="请输入签到时长，单位：分钟（可选）"
            class="input"
            :class="{ 'input--error': errors.duration }"
            min="0"
          />
          <p v-if="errors.duration" class="form-error">{{ errors.duration }}</p>
        </div>

        <div class="form-group">
          <label class="form-label">位置信息（可选）</label>
          <div class="location-group">
            <div class="location-item">
              <label for="required_latitude" class="form-label-small">纬度</label>
              <input
                id="required_latitude"
                v-model.number="latitudeInput"
                type="number"
                placeholder="请输入纬度"
                class="input"
                :class="{ 'input--error': errors.required_latitude }"
                step="any"
              />
            </div>
            <div class="location-item">
              <label for="required_longitude" class="form-label-small">经度</label>
              <input
                id="required_longitude"
                v-model.number="longitudeInput"
                type="number"
                placeholder="请输入经度"
                class="input"
                :class="{ 'input--error': errors.required_longitude }"
                step="any"
              />
            </div>
            <div class="location-item">
              <label for="required_radius" class="form-label-small">允许半径（米）</label>
              <input
                id="required_radius"
                v-model.number="radiusInput"
                type="number"
                placeholder="请输入允许半径"
                class="input"
                :class="{ 'input--error': errors.required_radius }"
                min="0"
              />
            </div>
          </div>
          <p class="form-hint">如果设置了位置信息，学生需要在指定位置范围内才能签到</p>
          <p v-if="errors.required_latitude" class="form-error">{{ errors.required_latitude }}</p>
        </div>

        <div class="form-actions">
          <button type="button" class="button button--secondary" @click="handleReset">重置</button>
          <button type="submit" class="button" :disabled="loading">
            <span v-if="loading">发起中...</span>
            <span v-else>发起签到</span>
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

defineOptions({
  name: 'AttendanceLaunch'
})

const formData = reactive({
  class_id: '',
  session_type: null,
  duration: null,
  required_latitude: null,
  required_longitude: null,
  required_radius: null
})

const errors = reactive({})
const loading = ref(false)

// Computed properties to handle null/undefined conversion for number inputs
const durationInput = computed({
  get: () => formData.duration ?? undefined,
  set: value => {
    formData.duration = value ?? null
  }
})

const latitudeInput = computed({
  get: () => formData.required_latitude ?? undefined,
  set: value => {
    formData.required_latitude = value ?? null
  }
})

const longitudeInput = computed({
  get: () => formData.required_longitude ?? undefined,
  set: value => {
    formData.required_longitude = value ?? null
  }
})

const radiusInput = computed({
  get: () => formData.required_radius ?? undefined,
  set: value => {
    formData.required_radius = value ?? null
  }
})

const validateClassId = () => {
  if (!formData.class_id || formData.class_id.trim() === '') {
    errors.class_id = '班级ID不能为空'
    return false
  }
  delete errors.class_id
  return true
}

const validateForm = () => {
  let isValid = true

  // 验证班级ID
  if (!validateClassId()) {
    isValid = false
  }

  // 验证位置信息完整性
  if (
    (formData.required_latitude !== null || formData.required_longitude !== null || formData.required_radius !== null) &&
    (formData.required_latitude === null || formData.required_longitude === null || formData.required_radius === null)
  ) {
    errors.required_latitude = '位置信息必须完整填写（纬度、经度、半径）'
    isValid = false
  } else {
    delete errors.required_latitude
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // 构建请求体，只包含非null的字段
    const requestBody = {}
    if (formData.session_type !== null) requestBody.session_type = formData.session_type
    if (formData.duration !== null) requestBody.duration = formData.duration
    if (formData.required_latitude !== null) requestBody.required_latitude = formData.required_latitude
    if (formData.required_longitude !== null) requestBody.required_longitude = formData.required_longitude
    if (formData.required_radius !== null) requestBody.required_radius = formData.required_radius

    const response = await fetch(
      `http://127.0.0.1:8081/teacher/classes/${formData.class_id}/attendance/start`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.msg || `请求失败: ${response.status}`)
    }

    const result = await response.json()

    if (result.code === 1) {
      alert('签到发起成功！')
      handleReset()
    } else {
      throw new Error(result.msg || '签到发起失败')
    }
  } catch (error) {
    console.error('发起签到失败:', error)
    alert(error instanceof Error ? error.message : '发起签到失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  formData.class_id = ''
  formData.session_type = null
  formData.duration = null
  formData.required_latitude = null
  formData.required_longitude = null
  formData.required_radius = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}
</script>

<style scoped>
.attendance-launch {
  padding: 24px;
  max-inline-size: 800px;
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

 .form-card {
  margin-block-start: 24px;
}

.card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
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

.attendance-form {
  padding: 24px;
}

.form-group {
  margin-block-end: 24px;
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

.form-label-small {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  margin-block-end: 4px;
}

.form-select {
  inline-size: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  outline: none;
  transition: all 0.3s;
}

.form-select:focus {
  border-color: #2A5CAA;
  box-shadow: 0 0 0 2px rgba(42, 92, 170, 0.1);
}

.form-select--error {
  border-color: #ff4d4f;
}

.form-select--error:focus {
  border-color: #ff4d4f;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
}

.form-error {
  color: #ff4d4f;
  font-size: 12px;
  margin-block-start: 4px;
}

.form-hint {
  color: #999;
  font-size: 12px;
  margin-block-start: 8px;
  margin-block-end: 0;
}

.location-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.location-item {
  display: flex;
  flex-direction: column;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-block-start: 32px;
  padding-block-start: 24px;
  border-block-start: 1px solid #e8e8e8;
}

@media (max-width: 768px) {
  .location-group {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .button {
    inline-size: 100%;
  }
}
</style>
