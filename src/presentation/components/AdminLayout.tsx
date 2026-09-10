import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/admin-layout.css'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src="/assets/logo.png" alt="Logo de Frapen Angels" className="admin-logo-img" />
          <h2>Frapen Angels</h2>
          <p>Panel Administrativo</p>
        </div>

        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-link">
            <span>📊</span> Dashboard
          </Link>
          <Link to="/admin/routes" className="admin-nav-link">
            <span>🛣️</span> Gestionar Rutas
          </Link>
          <Link to="/admin/proposals" className="admin-nav-link">
            <span>📝</span> Propuestas Pendientes
          </Link>
          <Link to="/admin/notifications" className="admin-nav-link">
            <span>📧</span> Notificaciones
          </Link>
          <Link to="/admin/calendar" className="admin-nav-link">
            <span>📅</span> Calendario
          </Link>
        </nav>

        <div className="admin-user">
          <div className="admin-user-info">
            <p className="admin-user-name">{user?.firstName} {user?.lastName}</p>
            <p className="admin-user-email">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Panel Administrativo</h1>
          <Link to="/" className="btn-secondary">Volver a inicio</Link>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
