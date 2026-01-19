import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Main from './pages/Main'
import LocationManagement from './pages/LocationManagement'
import SlittingInput from './pages/SlittingInput'
import LoadingRegistration from './pages/LoadingRegistration'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/main" 
          element={
            isAuthenticated ? <Main /> : <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/location-management" 
          element={
            isAuthenticated ? <LocationManagement /> : <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/slitting-input" 
          element={
            isAuthenticated ? <SlittingInput /> : <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/loading-registration" 
          element={
            isAuthenticated ? <LoadingRegistration /> : <Navigate to="/login" replace />
          } 
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/main" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
