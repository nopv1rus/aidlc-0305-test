import { useCallback } from 'react'
import { useOrderStore } from '../store/order.store'
import { useCartStore } from '@/domains/cart/store/cart.store'
import { useSessionStore } from '@/domains/session/store/session.store'
import { useNetworkStore } from '@/shared/network/network.store'
import { enqueueOrder } from '@/shared/network/order-queue'

export function useOrderSubmit() {
  const createOrder = useOrderStore((s) => s.createOrder)
  const isSubmitting = useOrderStore((s) => s.isSubmitting)
  const submitError = useOrderStore((s) => s.submitError)
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const session = useSessionStore((s) => s.session)
  const isOnline = useNetworkStore((s) => s.isOnline)

  const submit = useCallback(async () => {
    if (!session || items.length === 0) return null

    if (!isOnline) {
      enqueueOrder(session.tableToken, {
        id: `queued-${Date.now()}`,
        payload: {
          storeId: session.storeId,
          tableId: session.tableId,
          sessionId: session.sessionId || null,
          items: items.map((i) => ({ menuId: i.menuId, quantity: i.quantity })),
        },
      })
      clearCart()
      return null
    }

    const order = await createOrder(
      session.storeId,
      session.tableId,
      session.sessionId || null,
      items,
    )
    clearCart()
    return order
  }, [session, items, isOnline, createOrder, clearCart])

  return { submit, isSubmitting, submitError, canSubmit: items.length > 0 }
}
