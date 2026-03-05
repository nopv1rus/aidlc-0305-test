import { PriceDisplay } from '@/shared/ui/PriceDisplay'
import { QuantityControl } from '@/shared/ui/QuantityControl'
import type { CartItem } from '@/domains/cart/model/cart.types'

interface OrderItemListProps {
  items: CartItem[]
  editable?: boolean
  onUpdateQuantity?: (menuId: string, quantity: number) => void
}

export function OrderItemList({ items, editable = false, onUpdateQuantity }: OrderItemListProps) {
  return (
    <div className="divide-y divide-gray-100" data-testid="order-item-list">
      {items.map((item) => (
        <div key={item.menuId} className="flex items-center gap-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
            <PriceDisplay amount={item.price} className="text-xs text-gray-500" />
          </div>
          {editable && onUpdateQuantity ? (
            <QuantityControl
              quantity={item.quantity}
              onIncrease={() => onUpdateQuantity(item.menuId, item.quantity + 1)}
              onDecrease={() => onUpdateQuantity(item.menuId, item.quantity - 1)}
            />
          ) : (
            <span className="tabular-nums text-sm text-gray-600">×{item.quantity}</span>
          )}
          <PriceDisplay
            amount={item.price * item.quantity}
            className="w-20 text-right text-sm font-medium text-gray-900"
          />
        </div>
      ))}
    </div>
  )
}
