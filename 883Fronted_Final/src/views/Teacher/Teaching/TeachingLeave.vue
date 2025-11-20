<!-- src/views/teaching/Leave.vue -->
<template>
  <div class="teaching-leave">
    <h1>请假管理</h1>
    <p>请假管理功能页面 - 开发中</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'TeachingLeave'
})

const router = useRouter()

onMounted(() => {
  //router.replace('/teacher/leave/approval')
})
</script>

<style scoped>
.teaching-leave {
  padding: 20px;
}
</style>