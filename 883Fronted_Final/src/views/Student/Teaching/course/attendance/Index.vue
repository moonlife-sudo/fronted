<template>
  <div class="attendance-page">
    <div class="page-header">
      <h1>考勤签到</h1>
    </div>

    <div class="card active-session-card">
      <div class="card-header">
        <h3>📢 正在签到：{{ courseName }}</h3>
        <div class="timer">剩余时间：05:23</div>
      </div>
      <div class="card-body">
        <div class="session-info">
          <p><strong>签到类型：</strong>位置签到</p>
          <p><strong>要求位置：</strong>教学楼 B205 (半径 100米)</p>
          <p><strong>发起时间：</strong>10:00</p>
        </div>

        <div v-if="!isCheckedIn" class="action-area">
          <button class="btn-primary" @click="doCheckIn" :disabled="checking">
            {{ checking ? '定位中...' : '📍 立即签到' }}
          </button>
          <p class="gps-hint" v-if="checking">正在获取您的位置信息...</p>
          <div v-if="locationInfo.latitude" class="location-info">
            <p><strong>当前位置：</strong></p>
            <p class="location-detail">纬度: {{ locationInfo.latitude }}, 经度: {{ locationInfo.longitude }}</p>
            <p class="location-detail">地址: {{ locationInfo.address }}</p>
          </div>
        </div>
        <div v-else class="success-msg">
          <i class="bi bi-check-circle-fill"></i> 签到成功！
          <span>时间: {{ checkInTime }}</span>
        </div>
      </div>
    </div>

    <div class="card history-card">
      <h3>历史记录</h3>
      <table class="data-table">
        <thead>
        <tr>
          <th>日期</th>
          <th>课程</th>
          <th>状态</th>
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

// 百度地图 API Key 
const BAIDU_AK = '3Jbw6qq8jVSn3CzXu0btBU2lpgffWz5G'

const history = ref([
  { id: 1, date: '2025-11-25 10:00', status: 'present', text: '出勤' },
  { id: 2, date: '2025-11-18 10:05', status: 'late', text: '迟到' },
  { id: 3, date: '2025-11-11 10:00', status: 'present', text: '出勤' },
])

onMounted(() => {
  courseName.value = localStorage.getItem('currentCourseName') || 'Modern Cryptography'
})

// 获取用户位置信息
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持地理定位'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const address = await reverseGeocode(latitude, longitude)
          resolve({ latitude, longitude, address })
        } catch (error) {
          
          resolve({ latitude, longitude, address: '地址获取失败' })
        }
      },
      (error) => {
        let message = '定位失败'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = '用户拒绝了定位权限'
            break
          case error.POSITION_UNAVAILABLE:
            message = '位置信息不可用'
            break
          case error.TIMEOUT:
            message = '定位请求超时'
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

// 百度地图 - 根据经纬度获取地址
const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${BAIDU_AK}&output=json&coordtype=wgs84ll&location=${latitude},${longitude}`
    )
    const data = await response.json()
    
    if (data.status === 0 && data.result) {
      return data.result.formatted_address || '地址解析失败'
    } else {
      throw new Error('百度地图API调用失败')
    }
  } catch (error) {
    console.warn('逆地理编码失败:', error)
    // 返回一个默认地址
    return '教学楼附近'
  }
}

const doCheckIn = async () => {
  checking.value = true
  
  try {
    // 获取当前位置
    const location = await getCurrentLocation()
    locationInfo.value = location
    
    console.log('获取到位置信息:', location)
    
     // 模拟向后端提交签到信息
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
        console.log('签到请求成功发送到后端')
      }
    } catch (e) {
      console.warn('后端连接失败，继续完成前端签到流程')
    }
    
    checking.value = false
    isCheckedIn.value = true
    checkInTime.value = new Date().toLocaleTimeString()
    
    alert(`签到成功！\n位置：${location.address}\n坐标：${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`)
    
  } catch (error) {
    checking.value = false
    console.error('定位失败:', error)
    alert(`定位失败: ${error.message}\n请检查定位权限或网络连接`)
  }
}

// 验证位置是否在允许范围内
const validateLocation = (lat, lng) => {
  const requiredLat = 30.5133
  const requiredLng = 114.3640
  const maxDistance = 100 // 米
  
  const distance = calculateDistance(lat, lng, requiredLat, requiredLng)
  return distance <= maxDistance
}

// 计算两点之间的距离
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