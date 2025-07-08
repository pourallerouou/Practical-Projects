import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: '你好！我是你的AI助手，有什么我可以帮你？' }
  ])
  const messagesEndRef = useRef(null)

  const aiReplies = [
    '我明白了，你说得很有道理。',
    '这是个好问题，让我想一想。',
    '你能再详细一点吗？',
    '我会一直陪着你。',
    '听起来你今天过得不错！',
    '别担心，我在这儿。',
    '太棒了！继续努力吧。',
    '要不要喝杯水休息一下？'
  ]

  const handleSend = () => {
    const trimmed = inputValue.trim()
    if (trimmed === '') return

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmed
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    setTimeout(() => {
      const randomReply = aiReplies[Math.floor(Math.random() * aiReplies.length)]
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: randomReply
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className="chat-container">
      <h1 className="chat-title">💬 聊天模拟器</h1>

      <div className="chat-box">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-content">
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="请输入消息..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend()
          }}
          className="input-box"
        />
        <button onClick={handleSend} className="send-button">发送</button>
      </div>
    </div>
  )
}

export default App