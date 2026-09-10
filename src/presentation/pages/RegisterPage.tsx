import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/auth.css'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dni: '',
    birthDate: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState('')
  const { register, updateUserData } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setProfilePictureFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setProfilePicturePreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const registerResponse = await register(formData)

      if (profilePictureFile && registerResponse) {
        const formDataToSend = new FormData()
        formDataToSend.append('picture', profilePictureFile)

        const response = await fetch(`http://localhost:3000/api/v1/members/${registerResponse.member.memberId}/picture`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${registerResponse.token}`,
          },
          body: formDataToSend,
        })

        if (response.ok) {
          const updatedMember = await response.json()
          updateUserData(updatedMember)
        } else {
          console.error('Error al subir la foto de perfil')
        }
      }

      setTimeout(() => {
        navigate('/')
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Registrarse</h1>
        <p className="subtitle">Crea tu cuenta de Frapen Angels</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Nombre *</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Apellido *</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dni">DNI</label>
              <input
                id="dni"
                name="dni"
                type="text"
                value={formData.dni}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthDate">Fecha de nacimiento</label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Dirección</label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Ciudad</label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Código postal</label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                value={formData.postalCode}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="picture">Foto de perfil (opcional)</label>
            {profilePicturePreview && (
              <div style={{ marginBottom: '10px' }}>
                <img src={profilePicturePreview} alt="Foto de perfil" style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '4px' }} />
              </div>
            )}
            <input
              id="picture"
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
            <Link to="/" className="btn-cancel">
              Cancelar
            </Link>
          </div>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/auth/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
