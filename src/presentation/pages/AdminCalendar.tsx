import React from 'react'
import AdminLayout from '../components/AdminLayout'
import '../styles/admin-calendar.css'

const AdminCalendar: React.FC = () => {
  return (
    <AdminLayout>
      <div className="admin-calendar-page">
        <h2>Gestionar Calendario</h2>

        <div className="calendar-info">
          <div className="info-card">
            <h3>📅 Calendario de Eventos</h3>
            <p>Administra los eventos y actividades del calendario del club. Próximamente: crear, editar y eliminar eventos de calendario.</p>
          </div>

          <div className="upcoming-events">
            <h3>Próximos Eventos</h3>
            <p className="info-message">Los eventos aparecerán aquí cuando se creen.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminCalendar
