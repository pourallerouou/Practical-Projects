import { useEffect, useState } from 'react'
import axios from 'axios'
import RecordItem from '../components/RecordItem'
import AttendanceChart from '../components/AttendanceChart'

export default function History() {
  const [records, setRecords] = useState([])
  const [allStudents, setAllStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let studentsLoaded = false
    let recordsLoaded = false
    axios.get('http://localhost:3001/api/students')
      .then(res => {
        setAllStudents(res.data)
        studentsLoaded = true
        if (recordsLoaded) setLoading(false)
      })
      .catch(err => console.error('获取学生失败:', err))
    axios.get('http://localhost:3001/api/checkin')
      .then(res => {
        setRecords(res.data)
        recordsLoaded = true
        if (studentsLoaded) setLoading(false)
      })
      .catch(err => console.error('获取签到记录失败:', err))
  }, [])

  return (
    <div style={{ minHeight: '100vh', height: '100vh', background: `url('src/image/white light.jpg') center/cover no-repeat`, padding: 0, overflow: 'hidden' }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        background: 'rgba(255,255,255,0.92)',
        borderRadius: 18,
        boxShadow: '0 4px 32px #0001',
        padding: 32,
        height: 'calc(100vh - 80px)',
        marginTop: 40,
        marginBottom: 40,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: 32, fontSize: 28, fontWeight: 700, color: '#222', textShadow: '0 2px 8px #fff8' }}>📊 历史签到记录</h1>
        {loading ? (
          <p style={{ textAlign: 'center', marginTop: 40 }}>加载中...</p>
        ) : records.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: 40 }}>暂无签到记录</p>
        ) : (
          <>
            <AttendanceChart records={records} allStudents={allStudents} />
            <div style={{ flex: 1, overflowY: 'auto', marginTop: 24, minHeight: 0 }}>
              {records.map(record => (
                <RecordItem
                  key={record._id}
                  record={record}
                  allStudents={allStudents}
                  onDelete={(id) =>
                    setRecords(prev => prev.filter(r => r._id !== id))
                  }
                  onStatusChange={(studentId, newStatus, name) => {
                    setRecords(prev => prev.map(r => {
                      if (r._id !== record._id) return r
                      // 更新该记录的 students
                      let found = r.students.find(s => s.studentId === studentId)
                      if (found) {
                        found.present = newStatus
                      } else {
                        r.students.push({ studentId, name, present: newStatus })
                      }
                      return { ...r, students: [...r.students] }
                    }))
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}