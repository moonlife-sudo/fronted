<!-- layouts/AdminLayout.vue -->
<template>
  <div class="layout">
    <AdminHeader />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import AdminHeader from './headers/AdminHeader.vue'

export default {
  name: 'AdminLayout',
  components: {
    AdminHeader
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