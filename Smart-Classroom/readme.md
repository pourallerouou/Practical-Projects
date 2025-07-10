# 智慧课堂签到系统

### 项目结构
Smart-Classroom/
├── client/   # 前端React项目
│   ├── src/
│   │   ├── components/   # 复用组件（如考勤图表、记录项等）
│   │   ├── pages/        # 页面（如手动签到、历史记录、人脸签到等）
│   │   ├── video/ image/ # 静态资源
│   │   ├── App.jsx       # 路由和主入口
│   │   └── main.jsx      # 应用入口
│   ├── public/           # 公共资源
│   ├── package.json      # 前端依赖与脚本
│   └── ...               # 配置文件等
├── server/   # 后端Node.js项目
│   ├── routes/           # 路由（如checkin、students）
│   ├── models/           # 数据模型（如CheckinRecord、Student）
│   ├── index.js          # 服务入口
│   ├── seed.js           # 数据初始化脚本
│   ├── package.json      # 后端依赖
│   └── ...               # 其他
└── readme.md

### 技术栈说明

·前端（client）
React 19：主流前端框架，负责页面渲染和组件化开发。
Vite：新一代前端构建工具，开发体验快，支持热更新。
React Router DOM 7：实现前端路由和页面切换。
Axios：进行前后端 HTTP 通信。
Recharts：用于数据可视化（如签到统计图表）。
ESLint：代码规范和质量保障。
TypeScript 类型声明（@types/react等）：提升开发体验（但主代码为JSX）。

·后端（server）
Node.js + Express 5：主流Web服务框架，负责API接口。
Mongoose 8：MongoDB对象建模，简化数据库操作。
CORS：跨域资源共享，支持前后端分离部署。

### 项目特点
  前后端分离，结构清晰：便于团队协作和独立部署。
功能模块化：
  前端页面分为手动签到、历史记录、人脸签到（预留），组件复用性好。
  后端路由和数据模型分离，接口清晰。
  数据可视化：使用 Recharts 展示签到历史，提升用户体验。
  接口设计合理：支持签到记录的增删查改（POST/GET/PATCH/DELETE），便于后续扩展。
  良好的用户交互体验：如手动签到流程友好，签到完成后有结果反馈。
  代码规范：引入 ESLint 保证代码风格统一。
