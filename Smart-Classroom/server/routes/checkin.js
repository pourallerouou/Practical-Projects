const express = require('express')
const router = express.Router()
const CheckinRecord = require('../models/CheckinRecord')

// POST /api/checkin — 保存签到记录
router.post('/', async (req, res) => {
  try {
    const { method, students } = req.body
    if (!method || !students) {
      return res.status(400).json({ error: '缺少签到方式或学生列表' })
    }

    const newRecord = new CheckinRecord({
      method,
      students
    })

    await newRecord.save()
    res.status(201).json({ message: '签到记录保存成功' })
  } catch (err) {
    console.error('保存签到记录失败:', err)
    res.status(500).json({ error: '服务器错误，保存失败' })
  }
})

// GET /api/checkin — 查询所有签到记录
router.get('/', async (req, res) => {
  try {
    const records = await CheckinRecord.find().sort({ timestamp: -1 })
    res.json(records)
  } catch (err) {
    console.error('获取签到记录失败:', err)
    res.status(500).json({ error: '服务器错误，获取失败' })
  }
})

// PATCH /api/checkin/:id/student/:studentId
router.patch('/:id/student/:studentId', async (req, res) => {
  const { id, studentId } = req.params
  const { present } = req.body

  try {
    const record = await CheckinRecord.findById(id)
    if (!record) {
      return res.status(404).json({ error: '签到记录不存在' })
    }

    const student = record.students.find(s => s.studentId === studentId)
    if (!student) {
      return res.status(404).json({ error: '该学生不在记录中' })
    }

    student.present = present
    await record.save()

    res.json({ message: '签到状态已更新' })
  } catch (err) {
    console.error('更新失败:', err)
    res.status(500).json({ error: '服务器错误' })
  }
})


// DELETE /api/checkin/:id — 删除签到记录
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await CheckinRecord.findByIdAndDelete(id)
    res.json({ message: '签到记录已删除' })
  } catch (err) {
    console.error('删除签到记录失败:', err)
    res.status(500).json({ error: '删除失败' })
  }
})

module.exports = router