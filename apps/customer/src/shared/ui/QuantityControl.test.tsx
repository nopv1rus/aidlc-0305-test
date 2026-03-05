import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuantityControl } from './QuantityControl'

describe('QuantityControl', () => {
  it('수량 표시', () => {
    render(<QuantityControl quantity={3} onIncrease={vi.fn()} onDecrease={vi.fn()} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('증가 버튼 클릭', async () => {
    const onIncrease = vi.fn()
    render(<QuantityControl quantity={1} onIncrease={onIncrease} onDecrease={vi.fn()} />)
    await userEvent.click(screen.getByLabelText('수량 증가'))
    expect(onIncrease).toHaveBeenCalledOnce()
  })

  it('감소 버튼 클릭', async () => {
    const onDecrease = vi.fn()
    render(<QuantityControl quantity={2} onIncrease={vi.fn()} onDecrease={onDecrease} />)
    await userEvent.click(screen.getByLabelText('수량 감소'))
    expect(onDecrease).toHaveBeenCalledOnce()
  })

  it('최소값에서 감소 버튼 비활성화', () => {
    render(<QuantityControl quantity={1} onIncrease={vi.fn()} onDecrease={vi.fn()} min={1} />)
    expect(screen.getByLabelText('수량 감소')).toBeDisabled()
  })

  it('최대값에서 증가 버튼 비활성화', () => {
    render(<QuantityControl quantity={99} onIncrease={vi.fn()} onDecrease={vi.fn()} max={99} />)
    expect(screen.getByLabelText('수량 증가')).toBeDisabled()
  })
})
