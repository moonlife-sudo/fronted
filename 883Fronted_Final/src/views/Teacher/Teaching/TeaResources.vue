<!-- src/views/teaching/Resources.vue -->
<template>
  <div class="teaching-resources">
    <h1>课程资源</h1>
    <p>课程资源管理页面</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'TeachingResources'
})

const router = useRouter()

onMounted(() => {
  //router.replace('/teacher/resources/list')
})
</script>

<style scoped>
.teaching-resources {
  padding: 20px;
}
</style>
