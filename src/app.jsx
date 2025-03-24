import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import Reservations from './components/Reservations'
import Calendar from './components/Calendar'
import Statistics from './components/Statistics'
import SideBar from './components/SideBar'
import './styles/index.css'

// Ce composant permet de gérer la logique avec navigation
function AuthenticatedApp({ token, onLogout }) {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <SideBar onLogout={onLogout} />
      <div style={{ flex: 1, overflowX: 'auto' }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard token={token} onLogout={onLogout} />} />
          <Route path="/reservations" element={<Reservations token={token} onLogout={onLogout} />} />
          <Route path="/stats" element={<Statistics token={token} onLogout={onLogout} />} />
          <Route path="/calendar" element={<Calendar token={token} onLogout={onLogout} />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  )
}

// Wrapper pour avoir accès à useNavigate
function AppWrapper({ token, setToken }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    setToken(null)
    navigate('/dashboard') // Forcer la redirection vers dashboard
  }

  return !token ? (
    <Routes>
      <Route path="*" element={<LoginForm onLoginSuccess={setToken} />} />
    </Routes>
  ) : (
    <AuthenticatedApp token={token} onLogout={handleLogout} />
  )
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  return (
    <Router basename="/admin">
      <AppWrapper token={token} setToken={setToken} />
    </Router>
  )
}
