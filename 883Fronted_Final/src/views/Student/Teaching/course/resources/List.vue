<template>
  <div class="resources-page">
    <div class="card">
      <h3>📂 课程资料</h3>
      <div class="file-list">
        <div v-for="file in files" :key="file.id" class="file-item">
          <div class="file-icon">{{ getFileIcon(file.type) }}</div>
          <div class="file-info">
            <div class="name">{{ file.name }}</div>
            <div class="meta">{{ file.size }} • {{ file.date }}</div>
          </div>
          <button class="download-btn">下载</button>
        </div>
        <div v-if="files.length === 0" class="empty">暂无资料</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const files = ref([
  { id: 1, name: '第一章：课程导论.pdf', type: 'pdf', size: '2.5MB', date: '2023-11-01' },
  { id: 2, name: '实验环境配置指南.docx', type: 'doc', size: '1.2MB', date: '2023-11-02' },
  { id: 3, name: '示例代码.zip', type: 'zip', size: '5MB', date: '2023-11-05' }
])

const getFileIcon = (type) => ({ pdf: '📕', doc: '📘', zip: '📦' }[type] || '📄')
</script>

<style scoped>
.resources-page {
  padding: 24px;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

h3 {
  margin-block-start: 0;
  border-block-end: 1px solid #eee;
  padding-block-end: 15px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-block-end: 1px solid #f5f5f5;
}

.file-icon {
  font-size: 24px;
  margin-inline-end: 15px;
}

.file-info {
  flex: 1;
}

.file-info .name {
  font-weight: 500;
  color: #333;
  margin-block-end: 4px;
}

.file-info .meta {
  font-size: 12px;
  color: #999;
}

.download-btn {
  padding: 6px 12px;
  border: 1px solid #2A5CAA;
  color: #2A5CAA;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.download-btn:hover {
  background: #f0f7ff;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>