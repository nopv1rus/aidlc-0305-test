import { describe, it, expect, beforeEach } from 'vitest'
import { useMenuStore } from './menu.store'

describe('MenuStore', () => {
  beforeEach(() => {
    useMenuStore.setState({ categories: [], isLoading: false, error: null })
  })

  it('초기 상태', () => {
    const state = useMenuStore.getState()
    expect(state.categories).toHaveLength(0)
    expect(state.isLoading).toBe(false)
  })

  it('getMenuById: 메뉴 검색', () => {
    useMenuStore.setState({
      categories: [
        {
          id: 'cat-01',
          name: '추천',
          sortOrder: 1,
          menus: [
            {
              id: 'menu-01',
              name: '불고기',
              price: 18000,
              description: '',
              imageUrl: null,
              badge: null,
              sortOrder: 1,
              categoryId: 'cat-01',
            },
          ],
        },
      ],
    })
    const menu = useMenuStore.getState().getMenuById('menu-01')
    expect(menu?.name).toBe('불고기')
  })

  it('getMenuById: 없는 메뉴는 undefined', () => {
    expect(useMenuStore.getState().getMenuById('nonexistent')).toBeUndefined()
  })
})
