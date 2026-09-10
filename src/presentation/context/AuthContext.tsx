import React, { createContext, useContext, useState, useEffect } from 'react'

interface Member {
  memberId: string
  roleId: string
  email: string
  firstName: string
  lastName: string
  dni?: string
  birthDate?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  membershipNumber?: string
  status: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  profilePicture?: string
  isAdmin: boolean
}

interface AuthContextType {
  user: Member | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<{ token: string; member: Member }>
  logout: () => void
  updateProfile: (data: Partial<Member>) => Promise<void>
  updateUserData: (userData: Member) => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  dni?: string
  birthDate?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ERROR_MESSAGES: Record<string, string> = {
  'failed to fetch': 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
  'login failed': 'Error al iniciar sesión. Verifica tus credenciales.',
  'registration failed': 'Error al registrarse. Intenta nuevamente.',
  'profile update failed': 'Error al actualizar el perfil. Intenta nuevamente.',
  'password change failed': 'Error al cambiar la contraseña. Intenta nuevamente.',
  'no user logged in': 'No hay usuario autenticado.',
  'network error': 'Error de red. Por favor, verifica tu conexión.',
  'unauthorized': 'No tienes permiso para realizar esta acción. Por favor, inicia sesión nuevamente.',
  '401': 'No tienes permiso para realizar esta acción. Por favor, inicia sesión nuevamente.',
}

const translateError = (message: string): string => {
  const lowercaseMsg = message.toLowerCase()
  for (const [key, translation] of Object.entries(ERROR_MESSAGES)) {
    if (lowercaseMsg.includes(key)) {
      return translation
    }
  }
  return message || 'Ocurrió un error. Intenta nuevamente.'
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Member | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const data = await response.json()
      setToken(data.token)
      setUser(data.member)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.member))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch'
      throw new Error(translateError(message))
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Registration failed')
      }

      const responseData = await response.json()
      setToken(responseData.token)
      setUser(responseData.member)
      localStorage.setItem('token', responseData.token)
      localStorage.setItem('user', JSON.stringify(responseData.member))
      return responseData
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch'
      throw new Error(translateError(message))
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const updateProfile = async (data: Partial<Member>) => {
    if (!user) throw new Error('No user logged in')
    if (!token) throw new Error('No token available')

    try {
      const response = await fetch(`${API_BASE_URL}/members/${user.memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Profile update failed')
      }

      const updatedMember = await response.json()
      setUser(updatedMember)
      localStorage.setItem('user', JSON.stringify(updatedMember))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch'
      throw new Error(translateError(message))
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/members/${user.memberId}/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Password change failed')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch'
      throw new Error(translateError(message))
    }
  }

  const updateUserData = (userData: Member) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateProfile, updateUserData, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
