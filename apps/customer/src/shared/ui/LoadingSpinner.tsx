interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({ message = '로딩 중…' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12" role="status" aria-label={message}>
      <div
        className="h-8 w-8 animate-spin rounded-full border-3 border-gray-200 border-t-blue-600"
        aria-hidden="true"
      />
      <p className="mt-3 text-sm text-gray-500">{message}</p>
    </div>
  )
}
