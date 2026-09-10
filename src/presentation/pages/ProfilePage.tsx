import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/profile.css'

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture ? `data:image/jpeg;base64,${user.profilePicture}` : '')
  const [selectedPictureFile, setSelectedPictureFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
      })
      setProfilePicture(user.profilePicture ? `data:image/jpeg;base64,${user.profilePicture}` : '')
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await updateProfile(formData)

      if (selectedPictureFile && user) {
        const formDataToSend = new FormData()
        formDataToSend.append('picture', selectedPictureFile)

        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:3000/api/v1/members/${user.memberId}/picture`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Error al subir la foto')
        }

        const updatedMember = await response.json()
        localStorage.setItem('user', JSON.stringify(updatedMember))
        setSelectedPictureFile(null)
      }

      setSuccess('Perfil actualizado correctamente')
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedPictureFile(null)
    setProfilePicture(user?.profilePicture ? `data:image/jpeg;base64,${user.profilePicture}` : '')
    setError('')
    setSuccess('')
  }

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedPictureFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setProfilePicture(result)
    }
    reader.readAsDataURL(file)
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Mi perfil</h1>
        <div className="profile-actions">
          <Link to="/" className="btn-secondary">
            Volver a inicio
          </Link>
          <Link to={`/profile/${user.memberId}/password`} className="btn-secondary">
            Cambiar contraseña
          </Link>
          <button onClick={handleLogout} className="btn-danger">
            Cerrar sesión
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-card">
        <div className="profile-section">
          <h2>Información del perfil</h2>

          {!isEditing ? (
            <div className="profile-view">
              {profilePicture && (
                <div className="profile-field">
                  <label>Foto de perfil</label>
                  <img src={profilePicture} alt="Foto de perfil" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '4px' }} />
                </div>
              )}

              <div className="profile-field">
                <label>Número de membresía</label>
                <p>{user.membershipNumber}</p>
              </div>

              <div className="profile-field">
                <label>Correo electrónico</label>
                <p>{user.email}</p>
              </div>

              <div className="profile-field">
                <label>Nombre</label>
                <p>
                  {user.firstName} {user.lastName}
                </p>
              </div>

              {user.dni && (
                <div className="profile-field">
                  <label>DNI</label>
                  <p>{user.dni}</p>
                </div>
              )}

              {user.birthDate && (
                <div className="profile-field">
                  <label>Fecha de nacimiento</label>
                  <p>{new Date(user.birthDate).toLocaleDateString('es-ES')}</p>
                </div>
              )}

              {user.phone && (
                <div className="profile-field">
                  <label>Teléfono</label>
                  <p>{user.phone}</p>
                </div>
              )}

              {user.address && (
                <div className="profile-field">
                  <label>Dirección</label>
                  <p>{user.address}</p>
                </div>
              )}

              {user.city && (
                <div className="profile-field">
                  <label>Ciudad</label>
                  <p>{user.city}</p>
                </div>
              )}

              {user.postalCode && (
                <div className="profile-field">
                  <label>Código postal</label>
                  <p>{user.postalCode}</p>
                </div>
              )}

              {user.lastLoginAt && (
                <div className="profile-field">
                  <label>Último acceso</label>
                  <p>{new Date(user.lastLoginAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              )}

              <div className="profile-field">
                <label>Estado</label>
                <p>
                  <span className={`status-badge status-${user.status.toLowerCase()}`}>
                    {user.status === 'ACTIVE' && 'Activo'}
                    {user.status === 'INACTIVE' && 'Inactivo'}
                    {user.status === 'BLOCKED' && 'Bloqueado'}
                  </span>
                </p>
              </div>

              <button onClick={() => setIsEditing(true)} className="btn-primary">
                Editar perfil
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="picture">Foto de perfil</label>
                {profilePicture && (
                  <div style={{ marginBottom: '10px' }}>
                    <img src={profilePicture} alt="Foto de perfil" style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '4px' }} />
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Nombre</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Apellido</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

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

              <div className="form-actions">
                <button type="submit" disabled={isLoading} className="btn-primary">
                  {isLoading ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
