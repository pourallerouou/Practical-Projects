import { useState } from 'react'
import axios from 'axios'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function RecordItem({ record, onDelete, allStudents, onStatusChange }) {
  const [show, setShow] = useState(false)
  // 合并所有学生，未签到的补 present: false
  const mergedStudents = allStudents.map(stu => {
    const found = record.students.find(s => s.studentId === stu.studentId)
    return found ? found : { studentId: stu.studentId, name: stu.name, present: false }
  })
  const [students, setStudents] = useState(mergedStudents)
  const presentCount = students.filter(s => s.present).length
  const absentCount = students.length - presentCount

  const pieData = [
    { name: '到课', value: presentCount },
    { name: '缺勤', value: absentCount }
  ]

  const COLORS = ['#10b981', '#ef4444']

  // handleToggleStatus 切换记录状态函数，点击切换按钮触发
  const handleToggleStatus = async (stu) => {
    const newStatus = !stu.present
    try {
      // 如果该学生原本不在 record.students 中（即未签到），需要先补充
      let found = record.students.find(s => s.studentId === stu.studentId)
      if (!found) {
        // 先补充到 record.students
        record.students.push({ studentId: stu.studentId, name: stu.name, present: newStatus })
      }
      await axios.patch(`http://localhost:3001/api/checkin/${record._id}/student/${stu.studentId}`, {
        present: newStatus,
        name: stu.name
      })

      const updated = students.map(s =>
        s.studentId === stu.studentId ? { ...s, present: newStatus } : s
      )
      setStudents(updated)
      if (onStatusChange) onStatusChange(stu.studentId, newStatus, stu.name)
    } catch (err) {
      console.error('修改签到状态失败:', err)
      alert('修改失败')
    }
  }

  // handleDelete 删除一条记录的函数，点击记录中按钮触发
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

  // 表格样式
  const thStyle = { padding: 8, borderBottom: '1px solid #e5e7eb', textAlign: 'center', minWidth: 80, fontWeight: 600, background: 'inherit' }
  const tdStyle = { padding: 8, borderBottom: '1px solid #f1f5f9', textAlign: 'center', minWidth: 80, background: 'inherit' }

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
          <div style={{ overflowX: 'auto', marginTop: 10 }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #e5e7eb55', fontFamily: 'Segoe UI, Arial, sans-serif', fontSize: 15 }}>
              <thead>
                <tr style={{ background: 'linear-gradient(90deg,#e0e7ff 0%,#f1f5f9 100%)', color: '#222', fontWeight: 600 }}>
                  <th style={thStyle}>姓名</th>
                  <th style={thStyle}>学号</th>
                  <th style={thStyle}>签到状态</th>
                  <th style={thStyle}>操作</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                    <td style={tdStyle}>{s.name}</td>
                    <td style={tdStyle}>{s.studentId}</td>
                    <td style={tdStyle}>{s.present ? <span style={{ color: '#10b981', fontWeight: 600 }}>✅ 到课</span> : <span style={{ color: '#ef4444', fontWeight: 600 }}>❌ 缺席</span>}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleToggleStatus(s)}
                        style={{
                          fontSize: 13,
                          padding: '2px 10px',
                          background: '#facc15',
                          color: '#000',
                          border: 'none',
                          borderRadius: 5,
                          cursor: 'pointer',
                          fontWeight: 500
                        }}
                      >
                        切换
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ height: 250, marginTop: 20 }}>

            {/* ResponsiveContainer 是 ​Recharts​ 图表库中用于实现响应式图表容器的核心组件。 */}
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