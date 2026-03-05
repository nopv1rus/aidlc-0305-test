import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem } from '../model/cart.types'
import type { Menu } from '@/domains/menu/model/menu.types'

interface CartStore {
  items: CartItem[]
  addItem: (menu: Menu) => void
  removeItem: (menuId: string) => void
  updateQuantity: (menuId: string, quantity: number) => void
  clearCart: () => void
  getTotalAmount: () => number
  getTotalCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menu: Menu) => {
        set((state) => {
          const existing = state.items.find((i) => i.menuId === menu.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.menuId === menu.id
                  ? { ...i, quantity: Math.min(i.quantity + 1, 99) }
                  : i,
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                menuId: menu.id,
                name: menu.name,
                price: menu.price,
                quantity: 1,
                imageUrl: menu.imageUrl,
              },
            ],
          }
        })
      },

      removeItem: (menuId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.menuId !== menuId),
        }))
      },

      updateQuantity: (menuId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.menuId !== menuId) }
          }
          return {
            items: state.items.map((i) =>
              i.menuId === menuId ? { ...i, quantity: Math.min(quantity, 99) } : i,
            ),
          }
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'cart:v1',
      storage: createJSONStorage(() => {
        try {
          return localStorage
        } catch {
          return sessionStorage
        }
      }),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
