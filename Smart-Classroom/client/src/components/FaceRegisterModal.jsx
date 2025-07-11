import { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import axios from 'axios'

export default function FaceRegisterModal({ student, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [success, setSuccess] = useState(false)

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
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

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

  useEffect(() => {
    let intervalId
    if (!detecting) return
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const displaySize = { width: 400, height: 300 }
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
  }, [detecting])

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
    const detection = await faceapi.detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
    ).withFaceLandmarks(true).withFaceDescriptor()
    if (!detection) {
      setError('未检测到人脸，请对准摄像头')
      setRegistering(false)
      return
    }
    try {
      await axios.post('http://localhost:3001/api/students/register-face', {
        studentId: student.studentId,
        name: student.name,
        descriptor: Array.from(detection.descriptor)
      })
      setSuccess(true)
      setTimeout(() => onClose(true), 1200)
    } catch (err) {
      setError('注册失败: ' + (err.response?.data?.error || err.message))
      setRegistering(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: 'white', borderRadius: 12, padding: 32, minWidth: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
        <h3 style={{ textAlign: 'center', marginBottom: 10 }}>人脸录入：{student.name}（{student.studentId}）</h3>
        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{error}</div>}
        {success && <div style={{ color: 'green', textAlign: 'center', marginBottom: 10 }}>录入成功！</div>}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 400, height: 300 }}>
            <video
              ref={videoRef}
              width={400}
              height={300}
              autoPlay
              muted
              style={{ borderRadius: 8, background: '#222' }}
            />
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              style={{ position: 'absolute', left: 0, top: 0 }}
            />
          </div>
          <button
            onClick={handleRegister}
            disabled={loading || registering || success}
            style={{ marginTop: 20, padding: '12px 32px', fontSize: 18, borderRadius: 8, background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            {registering ? '录入中...' : '采集并录入人脸'}
          </button>
          <button
            onClick={() => onClose(false)}
            style={{ marginTop: 16, padding: '8px 24px', fontSize: 15, borderRadius: 8, background: '#eee', color: '#333', border: 'none', cursor: 'pointer' }}
            disabled={registering}
          >
            关闭
          </button>
          <div style={{ marginTop: 16, color: '#888' }}>
            {loading ? '正在加载人脸识别模型...' : '请对准摄像头，点击录入'}
          </div>
        </div>
      </div>
    </div>
  )
} 