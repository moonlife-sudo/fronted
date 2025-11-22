<template>
  <div class="grades-page">
    <div class="overview-card">
      <div class="score-circle">
        <span class="label">当前总分</span>
        <span class="value">{{ finalScore }}</span>
      </div>
      <div class="rank-info">
        <p>班级排名：<strong>12 / 45</strong></p>
        <p>击败了 73% 的同学</p>
      </div>
    </div>

    <div class="card detail-card">
      <h3>成绩明细</h3>
      <table class="grade-table">
        <thead>
          <tr>
            <th>考核项</th>
            <th>权重</th>
            <th>满分</th>
            <th>我的得分</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in gradeItems" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.weight * 100 }}%</td>
            <td>{{ item.maxScore }}</td>
            <td class="my-score">{{ item.myScore || '-' }}</td>
            <td>
              <span v-if="item.myScore" class="tag success">已出分</span>
              <span v-else class="tag waiting">待录入</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const finalScore = ref(86.5)
const gradeItems = ref([
  { id: 1, name: '平时作业', weight: 0.3, maxScore: 100, myScore: 90 },
  { id: 2, name: '期中考试', weight: 0.3, maxScore: 100, myScore: 85 },
  { id: 3, name: '期末考试', weight: 0.4, maxScore: 100, myScore: null } // 还没考
])
</script>

<style scoped>
.grades-page {
  padding: 24px;
  max-inline-size: 1000px;
  margin: 0 auto;
}

.overview-card {
  background: linear-gradient(135deg, #2A5CAA 0%, #5C6BC0 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block-end: 24px;
}

.score-circle {
  text-align: center;
}

.score-circle .label {
  display: block;
  font-size: 14px;
  opacity: 0.9;
  margin-block-end: 5px;
}

.score-circle .value {
  font-size: 48px;
  font-weight: bold;
}

.rank-info {
  text-align: end;
  font-size: 14px;
  opacity: 0.9;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

h3 {
  margin-block-start: 0;
  border-block-end: 1px solid #eee;
  padding-block-end: 15px;
}

.grade-table {
  inline-size: 100%;
  border-collapse: collapse;
}

.grade-table th {
  text-align: start;
  color: #666;
  padding: 12px;
  background: #f9f9f9;
}

.grade-table td {
  padding: 12px;
  border-block-end: 1px solid #eee;
  color: #333;
}

.my-score {
  font-weight: bold;
  color: #2A5CAA;
}

.tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.tag.success {
  background: #f6ffed;
  color: #52c41a;
}

.tag.waiting {
  background: #f5f5f5;
  color: #999;
}
</style>