<template>
  <div class="homework-list-page">
    <div class="page-header">
      <h2>我的作业</h2>
      <div class="header-actions">
        <button class="back-btn" @click="goBackToCourses">返回课程列表</button>
      </div>
    </div>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="homeworkList.length === 0" class="empty">暂无作业</div>

    <div v-else class="homework-cards">
      <div v-for="item in homeworkList" :key="item.homework_id" class="homework-card"
        @click="goToDetail(item.homework_id)">
        <div class="card-left">
          <h3 class="title">{{ item.title }}</h3>
          <p class="deadline">截止时间：{{ formatTime(item.due_date) }}</p>
        </div>

        <div class="card-right">
          <span class="status-badge" :class="getStatusClass(item.my_submission_status)">
            {{ getStatusText(item.my_submission_status) }}
          </span>
          <span v-if="item.my_grade !== null" class="grade">
            {{ item.my_grade }}分
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'StuHomework',
  setup() {
    const route = useRoute()
    const router = useRouter()
    // 优先从路由参数取，没有则从本地存储取
    const classId = computed(() => route.query.classId || localStorage.getItem('currentClassId'))

    const homeworkList = ref([])
    const loading = ref(false)

    onMounted(() => {
      if (classId.value) {
        fetchHomeworkList()
      }
    })
    const goBackToCourses = () => {
      router.push({ path: '/student/teachinghome' })
    }
    // 获取作业列表
    const fetchHomeworkList = async () => {
      loading.value = true
      try {
        const res = await fetch(`http://127.0.0.1:8081/student/classes/${classId.value}/homeworks?page=1&pageSize=100`)
        const result = await res.json()
        if (result.code === 1) {
          homeworkList.value = result.data.rows || []
        }
      } catch (error) {
        console.error('获取作业列表失败', error)
      } finally {
        loading.value = false
      }
    }

    const goToDetail = (homeworkId) => {
      router.push({
        path: '/student/teaching/homework/detail', // 注意需要在路由中配置这个路径
        query: { homeworkId, classId: classId.value }
      })
    }

    const formatTime = (time) => {
      return time ? new Date(time).toLocaleString() : '无截止日期'
    }

    // 状态映射，根据接口文档逻辑调整
    const getStatusText = (status) => {
      // 假设：0/null=未提交, 1=已提交/准时, 2=迟交
      const map = { 0: '未提交', 1: '已提交', 2: '迟交', 3: '未提交' }
      return map[status] || '未提交'
    }

    const getStatusClass = (status) => {
      if (status === 1) return 'success'
      if (status === 2) return 'warning'
      return 'pending'
    }

    return {
      router,
      classId,
      homeworkList,
      loading,
      goBackToCourses,
      fetchHomeworkList,
      goToDetail,
      formatTime,
      getStatusText,
      getStatusClass
    }
  }
}
</script>

<style scoped>
.homework-list-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.homework-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.homework-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s;
}

.homework-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.deadline {
  margin: 0;
  font-size: 13px;
  color: #999;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.pending {
  background: #f5f5f5;
  color: #999;
}

.status-badge.success {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.warning {
  background: #fff7e6;
  color: #faad14;
}

.grade {
  font-weight: bold;
  color: #1890ff;
}

.back-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.loading,
.empty {
  text-align: center;
  color: #999;
  padding: 40px;
}
</style>