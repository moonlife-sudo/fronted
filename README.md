# 883Fronted_Final 项目简介

管理员：资源管理、生活管理
教师：教学管理、资源管理
学生：教学系统、资源预约、校园服务

# 883Fronted_Final 项目结构说明

883Fronted_Final/ 
│
├── src/
│   │
│   ├── components/ (可复用组件)
│   │   │
│   │   └── layout/ (布局组件)
│   │       │
│   │       ├── AdminLayout.vue    # 管理员端主布局
│   │       │   ├── 包含整体布局结构
│   │       │   ├── 集成顶部导航和侧边栏
│   │       │   └── 内容区域路由视图
│   │       │
│   │       ├── StuLayout.vue      # 学生端主布局
│   │       │   ├── 学生端整体框架
│   │       │   ├── 集成学生相关功能入口
│   │       │   └── 响应式设计
│   │       │
│   │       ├── TeaLayout.vue      # 教师端主布局
│   │       │   ├── 教师端整体框架
│   │       │   └── 集成教学管理功能
│   │       │
│   │       ├── headers/ (顶部导航栏)
│   │       │   ├── AdminHeader.vue  # 管理员顶部导航
│   │       │   │
│   │       │   ├── StuHeader.vue    # 学生端顶部导航
│   │       │   │
│   │       │   └── TeaHeader.vue    # 教师端顶部导航
│   │       │
│   │       └── siderbars/ (侧边栏)
│   │           ├── AdminSidebar.vue  # 管理员侧边栏
│   │           │
│   │           ├── StuSidebar.vue    # 学生侧边栏
│   │           │
│   │           └── TeaSidebar.vue    # 教师侧边栏
│   │
│   └── views/ (页面视图)
│       │
│       ├── Student/ (学生)
│       │   │
│       │   ├── Campus/
│       │   │   ├── StuCampusHome.vue          # 学生校园首页
│       │   │   ├── StuDormAssign.vue          # 宿舍分配查看
│       │   │   ├── StuForum.vue               # 校园论坛
│       │   │   └── StuPostDetail.vue          # 论坛帖子详情
│       │   │
│       │   ├── Resource/
│       │   │   ├── StuClassroom.vue           # 教室预约
│       │   │   ├── StudentLibrary.vue         # 图书馆服务
│       │   │   └── StuResourceHome.vue        # 资源服务首页
│       │   │
│       │   ├── Teaching/
│       │   │   ├── StuAttendance.vue          # 考勤记录查看
│       │   │   ├── StuClassResource.vue       # 课程资源下载
│       │   │   ├── StuGrades.vue              # 成绩查询
│       │   │   ├── StuHomework_Detail.vue     # 作业详情查看
│       │   │   ├── StuHomework.vue            # 作业列表
│       │   │   ├── StuLeave.vue               # 请假申请
│       │   │   └── StuTeaching_Index.vue      # 教学模块首页
│       │   │
│       │   └── stuProfile.vue                 # 学生个人信息
│       │
│       ├── Teacher/ (教师)
│       │   ├── Resource/
│       │   │   ├── TeacherLibrary.vue         # 教师图书馆
│       │   │   ├── TeaClassroom.vue           # 教室使用管理
│       │   │   └── TeaResourceHome.vue        # 资源管理首页
│       │   │
│       │   ├── Teaching/
│       │   │   ├── attendance/                # 考勤管理相关
│       │   │   ├── grades/                    # 成绩管理相关
│       │   │   ├── homework/                  # 作业管理相关
│       │   │   ├── leave/                     # 请假审批相关
│       │   │   ├── resources/                 # 教学资源相关
│       │   │   ├── students/                  # 学生管理相关
│       │   │   ├── CourseDetail.vue           # 课程详细信息
│       │   │   ├── LearningPath.vue           # 学习路径规划
│       │   │   ├── TeaAttendance.vue          # 学生考勤管理
│       │   │   ├── TeachingLeave.vue          # 学生请假审批
│       │   │   ├── TeaGrades.vue              # 成绩录入管理
│       │   │   ├── TeaHomework.vue            # 作业发布批改
│       │   │   ├── TeaResources.vue           # 教学资源管理
│       │   │   ├── TeaStudents.vue            # 学生信息管理
│       │   │   ├── Teateaching_Index.vue      # 教学管理首页
│       │   │
│       │   └── TeacherProfile.vue             # 教师个人信息
│       │   
│       └── Admin/ (管理员)
│       │   ├── Campus/
│       │   │   ├── AdmCampusHome.vue          # 校园总览首页
│       │   │   ├── AdmDormAssign.vue          # 宿舍分配管理
│       │   │   └── AdminDorm.vue              # 宿舍信息管理
│       │   │
│       │   └── Resource/
│       │   │   ├── AdminApprove.vue           # 资源使用审批
│       │   │   ├── AdminClassroom.vue         # 教室资源管理
│       │   │   ├── AdminLibrary.vue           # 图书馆管理
│       │   │   ├── AdminResourceHome.vue      # 资源管理首页
│       │   │
│       │   └── AdminProfile.vue               # 管理员个人信息
│       │
│       └── Home.vue (系统首页)
│
└── 其他配置文件
    ├── App.vue          # 布局结构和全局状态管理
    ├── package.json     # 项目依赖
    ├── vue.config.js    # Vue配置
    └── router/          # 路由配置
        └── index.js     # 路由定义
    