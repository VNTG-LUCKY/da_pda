import axios from 'axios'

// API base URL (리버스 프록시 방식)
// - 브라우저는 항상 같은 출처(현재 페이지 주소)로만 요청 → 61.107.76.23에서는 3000만 사용
// - 3000 서버(start-preview)가 /api를 내부에서 6000으로 프록시 (Chrome은 6000 포트 직접 접속 차단됨)
// - 개발: 빈 문자열 → Vite가 /api를 5000으로 프록시. 로컬 미리보기: localhost:5000
const getBaseURL = () => {
  if (import.meta.env.DEV) return ''
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000'
  }
  // 배포 서버(61.107.76.23 등): 절대 6000 직접 호출 금지. 같은 출처(3000)만 사용.
  return ''
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
