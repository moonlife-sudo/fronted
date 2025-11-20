<!-- src/views/teaching/Students.vue -->
<template>
  <div class="teaching-students">
    <h1>学生管理</h1>
    <p>学生管理功能页面 - 开发中</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'TeachingStudents'
})

const router = useRouter()

onMounted(() => {
  //router.replace('/teacher/students/detail')
})
</script>

<style scoped>
.teaching-students {
  padding: 20px;
}
</style>
