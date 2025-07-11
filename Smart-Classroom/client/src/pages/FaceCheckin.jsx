import { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import axios from 'axios'

export default function FaceCheckin() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [students, setStudents] = useState([])
  const [result, setResult] = useState(null)
  const [checking, setChecking] = useState(false)
  const [signing, setSigning] = useState(false) // 是否正在签到
  const [signedMap, setSignedMap] = useState({}) // { studentId: {name, studentId, time, dist} }
  // 新增：动态设置 video/canvas 宽高，确保对齐
  const [videoSize, setVideoSize] = useState({ width: 600, height: 450 })

  // 启动摄像头
  useEffect(() => {
    async function startVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        setError('无法访问摄像头: ' + err.message)
      }
    }
    startVideo()
  }, [])

  // 加载模型和学生特征
  useEffect(() => {
    async function loadAll() {
      setLoading(true)
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models')
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        // 获取所有已注册学生及其特征
        const res = await axios.get('http://localhost:3001/api/students')
        setStudents(res.data.filter(s => s.faceRegistered && Array.isArray(s.descriptor)))
        setLoading(false)
      } catch (err) {
        setError('模型或学生数据加载失败: ' + err.message)
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // 新增：动态设置 video/canvas 宽高，确保对齐
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const handleLoaded = () => {
      setVideoSize({ width: video.videoWidth, height: video.videoHeight })
    }
    video.addEventListener('loadedmetadata', handleLoaded)
    return () => video.removeEventListener('loadedmetadata', handleLoaded)
  }, [])

  // 检测人脸并比对（仅在 signing=true 时）
  useEffect(() => {
    let intervalId
    if (!signing) return
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const displaySize = { width: videoSize.width, height: videoSize.height }
    faceapi.matchDimensions(canvas, displaySize)

    async function detectAndCheck() {
      if (video.paused || video.ended || checking) return
      const detection = await faceapi.detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
      ).withFaceLandmarks(true).withFaceDescriptor()
      canvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height)
      if (detection) {
        // 用实际视频尺寸做 resizeResults
        const resized = faceapi.resizeResults(detection, displaySize)
        faceapi.draw.drawDetections(canvas, [resized])
        faceapi.draw.drawFaceLandmarks(canvas, [resized])
        // 比对
        const inputDescriptor = detection.descriptor
        let minDist = Infinity
        let matched = null
        for (const stu of students) {
          if (!stu.descriptor) continue
          const dist = faceapi.euclideanDistance(inputDescriptor, stu.descriptor)
          if (dist < minDist) {
            minDist = dist
            matched = stu
          }
        }
        if (matched && minDist < 0.5) { // 阈值可调整
          setChecking(true)
          setResult({ success: true, student: matched, dist: minDist })
          // 只记录第一次签到
          setSignedMap(prev => {
            if (prev[matched.studentId]) return prev
            return {
              ...prev,
              [matched.studentId]: {
                studentId: matched.studentId,
                name: matched.name,
                time: new Date().toISOString(),
                dist: minDist
              }
            }
          })
          setTimeout(() => {
            setChecking(false)
            setResult(null)
          }, 2000)
        } else if (minDist < Infinity) {
          setResult({ success: false, dist: minDist })
          setTimeout(() => setResult(null), 1200)
        }
      }
    }

    intervalId = setInterval(detectAndCheck, 1200)
    return () => clearInterval(intervalId)
  }, [signing, students, checking, videoSize])

  // 停止签到并提交记录
  async function handleStopSign() {
    setSigning(false)
    if (Object.keys(signedMap).length === 0) return
    try {
      await axios.post('http://localhost:3001/api/checkin', {
        method: 'face',
        students: Object.values(signedMap).map(s => ({
          studentId: s.studentId,
          name: s.name,
          present: true,
          time: s.time
        }))
      })
      setResult({ success: true, message: '本次签到已保存！' })
      setSignedMap({})
    } catch (e) {
      setResult({ success: false, message: '签到保存失败' })
    }
    setTimeout(() => setResult(null), 2000)
  }

  function handleStartSign() {
    setSignedMap({})
    setSigning(true)
    setResult(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: `url('src/image/white puzzle.jpg') center/cover no-repeat`, padding: 40 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: 'rgba(255,255,255,0.92)', borderRadius: 18, boxShadow: '0 4px 32px #0001', padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: 28, fontWeight: 700, color: '#222', textShadow: '0 2px 8px #fff8' }}>📷 人脸识别签到</h2>
        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: videoSize.width, height: videoSize.height, marginBottom: 18 }}>
            <video
              ref={videoRef}
              width={videoSize.width}
              height={videoSize.height}
              autoPlay
              muted
              style={{ borderRadius: 16, background: '#222', boxShadow: '0 2px 16px #0002', objectFit: 'cover', width: videoSize.width, height: videoSize.height }}
            />
            <canvas
              ref={canvasRef}
              width={videoSize.width}
              height={videoSize.height}
              style={{ position: 'absolute', left: 0, top: 0, borderRadius: 16, pointerEvents: 'none' }}
            />
          </div>
          <div style={{ marginTop: 20, color: '#888', minHeight: 32, fontSize: 17 }}>
            {loading ? '正在加载人脸识别模型和学生数据...' : (signing ? '签到进行中，请对准摄像头' : '点击开始签到')}
          </div>
          {!signing && (
            <button
              style={{ margin: '16px 0', padding: '12px 32px', fontSize: 18, borderRadius: 8, background: '#10b981', color: 'white', border: 'none', cursor: 'pointer' }}
              onClick={handleStartSign}
              disabled={loading}
            >
              开始签到
            </button>
          )}
          {signing && (
            <button
              style={{ margin: '16px 0', padding: '12px 32px', fontSize: 18, borderRadius: 8, background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}
              onClick={handleStopSign}
            >
              停止签到
            </button>
          )}
          {signing && (
            <div style={{ marginTop: 10, color: '#333', fontSize: 16 }}>
              <b>已签到学生：</b>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {Object.values(signedMap).map(s => (
                  <li key={s.studentId}>
                    {s.name}（{s.studentId}）<span style={{ color: '#888', fontSize: 13 }}> {new Date(s.time).toLocaleTimeString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result && result.message && (
            <div style={{ color: result.success ? 'green' : 'red', marginTop: 10, fontSize: 18 }}>
              {result.message}
            </div>
          )}
          {result && result.success && result.student && (
            <div style={{ color: 'green', marginTop: 10, fontSize: 18 }}>
              签到成功：{result.student.name}（{result.student.studentId}）<br />
              相似度：{(1 - result.dist).toFixed(2)}
            </div>
          )}
          {result && result.success === false && result.dist && (
            <div style={{ color: 'red', marginTop: 10, fontSize: 16 }}>
              未识别到已注册学生（相似度：{(1 - result.dist).toFixed(2)}）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}