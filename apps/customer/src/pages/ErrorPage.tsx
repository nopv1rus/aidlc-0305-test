import { useLocation } from 'react-router-dom'

export function ErrorPage() {
  const location = useLocation()
  const message = (location.state as { message?: string })?.message
    ?? '유효하지 않은 QR코드입니다. 테이블의 QR코드를 다시 스캔해주세요.'

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-lg font-semibold text-gray-900">접속할 수 없습니다</p>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
    </div>
  )
}
