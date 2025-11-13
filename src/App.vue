<!-- App.vue -->
<template>
  <div id="app">
    <AppLayout v-if="!$route.meta?.noLayout">
      <router-view />
    </AppLayout>
    <router-view v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppLayout from '@/components/layout/AppLayout.vue';

export default defineComponent({
  name: 'App',
  components: {
    AppLayout
  }
});
</script>

<style>
/* 全局样式保持不变 */
</style>
