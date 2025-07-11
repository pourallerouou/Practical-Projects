// src/components/AttendanceChart.jsx
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function AttendanceChart({ records, allStudents = [] }) {
  const chartData = records.map((r, i) => {
    const date = new Date(r.timestamp).toLocaleDateString()
    // 统计 present
    const present = r.students.filter(s => s.present).length
    // 缺勤 = 总学生数 - 到课
    const absent = allStudents.length > 0 ? allStudents.length - present : r.students.length - present
    return {
      name: `#${i + 1} ${date}`,
      到课: present,
      缺勤: absent
    }
  })

  return (
    <div style={{ height: 300, marginBottom: 40 }}>
      {/* <h2 style={{ textAlign: 'center' }}>📊 每次签到出勤情况</h2> */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="到课" fill="#10b981" />
          <Bar dataKey="缺勤" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}