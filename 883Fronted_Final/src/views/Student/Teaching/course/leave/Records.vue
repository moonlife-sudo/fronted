<template>
    <div class="leave-records">
        <div class="card">
            <div class="header">
                <h3>请假记录</h3>
                <button class="new-btn" @click="$router.push('apply')">+ 新申请</button>
            </div>
            <table class="records-table">
                <thead>
                    <tr>
                        <th>类型</th>
                        <th>时间段</th>
                        <th>原因</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in list" :key="item.id">
                        <td>{{ item.type }}</td>
                        <td>{{ item.date }}</td>
                        <td class="reason">{{ item.reason }}</td>
                        <td><span :class="['badge', item.status]">{{ item.statusText }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const list = ref([
    { id: 1, type: '病假', date: '11-20 08:00 ~ 11-20 12:00', reason: '发烧去医院', status: 'approved', statusText: '已通过' },
    { id: 2, type: '事假', date: '11-10 14:00 ~ 11-10 18:00', reason: '家中急事', status: 'rejected', statusText: '已驳回' },
    { id: 3, type: '病假', date: '11-25 08:00 ~ 11-25 18:00', reason: '拔牙', status: 'pending', statusText: '审批中' }
])
</script>

<style scoped>
.leave-records {
    padding: 24px;
}

.card {
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block-end: 20px;
}

h3 {
    margin: 0;
}

.new-btn {
    background: #2A5CAA;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.records-table {
    inline-size: 100%;
    border-collapse: collapse;
}

.records-table th,
.records-table td {
    padding: 12px;
    text-align: start;
    border-block-end: 1px solid #eee;
    font-size: 14px;
}

.reason {
    max-inline-size: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #666;
}

.badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.badge.approved {
    background: #f6ffed;
    color: #52c41a;
}

.badge.rejected {
    background: #fff1f0;
    color: #ff4d4f;
}

.badge.pending {
    background: #e6f7ff;
    color: #1890ff;
}
</style>