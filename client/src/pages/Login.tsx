import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void
}

const LAST_USERNAME_KEY = 'da_pda_last_username'

function Login({ setIsAuthenticated }: LoginProps) {
  const [username, setUsername] = useState(() => localStorage.getItem(LAST_USERNAME_KEY) || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [exited, setExited] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (username === 'dapda' && password === '1234') {
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem(LAST_USERNAME_KEY, username)
      localStorage.setItem('username', username)
      setIsAuthenticated(true)
      navigate('/main')
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  const handleExit = () => {
    const keysToPreserve = [
      LAST_USERNAME_KEY,
      'main_card_order',
      'darkMode',
      'pda_wake_lock',
      'pda_font_size',
      'pda_sound_enabled',
      'pda_vibration_enabled',
      'pda_scan_history',
    ]
    const saved: Record<string, string> = {}
    keysToPreserve.forEach(k => {
      const v = localStorage.getItem(k)
      if (v !== null) saved[k] = v
    })
    localStorage.clear()
    sessionStorage.clear()
    Object.entries(saved).forEach(([k, v]) => localStorage.setItem(k, v))
    setExited(true)
    window.close()
  }

  const handleRestart = () => {
    window.location.replace(window.location.origin + '/login')
  }

  if (exited) {
    return (
      <div className="login-container">
        <div className="login-exit-screen">
          <div className="login-exit-icon">&#x2714;</div>
          <p className="login-exit-title">프로그램이 종료되었습니다</p>
          <p className="login-exit-desc">캐시가 삭제되었습니다.<br />뒤로 가기 버튼을 눌러 완전히 닫아주세요.</p>
          <button type="button" className="login-exit-restart" onClick={handleRestart}>
            다시 시작
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="login-header-content">
          <h1 className="login-company-name">동아스틸</h1>
          <h2 className="login-app-name">PDA</h2>
          <p className="login-subtitle">물류 관리 시스템</p>
        </div>
      </div>
      
      <div className="login-form-container">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
              required
            />
          </div>
          
          <div className="login-input-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          
          {error && <div className="login-error">{error}</div>}
          
          <button type="submit" className="login-button">
            로그인
          </button>

          <button type="button" className="login-exit-button" onClick={handleExit}>
            프로그램 종료
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login











