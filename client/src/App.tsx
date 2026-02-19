import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Main from './pages/Main'
import LocationManagement from './pages/LocationManagement'
import SlittingInput from './pages/SlittingInput'
import LoadingRegistration from './pages/LoadingRegistration'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem('isAuthenticated')
    }
  }, [isAuthenticated])

  // 휴대폰 등에서 접속 시 캐시 영향 최소화: Cache API 비우기 (매 방문 시)
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (!isMobile) return

    if ('caches' in window) {
      caches.keys().then((names) => {
        Promise.all(names.map((name) => caches.delete(name))).catch(() => {})
      })
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/main" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/main"
          element={
            isAuthenticated ? (
              <Main setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/location-management"
          element={
            isAuthenticated ? (
              <LocationManagement />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/slitting-input"
          element={
            isAuthenticated ? (
              <SlittingInput />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/loading-registration"
          element={
            isAuthenticated ? (
              <LoadingRegistration />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/main' : '/login'} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
