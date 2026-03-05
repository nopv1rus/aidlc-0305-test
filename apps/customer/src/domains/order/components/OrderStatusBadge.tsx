import type { OrderStatus } from '../model/order.types'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: '대기중', className: 'bg-yellow-100 text-yellow-800' },
  preparing: { label: '준비중', className: 'bg-blue-100 text-blue-800' },
  completed: { label: '완료', className: 'bg-green-100 text-green-800' },
  cancelled: { label: '취소됨', className: 'bg-gray-100 text-gray-600' },
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
      data-testid={`order-status-${status}`}
    >
      {config.label}
    </span>
  )
}
