<!-- src/views/teaching/Homework.vue -->
<template>
  <div class="teaching-homework">
    <h1>作业管理</h1>
    <div class="page-content">
      <p>作业管理功能页面 - 开发中</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'TeachingHomework'
})

const router = useRouter()

onMounted(() => {
  //router.replace('/teacher/homework/publish')
})
</script>

<style scoped>
.teaching-homework {
  padding: 20px;
}
</style>
