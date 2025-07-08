import { useEffect, useState } from 'react'
import axios from 'axios'
import RecordItem from '../components/RecordItem'
import AttendanceChart from '../components/AttendanceChart'

export default function History() {
  const [records, setRecords] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3001/api/checkin')
      .then(res => setRecords(res.data))
      .catch(err => console.error('获取签到记录失败:', err))
  }, [])

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>📊 历史签到记录</h1>

      {records.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: 40 }}>暂无签到记录</p>
      ) : (
        <>
          <AttendanceChart records={records} />
          {records.map(record => (
            <RecordItem
              key={record._id}
              record={record}
              onDelete={(id) =>
                setRecords(prev => prev.filter(r => r._id !== id))
              }
            />
          ))}
        </>
      )}
    </div>
  )
}