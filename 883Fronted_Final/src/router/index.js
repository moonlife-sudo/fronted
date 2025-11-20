// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import TeacherLayout from '@/components/layout/TeaLayout.vue'
import StudentLayout from '@/components/layout/StuLayout.vue'

const routes = [
  // 根路径重定向 - 根据用户角色重定向到对应首页
  {
    path: '/',
    redirect: () => {
      const userRole = localStorage.getItem('userRole') || 'student'
      switch (userRole) {
        case 'admin': return '/admin/home'
        case 'teacher': return '/teacher/resourcehome'
        case 'student': return '/student/home'
        default: return '/student/home'
      }
    }
  },
  
  // 学生路由
  {
    path: '/student',
    component: StudentLayout,
    //meta: { role: 'student' },
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

      // 学生校园相关路由

    ]
  },
  
  // 教师路由
  {
    path: '/teacher',
    component: TeacherLayout,
    //meta: { role: 'teacher' },
    children: [
      {
        path: 'resourcehome',  // 注意：这里是 resourcehome，不是 home
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
      {
        path: 'profile',
        name: 'TeacherProfile',
        component: () => import('../views/Teacher/TeacherProfile.vue'),
        meta: { showSidebar: false }
      }
    ]
  },
  
  // 管理员路由
  {
    path: '/admin',
    component: AdminLayout,
    //meta: { role: 'admin' },
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

// 路由守卫 - 修正重定向逻辑
/*
router.beforeEach((to, from, next) => {
  // 获取用户角色（从Vuex或localStorage）
  const userRole = localStorage.getItem('userRole') || 'teacher'
  
  // 检查路由权限
  if (to.meta.role && to.meta.role !== userRole) {
    // 无权限访问，重定向到对应用户的首页
    switch (userRole) {
      case 'admin':
        next('/admin/home')
        break
      case 'teacher':
        next('/teacher/resourcehome')  // 注意：这里是 resourcehome
        break
      case 'student':
        next('/student/home')
        break
      default:
        next('/student/home')
    }
    return
  }
  
  next()
})
  */

export default router