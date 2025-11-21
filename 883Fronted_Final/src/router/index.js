// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import TeacherLayout from "@/components/layout/TeaLayout.vue";
import StudentLayout from "@/components/layout/StuLayout.vue";
import Login from "../views/Login.vue";

const routes = [
  // 根路径重定向到学生首页
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"), // 或者直接用 component: Login
    // 💡 建议添加 meta 字段明确标记不需要布局
    meta: { showLayout: false },
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: { showSidebar: false },
  },

  // 学生路由
  {
    path: "/student",
    component: StudentLayout,
    children: [
      {
        path: "profile",
        name: "StudentProfile",
        component: () => import("../views/Student/stuProfile.vue"),
        meta: { showSidebar: false },
      },
      // 学生教学相关路由
      {
        path: "teachinghome",
        name: "StudentTeachingHome",
        component: () =>
          import("../views/Student/Teaching/StuTeaching_Index.vue"),
        meta: { showSidebar: false },
      },
      {
        path: "attendance",
        name: "StudentAttendance",
        component: () => import("../views/Student/Teaching/StuAttendance.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "grade",
        name: "StudentGrade",
        component: () => import("../views/Student/Teaching/StuGrades.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "homework",
        name: "StudentHomework",
        component: () => import("../views/Student/Teaching/StuHomework.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "homeworkdetail",
        name: "StudentHomeworkDetail",
        component: () =>
          import("../views/Student/Teaching/StuHomework_Detail.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "leave",
        name: "StudentLeave",
        component: () => import("../views/Student/Teaching/StuLeave.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "classresource",
        name: "StudentClassResource",
        component: () =>
          import("../views/Student/Teaching/StuClassResource.vue"),
        meta: { showSidebar: true },
      },

      // 学生资源相关路由
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
      // 学生校园相关路由
      {
        path: "campushome",
        name: "StudentCampusHome",
        component: () => import("../views/Student/Campus/StuCampusHome.vue"),
        meta: { showSidebar: false },
      },
      {
        path: "studorm",
        name: "StudentDormAssign",
        component: () => import("../views/Student/Campus/StuDormAssign.vue"),
        meta: { showSidebar: false },
      },
      {
        path: "forum",
        name: "StudentForum",
        component: () => import("../views/Student/Campus/StuForum.vue"),
        meta: { showSidebar: false },
      },
      {
        path: "postdetail",
        name: "StudentPostDetail",
        component: () => import("../views/Student/Campus/StuPostDetail.vue"),
        meta: { showSidebar: false },
      },
    ],
  },

  // 教师路由
  {
    path: "/teacher",
    component: TeacherLayout,
    children: [
      {
        path: "profile",
        name: "TeacherProfile",
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

      // === 首页概览 ===
      {
        path: "course/:courseId/overview",
        name: "CourseOverview",
        component: () =>
          import("../views/Teacher/Teaching/course/CourseDetail.vue"),
        meta: { showSidebar: true, title: "课程概览" },
      },
      {
        path: "course/:courseId/learning-path",
        name: "CourseLearningPath",
        component: () =>
          import("../views/Teacher/Teaching/course/LearningPath.vue"),
        meta: { showSidebar: true, title: "知识图谱" },
      },

      // === 考勤管理 ===
      {
        path: "course/:courseId/attendance/launch",
        name: "CourseAttendanceLaunch",
        component: () =>
          import("../views/Teacher/Teaching/course/attendance/Launch.vue"),
        meta: { showSidebar: true, title: "发起签到" },
      },
      {
        path: "course/:courseId/attendance/detail",
        name: "CourseAttendanceDetail",
        component: () =>
          import("../views/Teacher/Teaching/course/attendance/Detail.vue"),
        meta: { showSidebar: true, title: "考勤详情" },
      },
      {
        path: "course/:courseId/attendance/modify",
        name: "CourseAttendanceModify",
        component: () =>
          import("../views/Teacher/Teaching/course/attendance/Modify.vue"),
        meta: { showSidebar: true, title: "修改考勤" },
      },

      // === 作业管理 (含AI) ===
      {
        path: "course/:courseId/homework/publish",
        name: "CourseHomeworkPublish",
        component: () =>
          import("../views/Teacher/Teaching/course/homework/Publish.vue"),
        meta: { showSidebar: true, title: "发布作业" },
      },
      {
        path: "course/:courseId/homework/correct",
        name: "CourseHomeworkCorrect",
        component: () =>
          import("../views/Teacher/Teaching/course/homework/Correct.vue"),
        meta: { showSidebar: true, title: "AI智能批改" },
      },
      {
        path: "course/:courseId/homework/submissions",
        name: "CourseHomeworkSubmissions",
        component: () =>
          import("../views/Teacher/Teaching/course/homework/Submissions.vue"),
        meta: { showSidebar: true, title: "提交情况" },
      },

      // === 成绩管理 ===
      {
        path: "course/:courseId/grades/composition",
        name: "CourseGradesComposition",
        component: () =>
          import("../views/Teacher/Teaching/course/grades/Composition.vue"),
        meta: { showSidebar: true, title: "成绩组成" },
      },
      {
        path: "course/:courseId/grades/input",
        name: "CourseGradesInput",
        component: () =>
          import("../views/Teacher/Teaching/course/grades/Input.vue"),
        meta: { showSidebar: true, title: "录入成绩" },
      },
      {
        path: "course/:courseId/grades/detail",
        name: "CourseGradesDetail",
        component: () =>
          import("../views/Teacher/Teaching/course/grades/Detail.vue"),
        meta: { showSidebar: true, title: "成绩详情" },
      },

      // === 课程资源 ===
      {
        path: "course/:courseId/resources/list",
        name: "CourseResourceList",
        component: () =>
          import("../views/Teacher/Teaching/course/resources/List.vue"),
        meta: { showSidebar: true, title: "资源列表" },
      },
      {
        path: "course/:courseId/resources/upload",
        name: "CourseResourceUpload",
        component: () =>
          import("../views/Teacher/Teaching/course/resources/Upload.vue"),
        meta: { showSidebar: true, title: "上传资源" },
      },

      // === 学生管理 ===
      {
        path: "course/:courseId/students/detail",
        name: "CourseStudentDetail",
        component: () =>
          import("../views/Teacher/Teaching/course/students/Detail.vue"),
        meta: { showSidebar: true, title: "学生详情" },
      },
      // === 请假管理 (新增缺失部分) ===
      {
        path: "course/:courseId/leave/approval",
        name: "CourseLeaveApproval",
        component: () =>
          import("../views/Teacher/Teaching/course/leave/Approval.vue"),
        meta: { showSidebar: true, title: "请假审批" },
      },
      {
        path: "course/:courseId/leave/records",
        name: "CourseLeaveRecords",
        component: () =>
          import("../views/Teacher/Teaching/course/leave/Records.vue"),
        meta: { showSidebar: true, title: "请假记录" },
      },

      // 教师资源相关路由
      {
        path: "resourcehome",
        name: "TeacherHome",
        component: () =>
          import("../views/Teacher/Resource/TeaResourceHome.vue"),
        meta: { showSidebar: false },
      },
      {
        path: "library",
        name: "TeacherLibrary",
        component: () => import("../views/Teacher/Resource/TeacherLibrary.vue"),
        meta: { showSidebar: true },
      },
      {
        path: "classroom",
        name: "TeacherClassroom",
        component: () => import("../views/Teacher/Resource/TeaClassroom.vue"),
        meta: { showSidebar: true },
      },
    ],
  },

  // 管理员路由
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      // 管理员校园相关路由
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
      // 管理员资源相关路由
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

// 🔒 全局前置守卫
router.beforeEach((to, from, next) => {
  // 1. 获取 Token (假设登录后存在 localStorage 中)
  const token = localStorage.getItem("token");

  // 2. 定义无需登录的白名单页面 (比如登录页、注册页)
  const whiteList = ["/login", "/register"];

  // 3. 判断逻辑
  if (whiteList.includes(to.path)) {
    // 如果要去白名单页面，直接放行
    next();
  } else {
    // 如果要去其他页面
    if (token) {
      // 有 Token，放行
      next();
    } else {
      // 没 Token，强制跳转到登录页
      next("/login");
    }
  }
});

export default router;
