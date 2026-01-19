import { useNavigate } from 'react-router-dom'
import './Main.css'

function Main() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    navigate('/login')
  }

  return (
    <div className="main-container">
      <div className="main-header">
        <div className="main-header-content">
          <h1 className="main-company-name">동아스틸</h1>
          <h2 className="main-app-name">PDA</h2>
          <p className="main-subtitle">물류 관리 시스템</p>
          <button className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
      
      <div className="main-content">
        <h2 className="main-title">주요 기능</h2>
        
        <div className="function-cards">
          <div 
            className="function-card card-orange"
            onClick={() => navigate('/location-management')}
          >
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FFA500" stroke="#FFA500" strokeWidth="2"/>
                <path d="M2 17L12 22L22 17" stroke="#FFA500" strokeWidth="2"/>
                <path d="M2 12L12 17L22 12" stroke="#FFA500" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="card-title">적재위치관리</h3>
            <p className="card-subtitle">적재위치 관리</p>
          </div>
          
          <div 
            className="function-card card-green"
            onClick={() => navigate('/slitting-input')}
          >
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="6" width="16" height="12" fill="#4CAF50" stroke="#4CAF50" strokeWidth="2"/>
                <path d="M8 10H16M8 14H16" stroke="white" strokeWidth="2"/>
                <path d="M12 6V18" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="card-title">슬리팅 투입</h3>
            <p className="card-subtitle">슬리팅 투입 처리</p>
          </div>
          
          <div 
            className="function-card card-blue"
            onClick={() => navigate('/loading-registration')}
          >
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="8" width="20" height="12" rx="2" fill="#2196F3" stroke="#2196F3" strokeWidth="2"/>
                <path d="M6 8V6C6 4.89543 6.89543 4 8 4H16C17.1046 4 18 4.89543 18 6V8" stroke="white" strokeWidth="2"/>
                <path d="M8 12H16" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="card-title">상차등록</h3>
            <p className="card-subtitle">상차 등록 처리</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main








