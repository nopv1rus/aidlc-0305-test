import client from './client'
import type { Menu, Category, BadgeType } from '@/types'

export const getMenus = (storeId: string) =>
  client.get<Menu[]>(`/menus/store/${storeId}`)

export const getCategories = (storeId: string) =>
  client.get<Category[]>(`/categories/store/${storeId}`)

export const createMenu = (storeId: string, data: Omit<Menu, 'id' | 'storeId' | 'categoryName'>) =>
  client.post<Menu>('/menus', { storeId, ...data })

export const updateMenu = (menuId: string, data: Partial<Menu>) =>
  client.put<Menu>(`/menus/${menuId}`, data)

export const deleteMenu = (menuId: string) =>
  client.delete(`/menus/${menuId}`)

export const updateMenuOrder = (storeId: string, orderData: { menuId: string; sortOrder: number }[]) =>
  client.put(`/menus/store/${storeId}/order`, { orderData })

export const updateMenuBadge = (menuId: string, badge: BadgeType) =>
  client.put<Menu>(`/menus/${menuId}/badge`, { badge })

export const createCategory = (storeId: string, name: string) =>
  client.post<Category>('/categories', { storeId, name })
