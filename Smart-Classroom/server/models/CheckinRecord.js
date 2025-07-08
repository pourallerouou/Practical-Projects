const mongoose = require('mongoose')

const CheckinRecordSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  method: { type: String, enum: ['manual', 'face'], required: true },
  students: [
    {
      studentId: String,
      name: String,
      present: Boolean
    }
  ]
})

module.exports = mongoose.model('CheckinRecord', CheckinRecordSchema)