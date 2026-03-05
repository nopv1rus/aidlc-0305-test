import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 요청 인터셉터: JWT 토큰 자동 첨부
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 응답 인터셉터: 401 시 자동 로그아웃
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_info')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
