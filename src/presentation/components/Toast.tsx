import { useEffect, useState } from 'react'
import '../styles/toast.css'

interface ToastProps {
  id: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  onClose: (id: string) => void
}

const Toast = ({ id, message, type = 'info', duration = 3000, onClose }: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onClose(id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <div className={`toast toast-${type} ${isExiting ? 'toast-exit' : ''}`}>
      <p className="toast-message">{message}</p>
    </div>
  )
}

export default Toast
