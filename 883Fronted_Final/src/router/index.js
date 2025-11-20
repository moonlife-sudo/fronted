// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import TeacherLayout from '@/components/layout/TeaLayout.vue'
import StudentLayout from '@/components/layout/StuLayout.vue'

const routes = [
  // 根路径重定向到学生首页
  {
    path: '/',
    redirect: '/student/resourcehome'
  },
 
  // 学生路由
  {
    path: '/student',
    component: StudentLayout,
    children: [
      {
        path: 'profile',
        name: 'StudentProfile',
        component: () => import('../views/Student/stuProfile.vue'),
        meta: { showSidebar: false }
      },
      // 学生教学相关路由
      {
        path: 'teachinghome',
        name: 'StudentTeachingHome',
        component: () => import('../views/Student/Teaching/StuTeaching_Index.vue'),
        meta: { showSidebar: false }
      },
      {
        path: 'attendance',
        name: 'StudentAttendance',
        component: () => import('../views/Student/Teaching/StuAttendance.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'grade',
        name: 'StudentGrade',
        component: () => import('../views/Student/Teaching/StuGrades.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'homework',
        name: 'StudentHomework',
        component: () => import('../views/Student/Teaching/StuHomework.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'homeworkdetail',
        name: 'StudentHomeworkDetail',
        component: () => import('../views/Student/Teaching/StuHomework_Detail.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'leave',
        name: 'StudentLeave',
        component: () => import('../views/Student/Teaching/StuLeave.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'classresource',
        name: 'StudentClassResource',
        component: () => import('../views/Student/Teaching/StuClassResource.vue'),
        meta: { showSidebar: true }
      },

      // 学生资源相关路由
      {
        path: 'resourcehome',
        name: 'StudentResourceHome',
        component: () => import('../views/Student/Resource/StuResourceHome.vue'),
        meta: { showSidebar: false }
      },
      {
        path: 'library',
        name: 'StudentLibrary',
        component: () => import('../views/Student/Resource/StudentLibrary.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'classroom',
        name: 'StudentClassroom',
        component: () => import('../views/Student/Resource/StuClassroom.vue'),
        meta: { showSidebar: true }
      },
    ]
  },
  
  // 教师路由
  {
    path: '/teacher',
    component: TeacherLayout,
    children: [
      {
        path: 'profile',
        name: 'TeacherProfile',
        component: () => import('../views/Teacher/TeacherProfile.vue'),
        meta: { showSidebar: false }
      },
      // 教师教学功能路由
      {
        path: 'teachinghome',
        name: 'TeacherTeachingIndex',
        component: () => import('../views/Teacher/Teaching/Teateaching_Index.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'attendance',
        name: 'TeacherAttendance',
        component: () => import('../views/Teacher/Teaching/TeaAttendance.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'grades',
        name: 'TeacherGrades',
        component: () => import('../views/Teacher/Teaching/TeaGrades.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'homework',
        name: 'TeacherHomework',
        component: () => import('../views/Teacher/Teaching/TeaHomework.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'resources',
        name: 'TeacherResources',
        component: () => import('../views/Teacher/Teaching/TeaResources.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'students',
        name: 'TeacherStudents',
        component: () => import('../views/Teacher/Teaching/TeaStudents.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'leave',
        name: 'TeacherLeave',
        component: () => import('../views/Teacher/Teaching/TeachingLeave.vue'),
        meta: { showSidebar: true }
      },

      // 教师资源相关路由
      {
        path: 'resourcehome', 
        name: 'TeacherHome',
        component: () => import('../views/Teacher/Resource/TeaResourceHome.vue'),
        meta: { showSidebar: false }
      },
      {
        path: 'library',
        name: 'TeacherLibrary',
        component: () => import('../views/Teacher/Resource/TeacherLibrary.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'classroom',
        name: 'TeacherClassroom',
        component: () => import('../views/Teacher/Resource/TeaClassroom.vue'),
        meta: { showSidebar: true }
      },
    ]
  },
  
  // 管理员路由
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: 'home',
        name: 'AdminHome',
        component: () => import('../views/Admin/AdminResourceHome.vue'),
        meta: { showSidebar: false }
      },
      {
        path: 'dorm',
        name: 'AdminDorm',
        component: () => import('../views/Admin/Campus/AdminDorm.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'approve',
        name: 'AdminApprove',
        component: () => import('../views/Admin/Resource/AdminApprove.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'classroom',
        name: 'AdminClassroom',
        component: () => import('../views/Admin/Resource/AdminClassroom.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'library',
        name: 'AdminLibrary',
        component: () => import('../views/Admin/Resource/AdminLibrary.vue'),
        meta: { showSidebar: true }
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('../views/Admin/AdminProfile.vue'),
        meta: { showSidebar: false }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router