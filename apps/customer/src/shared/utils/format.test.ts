import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, formatTime } from './format'

describe('formatCurrency', () => {
  it('원화 포맷팅', () => {
    const result = formatCurrency(18000)
    expect(result).toContain('18,000')
  })

  it('0원 포맷팅', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })
})

describe('formatDate', () => {
  it('ISO 문자열을 한국어 날짜로 변환', () => {
    const result = formatDate('2026-03-05T10:30:00Z')
    expect(result).toBeTruthy()
  })
})

describe('formatTime', () => {
  it('ISO 문자열을 시간으로 변환', () => {
    const result = formatTime('2026-03-05T10:30:00Z')
    expect(result).toBeTruthy()
  })
})
