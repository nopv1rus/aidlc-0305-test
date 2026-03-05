import axios, { AxiosError } from 'axios'
import { shouldRetry, getRetryDelay, wait } from './retry'
import { toAppError } from './error-handler'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: 세션 토큰 주입
axiosInstance.interceptors.request.use((config) => {
  return config
})

// Response interceptor: 에러 변환 + 재시도
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config
    if (!config) throw toAppError(error)

    const retryCount = ((config as unknown as Record<string, unknown>).__retryCount as number) ?? 0

    if (shouldRetry(error, retryCount)) {
      ;(config as unknown as Record<string, unknown>).__retryCount = retryCount + 1
      const delay = getRetryDelay(retryCount + 1, error)
      await wait(delay)
      return axiosInstance(config)
    }

    throw toAppError(error)
  },
)

export { useMock }
