// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import TeacherLayout from "@/components/layout/TeaLayout.vue";
import StudentLayout from "@/components/layout/StuLayout.vue";

const routes = [
  // 1. 基础路由
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: { showLayout: false },
  },

  // 2. 学生路由
  {
    path: "/student",
    component: StudentLayout,
    children: [
      {
        path: "home", // 访问路径变成 /student/home
        name: "StudentHome",
        component: () => import("../views/Home.vue"), // 复用同一个 Home 组件
        meta: { showSidebar: false }, // 首页通常不显示侧边栏
      },
      {
        path: "profile",
        name: "StudentProfile",
        component: () => import("../views/Student/stuProfile.vue"),
        meta: { showSidebar: false },
      },
      // 2.1 学生入口：课程列表
      {
        path: "teachinghome",
        name: "StudentTeachingHome",
        component: () =>
          import("../views/Student/Teaching/StuTeaching_Index.vue"),
        meta: { showSidebar: true },
      },
      // 全局请假记录 (修复点击侧边栏“请假记录”不显示的问题)
      {
        path: "leave",
        // 1. 如果访问 /student/leave，自动跳到记录页
        redirect: "/student/leave/records",
      },
      {
        path: "leave/records",
        name: "StudentGlobalLeaveRecords",
        component: () =>
          import("../views/Student/Teaching/course/leave/Records.vue"),
        meta: { showSidebar: true, title: "请假记录" },
      },
      {
        path: "leave/apply",
        name: "StudentGlobalLeaveApply",
        component: () =>
          import("../views/Student/Teaching/course/leave/Apply.vue"),
        meta: { showSidebar: true, title: "我要请假" },
      },

      // ============================================================
      // 2.2 【核心】学生课程专属智能教学路由 (扁平化写法，不要改动)
      // ============================================================
      // ✅ 【新增】智能重定向：如果只访问了 course/501，自动跳到考勤页
      {
        path: "course/:courseId",
        redirect: (to) =>
          `/student/course/${to.params.courseId}/attendance/index`,
      },
      // 课程概览
      {
        path: "course/:courseId/overview",
        name: "StudentCourseOverview",
        component: () =>
          import("../views/Student/Teaching/course/CourseDetail.vue"),
        meta: { showSidebar: true, title: "课程概览" },
      },
      // 考勤
      {
        path: "course/:courseId/attendance/index",
        name: "StudentCourseAttendance",
        component: () =>
          import("../views/Student/Teaching/course/attendance/Index.vue"),
        meta: { showSidebar: true, title: "考勤签到" },
      },
      // 作业列表
      {
        path: "course/:courseId/homework/list",
        name: "StudentCourseHomeworkList",
        component: () =>
          import("../views/Student/Teaching/course/homework/List.vue"),
        meta: { showSidebar: true, title: "作业列表" },
      },
      // 作业详情
      {
        path: "course/:courseId/homework/detail",
        name: "StudentCourseHomeworkDetail",
        component: () =>
          import("../views/Student/Teaching/course/homework/Detail.vue"),
        meta: { showSidebar: true, title: "作业详情" },
      },
      // 成绩
      {
        path: "course/:courseId/grades/index",
        name: "StudentCourseGrades",
        component: () =>
          import("../views/Student/Teaching/course/grades/Index.vue"),
        meta: { showSidebar: true, title: "成绩查询" },
      },
      // 资源
      {
        path: "course/:courseId/resources/list",
        name: "StudentCourseResources",
        component: () =>
          import("../views/Student/Teaching/course/resources/List.vue"),
        meta: { showSidebar: true, title: "课程资源" },
      },
      // 请假
      {
        path: "course/:courseId/leave/apply",
        name: "StudentLeaveApply",
        component: () =>
          import("../views/Student/Teaching/course/leave/Apply.vue"),
        meta: { showSidebar: true, title: "请假申请" },
      },
      {
        path: "course/:courseId/leave/records",
        name: "StudentLeaveRecords",
        component: () =>
          import("../views/Student/Teaching/course/leave/Records.vue"),
        meta: { showSidebar: true, title: "请假记录" },
      },

      // 2.3 学生其他功能
      {
        path: "resourcehome",
        name: "StudentResourceHome",
        component: () =>
          import("../views/Student/Resource/StuResourceHome.vue"),
        meta: { showSidebar: false },
      },
      {
        path: "library",
        name: "StudentLibrary",
        component: () => import("../views/Student/Resource/StudentLibrary.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "classroom",
        name: "StudentClassroom",
        component: () => import("../views/Student/Resource/StuClassroom.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "campushome",
        name: "StudentCampusHome",
        component: () => import("../views/Student/Campus/StuCampusHome.vue"),
        meta: { showSidebar: false }, // 首页通常不显示侧边栏，保持 false 即可
      },
      {
        path: "studorm",
        name: "StudentDormAssign",
        component: () => import("../views/Student/Campus/StuDormAssign.vue"),
        meta: { showSidebar: true }, // ❌ 之前是 false，👉 改为 true
      },
      {
        path: "forum",
        name: "StudentForum",
        component: () => import("../views/Student/Campus/StuForum.vue"),
        meta: { showSidebar: true }, // ❌ 之前是 false，👉 改为 true
      },
      {
        path: "postdetail",
        name: "StudentPostDetail",
        component: () => import("../views/Student/Campus/StuPostDetail.vue"),
        meta: { showSidebar: true }, // ❌ 建议也改为 true
      },
    ],
  },

  // 3. 教师路由 (保持你之前的完美配置)
  {
    path: "/teacher",
    component: TeacherLayout,
    children: [
      {
        path: "home", // 访问路径变成 /teacher/home
        name: "TeacherHome",
        component: () => import("../views/Home.vue"),
        meta: { showSidebar: false },
      },
      {
        path: "profile",
        component: () => import("../views/Teacher/TeacherProfile.vue"),
        meta: { showSidebar: false },
      },
      {
        path: "teachinghome",
        name: "TeacherTeachingIndex",
        component: () =>
          import("../views/Teacher/Teaching/Teateaching_Index.vue"),
        meta: { showSidebar: true },
      },
      // === 教师课程智能教学路由 ===
      {
        path: "course/:courseId/overview",
        component: () =>
          import("../views/Teacher/Teaching/course/CourseDetail.vue"),
        meta: { showSidebar: true, title: "课程概览" },
      },
      {
        path: "course/:courseId/learning-path",
        component: () =>
          import("../views/Teacher/Teaching/course/LearningPath.vue"),
        meta: { showSidebar: true, title: "知识图谱" },
      },
      // 考勤
      {
        path: "course/:courseId/attendance/launch",
        component: () =>
          import("../views/Teacher/Teaching/course/attendance/Launch.vue"),
        meta: { showSidebar: true, title: "发起签到" },
      },
      {
        path: "course/:courseId/attendance/detail",
        component: () =>
          import("../views/Teacher/Teaching/course/attendance/Detail.vue"),
        meta: { showSidebar: true, title: "考勤详情" },
      },
      {
        path: "course/:courseId/attendance/modify",
        component: () =>
          import("../views/Teacher/Teaching/course/attendance/Modify.vue"),
        meta: { showSidebar: true, title: "修改考勤" },
      },
      // 作业
      {
        path: "course/:courseId/homework/publish",
        component: () =>
          import("../views/Teacher/Teaching/course/homework/Publish.vue"),
        meta: { showSidebar: true, title: "发布作业" },
      },
      {
        path: "course/:courseId/homework/correct",
        component: () =>
          import("../views/Teacher/Teaching/course/homework/Correct.vue"),
        meta: { showSidebar: true, title: "AI智能批改" },
      },
      {
        path: "course/:courseId/homework/submissions",
        component: () =>
          import("../views/Teacher/Teaching/course/homework/Submissions.vue"),
        meta: { showSidebar: true, title: "提交情况" },
      },
      // 成绩
      {
        path: "course/:courseId/grades/composition",
        component: () =>
          import("../views/Teacher/Teaching/course/grades/Composition.vue"),
        meta: { showSidebar: true, title: "成绩组成" },
      },
      {
        path: "course/:courseId/grades/input",
        component: () =>
          import("../views/Teacher/Teaching/course/grades/Input.vue"),
        meta: { showSidebar: true, title: "录入成绩" },
      },
      {
        path: "course/:courseId/grades/detail",
        component: () =>
          import("../views/Teacher/Teaching/course/grades/Detail.vue"),
        meta: { showSidebar: true, title: "成绩详情" },
      },
      // 资源
      {
        path: "course/:courseId/resources/list",
        component: () =>
          import("../views/Teacher/Teaching/course/resources/List.vue"),
        meta: { showSidebar: true, title: "资源列表" },
      },
      {
        path: "course/:courseId/resources/upload",
        component: () =>
          import("../views/Teacher/Teaching/course/resources/Upload.vue"),
        meta: { showSidebar: true, title: "上传资源" },
      },
      // 学生管理
      {
        path: "course/:courseId/students/detail",
        component: () =>
          import("../views/Teacher/Teaching/course/students/Detail.vue"),
        meta: { showSidebar: true, title: "学生详情" },
      },
      // 请假
      {
        path: "course/:courseId/leave/approval",
        component: () =>
          import("../views/Teacher/Teaching/course/leave/Approval.vue"),
        meta: { showSidebar: true, title: "请假审批" },
      },
      {
        path: "course/:courseId/leave/records",
        component: () =>
          import("../views/Teacher/Teaching/course/leave/Records.vue"),
        meta: { showSidebar: true, title: "请假记录" },
      },
      // 教师公共资源
      {
        path: "resourcehome",
        component: () =>
          import("../views/Teacher/Resource/TeaResourceHome.vue"),
        meta: { showSidebar: false },
      },
      {
        path: "library",
        component: () => import("../views/Teacher/Resource/TeacherLibrary.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "classroom",
        component: () => import("../views/Teacher/Resource/TeaClassroom.vue"),
        meta: { showSidebar: true },
      },
    ],
  },

  // 4. 管理员路由
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path: "home", // 访问路径变成 /admin/home
        name: "AdminHome",
        component: () => import("../views/Home.vue"),
        meta: { showSidebar: false },
      },
      {
        path: "campushome",
        name: "AdminCampusHome",
        component: () => import("../views/Admin/Campus/AdmCampusHome.vue"),
        meta: { showSidebar: false },
      },
      {
        path: "dorm",
        name: "AdminDorm",
        component: () => import("../views/Admin/Campus/AdminDorm.vue"),
        meta: { showSidebar: false },
      },
      {
        path: "dormassign",
        name: "DormAssign",
        component: () => import("../views/Admin/Campus/AdmDormAssign.vue"),
        meta: { showSidebar: false },
      },
      {
        path: "resourcehome",
        name: "AdminHome",
        component: () =>
          import("../views/Admin/Resource/AdminResourceHome.vue"),
        meta: { showSidebar: false },
      },
      {
        path: "approve",
        name: "AdminApprove",
        component: () => import("../views/Admin/Resource/AdminApprove.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "classroom",
        name: "AdminClassroom",
        component: () => import("../views/Admin/Resource/AdminClassroom.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "library",
        name: "AdminLibrary",
        component: () => import("../views/Admin/Resource/AdminLibrary.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "profile",
        name: "AdminProfile",
        component: () => import("../views/Admin/AdminProfile.vue"),
        meta: { showSidebar: false },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 🔒 全局守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const whiteList = ["/login", "/register"];
  if (whiteList.includes(to.path)) {
    next();
  } else {
    if (token) {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
