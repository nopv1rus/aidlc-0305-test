import type { AxiosError } from 'axios'

const MAX_RETRIES = 3
const BASE_DELAY = 1000

export function shouldRetry(error: AxiosError, attempt: number): boolean {
  if (attempt >= MAX_RETRIES) return false
  if (error.config?.method !== 'get') return false
  if (error.response?.status === 429) return true
  if (!error.response) return true // network error
  if (error.response.status >= 500) return true
  return false
}

export function getRetryDelay(attempt: number, error: AxiosError): number {
  const retryAfter = error.response?.headers?.['retry-after']
  if (retryAfter) return parseInt(retryAfter, 10) * 1000
  return BASE_DELAY * Math.pow(2, attempt - 1)
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
