import client from './client'
import type { Table } from '@/types'

export const getTables = (storeId: string) =>
  client.get<Table[]>(`/tables/store/${storeId}`)

export const createTable = (storeId: string, tableNumber: number) =>
  client.post<Table>('/tables', { storeId, tableNumber })

export const getQRCode = (tableId: string): Promise<Blob> =>
  client.get(`/tables/${tableId}/qrcode`, { responseType: 'blob' }).then((r) => r.data)

export const getBulkQRCodes = (tableIds: string[]): Promise<Blob> =>
  client.post('/tables/qrcode/bulk', { tableIds }, { responseType: 'blob' }).then((r) => r.data)

export const completeSession = (sessionId: string) =>
  client.post(`/sessions/${sessionId}/complete`)
