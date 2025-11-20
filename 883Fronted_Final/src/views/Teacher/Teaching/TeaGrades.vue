<!-- src/views/teaching/Grades.vue -->
<template>
  <div class="teaching-grades">
    <h1>成绩管理</h1>
    <p>成绩管理功能页面 - 开发中</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'TeachingGrades'
})

const router = useRouter()

onMounted(() => {
  //router.replace('/teacher/grades/composition')
})
</script>

<style scoped>
.teaching-grades {
  padding: 20px;
}
</style>