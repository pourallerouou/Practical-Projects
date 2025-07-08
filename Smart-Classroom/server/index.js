const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

// 中间件
app.use(cors())
app.use(express.json())

// 路由
const studentRoutes = require('./routes/students')
const checkinRoutes = require('./routes/checkin')
app.use('/api/students', studentRoutes)
app.use('/api/checkin', checkinRoutes)

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/smart_classroom')
  .then(() => {
    console.log('✅ 数据库连接成功')
    app.listen(3001, () => {
      console.log('🚀 后端服务运行在 http://localhost:3001')
    })
  })
  .catch(err => {
    console.error('❌ 数据库连接失败', err)
  })