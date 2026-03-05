export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled'

export interface OrderItem {
  menuId: string
  menuName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string
}

export interface CreateOrderRequest {
  storeId: string
  tableId: string
  sessionId: string | null
  items: { menuId: string; quantity: number }[]
}

export interface CreateOrderResponse {
  id: string
  orderNumber: string
  sessionId: string
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string
}

export interface GetOrdersResponse {
  orders: Order[]
}
