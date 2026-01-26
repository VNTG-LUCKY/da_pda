import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void
}

function Login({ setIsAuthenticated }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // 하드코딩된 로그인 정보
    if (username === 'dapda' && password === '1234') {
      localStorage.setItem('isAuthenticated', 'true')
      setIsAuthenticated(true)
      navigate('/main')
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
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
        </form>
      </div>
    </div>
  )
}

export default Login










