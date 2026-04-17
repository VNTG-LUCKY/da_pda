import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Main from './pages/Main'
import LocationManagement from './pages/LocationManagement'
import SlittingInput from './pages/SlittingInput'
import LoadingRegistration from './pages/LoadingRegistration'
import './App.css'

export type FontSizeLevel = 'small' | 'medium' | 'large'

const FONT_SIZE_MAP: Record<FontSizeLevel, string> = {
  small:  '13px',
  medium: '16px',
  large:  '19px',
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  // ── 화면 꺼짐 방지 ──────────────────────────────────────────
  const [isWakeLock, setIsWakeLock] = useState(() => {
    return localStorage.getItem('pda_wake_lock') === 'true'
  })
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  // ── 글꼴 크기 ────────────────────────────────────────────────
  const [fontSizeLevel, setFontSizeLevel] = useState<FontSizeLevel>(() => {
    const saved = localStorage.getItem('pda_font_size')
    return (saved === 'small' || saved === 'large') ? saved : 'medium'
  })

  // ── 바코드 입력 딜레이 ────────────────────────────────────────
  const [barcodeDelay, setBarcodeDelay] = useState<number>(() => {
    const saved = localStorage.getItem('pda_barcode_delay')
    const n = parseInt(saved ?? '100', 10)
    return isNaN(n) ? 100 : n
  })

  // 인증 해제 시 localStorage 정리
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem('isAuthenticated')
    }
  }, [isAuthenticated])

  // 다크 모드 적용
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', String(isDarkMode))
  }, [isDarkMode])

  // Wake Lock 획득/해제
  useEffect(() => {
    localStorage.setItem('pda_wake_lock', String(isWakeLock))

    if (!isWakeLock || !('wakeLock' in navigator)) {
      wakeLockRef.current?.release().catch(() => {})
      wakeLockRef.current = null
      return
    }

    const acquire = async () => {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
      } catch { /* 권한 거부 등 무시 */ }
    }

    acquire()

    // 화면이 다시 visible 될 때 자동 재획득
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') acquire()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      wakeLockRef.current?.release().catch(() => {})
      wakeLockRef.current = null
    }
  }, [isWakeLock])

  // 글꼴 크기 적용
  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SIZE_MAP[fontSizeLevel]
    localStorage.setItem('pda_font_size', fontSizeLevel)
  }, [fontSizeLevel])

  // 바코드 딜레이 저장
  useEffect(() => {
    localStorage.setItem('pda_barcode_delay', String(barcodeDelay))
  }, [barcodeDelay])

  // 모바일 캐시 비우기
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (!isMobile) return
    if ('caches' in window) {
      caches.keys().then((names) => {
        Promise.all(names.map((name) => caches.delete(name))).catch(() => {})
      })
    }
  }, [])

  const sharedProps = {
    isDarkMode,
    setIsDarkMode,
    isWakeLock,
    setIsWakeLock,
    fontSizeLevel,
    setFontSizeLevel,
    barcodeDelay,
    setBarcodeDelay,
  }

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
              <Main setIsAuthenticated={setIsAuthenticated} {...sharedProps} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/location-management"
          element={
            isAuthenticated ? (
              <LocationManagement {...sharedProps} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/slitting-input"
          element={
            isAuthenticated ? (
              <SlittingInput {...sharedProps} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/loading-registration"
          element={
            isAuthenticated ? (
              <LoadingRegistration {...sharedProps} />
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
