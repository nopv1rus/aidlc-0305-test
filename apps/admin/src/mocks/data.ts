import type { Admin, Store, Table, Menu, Category, Order, OrderHistory, HistorySummary } from '@/types'

export const mockAdmin: Admin = {
  id: 'admin-1',
  storeId: 'store-1',
  storeIdentifier: 'teststore',
  role: 'store_admin',
  createdAt: '2026-01-01T00:00:00Z',
}

export const mockSuperAdmin: Admin = {
  id: 'super-1',
  storeId: '',
  storeIdentifier: 'superadmin',
  role: 'super_admin',
  createdAt: '2026-01-01T00:00:00Z',
}

export const mockStores: Store[] = [
  { id: 'store-1', name: '강남점', identifier: 'teststore', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'store-2', name: '홍대점', identifier: 'hongdae', createdAt: '2026-01-15T00:00:00Z' },
]

export const mockCategories: Category[] = [
  { id: 'cat-1', storeId: 'store-1', name: '메인 메뉴', sortOrder: 1 },
  { id: 'cat-2', storeId: 'store-1', name: '사이드', sortOrder: 2 },
  { id: 'cat-3', storeId: 'store-1', name: '음료', sortOrder: 3 },
]

export const mockTables: Table[] = [
  {
    id: 'table-1', storeId: 'store-1', number: 1, token: 'tok-1', createdAt: '2026-01-01T00:00:00Z',
    activeSession: { id: 'session-1', tableId: 'table-1', storeId: 'store-1', startedAt: '2026-03-05T10:00:00Z', status: 'active' },
  },
  { id: 'table-2', storeId: 'store-1', number: 2, token: 'tok-2', createdAt: '2026-01-01T00:00:00Z', activeSession: null },
  {
    id: 'table-3', storeId: 'store-1', number: 3, token: 'tok-3', createdAt: '2026-01-01T00:00:00Z',
    activeSession: { id: 'session-3', tableId: 'table-3', storeId: 'store-1', startedAt: '2026-03-05T11:00:00Z', status: 'active' },
  },
  { id: 'table-4', storeId: 'store-1', number: 4, token: 'tok-4', createdAt: '2026-01-01T00:00:00Z', activeSession: null },
  { id: 'table-5', storeId: 'store-1', number: 5, token: 'tok-5', createdAt: '2026-01-01T00:00:00Z', activeSession: null },
]

export const mockMenus: Menu[] = [
  { id: 'menu-1', storeId: 'store-1', categoryId: 'cat-1', categoryName: '메인 메뉴', name: '불고기 버거', price: 9500, description: '국내산 소고기 패티', badge: 'none', sortOrder: 1 },
  { id: 'menu-2', storeId: 'store-1', categoryId: 'cat-1', categoryName: '메인 메뉴', name: '치킨 버거', price: 8500, description: '바삭한 치킨 패티', badge: 'popular', sortOrder: 2 },
  { id: 'menu-3', storeId: 'store-1', categoryId: 'cat-2', categoryName: '사이드', name: '감자튀김', price: 3000, description: '바삭한 감자튀김', badge: 'none', sortOrder: 1 },
  { id: 'menu-4', storeId: 'store-1', categoryId: 'cat-3', categoryName: '음료', name: '콜라', price: 2000, description: '시원한 콜라', badge: 'none', sortOrder: 1 },
  { id: 'menu-5', storeId: 'store-1', categoryId: 'cat-3', categoryName: '음료', name: '아메리카노', price: 3500, description: '진한 아메리카노', badge: 'new', sortOrder: 2 },
]

export const mockOrders: Order[] = [
  {
    id: 'order-1', storeId: 'store-1', tableId: 'table-1', tableNumber: 1, sessionId: 'session-1',
    orderNumber: 'ORD-001', status: 'pending', totalAmount: 14500,
    createdAt: '2026-03-05T10:05:00Z',
    items: [
      { id: 'item-1', menuId: 'menu-1', menuName: '불고기 버거', quantity: 1, unitPrice: 9500 },
      { id: 'item-2', menuId: 'menu-4', menuName: '콜라', quantity: 1, unitPrice: 2000 },
      { id: 'item-3', menuId: 'menu-3', menuName: '감자튀김', quantity: 1, unitPrice: 3000 },
    ],
  },
  {
    id: 'order-2', storeId: 'store-1', tableId: 'table-3', tableNumber: 3, sessionId: 'session-3',
    orderNumber: 'ORD-002', status: 'preparing', totalAmount: 17000,
    createdAt: '2026-03-05T11:10:00Z',
    items: [
      { id: 'item-4', menuId: 'menu-2', menuName: '치킨 버거', quantity: 2, unitPrice: 8500 },
    ],
  },
]

export const mockOrderHistory: OrderHistory[] = [
  {
    id: 'hist-1', storeId: 'store-1', tableId: 'table-1', tableNumber: 1, sessionId: 'session-old-1',
    orderNumber: 'ORD-H001', status: 'completed', totalAmount: 21000,
    createdAt: '2026-03-04T18:00:00Z', sessionEndedAt: '2026-03-04T19:30:00Z',
    items: [
      { id: 'hi-1', menuId: 'menu-1', menuName: '불고기 버거', quantity: 2, unitPrice: 9500 },
      { id: 'hi-2', menuId: 'menu-4', menuName: '콜라', quantity: 1, unitPrice: 2000 },
    ],
  },
  {
    id: 'hist-2', storeId: 'store-1', tableId: 'table-2', tableNumber: 2, sessionId: 'session-old-2',
    orderNumber: 'ORD-H002', status: 'completed', totalAmount: 11500,
    createdAt: '2026-03-04T19:00:00Z', sessionEndedAt: '2026-03-04T20:00:00Z',
    items: [
      { id: 'hi-3', menuId: 'menu-2', menuName: '치킨 버거', quantity: 1, unitPrice: 8500 },
      { id: 'hi-4', menuId: 'menu-3', menuName: '감자튀김', quantity: 1, unitPrice: 3000 },
    ],
  },
]

export const mockSummary: HistorySummary = {
  totalOrders: 2,
  totalAmount: 32500,
  byTable: [
    { tableNumber: 1, totalAmount: 21000, orderCount: 1 },
    { tableNumber: 2, totalAmount: 11500, orderCount: 1 },
  ],
}

// 런타임에 변경 가능한 상태
export const state = {
  tables: [...mockTables],
  menus: [...mockMenus],
  orders: [...mockOrders],
  orderHistory: [...mockOrderHistory],
  stores: [...mockStores],
  accounts: [
    { ...mockAdmin },
    { id: 'admin-2', storeId: 'store-2', storeIdentifier: 'hongdae', role: 'store_admin' as const, createdAt: '2026-01-15T00:00:00Z' },
  ] as Admin[],
}
