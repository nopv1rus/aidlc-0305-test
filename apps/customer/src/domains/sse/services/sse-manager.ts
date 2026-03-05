import { useSSEStore } from '../store/sse.store'
import { useOrderStore } from '@/domains/order/store/order.store'
import { useSessionStore } from '@/domains/session/store/session.store'
import { useCartStore } from '@/domains/cart/store/cart.store'
import type { OrderStatusChangedEvent } from '../model/sse.types'

const MAX_RETRIES = 5
const RETRY_DELAY = 3000

let eventSource: EventSource | null = null
let retryTimer: ReturnType<typeof setTimeout> | null = null

export function connectSSE(storeId: string, tableId: string): void {
  disconnectSSE()

  const useMock = import.meta.env.VITE_USE_MOCK === 'true'
  if (useMock) {
    useSSEStore.getState().setConnected(true)
    return
  }

  const url = `/api/sse/customer/${storeId}/${tableId}`
  eventSource = new EventSource(url)

  eventSource.onopen = () => {
    useSSEStore.getState().setConnected(true)
    useSSEStore.getState().resetRetry()
  }

  eventSource.addEventListener('ORDER_STATUS_CHANGED', (e) => {
    try {
      const data = JSON.parse(e.data) as OrderStatusChangedEvent
      useOrderStore.getState().updateOrderStatus(data.orderId, data.status)
    } catch {
      // 파싱 실패 무시
    }
  })

  eventSource.addEventListener('SESSION_ENDED', () => {
    useSessionStore.getState().clearSession()
    useCartStore.getState().clearCart()
    disconnectSSE()
  })

  eventSource.onerror = () => {
    useSSEStore.getState().setConnected(false)
    eventSource?.close()
    eventSource = null

    const { retryCount } = useSSEStore.getState()
    if (retryCount < MAX_RETRIES) {
      useSSEStore.getState().incrementRetry()
      retryTimer = setTimeout(() => connectSSE(storeId, tableId), RETRY_DELAY)
    }
  }

  // 페이지 포커스 복귀 시 연결 확인
  const handleVisibility = () => {
    if (document.visibilityState === 'visible' && !useSSEStore.getState().isConnected) {
      useSSEStore.getState().resetRetry()
      connectSSE(storeId, tableId)
    }
  }
  document.addEventListener('visibilitychange', handleVisibility)
}

export function disconnectSSE(): void {
  if (retryTimer) {
    clearTimeout(retryTimer)
    retryTimer = null
  }
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
  useSSEStore.getState().setConnected(false)
}
