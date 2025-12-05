<template>
  <div class="attendance-page">
    <div class="page-header">
      <h1>Attendance Check-in</h1>
    </div>

    <div class="card active-session-card">
      <div class="card-header">
        <h3>📢 Checking In Now: {{ courseName }}</h3>
        
      </div>
      <div class="card-body">
        <div class="session-info">
          <p><strong>Check-in Type：</strong>Location Check-in</p>
          <p><strong>Required Location：</strong>Teaching Building B205 (radius 100m)</p>
          <p><strong>Start Time：</strong>10:00</p>
        </div>

        <div v-if="!isCheckedIn" class="action-area">
          <button class="btn-primary" @click="doCheckIn" :disabled="checking">
            {{ checking ? 'Locating...' : '📍 Check In Now' }}
          </button>
          <p class="gps-hint" v-if="checking">Getting your location information...</p>
          <div v-if="locationInfo.latitude" class="location-info">
            <p><strong>Current Location：</strong></p>
            <p class="location-detail">Latitude: {{ locationInfo.latitude }}, Longitude: {{ locationInfo.longitude }}</p>
        <p class="location-detail">Address: {{ locationInfo.address }}</p>
          </div>
        </div>
        <div v-else class="success-msg">
          <i class="bi bi-check-circle-fill"></i> Check-in Successful!
          <span>Time: {{ checkInTime }}</span>
        </div>
      </div>
    </div>

    <div class="card history-card">
      <h3>History Records</h3>
      <table class="data-table">
        <thead>
        <tr>
          <th>Date</th>
          <th>Course</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="rec in history" :key="rec.id">
          <td>{{ rec.date }}</td>
          <td>{{ courseName }}</td>
          <td><span class="tag" :class="rec.status">{{ rec.text }}</span></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseName = ref('')
const checking = ref(false)
const isCheckedIn = ref(false)
const checkInTime = ref('')
const locationInfo = ref({
  latitude: null,
  longitude: null,
  address: ''
})

// Baidu Map API Key 
const BAIDU_AK = '3Jbw6qq8jVSn3CzXu0btBU2lpgffWz5G'

const history = ref([
  { id: 1, date: '2025-11-25 10:00', status: 'present', text: 'Present' },
  { id: 2, date: '2025-11-18 10:05', status: 'late', text: 'Late' },
  { id: 3, date: '2025-11-11 10:00', status: 'present', text: 'Present' },
])

onMounted(() => {
  courseName.value = localStorage.getItem('currentCourseName') || 'Modern Cryptography'
})

// Get user location information
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Browser does not support geolocation'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const address = await reverseGeocode(latitude, longitude)
          resolve({ latitude, longitude, address })
        } catch (error) {
          
          resolve({ latitude, longitude, address: 'Failed to get address' })
        }
      },
      (error) => {
        let message = 'Location failed'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'User denied location permission'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable'
            break
          case error.TIMEOUT:
            message = 'Location request timed out'
            break
        }
        reject(new Error(message))
      },
      {
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 300000 
      }
    )
  })
}

// Baidu Map - Get address from coordinates
const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${BAIDU_AK}&output=json&coordtype=wgs84ll&location=${latitude},${longitude}`
    )
    const data = await response.json()
    
    if (data.status === 0 && data.result) {
      return data.result.formatted_address || 'Failed to parse address'
    } else {
      throw new Error('Baidu Map API call failed')
    }
  } catch (error) {
    console.warn('Reverse geocoding failed:', error)
    // Return a default address
    return 'Near Teaching Building'
  }
}

const doCheckIn = async () => {
  checking.value = true
  
  try {
    // Get current location
    const location = await getCurrentLocation()
    locationInfo.value = location
    
    console.log('Got location information:', location)
    
     // Simulate submitting check-in information to backend
    try {
      const response = await fetch(`http://127.0.0.1:8081/student/attendance/checkin`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'token': localStorage.getItem('token') 
        },
        body: JSON.stringify({
          course_id: 1,
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address
        })
      })
      
      if (response.ok) {
        console.log('Check-in request sent to backend successfully')
      }
    } catch (e) {
      console.warn('Failed to connect to backend, continuing front-end check-in process')
    }
    
    checking.value = false
    isCheckedIn.value = true
    checkInTime.value = new Date().toLocaleTimeString()
    
    alert(`Check-in Successful!\nLocation: ${location.address}\nCoordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`)
    
  } catch (error) {
    checking.value = false
    console.error('Location failed:', error)
    alert(`Location failed: ${error.message}\nPlease check location permissions or network connection`)
  }
}

// Validate if location is within allowed range
const validateLocation = (lat, lng) => {
  const requiredLat = 30.5133
  const requiredLng = 114.3640
  const maxDistance = 100 // meters
  
  const distance = calculateDistance(lat, lng, requiredLat, requiredLng)
  return distance <= maxDistance
}

// Calculate distance between two points
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000 
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
</script>

<style scoped>
.attendance-page { padding: 24px; }
.card { background: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.card-header { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px; }
.timer { color: #ff4d4f; font-weight: bold; font-size: 18px; }

.session-info p { margin: 8px 0; color: #555; }
.btn-primary { width: 100%; padding: 15px; background: #2A5CAA; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; margin-top: 10px; }
.btn-primary:disabled { background: #ccc; }

.success-msg { text-align: center; color: #52c41a; font-size: 18px; font-weight: bold; margin-top: 20px; }
.success-msg i { font-size: 24px; margin-right: 10px; }
.success-msg span { display: block; font-size: 14px; color: #999; font-weight: normal; margin-top: 5px; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table td, .data-table th { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
.tag.present { color: #52c41a; background: #f6ffed; padding: 2px 8px; border-radius: 4px; }
.tag.late { color: #faad14; background: #fffbe6; padding: 2px 8px; border-radius: 4px; }

.location-info { 
  margin-top: 15px; 
  padding: 12px; 
  background: #f0f7ff; 
  border-radius: 6px; 
  border: 1px solid #d6e7ff;
}

.location-detail { 
  font-size: 13px; 
  color: #666; 
  margin: 3px 0;
  font-family: monospace;
}

.gps-hint {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 10px;
}
</style>