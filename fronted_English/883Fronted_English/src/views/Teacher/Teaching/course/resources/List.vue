<template>
  <div class="resources-list">
    <div class="page-header">
      <h1>Course Resources</h1>
      <p>Current Course: {{ courseName }}</p>
    </div>

    <div class="card">
      <div class="toolbar">
        <button class="btn-primary" @click="$router.push('upload')">+ Upload New Resource</button>
      </div>

      <div class="file-grid">
        <div v-for="file in files" :key="file.id" class="file-card">
          <div class="file-icon">{{ getIcon(file.type) }}</div>
          <div class="file-info">
            <h4>{{ file.name }}</h4>
            <p>{{ file.size }} • {{ file.date }}</p>
          </div>
          <div class="file-actions">
            <button>Download</button>
            <button class="del">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseName = ref('')
const files = ref([
  { id: 1, name: 'Chapter 1: Introduction.pdf', type: 'pdf', size: '2.4MB', date: '2025-09-01' },
      { id: 2, name: 'Lab1-Environment Setup.docx', type: 'doc', size: '1.1MB', date: '2025-09-05' },
      { id: 3, name: 'Course Outline.pdf', type: 'pdf', size: '500KB', date: '2025-08-30' },
  { id: 4, name: 'Week2-Lecture.mp4', type: 'video', size: '150MB', date: '2025-09-12' },
])

onMounted(() => {
  courseName.value = sessionStorage.getItem('selectedCourseName') || 'Modern Cryptography'
})

const getIcon = (type) => {
  const map = { pdf: '📕', doc: '📘', video: '🎬' }
  return map[type] || '📄'
}
</script>

<style scoped>
.resources-list { padding: 24px; }
.card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.toolbar { margin-bottom: 20px; }
.btn-primary { background: #2A5CAA; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }

.file-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
.file-card { border: 1px solid #eee; padding: 20px; border-radius: 8px; text-align: center; transition: all 0.2s; }
.file-card:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.08); }

.file-icon { font-size: 40px; margin-bottom: 10px; }
.file-info h4 { margin: 0 0 5px 0; font-size: 14px; color: #333; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.file-info p { margin: 0; font-size: 12px; color: #999; }

.file-actions { margin-top: 15px; display: flex; justify-content: center; gap: 10px; }
.file-actions button { background: #f5f5f5; border: none; padding: 4px 10px; border-radius: 4px; font-size: 12px; cursor: pointer; }
.file-actions button.del { color: #ff4d4f; }
</style>