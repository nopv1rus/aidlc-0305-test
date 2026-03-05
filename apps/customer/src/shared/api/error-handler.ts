import { AxiosError } from 'axios'
import { AppError } from '../errors/app-error'

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error

  if (error instanceof AxiosError) {
    if (!error.response) {
      return new AppError(
        'Network error',
        'NETWORK_ERROR',
        '네트워크 연결을 확인해주세요. Wi-Fi 또는 데이터를 확인 후 다시 시도해주세요.',
        true,
      )
    }

    const status = error.response.status

    if (status === 401) {
      return new AppError(
        'Session expired',
        'SESSION_EXPIRED',
        '세션이 만료되었습니다. QR코드를 다시 스캔해주세요.',
        false,
      )
    }

    if (status === 403) {
      return new AppError(
        'Forbidden',
        'SESSION_INVALID',
        '접근 권한이 없습니다.',
        false,
      )
    }

    if (status === 404) {
      return new AppError(
        'Not found',
        'UNKNOWN',
        '요청한 정보를 찾을 수 없습니다.',
        false,
      )
    }

    if (status === 429) {
      return new AppError(
        'Rate limited',
        'RATE_LIMITED',
        '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
        true,
      )
    }

    if (status >= 500) {
      return new AppError(
        `Server error: ${status}`,
        'SERVER_ERROR',
        '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        true,
      )
    }

    return new AppError(
      `HTTP ${status}`,
      'UNKNOWN',
      '주문 처리 중 문제가 발생했습니다. 다시 시도해주세요.',
      false,
    )
  }

  return new AppError(
    String(error),
    'UNKNOWN',
    '알 수 없는 오류가 발생했습니다.',
    false,
  )
}
