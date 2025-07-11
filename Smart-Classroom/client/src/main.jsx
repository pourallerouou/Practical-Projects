import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import ManualCheckin from './pages/ManualCheckin.jsx'
import FaceCheckin from './pages/FaceCheckin.jsx'
import History from './pages/History.jsx'
import FaceRegister from './pages/FaceRegister.jsx'
import StudentManager from './pages/StudentManager.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/manual" element={<ManualCheckin />} />
        <Route path="/face" element={<FaceCheckin />} />
        <Route path="/history" element={<History />} />
        <Route path="/register-face" element={<FaceRegister />} />
        <Route path="/students" element={<StudentManager />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)