import { useState } from 'react'
import type { Menu } from '../model/menu.types'
import { BottomSheet } from '@/shared/ui/BottomSheet'
import { QuantityControl } from '@/shared/ui/QuantityControl'
import { PriceDisplay } from '@/shared/ui/PriceDisplay'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'

interface MenuDetailSheetProps {
  menu: Menu | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (menu: Menu, quantity: number) => void
}

export function MenuDetailSheet({ menu, isOpen, onClose, onAddToCart }: MenuDetailSheetProps) {
  const [quantity, setQuantity] = useState(1)

  if (!menu) return null

  const handleAdd = () => {
    onAddToCart(menu, quantity)
    setQuantity(1)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="메뉴 상세">
      {menu.imageUrl ? (
        <img
          src={menu.imageUrl}
          alt={menu.name}
          width={400}
          height={300}
          className="w-full rounded-lg object-cover"
          style={{ aspectRatio: '4/3' }}
        />
      ) : null}
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-gray-900">{menu.name}</h3>
          {menu.badge ? <Badge variant={menu.badge} /> : null}
        </div>
        <PriceDisplay amount={menu.price} className="mt-1 text-lg font-semibold text-gray-900" />
        {menu.description ? (
          <p className="mt-3 text-sm text-gray-600">{menu.description}</p>
        ) : null}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-gray-600">수량</span>
        <QuantityControl
          quantity={quantity}
          onIncrease={() => setQuantity((q) => Math.min(q + 1, 99))}
          onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
        />
      </div>
      <Button
        onClick={handleAdd}
        className="mt-6 w-full"
        data-testid="menu-detail-add-to-cart"
      >
        장바구니 추가 · <PriceDisplay amount={menu.price * quantity} />
      </Button>
    </BottomSheet>
  )
}
