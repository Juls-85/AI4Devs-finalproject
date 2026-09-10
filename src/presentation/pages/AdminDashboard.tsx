import React from 'react'
import AdminLayout from '../components/AdminLayout'
import '../styles/admin-dashboard.css'

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="dashboard-welcome">
        <h2>Bienvenido al Panel Administrativo</h2>
        <p>Gestiona rutas, propuestas, notificaciones y eventos del calendario desde aquí.</p>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon">🛣️</div>
            <h3>Gestionar Rutas</h3>
            <p>Crea, edita y administra todas las rutas del club.</p>
            <a href="/admin/routes" className="btn-primary">Ir a Rutas</a>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📝</div>
            <h3>Propuestas Pendientes</h3>
            <p>Revisa y aprueba las propuestas de rutas de los socios.</p>
            <a href="/admin/proposals" className="btn-primary">Ver Propuestas</a>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📧</div>
            <h3>Notificaciones</h3>
            <p>Envía notificaciones y comunicaciones a los socios.</p>
            <a href="/admin/notifications" className="btn-primary">Gestionar Notificaciones</a>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📅</div>
            <h3>Calendario</h3>
            <p>Administra eventos y actividades del calendario.</p>
            <a href="/admin/calendar" className="btn-primary">Ver Calendario</a>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
