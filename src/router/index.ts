// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      // 智能教学模块路由
      {
        path: '/teaching',
        name: 'Teaching',
        component: () => import('@/views/teaching/Index.vue'),
      },
      {
        path: '/teaching/resources',
        name: 'TeachingResources',
        component: () => import('@/views/teaching/Resources.vue'),
      },
      {
        path: '/teaching/attendance',
        name: 'TeachingAttendance',
        component: () => import('@/views/teaching/Attendance.vue'),
      },
      {
        path: '/teaching/homework',
        name: 'TeachingHomework',
        component: () => import('@/views/teaching/Homework.vue'),
      },
      {
        path: '/teaching/grades',
        name: 'TeachingGrades',
        component: () => import('@/views/teaching/Grades.vue'),
      },
      {
        path: '/teaching/students',
        name: 'TeachingStudents',
        component: () => import('@/views/teaching/Students.vue'),
      },
      {
        path: '/teaching/leave',
        name: 'TeachingLeave',
        component: () => import('@/views/teaching/Leave.vue'),
      },

      // 资源预约模块路由
      {
        path: '/reservation',
        name: 'Reservation',
        component: () => import('@/views/reservation/Index.vue'),
      },
      {
        path: '/reservation/classroom',
        name: 'ReservationClassroom',
        component: () => import('@/views/reservation/Classroom.vue'),
      },
      {
        path: '/reservation/history',
        name: 'ReservationHistory',
        component: () => import('@/views/reservation/History.vue'),
      },

      // 校园生活模块路由
      {
        path: '/campus',
        name: 'Campus',
        component: () => import('@/views/campus/Index.vue'),
      },
      {
        path: '/campus/library',
        name: 'CampusLibrary',
        component: () => import('@/views/campus/Library.vue'),
      },
      {
        path: '/campus/news',
        name: 'CampusNews',
        component: () => import('@/views/campus/News.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { noLayout: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
