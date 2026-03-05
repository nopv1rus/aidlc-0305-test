import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PriceDisplay } from './PriceDisplay'

describe('PriceDisplay', () => {
  it('금액 포맷팅 표시', () => {
    render(<PriceDisplay amount={18000} />)
    expect(screen.getByTestId('price-display').textContent).toContain('18,000')
  })

  it('0원 표시', () => {
    render(<PriceDisplay amount={0} />)
    expect(screen.getByTestId('price-display').textContent).toContain('0')
  })

  it('tabular-nums 클래스 적용', () => {
    render(<PriceDisplay amount={1000} />)
    expect(screen.getByTestId('price-display')).toHaveClass('tabular-nums')
  })
})
