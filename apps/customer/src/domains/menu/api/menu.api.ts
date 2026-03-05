import { axiosInstance, useMock } from '@/shared/api/axios-instance'
import type { GetMenusResponse } from '../model/menu.types'
import mockCategories from '@/mocks/categories.json'

export async function fetchMenus(storeId: string): Promise<GetMenusResponse> {
  if (useMock) {
    await new Promise((r) => setTimeout(r, 300))
    return mockCategories as GetMenusResponse
  }
  const { data } = await axiosInstance.get<GetMenusResponse>(`/api/menus/${storeId}`)
  return data
}
