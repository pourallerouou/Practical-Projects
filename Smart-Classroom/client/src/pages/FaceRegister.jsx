import { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import axios from 'axios'

export default function FaceRegister() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [name, setName] = useState('')
  const [registering, setRegistering] = useState(false)
  const [success, setSuccess] = useState(false)
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

  // 加载模型
  useEffect(() => {
    async function loadModels() {
      setLoading(true)
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models')
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        setLoading(false)
        setDetecting(true)
      } catch (err) {
        setError('模型加载失败: ' + err.message)
        setLoading(false)
      }
    }
    loadModels()
  }, [])

  // 动态设置 video/canvas 宽高，确保对齐
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const handleLoaded = () => {
      setVideoSize({ width: video.videoWidth, height: video.videoHeight })
    }
    video.addEventListener('loadedmetadata', handleLoaded)
    return () => video.removeEventListener('loadedmetadata', handleLoaded)
  }, [])

  // 检测人脸并绘制
  useEffect(() => {
    let intervalId
    if (!detecting) return
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const displaySize = { width: videoSize.width, height: videoSize.height }
    faceapi.matchDimensions(canvas, displaySize)

    async function detectFace() {
      if (video.paused || video.ended) return
      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
      ).withFaceLandmarks(true)
      const resized = faceapi.resizeResults(detections, displaySize)
      canvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height)
      faceapi.draw.drawDetections(canvas, resized)
      faceapi.draw.drawFaceLandmarks(canvas, resized)
    }

    intervalId = setInterval(detectFace, 200)
    return () => clearInterval(intervalId)
  }, [detecting, videoSize])

  // 采集人脸特征并提交
  async function handleRegister() {
    setRegistering(true)
    setError('')
    setSuccess(false)
    const video = videoRef.current
    if (!video) {
      setError('摄像头未就绪')
      setRegistering(false)
      return
    }
    // 检测人脸并提取特征
    const detection = await faceapi.detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
    ).withFaceLandmarks(true).withFaceDescriptor()
    if (!detection) {
      setError('未检测到人脸，请对准摄像头')
      setRegistering(false)
      return
    }
    // 提交到后端
    try {
      await axios.post('http://localhost:3001/api/students/register-face', {
        studentId,
        name,
        descriptor: Array.from(detection.descriptor)
      })
      setSuccess(true)
    } catch (err) {
      setError('注册失败: ' + (err.response?.data?.error || err.message))
    }
    setRegistering(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: `url('src/image/white puzzle.jpg') center/cover no-repeat`, padding: 40 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: 'rgba(255,255,255,0.92)', borderRadius: 18, boxShadow: '0 4px 32px #0001', padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: 28, fontWeight: 700, color: '#222', textShadow: '0 2px 8px #fff8' }}>📝 人脸注册</h2>
        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{error}</div>}
        {success && <div style={{ color: 'green', textAlign: 'center', marginBottom: 10 }}>注册成功！</div>}
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
          <form
            style={{ marginTop: 20, width: '100%', maxWidth: 400 }}
            onSubmit={e => { e.preventDefault(); handleRegister() }}
          >
            <input
              type="text"
              placeholder="学号"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              required
              style={{ width: '100%', padding: 10, marginBottom: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
            />
            <input
              type="text"
              placeholder="姓名"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ width: '100%', padding: 10, marginBottom: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
            />
            <button
              type="submit"
              disabled={loading || registering}
              style={{ width: '100%', padding: 12, fontSize: 18, borderRadius: 8, background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              {registering ? '注册中...' : '采集并注册人脸'}
            </button>
          </form>
          <div style={{ marginTop: 20, color: '#888' }}>
            {loading ? '正在加载人脸识别模型...' : '请对准摄像头，输入信息后点击注册'}
          </div>
        </div>
      </div>
    </div>
  )
} 