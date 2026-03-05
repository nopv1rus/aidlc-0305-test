import { useEffect } from 'react'
import { useOrderStore } from '../store/order.store'
import { useSessionStore } from '@/domains/session/store/session.store'
import { OrderCard } from './OrderCard'
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'
import { EmptyState } from '@/shared/ui/EmptyState'

export function OrderHistoryPage() {
  const orders = useOrderStore((s) => s.orders)
  const isLoading = useOrderStore((s) => s.isLoading)
  const fetchOrders = useOrderStore((s) => s.fetchOrders)
  const sessionId = useSessionStore((s) => s.session?.sessionId)

  useEffect(() => {
    if (sessionId) {
      fetchOrders(sessionId).catch(() => {})
    }
  }, [sessionId, fetchOrders])

  if (isLoading) return <LoadingSpinner message="주문 내역을 불러오는 중…" />

  if (orders.length === 0) {
    return <EmptyState message="아직 주문 내역이 없습니다" description="메뉴에서 주문해보세요." />
  }

  return (
    <div className="space-y-3 p-4" data-testid="order-history-page">
      <h2 className="text-lg font-bold text-gray-900">주문 내역</h2>
      <div aria-live="polite">
        {orders.map((order) => (
          <div key={order.id} className="mt-3">
            <OrderCard order={order} />
          </div>
        ))}
      </div>
    </div>
  )
}
