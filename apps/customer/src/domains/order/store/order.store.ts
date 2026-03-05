import { create } from 'zustand'
import type { Order, OrderStatus } from '../model/order.types'
import type { CartItem } from '@/domains/cart/model/cart.types'
import { createOrder as createOrderApi, fetchOrders as fetchOrdersApi } from '../api/order.api'
import { toAppError } from '@/shared/api/error-handler'

interface OrderStore {
  orders: Order[]
  isSubmitting: boolean
  submitError: string | null
  isLoading: boolean
  createOrder: (
    storeId: string,
    tableId: string,
    sessionId: string | null,
    items: CartItem[],
  ) => Promise<Order>
  fetchOrders: (sessionId: string) => Promise<void>
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  clearOrders: () => void
}

export const useOrderStore = create<OrderStore>((set, _get) => ({
  orders: [],
  isSubmitting: false,
  submitError: null,
  isLoading: false,

  createOrder: async (storeId, tableId, sessionId, items) => {
    set({ isSubmitting: true, submitError: null })
    try {
      const res = await createOrderApi({
        storeId,
        tableId,
        sessionId,
        items: items.map((i) => ({ menuId: i.menuId, quantity: i.quantity })),
      })
      const order: Order = {
        id: res.id,
        orderNumber: res.orderNumber,
        status: res.status,
        totalAmount: res.totalAmount,
        items: res.items,
        createdAt: res.createdAt,
      }
      set((state) => ({
        orders: [order, ...state.orders],
        isSubmitting: false,
      }))
      return order
    } catch (err) {
      const appErr = toAppError(err)
      set({ isSubmitting: false, submitError: appErr.userMessage })
      throw appErr
    }
  },

  fetchOrders: async (sessionId) => {
    set({ isLoading: true })
    try {
      const res = await fetchOrdersApi(sessionId)
      set({ orders: res.orders, isLoading: false })
    } catch (err) {
      const appErr = toAppError(err)
      set({ isLoading: false })
      throw appErr
    }
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o,
      ),
    }))
  },

  clearOrders: () => set({ orders: [] }),
}))