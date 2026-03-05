import client from './client'
import type { Store, Admin } from '@/types'

export const getStores = () =>
  client.get<Store[]>('/admin/stores')

export const createStore = (name: string) =>
  client.post<Store>('/admin/stores', { name })

export const deleteStore = (storeId: string) =>
  client.delete(`/admin/stores/${storeId}`)

export const getStoreAdmins = () =>
  client.get<Admin[]>('/admin/accounts')

export const createStoreAdmin = (storeId: string, storeIdentifier: string, password: string) =>
  client.post<Admin>('/admin/accounts', { storeId, storeIdentifier, password })

export const deleteStoreAdmin = (adminId: string) =>
  client.delete(`/admin/accounts/${adminId}`)

export const getTableCountByStore = (storeId: string) =>
  client.get<{ count: number }>(`/admin/stores/${storeId}/table-count`)
