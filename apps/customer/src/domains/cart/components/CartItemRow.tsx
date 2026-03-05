import { memo } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { QuantityControl } from '@/shared/ui/QuantityControl'
import { PriceDisplay } from '@/shared/ui/PriceDisplay'
import type { CartItem } from '../model/cart.types'

interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (menuId: string, quantity: number) => void
  onRemove: (menuId: string) => void
}

export const CartItemRow = memo(function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  return (
    <div className="flex items-center gap-3 py-3" data-testid={`cart-item-${item.menuId}`}>
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt=""
          width={48}
          height={48}
          loading="lazy"
          className="h-12 w-12 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100" aria-hidden="true">
          <span className="text-lg text-gray-300">🍽</span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
        <PriceDisplay amount={item.price * item.quantity} className="text-sm text-gray-600" />
      </div>
      <QuantityControl
        quantity={item.quantity}
        onIncrease={() => onUpdateQuantity(item.menuId, item.quantity + 1)}
        onDecrease={() => onUpdateQuantity(item.menuId, item.quantity - 1)}
      />
      <button
        type="button"
        onClick={() => onRemove(item.menuId)}
        aria-label={`${item.name} 삭제`}
        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 focus-visible:ring-2 focus-visible:ring-blue-500"
        data-testid={`cart-remove-${item.menuId}`}
      >
        <TrashIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
})
