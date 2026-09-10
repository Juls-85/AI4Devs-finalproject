import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import '../styles/home.css'

const HomePage = () => {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <div className="home-container">
      {user && (
        <aside className="home-sidebar">
          <div className="sidebar-logo">
            <img src="/assets/logo.png" alt="Logo de Frapen Angels" className="sidebar-logo-img" />
            <h2>Frapen Angels</h2>
          </div>
          <nav className="sidebar-nav">
            <Link to="/" className="sidebar-link">
              🏠 Inicio
            </Link>
            <Link to={`/profile/${user.memberId}`} className="sidebar-link">
              👤 Mi Perfil
            </Link>
            {user.isAdmin && (
              <Link to="/admin" className="sidebar-link admin-link">
                ⚙️ Panel Admin
              </Link>
            )}
          </nav>
          <div className="sidebar-user">
            <div className="user-info">
              <p className="user-name">{user.firstName} {user.lastName}</p>
              <p className="user-email">{user.email}</p>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar sesión
            </button>
          </div>
        </aside>
      )}

      <div className="home-wrapper">
        <header className="home-header">
          {!user && (
            <div className="header-content">
              <img src="/assets/logo.png" alt="Logo de Frapen Angels" className="header-logo" />
            </div>
          )}
          {!user && (
            <nav className="header-nav">
              <Link to="/auth/login" className="btn-nav">
                Iniciar sesión
              </Link>
              <Link to="/auth/register" className="btn-nav btn-primary">
                Registrarse
              </Link>
            </nav>
          )}
        </header>

        <main className="home-main">
        <section className="hero">
          <div className="hero-content">
            <h2>Bienvenido a Frapen Angels</h2>
            <p>Tu plataforma de gestión del club de aventuras en moto</p>
            {!user && (
              <div className="hero-buttons">
                <Link to="/auth/login" className="btn btn-primary btn-large">
                  Iniciar sesión
                </Link>
                <Link to="/auth/register" className="btn btn-secondary btn-large">
                  Crear cuenta
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="features">
          <h2>Características</h2>
          <div className="features-grid">
            {user && (
              <>
                <button
                  className="feature-card feature-card-btn"
                  onClick={() => navigate(`/profile/${user.memberId}`)}
                >
                  <h3>Gestionar perfil</h3>
                  <p>Mantén tu información personal actualizada</p>
                </button>
                <button
                  className="feature-card feature-card-btn"
                  onClick={() => showToast('Función disponible próximamente', 'info')}
                >
                  <h3>Explorar rutas</h3>
                  <p>Descubre aventuras y actividades increíbles</p>
                </button>
                <button
                  className="feature-card feature-card-btn"
                  onClick={() => showToast('Función disponible próximamente', 'info')}
                >
                  <h3>Reservar</h3>
                  <p>Regístrate en rutas y eventos fácilmente</p>
                </button>
                <button
                  className="feature-card feature-card-btn"
                  onClick={() => showToast('Función disponible próximamente', 'info')}
                >
                  <h3>Realizar pagos</h3>
                  <p>Procesamiento seguro de pagos para reservas</p>
                </button>
                <button
                  className="feature-card feature-card-btn"
                  onClick={() => showToast('Función disponible próximamente', 'info')}
                >
                  <h3>Vista de calendario</h3>
                  <p>Ve todas las actividades próximas de un vistazo</p>
                </button>
                <button
                  className="feature-card feature-card-btn"
                  onClick={() => showToast('Función disponible próximamente', 'info')}
                >
                  <h3>Notificaciones</h3>
                  <p>Mantente actualizado con los anuncios del club</p>
                </button>
              </>
            )}
            {!user && (
              <>
                <div className="feature-card">
                  <h3>Gestionar perfil</h3>
                  <p>Mantén tu información personal actualizada</p>
                </div>
                <div className="feature-card">
                  <h3>Explorar rutas</h3>
                  <p>Descubre aventuras y actividades increíbles</p>
                </div>
                <div className="feature-card">
                  <h3>Reservar</h3>
                  <p>Regístrate en rutas y eventos fácilmente</p>
                </div>
                <div className="feature-card">
                  <h3>Realizar pagos</h3>
                  <p>Procesamiento seguro de pagos para reservas</p>
                </div>
                <div className="feature-card">
                  <h3>Vista de calendario</h3>
                  <p>Ve todas las actividades próximas de un vistazo</p>
                </div>
                <div className="feature-card">
                  <h3>Notificaciones</h3>
                  <p>Mantente actualizado con los anuncios del club</p>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="info">
          <h2>Sobre nosotros</h2>
          <p>Frapen Angels es una comunidad dedicada a organizar y gestionar actividades grupales, rutas y aventuras en moto. Únete a nosotros y descubre nuevas experiencias con personas afines.</p>
        </section>
      </main>

        <footer className="home-footer">
          <p>&copy; 2026 Frapen Angels. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
