// seed.js
//更新这个js文件可以快速重新设置所有学生信息。

const mongoose = require('mongoose')
const Student = require('./models/Student')

mongoose.connect('mongodb://127.0.0.1:27017/smart_classroom')
  .then(async () => {
    await Student.deleteMany()
    await Student.insertMany([
      { studentId: '20230001', name: 'Alex', class: 'A班', gender: '男' },
      { studentId: '20230002', name: 'Sam', class: 'A班', gender: '女' },
      { studentId: '20230003', name: 'Max', class: 'B班', gender: '男' },
      { studentId: '20230004', name: 'Liz', class: 'A班', gender: '男' },
      { studentId: '20230005', name: 'Ben', class: 'A班', gender: '女' },
      { studentId: '20230006', name: 'Jen', class: 'B班', gender: '男' },
      { studentId: '20230007', name: 'Dan', class: 'A班', gender: '男' },
      { studentId: '20230008', name: 'Meg', class: 'A班', gender: '女' },
      { studentId: '20230009', name: 'Tim', class: 'B班', gender: '男' }
    ])
    console.log('✅ 学生数据已导入')
    process.exit()
  })
  .catch(err => {
    console.error('❌ 连接失败', err)
  })