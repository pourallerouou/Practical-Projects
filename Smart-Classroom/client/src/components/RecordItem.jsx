import { useState } from 'react'
import axios from 'axios'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function RecordItem({ record, onDelete }) {
  const [show, setShow] = useState(false)
  const [students, setStudents] = useState(record.students)
  const presentCount = students.filter(s => s.present).length
  const absentCount = students.length - presentCount

  const pieData = [
    { name: '到课', value: presentCount },
    { name: '缺勤', value: absentCount }
  ]

  const COLORS = ['#10b981', '#ef4444']

  const handleToggleStatus = async (stu) => {
    const newStatus = !stu.present
    try {
      await axios.patch(`http://localhost:3001/api/checkin/${record._id}/student/${stu.studentId}`, {
        present: newStatus
      })

      const updated = students.map(s =>
        s.studentId === stu.studentId ? { ...s, present: newStatus } : s
      )
      setStudents(updated)
    } catch (err) {
      console.error('修改签到状态失败:', err)
      alert('修改失败')
    }
  }

  const handleDelete = async () => {
    const confirm = window.confirm('是否确认删除本次签到记录？')
    if (!confirm) return
    try {
      await axios.delete(`http://localhost:3001/api/checkin/${record._id}`)
      onDelete(record._id)
    } catch (err) {
      console.error('删除失败:', err)
      alert('删除失败')
    }
  }

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>{new Date(record.timestamp).toLocaleString()}</strong><br />
          类型：{record.method === 'manual' ? '手动签到' : '人脸识别'}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>
            ✅ 到课：{presentCount} / ❌ 缺勤：{absentCount}
          </div>
          <button
            onClick={handleDelete}
            style={{
              marginTop: 6,
              backgroundColor: '#ef4444',
              color: '#fff',
              fontSize: 12,
              padding: '4px 8px',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            🗑 删除
          </button>
        </div>
      </div>

      <button
        onClick={() => setShow(prev => !prev)}
        style={{
          marginTop: 10,
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: 6,
          cursor: 'pointer'
        }}
      >
        {show ? '收起 ▲' : '展开详情 ▼'}
      </button>

      {show && (
        <>
          <ul style={{ marginTop: 10, paddingLeft: 20 }}>
            {students.map((s, i) => (
              <li key={i}>
                {s.name}（{s.studentId}） - {s.present ? '✅ 到课' : '❌ 缺席'}
                <button
                  onClick={() => handleToggleStatus(s)}
                  style={{
                    marginLeft: 10,
                    fontSize: 12,
                    padding: '2px 6px',
                    background: '#facc15',
                    color: '#000',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}
                >
                  切换
                </button>
              </li>
            ))}
          </ul>

          <div style={{ height: 250, marginTop: 20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}