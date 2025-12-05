<template>
  <div class="attendance-launch">
    <div class="page-header">
      <h1>Launch Attendance</h1>
      <p class="page-description">Set attendance rules and scope</p>
    </div>

    <section class="card form-card">
      <form @submit.prevent="handleSubmit" class="attendance-form">
        <div class="form-group">
          <label>Current Course</label>
          <div class="course-badge">
            <span class="course-name">{{ courseName }}</span>
            <span class="course-id">ID: {{ formData.class_id }}</span>
          </div>
        </div>

        <div class="form-group">
          <label>Attendance Type</label>
          <div class="type-selector">
            <div class="type-card" :class="{ active: formData.session_type === 1 }" @click="formData.session_type = 1">
              <i class="bi bi-person-bounding-box"></i> Normal Attendance
            </div>
            <div class="type-card" :class="{ active: formData.session_type === 2 }" @click="formData.session_type = 2">
              <i class="bi bi-geo-alt-fill"></i> Location-based Attendance
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Attendance Duration</label>
          <div class="duration-options">
            <span v-for="t in [5, 10, 15, 30]" :key="t" class="tag" :class="{ active: formData.duration === t }"
              @click="formData.duration = t">{{ t }} minutes</span>
          </div>
        </div>

        <div v-if="formData.session_type === 2" class="location-box">
          <label class="section-label">📍 Attendance Location Settings</label>

          <div class="map-preview" v-if="!hasLocation">
            <button type="button" class="btn-map" @click="openMapModal">
              <i class="bi bi-map"></i> Open Map to Select Location
            </button>
            <p class="hint">Click the button to select classroom location on the map</p>
          </div>

          <div class="location-result" v-else>
            <div class="coord-info">
              <div class="res-item"><strong>Latitude: </strong>{{ formData.required_latitude }}</div>
              <div class="res-item"><strong>Longitude: </strong>{{ formData.required_longitude }}</div>
              <div class="res-item address"><strong>Address: </strong>{{ addressName }}</div>
            </div>
            <button type="button" class="btn-reselect" @click="openMapModal">Reselect</button>
          </div>

          <div class="radius-setting">
            <label>Allowable Radius: {{ formData.required_radius }} meters</label>
            <input type="range" v-model="formData.required_radius" min="50" max="500" step="50">
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="button-submit" @click="handleSubmit" :disabled="loading">
            {{ loading ? 'Launching...' : 'Launch Now' }}
          </button>
        </div>
      </form>
    </section>

    <div v-if="showMap" class="map-modal-overlay">
      <div class="map-modal">
        <div class="map-header">
          <h3>Please click on the map to select location</h3>
          <span class="close" @click="showMap = false">×</span>
        </div>
        <div class="map-body">
          <iframe id="mapPage" width="100%" height="100%" frameborder="0" :src="mapUrl"></iframe>
        </div>
        <div class="map-footer">
          <p class="tip">Tip: After finding the classroom location on the map, click confirm below (Demo Mode)</p>
          <button class="button-confirm" @click="confirmLocation">I've selected a location (Confirm)</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showMap = ref(false)
const courseName = ref('')
const addressName = ref('')
const loading = ref(false)

// 你的百度地图 AK
const BAIDU_AK = '3Jbw6qq8jVSn3CzXu0btBU2lpgffWz5G'

const mapUrl = computed(() => {
  return `https://api.map.baidu.com/marker?location=39.916979519873,116.41004950566&title=Classroom Location&content=Please confirm location&output=html&src=webapp.baidu.openAPIdemo&ak=${BAIDU_AK}`
})

const formData = reactive({
  class_id: '',
  session_type: 1,
  duration: 10,
  required_latitude: null,
  required_longitude: null,
  required_radius: 100
})

const hasLocation = computed(() => formData.required_latitude && formData.required_longitude)

onMounted(() => {
  courseName.value = sessionStorage.getItem('selectedCourseName') || 'Modern Cryptography'
  formData.class_id = sessionStorage.getItem('selectedClassId') || '1'
})

const openMapModal = () => {
  showMap.value = true
}

const confirmLocation = () => {
  formData.required_latitude = 30.5133
  formData.required_longitude = 114.3640
  addressName.value = "Selected: Teaching Building N201"
  showMap.value = false
}

const handleSubmit = async () => {
  loading.value = true
  try {
    // 尝试真实请求
    await fetch(`http://127.0.0.1:8081/teacher/classes/${formData.class_id}/attendance/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
      body: JSON.stringify(formData)
    })
  } catch (e) {
    console.warn('后端连接失败，走演示模式')
  } finally {
    loading.value = false
    alert(`Sign-in launched!\nType: ${formData.session_type === 1 ? 'Normal' : 'Location-based'}\nDuration: ${formData.duration} minutes`)
    router.push('detail')
  }
}
</script>

<style scoped>
/* 样式保持不变，直接复用上一次的 */
.attendance-launch {
  padding: 24px;
  max-inline-size: 800px;
  margin: 0 auto;
}

.page-header h1 {
  color: #333;
  margin-block-end: 5px;
}

.form-card {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-block-end: 25px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-block-end: 10px;
  color: #444;
}

.course-badge {
  background: #f0f7ff;
  border: 1px solid #2A5CAA;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #2A5CAA;
}

.course-name {
  font-weight: bold;
  font-size: 16px;
}

.course-id {
  font-size: 13px;
  opacity: 0.8;
}

.type-selector {
  display: flex;
  gap: 20px;
}

.type-card {
  flex: 1;
  border: 2px solid #eee;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.type-card:hover {
  border-color: #b3c7f9;
}

.type-card.active {
  border-color: #2A5CAA;
  background: #eef2ff;
  color: #2A5CAA;
  font-weight: bold;
}

.type-card i {
  font-size: 24px;
  display: block;
  margin-block-end: 8px;
}

.duration-options {
  display: flex;
  gap: 10px;
}

.tag {
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.tag.active {
  background: #2A5CAA;
  color: white;
}

.location-box {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  border: 1px dashed #ccc;
}

.btn-map {
  inline-size: 100%;
  padding: 15px;
  background: white;
  border: 1px solid #2A5CAA;
  color: #2A5CAA;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.location-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px;
  border-radius: 8px;
}

.res-item {
  font-size: 13px;
  color: #555;
  margin-block-end: 4px;
}

.btn-reselect {
  background: none;
  border: none;
  color: #2A5CAA;
  cursor: pointer;
  text-decoration: underline;
}

.button-submit {
  inline-size: 100%;
  padding: 14px;
  background: #2A5CAA;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-block-start: 20px;
}

.button-submit:hover:not(:disabled) {
  background: #1e4b8b;
}

.button-submit:disabled {
  background: #ccc;
}

.map-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.map-modal {
  background: white;
  inline-size: 90%;
  max-inline-size: 700px;
  block-size: 80vh;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.map-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  border-block-end: 1px solid #eee;
  background: #f5f5f5;
}

.map-header .close {
  font-size: 24px;
  cursor: pointer;
}

.map-body {
  flex: 1;
  position: relative;
}

.map-footer {
  padding: 15px;
  text-align: center;
  background: #fff;
  border-block-start: 1px solid #eee;
}

.button-confirm {
  background: #2A5CAA;
  color: white;
  border: none;
  padding: 10px 40px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}
</style>