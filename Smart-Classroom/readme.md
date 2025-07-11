# Smart Classroom 项目架构与技术栈分析

## 项目简介

本项目是一个“智慧教室”签到系统，包含前端（React）和后端（Node.js/Express/MongoDB）两部分，支持人脸识别签到、学生信息管理、历史记录与数据可视化等功能。

---

## 目录结构

```
Smart-Classroom/
├── client/                        # 前端（React 19 + Vite）
│   ├── package.json               # 前端依赖与脚本
│   ├── vite.config.js             # Vite 配置
│   ├── README.md                  # 前端说明文档
│   ├── public/                    # 公共资源
│   │   └── models/                # face-api.js 人脸识别模型文件
│   └── src/                       # 源码目录
│       ├── App.jsx                # 路由与全局布局
│       ├── main.jsx               # 入口文件
│       ├── index.css              # 全局样式
│       ├── image/                 # 背景与装饰图片
│       │   ├── white puzzle.jpg
│       │   ├── white paintings.jpg
│       │   ├── white light.jpg
│       │   ├── white clock.jpg
│       │   └── white2.jpg
│       ├── video/                 # 视频或模型资源（如有）
│       ├── pages/                 # 页面组件
│       │   ├── FaceCheckin.jsx    # 人脸签到页
│       │   ├── FaceRegister.jsx   # 人脸注册页
│       │   ├── History.jsx        # 历史记录页
│       │   ├── ManualCheckin.jsx  # 手动签到页
│       │   └── StudentManager.jsx # 学生管理页
│       └── components/            # 可复用组件
│           ├── AttendanceChart.jsx    # 出勤率图表
│           ├── FaceRegisterModal.jsx  # 人脸注册弹窗
│           └── RecordItem.jsx         # 单条签到记录展示
├── server/                        # 后端（Express + Mongoose）
│   ├── package.json               # 后端依赖与脚本
│   ├── index.js                   # 服务入口
│   ├── seed.js                    # 数据初始化脚本
│   ├── routes/                    # 路由
│   │   ├── students.js            # 学生相关 API
│   │   └── checkin.js             # 签到相关 API
│   └── models/                    # 数据模型
│       ├── Student.js             # 学生模型
│       └── CheckinRecord.js       # 签到记录模型
└── PROJECT_OVERVIEW.md            # 项目架构与说明
```

---

## 技术栈

### 前端

- **React 19**：构建响应式 UI
- **Vite**：极速开发与构建工具
- **React Router v7**：前端路由
- **Axios**：HTTP 请求
- **Recharts**：数据可视化（出勤率等）
- **face-api.js**：人脸检测与识别
- **ESLint**：代码质量保障

### 后端

- **Node.js + Express**：RESTful API 服务
- **Mongoose**：MongoDB ODM，数据建模
- **MongoDB**：数据存储
- **CORS**：跨域资源共享

---

## 主要功能与亮点

### 1. 人脸识别签到
- 前端集成 `face-api.js`，支持摄像头实时检测与人脸特征提取。
- 支持学生人脸注册与签到比对，提升签到效率与准确性。

### 2. 学生信息管理
- 支持学生的增删改查（CRUD），可查看人脸录入状态。
- 人脸注册支持弹窗式交互，体验友好。

### 3. 历史记录与数据可视化
- 历史签到记录支持滚动展示，顶部统计图表固定，便于数据分析。
- 出勤率等数据通过柱状图直观展示。

### 4. 现代化 UI/UX
- 采用卡片式布局与渐变背景，界面美观。
- 响应式设计，适配不同屏幕。
- 重要操作（如删除、录入人脸）有确认提示，防止误操作。

### 5. 代码结构清晰
- 前后端分离，接口清晰，易于维护和扩展。
- 组件化开发，复用性高。

---

## 可扩展性

- 增加权限与身份认证（如教师/管理员登录）
- 支持批量导入学生信息
- 增加签到异常提醒与统计
- 部署上线与移动端适配

