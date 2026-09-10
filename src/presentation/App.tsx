import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import HomePage from './pages/HomePage'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoutes from './pages/AdminRoutes'
import AdminProposals from './pages/AdminProposals'
import AdminNotifications from './pages/AdminNotifications'
import AdminCalendar from './pages/AdminCalendar'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/profile/:memberId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/profile/:memberId/password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/routes" element={<AdminRoute><AdminRoutes /></AdminRoute>} />
            <Route path="/admin/proposals" element={<AdminRoute><AdminProposals /></AdminRoute>} />
            <Route path="/admin/notifications" element={<AdminRoute><AdminNotifications /></AdminRoute>} />
            <Route path="/admin/calendar" element={<AdminRoute><AdminCalendar /></AdminRoute>} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
