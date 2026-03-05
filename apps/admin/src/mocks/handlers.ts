import { http, HttpResponse } from 'msw'
import { state, mockAdmin, mockSuperAdmin, mockCategories, mockSummary } from './data'
import type { OrderStatus } from '@/types'

const BASE = '/api'

export const handlers = [
  // ── Auth ──────────────────────────────────────────────
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = await request.json() as { storeIdentifier: string; password: string }
    if (body.storeIdentifier === 'teststore' && body.password === 'password') {
      return HttpResponse.json({ accessToken: 'mock-token-store', admin: mockAdmin })
    }
    return HttpResponse.json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
  }),

  http.post(`${BASE}/auth/super-login`, async ({ request }) => {
    const body = await request.json() as { username: string; password: string }
    if (body.username === 'superadmin' && body.password === 'superpass') {
      return HttpResponse.json({ accessToken: 'mock-token-super', admin: mockSuperAdmin })
    }
    return HttpResponse.json({ message: '인증 실패' }, { status: 401 })
  }),

  // ── Tables ────────────────────────────────────────────
  http.get(`${BASE}/tables/store/:storeId`, () => {
    return HttpResponse.json(state.tables)
  }),

  http.post(`${BASE}/tables`, async ({ request }) => {
    const body = await request.json() as { storeId: string; tableNumber: number }
    const newTable = {
      id: `table-${Date.now()}`,
      storeId: body.storeId,
      number: body.tableNumber,
      token: `tok-${Date.now()}`,
      createdAt: new Date().toISOString(),
      activeSession: null,
    }
    state.tables.push(newTable)
    return HttpResponse.json(newTable, { status: 201 })
  }),

  http.get(`${BASE}/tables/:tableId/qrcode`, ({ params }) => {
    const { tableId } = params
    const table = state.tables.find((t) => t.id === tableId)
    const url = `http://localhost:3002/order/${tableId}`
    // SVG QR 코드 placeholder 반환
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <rect width="200" height="200" fill="white"/>
      <text x="100" y="90" text-anchor="middle" font-size="12" fill="black">QR Code</text>
      <text x="100" y="110" text-anchor="middle" font-size="10" fill="gray">Table ${table?.number ?? tableId}</text>
      <text x="100" y="130" text-anchor="middle" font-size="8" fill="blue">${url}</text>
    </svg>`
    return new HttpResponse(svg, { headers: { 'Content-Type': 'image/svg+xml' } })
  }),

  http.post(`${BASE}/tables/qrcode/bulk`, async ({ request }) => {
    const body = await request.json() as { tableIds: string[] }
    // ZIP 파일 대신 간단한 텍스트 blob 반환 (mock)
    const content = body.tableIds.map((id) => {
      const t = state.tables.find((t) => t.id === id)
      return `Table ${t?.number}: http://localhost:3002/order/${id}`
    }).join('\n')
    return new HttpResponse(content, { headers: { 'Content-Type': 'application/zip' } })
  }),

  http.post(`${BASE}/sessions/:sessionId/complete`, ({ params }) => {
    const { sessionId } = params
    state.tables = state.tables.map((t) =>
      t.activeSession?.id === sessionId ? { ...t, activeSession: null } : t
    )
    // 완료된 주문들을 히스토리로 이동
    const completedOrders = state.orders.filter((o) => o.sessionId === sessionId)
    completedOrders.forEach((o) => {
      const table = state.tables.find((t) => t.id === o.tableId)
      state.orderHistory.push({
        ...o,
        tableNumber: table?.number ?? 0,
        sessionEndedAt: new Date().toISOString(),
      })
    })
    state.orders = state.orders.filter((o) => o.sessionId !== sessionId)
    return HttpResponse.json({ success: true })
  }),

  // ── Orders ────────────────────────────────────────────
  http.get(`${BASE}/orders/store/:storeId`, () => {
    return HttpResponse.json(state.orders)
  }),

  http.put(`${BASE}/orders/:orderId/status`, async ({ params, request }) => {
    const { orderId } = params
    const body = await request.json() as { status: OrderStatus }
    state.orders = state.orders.map((o) =>
      o.id === orderId ? { ...o, status: body.status } : o
    )
    const updated = state.orders.find((o) => o.id === orderId)
    return HttpResponse.json(updated)
  }),

  http.put(`${BASE}/orders/:orderId/cancel`, ({ params }) => {
    const { orderId } = params
    state.orders = state.orders.map((o) =>
      o.id === orderId ? { ...o, status: 'cancelled' } : o
    )
    const updated = state.orders.find((o) => o.id === orderId)
    return HttpResponse.json(updated)
  }),

  http.get(`${BASE}/orders/history/:storeId`, () => {
    return HttpResponse.json(state.orderHistory)
  }),

  http.get(`${BASE}/orders/history/:storeId/summary`, () => {
    const total = state.orderHistory.reduce((s, o) => s + o.totalAmount, 0)
    return HttpResponse.json({
      ...mockSummary,
      totalOrders: state.orderHistory.length,
      totalAmount: total,
      averageAmount: state.orderHistory.length > 0 ? Math.round(total / state.orderHistory.length) : 0,
    })
  }),

  // ── Menus ─────────────────────────────────────────────
  http.get(`${BASE}/menus/store/:storeId`, () => {
    return HttpResponse.json(state.menus)
  }),

  http.get(`${BASE}/categories/store/:storeId`, () => {
    return HttpResponse.json(mockCategories)
  }),

  http.post(`${BASE}/menus`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const cat = mockCategories.find((c) => c.id === body.categoryId)
    const newMenu = {
      id: `menu-${Date.now()}`,
      storeId: body.storeId as string,
      categoryId: body.categoryId as string,
      categoryName: cat?.name ?? '',
      name: body.name as string,
      price: body.price as number,
      description: (body.description as string) ?? '',
      badge: 'none' as const,
      sortOrder: state.menus.length + 1,
    }
    state.menus.push(newMenu)
    return HttpResponse.json(newMenu, { status: 201 })
  }),

  http.put(`${BASE}/menus/:menuId`, async ({ params, request }) => {
    const { menuId } = params
    const body = await request.json() as Record<string, unknown>
    state.menus = state.menus.map((m) =>
      m.id === menuId ? { ...m, ...body } : m
    )
    const updated = state.menus.find((m) => m.id === menuId)
    return HttpResponse.json(updated)
  }),

  http.delete(`${BASE}/menus/:menuId`, ({ params }) => {
    const { menuId } = params
    state.menus = state.menus.filter((m) => m.id !== menuId)
    return HttpResponse.json({ success: true })
  }),

  http.put(`${BASE}/menus/store/:storeId/order`, async ({ request }) => {
    const body = await request.json() as { orderData: { menuId: string; sortOrder: number }[] }
    body.orderData.forEach(({ menuId, sortOrder }) => {
      state.menus = state.menus.map((m) => m.id === menuId ? { ...m, sortOrder } : m)
    })
    return HttpResponse.json({ success: true })
  }),

  http.put(`${BASE}/menus/:menuId/badge`, async ({ params, request }) => {
    const { menuId } = params
    const body = await request.json() as { badge: string }
    state.menus = state.menus.map((m) =>
      m.id === menuId ? { ...m, badge: body.badge as never } : m
    )
    const updated = state.menus.find((m) => m.id === menuId)
    return HttpResponse.json(updated)
  }),

  http.post(`${BASE}/categories`, async ({ request }) => {
    const body = await request.json() as { storeId: string; name: string }
    const newCat = { id: `cat-${Date.now()}`, storeId: body.storeId, name: body.name, sortOrder: mockCategories.length + 1 }
    mockCategories.push(newCat)
    return HttpResponse.json(newCat, { status: 201 })
  }),

  // ── Super Admin ───────────────────────────────────────
  http.get(`${BASE}/admin/stores`, () => {
    return HttpResponse.json(state.stores)
  }),

  http.post(`${BASE}/admin/stores`, async ({ request }) => {
    const body = await request.json() as { name: string }
    // 중복 매장명 검증
    if (state.stores.find((s) => s.name === body.name.trim())) {
      return HttpResponse.json({ message: '이미 존재하는 매장명입니다.' }, { status: 409 })
    }
    const newStore = {
      id: `store-${Date.now()}`,
      name: body.name.trim(),
      identifier: body.name.trim().toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString(),
    }
    state.stores.push(newStore)
    return HttpResponse.json(newStore, { status: 201 })
  }),

  http.delete(`${BASE}/admin/stores/:storeId`, ({ params }) => {
    const { storeId } = params
    state.stores = state.stores.filter((s) => s.id !== storeId)
    return HttpResponse.json({ success: true })
  }),

  http.get(`${BASE}/admin/stores/:storeId/table-count`, ({ params }) => {
    const { storeId } = params
    const count = state.tables.filter((t) => t.storeId === storeId).length
    return HttpResponse.json({ count })
  }),

  http.get(`${BASE}/admin/accounts`, () => {
    return HttpResponse.json(state.accounts)
  }),

  http.post(`${BASE}/admin/accounts`, async ({ request }) => {
    const body = await request.json() as { storeId: string; storeIdentifier: string; password: string }
    // 중복 식별자 검증
    if (state.accounts.find((a) => a.storeIdentifier === body.storeIdentifier)) {
      return HttpResponse.json({ message: '이미 사용 중인 식별자입니다.' }, { status: 409 })
    }
    const newAdmin = {
      id: `admin-${Date.now()}`,
      storeId: body.storeId,
      storeIdentifier: body.storeIdentifier,
      role: 'store_admin' as const,
      createdAt: new Date().toISOString(),
    }
    state.accounts.push(newAdmin)
    return HttpResponse.json(newAdmin, { status: 201 })
  }),

  http.delete(`${BASE}/admin/accounts/:adminId`, ({ params }) => {
    const { adminId } = params
    state.accounts = state.accounts.filter((a) => a.id !== adminId)
    return HttpResponse.json({ success: true })
  }),
]
