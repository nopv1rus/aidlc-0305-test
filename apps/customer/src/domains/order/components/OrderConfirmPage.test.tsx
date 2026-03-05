import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { OrderConfirmPage } from './OrderConfirmPage'
import { useCartStore } from '@/domains/cart/store/cart.store'

describe('OrderConfirmPage', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] })
  })

  it('장바구니 비어있으면 빈 상태 표시', () => {
    render(
      <MemoryRouter initialEntries={['/order/test-token/confirm']}>
        <Routes>
          <Route path="/order/:tableToken/confirm" element={<OrderConfirmPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument()
  })

  it('장바구니에 항목 있으면 주문 확인 표시', () => {
    useCartStore.setState({
      items: [{ menuId: 'm1', name: '불고기', price: 18000, quantity: 1, imageUrl: null }],
    })
    render(
      <MemoryRouter initialEntries={['/order/test-token/confirm']}>
        <Routes>
          <Route path="/order/:tableToken/confirm" element={<OrderConfirmPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('주문 확인')).toBeInTheDocument()
    expect(screen.getByText('불고기')).toBeInTheDocument()
    expect(screen.getByTestId('order-submit-button')).toBeInTheDocument()
  })
})
