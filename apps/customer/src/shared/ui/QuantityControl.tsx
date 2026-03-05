import { memo } from 'react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

interface QuantityControlProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  min?: number
  max?: number
}

export const QuantityControl = memo(function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
}: QuantityControlProps) {
  return (
    <div className="inline-flex items-center gap-2" data-testid="quantity-control">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="수량 감소"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-blue-500"
        data-testid="quantity-decrease"
      >
        <MinusIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="w-8 text-center tabular-nums text-sm font-medium" aria-label={`수량 ${quantity}개`}>
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label="수량 증가"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-blue-500"
        data-testid="quantity-increase"
      >
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
})
