import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import '../styles/admin-notifications.css'

interface Notification {
  notification_id: string
  title: string
  body: string
  type: string
  status: string
  sent_at: string
  created_at: string
}

const AdminNotifications: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    type: 'GENERAL',
  })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:3000/api/v1/admin/routes/notifications/history', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('http://localhost:3000/api/v1/admin/routes/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Notificación enviada correctamente')
        setFormData({
          title: '',
          body: '',
          type: 'GENERAL',
        })
        loadNotifications()
      } else {
        alert('Error al enviar la notificación')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  return (
    <AdminLayout>
      <div className="admin-notifications-page">
        <h2>Gestionar Notificaciones</h2>

        <div className="notifications-container">
          <div className="notification-form-card">
            <h3>Enviar Notificación</h3>
            <form onSubmit={handleSubmit} className="notification-form">
              <div className="form-group">
                <label htmlFor="title">Título *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Nueva ruta disponible"
                />
              </div>

              <div className="form-group">
                <label htmlFor="body">Mensaje *</label>
                <textarea
                  id="body"
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  required
                  placeholder="Escribe el mensaje de la notificación"
                  rows={5}
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Tipo de Notificación</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="GENERAL">General</option>
                  <option value="ROUTE">Sobre una Ruta</option>
                  <option value="REMINDER">Recordatorio</option>
                </select>
              </div>

              <button type="submit" className="btn-primary">
                Enviar a Todos los Socios
              </button>
            </form>
          </div>

          <div className="notification-history-card">
            <h3>Historial de Notificaciones</h3>
            {isLoading ? (
              <p className="info-message">Cargando notificaciones...</p>
            ) : notifications.length === 0 ? (
              <p className="info-message">No hay notificaciones enviadas aún</p>
            ) : (
              <table className="notifications-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Enviado</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification.notification_id}>
                      <td>{notification.title}</td>
                      <td>{notification.type}</td>
                      <td>
                        <span className={`status-badge status-${notification.status.toLowerCase()}`}>
                          {notification.status === 'SENT' && 'Enviado'}
                          {notification.status === 'PENDING' && 'Pendiente'}
                        </span>
                      </td>
                      <td>{new Date(notification.sent_at || notification.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminNotifications
