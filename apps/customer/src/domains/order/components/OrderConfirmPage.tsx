import { useNavigate, useParams } from 'react-router-dom'
import { useCartStore } from '@/domains/cart/store/cart.store'
import { useOrderSubmit } from '../hooks/useOrderSubmit'
import { OrderItemList } from './OrderItemList'
import { PriceDisplay } from '@/shared/ui/PriceDisplay'
import { Button } from '@/shared/ui/Button'
import { ErrorMessage } from '@/shared/ui/ErrorMessage'
import { EmptyState } from '@/shared/ui/EmptyState'

export function OrderConfirmPage() {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const navigate = useNavigate()
  const { tableToken } = useParams<{ tableToken: string }>()
  const { submit, isSubmitting, submitError } = useOrderSubmit()

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handleSubmit = async () => {
    try {
      const order = await submit()
      if (order) {
        navigate(`/order/${tableToken}/success`, {
          state: { orderNumber: order.orderNumber },
          replace: true,
        })
      } else {
        // 오프라인 큐잉된 경우
        navigate(`/order/${tableToken}/success`, {
          state: { orderNumber: '오프라인 주문 접수' },
          replace: true,
        })
      }
    } catch {
      // submitError가 store에 설정됨
    }
  }

  if (items.length === 0) {
    return (
      <div className="p-4">
        <EmptyState message="장바구니가 비어있습니다" description="메뉴에서 항목을 추가해주세요." />
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" onClick={() => navigate(`/order/${tableToken}`)}>
            메뉴로 돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4" data-testid="order-confirm-page">
      <h2 className="text-lg font-bold text-gray-900">주문 확인</h2>
      <p className="mt-1 text-sm text-gray-500">수량을 수정할 수 있습니다.</p>

      <div className="mt-4">
        <OrderItemList items={items} editable onUpdateQuantity={updateQuantity} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-base font-semibold text-gray-900">총 금액</span>
        <PriceDisplay amount={totalAmount} className="text-xl font-bold text-gray-900" />
      </div>

      {submitError ? (
        <div className="mt-4">
          <ErrorMessage message={submitError} />
        </div>
      ) : null}

      <div className="mt-6 flex gap-3">
        <Button variant="secondary" onClick={() => navigate(-1)} className="flex-1" data-testid="order-back-button">
          돌아가기
        </Button>
        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          className="flex-1"
          data-testid="order-submit-button"
        >
          주문 확정
        </Button>
      </div>
    </div>
  )
}