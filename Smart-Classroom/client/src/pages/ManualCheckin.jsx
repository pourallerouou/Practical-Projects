import { useState, useEffect } from 'react'
import axios from 'axios'

export default function ManualCheckin() {
  const [students, setStudents] = useState([])
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [absentList, setAbsentList] = useState([])
  const [presentList, setPresentList] = useState([]) // ✅ 新增记录到课学生列表

  useEffect(() => {
    axios.get('http://localhost:3001/api/students')
      .then(res => {
        setStudents(res.data)
      })
      .catch(err => {
        console.error('获取学生失败', err)
      })
  }, [])

  const handleStart = () => {
    setStarted(true)
    setFinished(false)
    setCurrentIndex(0)
    setAbsentList([])
    setPresentList([])
  }

  const handleCheck = (isPresent) => {
    const currentStudent = students[currentIndex]

    if (isPresent) {
      setPresentList(prev => [...prev, currentStudent])
    } else {
      setAbsentList(prev => [...prev, currentStudent])
    }

    if (currentIndex + 1 < students.length) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setStarted(false)
      setFinished(true)
      saveRecordToServer([...presentList, isPresent ? currentStudent : null].filter(Boolean), [...absentList, !isPresent ? currentStudent : null].filter(Boolean)) // ✅ 保存数据
    }
  }

  // ✅ 提交签到记录到后端
  const saveRecordToServer = (presentList, absentList) => {
    const allRecords = [...presentList.map(stu => ({
      studentId: stu.studentId,
      name: stu.name,
      present: true
    })), ...absentList.map(stu => ({
      studentId: stu.studentId,
      name: stu.name,
      present: false
    }))]

    axios.post('http://localhost:3001/api/checkin', {
      method: 'manual',
      students: allRecords
    })
    .then(() => {
      console.log('✅ 签到记录已保存')
    })
    .catch(err => {
      console.error('❌ 保存签到记录失败:', err)
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: `url('src/image/white clock.jpg') center/cover no-repeat`, padding: 40 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: 'rgba(255,255,255,0.92)', borderRadius: 18, boxShadow: '0 4px 32px #0001', padding: 32 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 32, fontSize: 28, fontWeight: 700, color: '#222', textShadow: '0 2px 8px #fff8' }}>🖐️ 手动签到</h1>

        {!started && !finished && (
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <button onClick={handleStart} style={buttonStyle} disabled={students.length === 0}>
              {students.length === 0 ? '加载中...' : '开始签到'}
            </button>
          </div>
        )}

        {started && currentIndex < students.length && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
            <div style={{
              background: 'linear-gradient(120deg,#f1f5f9 0%,#e0e7ff 100%)',
              borderRadius: 18,
              boxShadow: '0 2px 16px #0001',
              padding: '36px 48px',
              minWidth: 340,
              maxWidth: 420,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1.5px solid #e0e7ff',
              transition: 'box-shadow 0.2s',
            }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: '#3b82f6', marginBottom: 18, letterSpacing: 1 }}>当前学生</div>
              <div style={{ fontSize: 28, margin: '10px 0 24px 0', color: '#222', fontWeight: 700, letterSpacing: 1 }}>
                {students[currentIndex].name}（{students[currentIndex].studentId}）
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 10 }}>
                <button
                  style={{ ...buttonStyle, background: 'linear-gradient(90deg,#10b981 60%,#34d399 100%)', fontWeight: 600, fontSize: 20, minWidth: 100 }}
                  onClick={() => handleCheck(true)}
                >
                  ✅ 已到
                </button>
                <button
                  style={{ ...buttonStyle, background: 'linear-gradient(90deg,#ef4444 60%,#f59e42 100%)', fontWeight: 600, fontSize: 20, minWidth: 100 }}
                  onClick={() => handleCheck(false)}
                >
                  ❌ 缺席
                </button>
              </div>
            </div>
          </div>
        )}

        {finished && (
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <h2 style={{ fontWeight: 700, color: '#10b981', fontSize: 24 }}>签到完成 ✅</h2>
            {absentList.length === 0 ? (
              <p style={{ fontSize: 18, color: '#222', marginTop: 24 }}>所有学生均已到课！🎉</p>
            ) : (
              <div style={{ marginTop: 24 }}>
                <p style={{ fontSize: 18, color: '#ef4444' }}>以下学生未到：</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0' }}>
                  {absentList.map((stu) => (
                    <li key={stu.studentId} style={{ fontSize: 17, color: '#222', margin: '8px 0', borderBottom: '1px dashed #e5e7eb', paddingBottom: 4 }}>
                      {stu.name}（{stu.studentId}）
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button onClick={handleStart} style={{ ...buttonStyle, marginTop: 32, fontSize: 18, padding: '12px 36px', borderRadius: 10 }}>
              重新开始
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const buttonStyle = {
  padding: '12px 24px',
  fontSize: 18,
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer'
}