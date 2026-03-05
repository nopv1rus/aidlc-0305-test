import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorMessage({ message, onRetry, retryLabel = '다시 시도' }: ErrorMessageProps) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 p-4"
      role="alert"
      aria-live="assertive"
      data-testid="error-message"
    >
      <div className="flex items-start gap-3">
        <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm text-red-800">{message}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              data-testid="error-retry-button"
            >
              {retryLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
