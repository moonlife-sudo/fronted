<template>
    <div class="leave-records-page">
        <div class="page-header">
            <h2>我的请假记录</h2>
            <button v-if="isCourseContext" class="apply-btn" @click="$router.push('apply')">
                + 发起申请
            </button>
        </div>

        <div class="card">
            <table class="records-table">
                <thead>
                    <tr>
                        <th>申请时间</th>
                        <th>类型</th>
                        <th>请假原因</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in list" :key="item.id">
                        <td>{{ item.date }}</td>
                        <td>{{ item.type }}</td>
                        <td class="reason">{{ item.reason }}</td>
                        <td>
                            <span :class="['status-badge', item.status]">{{ item.statusText }}</span>
                        </td>
                    </tr>
                    <tr v-if="list.length === 0">
                        <td colspan="4" class="empty">暂无请假记录</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCourseContext = computed(() => !!route.params.courseId)

const list = ref([
    { id: 1, date: '2023-11-20', type: '病假', reason: '发烧去医院', status: 'approved', statusText: '已通过' },
    { id: 2, date: '2023-11-10', type: '事假', reason: '家中急事', status: 'rejected', statusText: '已驳回' }
])
</script>

<style scoped>
.leave-records-page {
    padding: 24px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block-end: 20px;
}

.page-header h2 {
    margin: 0;
    font-size: 20px;
    color: #333;
}

.apply-btn {
    background: #2A5CAA;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.records-table {
    inline-size: 100%;
    border-collapse: collapse;
}

.records-table th {
    text-align: start;
    padding: 12px;
    background: #f9f9f9;
    color: #666;
    font-size: 14px;
}

.records-table td {
    padding: 12px;
    border-block-end: 1px solid #eee;
    color: #333;
    font-size: 14px;
}

.status-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.status-badge.approved {
    background: #f6ffed;
    color: #52c41a;
}

.status-badge.rejected {
    background: #fff1f0;
    color: #ff4d4f;
}

.empty {
    text-align: center;
    color: #999;
    padding: 20px;
}
</style>