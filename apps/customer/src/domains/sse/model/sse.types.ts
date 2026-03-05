export type SSEEventType = 'ORDER_STATUS_CHANGED' | 'SESSION_ENDED'

export interface SSEEvent {
  type: SSEEventType
  data: unknown
}

export interface OrderStatusChangedEvent {
  orderId: string
  status: 'pending' | 'preparing' | 'completed' | 'cancelled'
  updatedAt: string
}

export interface SessionEndedEvent {
  sessionId: string
  reason: 'completed'
}
