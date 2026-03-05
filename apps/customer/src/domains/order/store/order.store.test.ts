import { describe, it, expect, beforeEach } from 'vitest'
import { useOrderStore } from './order.store'

describe('OrderStore', () => {
  beforeEach(() => {
    useOrderStore.setState({ orders: [], isSubmitting: false, submitError: null, isLoading: false })
  })

  it('초기 상태', () => {
    const state = useOrderStore.getState()
    expect(state.orders).toHaveLength(0)
    expect(state.isSubmitting).toBe(false)
  })

  it('updateOrderStatus: 주문 상태 변경', () => {
    useOrderStore.setState({
      orders: [
        {
          id: 'o1',
          orderNumber: '#1',
          status: 'pending',
          totalAmount: 10000,
          items: [],
          createdAt: new Date().toISOString(),
        },
      ],
    })
    useOrderStore.getState().updateOrderStatus('o1', 'preparing')
    expect(useOrderStore.getState().orders[0]?.status).toBe('preparing')
  })

  it('clearOrders: 주문 초기화', () => {
    useOrderStore.setState({
      orders: [
        {
          id: 'o1',
          orderNumber: '#1',
          status: 'pending',
          totalAmount: 10000,
          items: [],
          createdAt: new Date().toISOString(),
        },
      ],
    })
    useOrderStore.getState().clearOrders()
    expect(useOrderStore.getState().orders).toHaveLength(0)
  })
})
