const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  class: { type: String },
  gender: { type: String, enum: ['男', '女'], default: '男' },
  faceRegistered: { type: Boolean, default: false }
})

module.exports = mongoose.model('Student', StudentSchema)