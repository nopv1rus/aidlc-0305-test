import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuCard } from './MenuCard'
import type { Menu } from '../model/menu.types'

const mockMenu: Menu = {
  id: 'menu-01',
  name: '불고기',
  price: 18000,
  description: '맛있는 불고기',
  imageUrl: null,
  badge: 'signature',
  sortOrder: 1,
  categoryId: 'cat-01',
}

describe('MenuCard', () => {
  it('메뉴 정보 표시', () => {
    render(<MenuCard menu={mockMenu} onMenuClick={vi.fn()} onAddToCart={vi.fn()} />)
    expect(screen.getByText('불고기')).toBeInTheDocument()
    expect(screen.getByText('시그니처')).toBeInTheDocument()
  })

  it('담기 버튼 클릭', async () => {
    const onAddToCart = vi.fn()
    render(<MenuCard menu={mockMenu} onMenuClick={vi.fn()} onAddToCart={onAddToCart} />)
    await userEvent.click(screen.getByLabelText('불고기 장바구니에 담기'))
    expect(onAddToCart).toHaveBeenCalledWith(mockMenu)
  })

  it('카드 클릭으로 상세 보기', async () => {
    const onMenuClick = vi.fn()
    render(<MenuCard menu={mockMenu} onMenuClick={onMenuClick} onAddToCart={vi.fn()} />)
    await userEvent.click(screen.getByLabelText('불고기 상세 보기'))
    expect(onMenuClick).toHaveBeenCalledWith(mockMenu)
  })
})
