import { axiosInstance, useMock } from '@/shared/api/axios-instance'
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrdersResponse,
} from '../model/order.types'
import mockOrders from '@/mocks/orders.json'

export async function createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
  if (useMock) {
    await new Promise((r) => setTimeout(r, 500))
    return {
      id: `order-${Date.now()}`,
      orderNumber: `#${Math.floor(Math.random() * 900 + 100)}`,
      sessionId: payload.sessionId ?? `session-${Date.now()}`,
      status: 'pending',
      totalAmount: 0,
      items: payload.items.map((i) => ({
        menuId: i.menuId,
        menuName: '메뉴',
        quantity: i.quantity,
        unitPrice: 0,
      })),
      createdAt: new Date().toISOString(),
    }
  }
  const { data } = await axiosInstance.post<CreateOrderResponse>('/api/orders', payload)
  return data
}

export async function fetchOrders(sessionId: string): Promise<GetOrdersResponse> {
  if (useMock) {
    await new Promise((r) => setTimeout(r, 300))
    return mockOrders as GetOrdersResponse
  }
  const { data } = await axiosInstance.get<GetOrdersResponse>(
    `/api/orders/session/${sessionId}`,
  )
  return data
}
