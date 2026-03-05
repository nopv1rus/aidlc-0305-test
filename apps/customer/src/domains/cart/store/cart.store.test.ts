import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from './cart.store'
import type { Menu } from '@/domains/menu/model/menu.types'

const mockMenu: Menu = {
  id: 'menu-01',
  name: '불고기',
  price: 18000,
  description: '',
  imageUrl: null,
  badge: null,
  sortOrder: 1,
  categoryId: 'cat-01',
}

describe('CartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] })
  })

  it('addItem: 새 메뉴 추가', () => {
    useCartStore.getState().addItem(mockMenu)
    const items = useCartStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0]?.menuId).toBe('menu-01')
    expect(items[0]?.quantity).toBe(1)
  })

  it('addItem: 기존 메뉴 수량 증가', () => {
    useCartStore.getState().addItem(mockMenu)
    useCartStore.getState().addItem(mockMenu)
    const items = useCartStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0]?.quantity).toBe(2)
  })

  it('removeItem: 항목 삭제', () => {
    useCartStore.getState().addItem(mockMenu)
    useCartStore.getState().removeItem('menu-01')
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('updateQuantity: 수량 변경', () => {
    useCartStore.getState().addItem(mockMenu)
    useCartStore.getState().updateQuantity('menu-01', 5)
    expect(useCartStore.getState().items[0]?.quantity).toBe(5)
  })

  it('updateQuantity: 0이면 삭제', () => {
    useCartStore.getState().addItem(mockMenu)
    useCartStore.getState().updateQuantity('menu-01', 0)
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('clearCart: 전체 비우기', () => {
    useCartStore.getState().addItem(mockMenu)
    useCartStore.getState().clearCart()
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('getTotalAmount: 합계 계산', () => {
    useCartStore.getState().addItem(mockMenu)
    useCartStore.getState().updateQuantity('menu-01', 3)
    expect(useCartStore.getState().getTotalAmount()).toBe(54000)
  })

  it('getTotalCount: 총 수량', () => {
    useCartStore.getState().addItem(mockMenu)
    useCartStore.getState().updateQuantity('menu-01', 3)
    expect(useCartStore.getState().getTotalCount()).toBe(3)
  })

  it('수량 최대 99 제한', () => {
    useCartStore.getState().addItem(mockMenu)
    useCartStore.getState().updateQuantity('menu-01', 100)
    expect(useCartStore.getState().items[0]?.quantity).toBe(99)
  })
})
