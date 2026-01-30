import axios from 'axios'

// API base URL 설정
// 개발 환경: Vite 프록시 사용 (상대 경로) → localhost:5000으로 프록시됨
// 프로덕션 환경: 현재 호스트의 5000 포트 사용
//   - 로컬에서 localhost:3000 접속 시 → http://localhost:5000
//   - 서버에서 172.17.1.56:3000 접속 시 → http://172.17.1.56:5000
const getBaseURL = () => {
  // 개발 환경 (npm run dev): Vite 프록시 사용
  if (import.meta.env.DEV) {
    // 빈 문자열 = 상대 경로 → Vite 프록시가 localhost:5000으로 전달
    return ''
  }
  
  // 프로덕션 환경 (npm run build 후 서빙)
  // 현재 접속한 호스트의 5000 포트를 백엔드로 사용
  const hostname = window.location.hostname

  // 로컬호스트인 경우
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000'
  }
  
  // 서버인 경우 (172.17.1.56 등)
  return `http://${hostname}:5000`
}

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 (디버깅용)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Response Error:', error)
    if (error.response) {
      console.error('Error Status:', error.response.status)
      console.error('Error Data:', error.response.data)
    } else if (error.request) {
      console.error('No response received:', error.request)
    } else {
      console.error('Error setting up request:', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient
