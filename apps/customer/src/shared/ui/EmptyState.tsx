interface EmptyStateProps {
  message: string
  description?: string
}

export function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-state">
      <p className="text-base font-medium text-gray-500">{message}</p>
      {description ? <p className="mt-1 text-sm text-gray-400">{description}</p> : null}
    </div>
  )
}
