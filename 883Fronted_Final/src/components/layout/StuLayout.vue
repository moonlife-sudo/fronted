<!-- layouts/StuLayout.vue -->
<template>
  <div class="layout">
    <StudentHeader />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import StudentHeader from './headers/StuHeader.vue'

export default {
  name: 'StudentLayout',
  components: {
    StudentHeader
  }
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.main-content {
  padding-top: 60px;
  min-height: calc(100vh - 60px);
}
</style>