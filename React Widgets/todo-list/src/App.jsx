import { useState, useEffect } from 'react'
import styles from './App.module.css'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')

  // ✅ 页面初始化时从 localStorage 读取任务
  useEffect(() => {
    const storedTasks = localStorage.getItem('my-tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  // ✅ 每次 tasks 变化时保存到 localStorage
  useEffect(() => {
    localStorage.setItem('my-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleAddTask = () => {
    const trimmed = inputValue.trim()
    if (trimmed === '') return

    const newTask = {
      id: Date.now(),
      text: trimmed,
      completed: false
    }

    setTasks([newTask, ...tasks])
    setInputValue('')
  }

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📝 我的任务清单</h1>

      <div className={styles.inputArea}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入新任务..."
          className={styles.inputBox}
        />
        <button onClick={handleAddTask} className={styles.addButton}>
          添加
        </button>
      </div>

      <div className={styles.filterArea}>
        <button
          onClick={() => setFilter('all')}
          className={`${styles.filterButton} ${filter === 'all' ? styles.filterButtonActive : ''}`}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`${styles.filterButton} ${filter === 'active' ? styles.filterButtonActive : ''}`}
        >
          未完成
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`${styles.filterButton} ${filter === 'completed' ? styles.filterButtonActive : ''}`}
        >
          已完成
        </button>
      </div>

      <ul className={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <li style={{ color: '#888' }}>暂无任务</li>
        ) : (
          filteredTasks.map(task => (
            <li
              key={task.id}
              className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}
            >
              <span
                onClick={() => toggleComplete(task.id)}
                className={styles.taskText}
              >
                {task.text}
              </span>
              <button onClick={() => handleDelete(task.id)} className={styles.deleteButton}>
                删除
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default App