import { useEffect, useState } from 'react'
import axios from 'axios'
import FaceRegisterModal from '../components/FaceRegisterModal'

export default function StudentManager() {
  const [students, setStudents] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [newStudent, setNewStudent] = useState({ studentId: '', name: '', gender: '男', class: '' })
  const [loading, setLoading] = useState(true)
  const [faceModal, setFaceModal] = useState({ open: false, student: null })

  useEffect(() => {
    fetchStudents()
  }, [])

  function fetchStudents() {
    setLoading(true)
    axios.get('http://localhost:3001/api/students')
      .then(res => setStudents(res.data))
      .finally(() => setLoading(false))
  }

  function handleEdit(id, stu) {
    setEditingId(id)
    setEditData({ ...stu })
  }

  function handleEditChange(e) {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  function handleEditSave(id) {
    axios.patch(`http://localhost:3001/api/students/${id}`, editData)
      .then(() => {
        setEditingId(null)
        fetchStudents()
      })
  }

  function handleEditCancel() {
    setEditingId(null)
    setEditData({})
  }

  function handleDelete(id) {
    if (!window.confirm('确定要删除该学生吗？')) return
    axios.delete(`http://localhost:3001/api/students/${id}`)
      .then(() => fetchStudents())
  }

  function handleAddChange(e) {
    const { name, value } = e.target
    setNewStudent(prev => ({ ...prev, [name]: value }))
  }

  function handleAdd() {
    if (!newStudent.studentId || !newStudent.name) return
    axios.post('http://localhost:3001/api/students', newStudent)
      .then(() => {
        setNewStudent({ studentId: '', name: '', gender: '男', class: '' })
        fetchStudents()
      })
  }

  function handleFaceRegister(stu) {
    if (window.confirm(`是否录入学生 ${stu.name}（${stu.studentId}）的人脸信息？`)) {
      setFaceModal({ open: true, student: stu })
    }
  }

  function handleFaceModalClose(success) {
    setFaceModal({ open: false, student: null })
    if (success) fetchStudents()
  }

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
        flexDirection: 'column'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>👥 学生信息管理</h2>
        <div style={{ marginBottom: 20, background: '#f3f4f6', padding: 16, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <b>新增学生：</b>
          <input name="studentId" placeholder="学号" value={newStudent.studentId} onChange={handleAddChange} style={addInputStyle} />
          <input name="name" placeholder="姓名" value={newStudent.name} onChange={handleAddChange} style={addInputStyle} />
          <select name="gender" value={newStudent.gender} onChange={handleAddChange} style={addInputStyle}>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
          <input name="class" placeholder="班级" value={newStudent.class} onChange={handleAddChange} style={addInputStyle} />
          <button onClick={handleAdd} style={{ ...addInputStyle, background: '#10b981', color: 'white', cursor: 'pointer', minWidth: 60 }}>添加</button>
        </div>
        <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1, maxHeight: 'calc(100vh - 260px)', minHeight: 200 }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: 'white', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', borderRadius: 12, fontFamily: 'Segoe UI, Arial, sans-serif', fontSize: 16 }}>
            <thead>
              <tr style={{ background: 'linear-gradient(90deg,#e0e7ff 0%,#f1f5f9 100%)', color: '#222', fontWeight: 700, letterSpacing: 1 }}>
                <th style={thStyle}>学号</th>
                <th style={thStyle}>姓名</th>
                <th style={thStyle}>性别</th>
                <th style={thStyle}>班级</th>
                <th style={thStyle}>人脸状态</th>
                <th style={thStyle}>操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#888' }}>加载中...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#888' }}>暂无学生</td></tr>
              ) : students.map(stu => (
                <tr key={stu._id} style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ ...tdStyle, textAlign: 'center', minWidth: 120 }}>{editingId === stu._id ? <input name="studentId" value={editData.studentId} onChange={handleEditChange} style={inputStyle} /> : stu.studentId}</td>
                  <td style={{ ...tdStyle, textAlign: 'center', minWidth: 120 }}>{editingId === stu._id ? <input name="name" value={editData.name} onChange={handleEditChange} style={inputStyle} /> : stu.name}</td>
                  <td style={{ ...tdStyle, textAlign: 'center', minWidth: 80 }}>{editingId === stu._id ? (
                    <select name="gender" value={editData.gender} onChange={handleEditChange} style={inputStyle}>
                      <option value="男">男</option>
                      <option value="女">女</option>
                    </select>
                  ) : stu.gender}</td>
                  <td style={{ ...tdStyle, textAlign: 'center', minWidth: 100 }}>{editingId === stu._id ? <input name="class" value={editData.class} onChange={handleEditChange} style={inputStyle} /> : stu.class}</td>
                  <td style={{ ...tdStyle, textAlign: 'center', minWidth: 120 }}>
                    <button
                      onClick={() => handleFaceRegister(stu)}
                      style={{
                        padding: '6px 18px',
                        borderRadius: 8,
                        border: 'none',
                        background: stu.faceRegistered ? '#10b981' : ' #B22222',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: 'pointer',
                        boxShadow: stu.faceRegistered ? '0 2px 8px #10b98122' : '0 2px 8px #f59e4222',
                        transition: 'background 0.2s'
                      }}
                    >
                      {stu.faceRegistered ? '已录入' : '未录入'}
                    </button>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center', minWidth: 160 }}>
                    {editingId === stu._id ? (
                      <>
                        <button onClick={() => handleEditSave(stu._id)} style={actionBtn}>保存</button>
                        <button onClick={handleEditCancel} style={actionBtn}>取消</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(stu._id, stu)} style={actionBtn}>编辑</button>
                        <button onClick={() => handleDelete(stu._id)} style={{ ...actionBtn, color: '#ef4444' }}>删除</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {faceModal.open && (
          <FaceRegisterModal
            student={faceModal.student}
            onClose={handleFaceModalClose}
          />
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  margin: '0 6px',
  padding: '6px 8px',
  borderRadius: 6,
  border: '1px solid #ccc',
  fontSize: 15,
  width: '100%',
  boxSizing: 'border-box',
  minWidth: 0,
  background: '#fff'
}
const thStyle = { padding: 10, borderBottom: '1px solid #e5e7eb', fontWeight: 600, textAlign: 'center', minWidth: 120, maxWidth: 180, whiteSpace: 'nowrap' }
const tdStyle = { padding: 8, borderBottom: '1px solid #f1f5f9', textAlign: 'center', minWidth: 120, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
const actionBtn = { margin: '0 4px', padding: '4px 10px', borderRadius: 6, border: 'none', background: '#f3f4f6', cursor: 'pointer' }
const addInputStyle = {
  margin: '0 4px',
  padding: '6px 8px',
  borderRadius: 6,
  border: '1px solid #ccc',
  fontSize: 15,
  width: 110,
  minWidth: 60,
  boxSizing: 'border-box',
  background: '#fff'
} 