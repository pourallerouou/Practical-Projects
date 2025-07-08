const express = require('express')
const router = express.Router()
const Student = require('../models/Student')

// 获取学生列表
router.get('/', async (req, res) => {
  try {
    const students = await Student.find()
    res.json(students)
  } catch (err) {
    console.error('获取学生失败:', err)
    res.status(500).json({ error: '获取学生失败' })
  }
})

module.exports = router  // ✅ 必须导出 router！