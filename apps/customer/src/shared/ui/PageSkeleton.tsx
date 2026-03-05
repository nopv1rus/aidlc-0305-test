export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4" role="status" aria-label="페이지 로딩 중…">
      <div className="h-8 w-2/3 rounded bg-gray-200" />
      <div className="space-y-3">
        <div className="h-24 rounded-lg bg-gray-200" />
        <div className="h-24 rounded-lg bg-gray-200" />
        <div className="h-24 rounded-lg bg-gray-200" />
      </div>
    </div>
  )
}
