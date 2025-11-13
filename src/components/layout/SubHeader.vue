<!-- components/layout/SubHeader.vue -->
<template>
  <div class="sub-header">
    <nav class="sub-nav">
      <!-- 确保这里使用了 currentSubMenu -->
      <router-link v-for="item in currentSubMenu" :key="item.path" :to="item.path" class="sub-nav-item"
        :class="{ active: isSubItemActive(item) }" 
        >
        {{ item.name }}
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface MenuItem {
  name: string
  path: string
}

const route = useRoute()

// 定义所有模块的子菜单（第三层级）
const subMenus = {
  teaching: {
    // 课程资源相关的第三级菜单
    resources: [
      { name: '课程列表', path: '/teaching/resources/list' },
      { name: '课程上传', path: '/teaching/resources/upload' },
      { name: '课程分类', path: '/teaching/resources/category' },
      { name: '资源统计', path: '/teaching/resources/stats' }
    ],
    // 考勤管理相关的第三级菜单
    attendance: [
      { name: '发起签到', path: '/teaching/attendance/launch' },
      { name: '查看考勤详情', path: '/teaching/attendance/detail' },
      { name: '修改考勤', path: '/teaching/attendance/modify' }
    ],
    // 作业管理相关的第三级菜单
    homework: [
      { name: '发布作业', path: '/teaching/homework/publish' },
      { name: '批改作业', path: '/teaching/homework/correct' },
      { name: '查看作业提交情况', path: '/teaching/homework/submissions' }
    ],
    // 成绩管理相关的第三级菜单
    grades: [
      { name: '管理成绩组成', path: '/teaching/grades/composition' },
      { name: '录入成绩', path: '/teaching/grades/input' },
      { name: '查看成绩详情', path: '/teaching/grades/detail' }
    ],
    // 学生管理相关的第三级菜单
    students: [
      { name: '学生详情', path: '/teaching/students/detail' },
      { name: '考勤汇总', path: '/teaching/students/attendance' },
      { name: '作业管理', path: '/teaching/students/homework' },
      { name: '请假管理', path: '/teaching/students/leave' }
    ],
    // 请假管理相关的第三级菜单
    leave: [
      { name: '审批请假申请', path: '/teaching/leave/approval' },
      { name: '请假记录', path: '/teaching/leave/records' }
    ]
  },
  reservation: {
    // 教室预约相关的第三级菜单
    classroom: [
      { name: '查询可用教室', path: '/reservation/classroom/available' },
      { name: '提交预约申请', path: '/reservation/classroom/submit' },
      { name: '预约日历', path: '/reservation/classroom/calendar' }
    ],
    // 预约记录相关的第三级菜单
    history: [
      { name: '我的预约记录', path: '/reservation/history/my' },
      { name: '预约统计', path: '/reservation/history/stats' },
      { name: '撤回预约申请', path: '/reservation/history/withdraw' }
    ],
    // 教室管理相关的第三级菜单（管理员）
    management: [
      { name: '教学楼管理', path: '/reservation/management/buildings' },
      { name: '教室信息', path: '/reservation/management/classrooms' },
      { name: '审批预约', path: '/reservation/management/approve' }
    ]
  },
  campus: {
    // 图书馆相关的第三级菜单
    library: [
      { name: '图书查询', path: '/campus/library/books' },
      { name: '借阅记录', path: '/campus/library/records' },
      { name: '图书推荐', path: '/campus/library/recommendations' },
      { name: '借阅策略', path: '/campus/library/policies' }
    ],
    // 校园动态相关的第三级菜单
    news: [
      { name: '通知公告', path: '/campus/news/announcements' },
      { name: '校园新闻', path: '/campus/news/list' },
      { name: '活动预告', path: '/campus/news/events' }
    ],
    // 校园服务相关的第三级菜单
    services: [
      { name: '服务指南', path: '/campus/services/guide' },
      { name: '在线咨询', path: '/campus/services/consult' },
      { name: '报修服务', path: '/campus/services/repair' }
    ]
  }
}

// 计算当前显示的次顶部栏菜单
const currentSubMenu = computed<MenuItem[]>(() => {
  const path = route.path

  // 智能教学系统
  if (path.startsWith('/teaching')) {
    if (path.includes('/attendance/')) return subMenus.teaching.attendance
    if (path.includes('/homework/')) return subMenus.teaching.homework
    if (path.includes('/grades/')) return subMenus.teaching.grades
    if (path.includes('/resources/')) return subMenus.teaching.resources
    if (path.includes('/students/')) return subMenus.teaching.students
    if (path.includes('/leave/')) return subMenus.teaching.leave
    return []
  }

  // 资源预约系统
  if (path.startsWith('/reservation')) {
    if (path.includes('/classroom/')) return subMenus.reservation.classroom
    if (path.includes('/history/')) return subMenus.reservation.history
    if (path.includes('/management/')) return subMenus.reservation.management
    return []
  }

  // 校园生活系统
  if (path.startsWith('/campus')) {
    if (path.includes('/library/')) return subMenus.campus.library
    if (path.includes('/news/')) return subMenus.campus.news
    if (path.includes('/services/')) return subMenus.campus.services
    return []
  }

  return []
})

// 检查次顶部栏菜单项是否激活
const isSubItemActive = (menuItem: MenuItem): boolean => {
  return route.path === menuItem.path || route.path.startsWith(menuItem.path + '/')
}
</script>

<style scoped>
.sub-header {
  background-color: var(--bg-white, #ffffff);
  border-block-end: 1px solid var(--border-color, #e0e0e0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  block-size: 50px;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.sub-nav {
  display: flex;
  gap: 0;
  block-size: 100%;
  align-items: center;
}

.sub-nav-item {
  padding: 0 20px;
  text-decoration: none;
  color: var(--text-gray, #666666);
  border-block-end: 2px solid transparent;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: 500;
  line-height: 50px;
  block-size: 50px;
  display: inline-block;
}

.sub-nav-item:hover {
  color: var(--primary-color, #2A5CAA);
}

.sub-nav-item.active {
  color: var(--primary-color, #2A5CAA);
  border-block-end-color: var(--primary-color, #2A5CAA);
}
</style>
