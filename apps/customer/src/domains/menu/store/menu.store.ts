import { create } from 'zustand'
import type { Category, Menu } from '../model/menu.types'
import { fetchMenus as fetchMenusApi } from '../api/menu.api'
import { toAppError } from '@/shared/api/error-handler'

interface MenuStore {
  categories: Category[]
  isLoading: boolean
  error: string | null
  fetchMenus: (storeId: string) => Promise<void>
  getMenuById: (menuId: string) => Menu | undefined
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchMenus: async (storeId: string) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetchMenusApi(storeId)
      set({ categories: res.categories, isLoading: false })
    } catch (err) {
      const appErr = toAppError(err)
      set({ isLoading: false, error: appErr.userMessage })
    }
  },

  getMenuById: (menuId: string) => {
    for (const cat of get().categories) {
      const found = cat.menus.find((m) => m.id === menuId)
      if (found) return found
    }
    return undefined
  },
}))
