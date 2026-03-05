import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cart.store'
import { useSessionStore } from '@/domains/session/store/session.store'
import { BottomSheet } from '@/shared/ui/BottomSheet'
import { Button } from '@/shared/ui/Button'
import { PriceDisplay } from '@/shared/ui/PriceDisplay'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { EmptyState } from '@/shared/ui/EmptyState'
import { CartItemRow } from './CartItemRow'

interface CartBottomSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function CartBottomSheet({ isOpen, onClose }: CartBottomSheetProps) {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const tableToken = useSessionStore((s) => s.session?.tableToken)
  const navigate = useNavigate()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handleOrder = () => {
    onClose()
    navigate(`/order/${tableToken}/confirm`)
  }

  const handleClear = () => {
    clearCart()
    setShowClearConfirm(false)
  }

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} title="장바구니">
        {items.length === 0 ? (
          <EmptyState message="장바구니가 비어있습니다" />
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <CartItemRow
                  key={item.menuId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="text-base font-semibold text-gray-900">총 금액</span>
              <PriceDisplay amount={totalAmount} className="text-lg font-bold text-gray-900" />
            </div>
            <div className="mt-4 flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowClearConfirm(true)}
                className="flex-shrink-0"
                data-testid="cart-clear-button"
              >
                비우기
              </Button>
              <Button onClick={handleOrder} className="flex-1" data-testid="cart-order-button">
                주문하기
              </Button>
            </div>
          </>
        )}
      </BottomSheet>
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="장바구니 비우기"
        message="장바구니의 모든 항목을 삭제하시겠습니까?"
        confirmLabel="비우기"
        cancelLabel="취소"
        variant="danger"
        onConfirm={handleClear}
        onCancel={() => setShowClearConfirm(false)}
      />
    </>
  )
}
