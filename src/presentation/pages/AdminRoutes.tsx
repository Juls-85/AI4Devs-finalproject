import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import '../styles/admin-routes.css'

interface Route {
  route_id: string
  title: string
  description?: string
  difficulty?: string
  distance_km?: number
  departure_date?: string
  status: string
  base_price?: number
  created_at: string
}

const AdminRoutes: React.FC = () => {
  const [showForm, setShowForm] = useState(false)
  const [routes, setRoutes] = useState<Route[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRoutes()
  }, [])

  const loadRoutes = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:3000/api/v1/admin/routes', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setRoutes(data)
      }
    } catch (error) {
      console.error('Error loading routes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'MEDIUM',
    distance_km: '',
    meeting_point: '',
    departure_date: '',
    departure_time: '',
    return_date: '',
    has_lodging: false,
    has_restaurant: false,
    base_price: '',
    lodging_price: '',
    restaurant_price: '',
    total_price: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const isCheckbox = type === 'checkbox'
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const cleanData = {
      ...formData,
      departure_date: formData.departure_date || null,
      return_date: formData.return_date || null,
      distance_km: formData.distance_km ? parseFloat(formData.distance_km as any) : null,
      base_price: formData.base_price ? parseFloat(formData.base_price as any) : null,
      lodging_price: formData.lodging_price ? parseFloat(formData.lodging_price as any) : null,
      restaurant_price: formData.restaurant_price ? parseFloat(formData.restaurant_price as any) : null,
      total_price: formData.total_price ? parseFloat(formData.total_price as any) : null,
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/admin/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanData),
      })

      if (response.ok) {
        alert('Ruta creada correctamente')
        setFormData({
          title: '',
          description: '',
          difficulty: 'MEDIUM',
          distance_km: '',
          meeting_point: '',
          departure_date: '',
          departure_time: '',
          return_date: '',
          has_lodging: false,
          has_restaurant: false,
          base_price: '',
          lodging_price: '',
          restaurant_price: '',
          total_price: '',
        })
        setShowForm(false)
        loadRoutes()
      } else {
        alert('Error al crear la ruta')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  return (
    <AdminLayout>
      <div className="admin-routes-page">
        <div className="page-header">
          <h2>Gestionar Rutas</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancelar' : '+ Nueva Ruta'}
          </button>
        </div>

        {showForm && (
          <div className="route-form-container">
            <form onSubmit={handleSubmit} className="route-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Título de la ruta *</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Ruta por la Sierra de Guadarrama"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe la ruta en detalle"
                    rows={4}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="difficulty">Dificultad</label>
                  <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                    <option value="EASY">Fácil</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HARD">Difícil</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="distance_km">Distancia (km)</label>
                  <input
                    id="distance_km"
                    name="distance_km"
                    type="number"
                    value={formData.distance_km}
                    onChange={handleChange}
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="meeting_point">Punto de encuentro</label>
                  <input
                    id="meeting_point"
                    name="meeting_point"
                    type="text"
                    value={formData.meeting_point}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="departure_date">Fecha de salida</label>
                  <input
                    id="departure_date"
                    name="departure_date"
                    type="date"
                    value={formData.departure_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="departure_time">Hora de salida</label>
                  <input
                    id="departure_time"
                    name="departure_time"
                    type="time"
                    value={formData.departure_time}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="return_date">Fecha de regreso</label>
                  <input
                    id="return_date"
                    name="return_date"
                    type="date"
                    value={formData.return_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="base_price">Precio base</label>
                  <input
                    id="base_price"
                    name="base_price"
                    type="number"
                    value={formData.base_price}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lodging_price">Precio alojamiento</label>
                  <input
                    id="lodging_price"
                    name="lodging_price"
                    type="number"
                    value={formData.lodging_price}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="restaurant_price">Precio restaurante</label>
                  <input
                    id="restaurant_price"
                    name="restaurant_price"
                    type="number"
                    value={formData.restaurant_price}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group checkbox">
                  <label htmlFor="has_lodging">
                    <input
                      id="has_lodging"
                      name="has_lodging"
                      type="checkbox"
                      checked={formData.has_lodging}
                      onChange={handleChange}
                    />
                    Incluye alojamiento
                  </label>
                </div>

                <div className="form-group checkbox">
                  <label htmlFor="has_restaurant">
                    <input
                      id="has_restaurant"
                      name="has_restaurant"
                      type="checkbox"
                      checked={formData.has_restaurant}
                      onChange={handleChange}
                    />
                    Incluye restaurante
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Crear Ruta
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="routes-list">
          <h3>Rutas Creadas</h3>
          {isLoading ? (
            <p className="info-message">Cargando rutas...</p>
          ) : routes.length === 0 ? (
            <p className="info-message">No hay rutas creadas aún</p>
          ) : (
            <table className="routes-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Dificultad</th>
                  <th>Distancia (km)</th>
                  <th>Fecha Salida</th>
                  <th>Precio Base</th>
                  <th>Estado</th>
                  <th>Creado</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.route_id}>
                    <td>{route.title}</td>
                    <td>{route.difficulty || '-'}</td>
                    <td>{route.distance_km || '-'}</td>
                    <td>{route.departure_date ? new Date(route.departure_date).toLocaleDateString() : '-'}</td>
                    <td>${route.base_price || '-'}</td>
                    <td>
                      <span className={`status-badge status-${route.status.toLowerCase().replace(/_/g, '_')}`}>
                        {route.status === 'PUBLISHED' && 'Publicado'}
                        {route.status === 'PROPOSAL' && 'Propuesta'}
                        {route.status === 'PENDING_REVIEW' && 'Pendiente de Revisión'}
                        {route.status === 'DRAFT' && 'Borrador'}
                      </span>
                    </td>
                    <td>{new Date(route.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminRoutes
