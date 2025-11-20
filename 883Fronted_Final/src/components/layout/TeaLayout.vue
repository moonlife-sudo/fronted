<!-- layouts/TeaLayout.vue -->
<template>
  <div class="layout">
    <TeaHeader />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import TeaHeader from './headers/TeaHeader.vue'

export default {
  name: 'TeacherLayout',
  components: {
    TeaHeader
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