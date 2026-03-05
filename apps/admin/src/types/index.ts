// ─── Auth ───────────────────────────────────────────────────────────────────
export type AdminRole = 'store_admin' | 'super_admin'

export interface Admin {
  id: string
  storeId?: string
  storeIdentifier?: string
  role: AdminRole
  createdAt: string
}

export interface LoginResponse {
  accessToken: string
  admin: Admin
}

// ─── Store ───────────────────────────────────────────────────────────────────
export interface Store {
  id: string
  name: string
  identifier: string
  createdAt: string
}

// ─── Table ───────────────────────────────────────────────────────────────────
export interface Table {
  id: string
  storeId: string
  number: number
  token: string
  createdAt: string
  activeSession?: TableSession | null
  totalAmount?: number
}

// ─── Session ─────────────────────────────────────────────────────────────────
export type SessionStatus = 'active' | 'ended'

export interface TableSession {
  id: string
  tableId: string
  storeId: string
  startedAt: string
  endedAt?: string
  status: SessionStatus
}

// ─── Menu ────────────────────────────────────────────────────────────────────
export type BadgeType = 'signature' | 'popular' | 'new' | 'none'

export interface Category {
  id: string
  storeId: string
  name: string
  sortOrder: number
}

export interface Menu {
  id: string
  storeId: string
  categoryId: string
  categoryName?: string
  name: string
  price: number
  description?: string
  imageUrl?: string
  badge: BadgeType
  sortOrder: number
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled'

export interface OrderItem {
  id: string
  menuId: string
  menuName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  storeId: string
  tableId: string
  tableNumber?: number
  sessionId: string
  orderNumber: string
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string
}

export interface OrderHistory {
  id: string
  storeId: string
  tableId: string
  tableNumber?: number
  sessionId: string
  orderNumber: string
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  sessionEndedAt?: string
}

export interface HistorySummary {
  totalAmount: number
  totalOrders: number
  byTable: { tableNumber: number; totalAmount: number; orderCount: number }[]
}

// ─── SSE Events ──────────────────────────────────────────────────────────────
export type SSEEventType = 'NEW_ORDER' | 'ORDER_STATUS_CHANGED' | 'SESSION_ENDED'

export interface SSEEvent {
  type: SSEEventType
  data: Order | { orderId: string; status: OrderStatus; tableId: string } | { tableId: string }
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export interface TableDashboardCard {
  table: Table
  orders: Order[]
  totalAmount: number
  hasNewOrder: boolean
}
