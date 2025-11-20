<!-- src/views/teaching/Attendance.vue -->
<template>
  <div class="teaching-attendance">
    <h1>考勤管理</h1>
    <p>考勤管理功能页面 - 开发中</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'TeachingAttendance'
})

const router = useRouter()

onMounted(() => {
  // 自动重定向到发起签到页面
  // router.replace('/teacher/attendance/launch')
})
</script>

<style scoped>
.teaching-attendance {
  padding: 20px;
}
</style>
