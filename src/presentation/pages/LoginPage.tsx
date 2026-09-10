import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/auth.css'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      setTimeout(() => {
        navigate('/')
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Iniciar sesión</h1>
        <p className="subtitle">Bienvenido de nuevo a Frapen Angels</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
            <Link to="/" className="btn-cancel">
              Atrás
            </Link>
          </div>
        </form>

        <p className="auth-link">
          ¿No tienes cuenta? <Link to="/auth/register">Regístrate aquí</Link>
        </p>

        <p className="auth-link">
          ¿Olvidaste tu contraseña? <Link to="/auth/forgot-password">Recupérala aquí</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
