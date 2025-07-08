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
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>🖐️ 手动签到</h1>

      {!started && !finished && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button onClick={handleStart} style={buttonStyle} disabled={students.length === 0}>
            {students.length === 0 ? '加载中...' : '开始签到'}
          </button>
        </div>
      )}

      {started && currentIndex < students.length && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <h2>当前学生</h2>
          <p style={{ fontSize: 24, margin: '16px 0' }}>
            {students[currentIndex].name}（{students[currentIndex].studentId}）
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
            <button
              style={{ ...buttonStyle, backgroundColor: '#10b981' }}
              onClick={() => handleCheck(true)}
            >
              ✅ 已到
            </button>
            <button
              style={{ ...buttonStyle, backgroundColor: '#ef4444' }}
              onClick={() => handleCheck(false)}
            >
              ❌ 缺席
            </button>
          </div>
        </div>
      )}

      {finished && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <h2>签到完成 ✅</h2>
          {absentList.length === 0 ? (
            <p>所有学生均已到课！🎉</p>
          ) : (
            <>
              <p>以下学生未到：</p>
              <ul>
                {absentList.map((stu) => (
                  <li key={stu.studentId}>
                    {stu.name}（{stu.studentId}）
                  </li>
                ))}
              </ul>
            </>
          )}
          <button onClick={handleStart} style={{ ...buttonStyle, marginTop: 20 }}>
            重新开始
          </button>
        </div>
      )}
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