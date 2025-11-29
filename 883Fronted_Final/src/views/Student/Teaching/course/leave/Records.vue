<template>
  <div class="leave-records-page">
    <div class="page-header">
      <h2>我的请假记录</h2>
      <button class="apply-btn" @click="$router.push('apply')">
        <i class="bi bi-plus-lg"></i> 发起申请
      </button>
    </div>

    <div class="records-container">
      <div v-for="item in list" :key="item.id" class="record-card">
        <div class="card-left">
          <div class="date-box">
            <span class="month">{{ item.month }}月</span>
            <span class="day">{{ item.day }}</span>
          </div>
          <div class="info">
            <div class="type-tag" :class="item.typeClass">{{ item.type }}</div>
            <p class="reason">{{ item.reason }}</p>
            <p class="duration">共 {{ item.duration }} 天</p>
          </div>
        </div>
        <div class="card-right">
          <span :class="['status-badge', item.status]">{{ item.statusText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const list = ref([
  {
    id: 1, month: '11', day: '20',
    type: '病假', typeClass: 'sick',
    reason: '突发高烧，去校医院就诊',
    duration: 1,
    status: 'approved', statusText: '已通过'
  },
  {
    id: 2, month: '10', day: '15',
    type: '事假', typeClass: 'personal',
    reason: '家里有急事需回家处理',
    duration: 2,
    status: 'rejected', statusText: '已驳回'
  },
  {
    id: 3, month: '09', day: '28',
    type: '事假', typeClass: 'personal',
    reason: '参加学术会议',
    duration: 3,
    status: 'approved', statusText: '已通过'
  }
])
</script>

<style scoped>
.leave-records-page { padding: 24px; max-width: 800px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.page-header h2 { margin: 0; font-size: 22px; color: #333; }

.apply-btn {
  background: #2A5CAA; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;
  font-weight: 500; display: flex; align-items: center; gap: 5px; box-shadow: 0 4px 10px rgba(42, 92, 170, 0.2);
}
.apply-btn:hover { background: #1e4b8b; }

.records-container { display: flex; flex-direction: column; gap: 15px; }

.record-card {
  background: white; padding: 20px; border-radius: 12px; display: flex; justify-content: space-between;
  align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #f0f0f0; transition: transform 0.2s;
}
.record-card:hover { transform: scale(1.01); }

.card-left { display: flex; gap: 20px; align-items: center; }

.date-box {
  background: #f8f9fa; padding: 10px; border-radius: 8px; text-align: center; min-width: 60px;
  border: 1px solid #eee;
}
.date-box .month { display: block; font-size: 12px; color: #999; }
.date-box .day { display: block; font-size: 20px; font-weight: bold; color: #333; }

.info { display: flex; flex-direction: column; gap: 5px; }
.type-tag {
  font-size: 12px; padding: 2px 8px; border-radius: 4px; display: inline-block; width: fit-content;
}
.type-tag.sick { background: #fff1f0; color: #ff4d4f; border: 1px solid #ffa39e; }
.type-tag.personal { background: #e6f7ff; color: #1890ff; border: 1px solid #91d5ff; }

.reason { margin: 0; font-size: 15px; font-weight: 500; color: #333; }
.duration { margin: 0; font-size: 12px; color: #999; }

.status-badge { padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; }
.status-badge.approved { background: #f6ffed; color: #52c41a; }
.status-badge.rejected { background: #fff2e8; color: #fa8c16; }
</style>