import { Link } from 'react-router-dom'

function App() {
  return (
    <div
      style={{
        backgroundImage: `url('src/image/white2.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          textAlign: 'center'
        }}
      >
        <h1>📚 智慧课堂签到系统</h1>
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link to="/manual">
            <button
              style={buttonStyle}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              手动签到
            </button>
          </Link>
          <Link to="/face">
            <button
              style={buttonStyle}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              人脸识别签到
            </button>
          </Link>
          <Link to="/history">
            <button
              style={buttonStyle}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              历史签到记录
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const buttonStyle = {
  padding: '14px 28px',
  fontSize: '18px',
  borderRadius: '10px',
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s',
}

export default App