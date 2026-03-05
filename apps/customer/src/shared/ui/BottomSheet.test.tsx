import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BottomSheet } from './BottomSheet'

describe('BottomSheet', () => {
  it('isOpen=false일 때 렌더링 안 함', () => {
    render(<BottomSheet isOpen={false} onClose={vi.fn()} title="테스트">내용</BottomSheet>)
    expect(screen.queryByTestId('bottom-sheet')).not.toBeInTheDocument()
  })

  it('isOpen=true일 때 렌더링', () => {
    render(<BottomSheet isOpen={true} onClose={vi.fn()} title="테스트">내용</BottomSheet>)
    expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument()
    expect(screen.getByText('테스트')).toBeInTheDocument()
    expect(screen.getByText('내용')).toBeInTheDocument()
  })

  it('닫기 버튼 클릭', async () => {
    const onClose = vi.fn()
    render(<BottomSheet isOpen={true} onClose={onClose} title="테스트">내용</BottomSheet>)
    await userEvent.click(screen.getByTestId('bottom-sheet-close'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('ESC 키로 닫기', async () => {
    const onClose = vi.fn()
    render(<BottomSheet isOpen={true} onClose={onClose} title="테스트">내용</BottomSheet>)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })
})
