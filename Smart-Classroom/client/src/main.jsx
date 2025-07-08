import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import ManualCheckin from './pages/ManualCheckin.jsx'
import FaceCheckin from './pages/FaceCheckin.jsx'
import History from './pages/History.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/manual" element={<ManualCheckin />} />
        <Route path="/face" element={<FaceCheckin />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)