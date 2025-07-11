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

// 注册/更新学生人脸特征
router.post('/register-face', async (req, res) => {
  const { studentId, name, descriptor } = req.body
  if (!studentId || !name || !descriptor || !Array.isArray(descriptor)) {
    return res.status(400).json({ error: '参数不完整' })
  }
  try {
    // 查找学生，存在则更新，不存在则新建
    let student = await Student.findOne({ studentId })
    if (student) {
      student.name = name
      student.descriptor = descriptor
      student.faceRegistered = true
      await student.save()
    } else {
      student = await Student.create({
        studentId,
        name,
        descriptor,
        faceRegistered: true
      })
    }
    res.json({ message: '人脸注册成功', student })
  } catch (err) {
    console.error('人脸注册失败:', err)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 新增学生
router.post('/', async (req, res) => {
  const { studentId, name, gender, class: className } = req.body
  if (!studentId || !name) {
    return res.status(400).json({ error: '学号和姓名不能为空' })
  }
  try {
    const exists = await Student.findOne({ studentId })
    if (exists) {
      return res.status(400).json({ error: '学号已存在' })
    }
    const student = await Student.create({ studentId, name, gender, class: className })
    res.status(201).json(student)
  } catch (err) {
    console.error('新增学生失败:', err)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 修改学生
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { studentId, name, gender, class: className } = req.body
  try {
    const student = await Student.findById(id)
    if (!student) return res.status(404).json({ error: '学生不存在' })
    if (studentId) student.studentId = studentId
    if (name) student.name = name
    if (gender) student.gender = gender
    if (className !== undefined) student.class = className
    await student.save()
    res.json(student)
  } catch (err) {
    console.error('修改学生失败:', err)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 删除学生
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await Student.findByIdAndDelete(id)
    res.json({ message: '删除成功' })
  } catch (err) {
    console.error('删除学生失败:', err)
    res.status(500).json({ error: '服务器错误' })
  }
})

module.exports = router  // ✅ 必须导出 router！