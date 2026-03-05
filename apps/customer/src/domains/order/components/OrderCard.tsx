import type { Order } from '../model/order.types'
import { OrderStatusBadge } from './OrderStatusBadge'
import { PriceDisplay } from '@/shared/ui/PriceDisplay'
import { formatTime } from '@/shared/utils/format'

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4" data-testid={`order-card-${order.id}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">{order.orderNumber}</span>
          <OrderStatusBadge status={order.status} />
        </div>
        <span className="text-xs text-gray-500">{formatTime(order.createdAt)}</span>
      </div>
      <div className="mt-2 space-y-0.5">
        {order.items.map((item, idx) => (
          <p key={idx} className="text-sm text-gray-600 truncate min-w-0">
            {item.menuName} ×{item.quantity}
          </p>
        ))}
      </div>
      <div className="mt-2 flex justify-end border-t border-gray-100 pt-2">
        <PriceDisplay amount={order.totalAmount} className="text-sm font-semibold text-gray-900" />
      </div>
    </div>
  )
}
