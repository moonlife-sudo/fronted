<template>
  <div class="homework-list">
    <div v-for="hw in homeworks" :key="hw.id" class="hw-item" @click="$router.push('detail?id=' + hw.id)">
      <div class="hw-info">
        <h4>{{ hw.title }}</h4>
        <span class="deadline">截止：{{ hw.deadline }}</span>
      </div>
      <div class="hw-status">
        <span :class="['badge', hw.status]">{{ getStatusText(hw.status) }}</span>
        <span v-if="hw.score" class="score">{{ hw.score }}分</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const homeworks = ref([
  { id: 1, title: '第一章：Vue基础练习', deadline: '2023-11-25 23:59', status: 'pending', score: null },
  { id: 2, title: '期中项目报告', deadline: '2023-11-10 23:59', status: 'graded', score: 92 },
  { id: 3, title: 'JS算法题', deadline: '2023-11-01 23:59', status: 'submitted', score: null }
])
const getStatusText = (s) => ({ pending: '未提交', submitted: '已提交', graded: '已批改' }[s])
</script>

<style scoped>
.homework-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.hw-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
  border: 1px solid #eee;
}

.hw-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.hw-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.deadline {
  font-size: 12px;
  color: #999;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.badge.pending {
  background: #fffbe6;
  color: #faad14;
}

.badge.submitted {
  background: #e6f7ff;
  color: #1890ff;
}

.badge.graded {
  background: #f6ffed;
  color: #52c41a;
}

.score {
  font-weight: bold;
  color: #2A5CAA;
  margin-inline-start: 10px;
}
</style>