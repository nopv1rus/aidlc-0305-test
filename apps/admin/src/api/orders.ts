import client from './client'
import type { Order, OrderStatus, OrderHistory, HistorySummary } from '@/types'

export const getOrdersByStore = (storeId: string) =>
  client.get<Order[]>(`/orders/store/${storeId}`)

export const updateOrderStatus = (orderId: string, status: OrderStatus) =>
  client.put<Order>(`/orders/${orderId}/status`, { status })

export const cancelOrder = (orderId: string) =>
  client.put<Order>(`/orders/${orderId}/cancel`)

export const getOrderHistory = (storeId: string, params?: { startDate?: string; endDate?: string; tableId?: string }) =>
  client.get<OrderHistory[]>(`/orders/history/${storeId}`, { params })

export const getOrderHistorySummary = (storeId: string, params?: { startDate?: string; endDate?: string }) =>
  client.get<HistorySummary>(`/orders/history/${storeId}/summary`, { params })
