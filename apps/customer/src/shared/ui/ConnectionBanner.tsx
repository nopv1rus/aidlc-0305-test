interface ConnectionBannerProps {
  isConnected: boolean
}

export function ConnectionBanner({ isConnected }: ConnectionBannerProps) {
  if (isConnected) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white"
      data-testid="connection-banner"
    >
      실시간 업데이트가 중단되었습니다. 새로고침해주세요.
    </div>
  )
}
