import { Link } from 'react-router-dom'
import '../styles/auth.css'

const ForgotPasswordPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Recuperar contraseña</h1>
        <p className="subtitle">Esta funcionalidad estará disponible próximamente</p>

        <div className="placeholder-message">
          <p>Por favor, contacta con soporte si necesitas recuperar tu contraseña.</p>
        </div>

        <p className="auth-link">
          <Link to="/auth/login">Volver a iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
