# 883Fronted_Final 使用指南

## 项目启动

```bash
# 安装依赖
npm install

# 开发环境运行
npm run serve

# 生产环境构建
npm run build
```

## 目录结构说明

详见 README.md 文件

src/
├── components/            # 公共组件
│   └── layout/            # 布局组件
│       ├── headers/       # 顶部导航
│       └── siderbars/     # 侧边栏
├── router/                # 路由配置
├── views/                 # 页面组件
│   ├── Student/           # 学生端页面
│   ├── Teacher/           # 教师端页面
│   └── Admin/             # 管理员端页面
└── App.vue                # 根组件

## 开发规范

- 使用 Vue 3 + Composition API
- 遵循组件化开发规范
- 所有页面组件统一放在 views 目录下
- 公共组件放在 components 目录下
- 样式使用 SCSS
- 路由配置在 router 目录下

## 技术栈

- 核心框架
  - Vue 3：使用 Vue 3.2.x 版本，采用 Composition API 进行开发
  - Vue Router 4：实现前端路由管理，支持动态路由和路由守卫
  - Vuex 4：状态管理，用于管理全局状态
- 构建工具
  - Vue CLI 5：项目脚手架和构建工具
  - Babel 7：JavaScript 编译器，支持现代 JavaScript 语法
  - Webpack：模块打包工具（Vue CLI 内置）
- 样式处理
  - SCSS/SASS：CSS 预处理器，版本 1.32.7
  - CSS3：使用现代 CSS 特性
