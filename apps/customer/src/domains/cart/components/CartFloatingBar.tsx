import { useState, lazy, Suspense } from 'react'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '../store/cart.store'
import { PriceDisplay } from '@/shared/ui/PriceDisplay'

const CartBottomSheet = lazy(() =>
  import('./CartBottomSheet').then((m) => ({ default: m.CartBottomSheet })),
)

export function CartFloatingBar() {
  const items = useCartStore((s) => s.items)
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return totalCount > 0 ? (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-[480px]"
        style={{ paddingBottom: 'calc(0.75rem + var(--safe-area-bottom))' }}
      >
        <div className="mx-4">
          <button
            type="button"
            onClick={() => setIsSheetOpen(true)}
            aria-label={`장바구니 열기, ${totalCount}개 항목`}
            className="flex w-full items-center justify-between rounded-2xl bg-blue-600 px-5 py-4 text-white shadow-lg hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 transition-colors duration-150"
            data-testid="cart-floating-bar"
          >
            <div className="flex items-center gap-2">
              <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-medium">장바구니 {totalCount}개</span>
            </div>
            <PriceDisplay amount={totalAmount} className="text-sm font-bold" />
          </button>
        </div>
      </div>
      <div aria-live="polite" className="sr-only">
        장바구니에 {totalCount}개 항목이 있습니다
      </div>
      <Suspense fallback={null}>
        <CartBottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
      </Suspense>
    </>
  ) : null
}
