import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartFloatingBar } from './CartFloatingBar'
import { useCartStore } from '../store/cart.store'

describe('CartFloatingBar', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] })
  })

  it('장바구니 비어있으면 숨김', () => {
    render(<MemoryRouter><CartFloatingBar /></MemoryRouter>)
    expect(screen.queryByTestId('cart-floating-bar')).not.toBeInTheDocument()
  })

  it('장바구니에 항목 있으면 표시', () => {
    useCartStore.setState({
      items: [{ menuId: 'm1', name: '불고기', price: 18000, quantity: 2, imageUrl: null }],
    })
    render(<MemoryRouter><CartFloatingBar /></MemoryRouter>)
    expect(screen.getByTestId('cart-floating-bar')).toBeInTheDocument()
    expect(screen.getByText('장바구니 2개')).toBeInTheDocument()
  })
})
