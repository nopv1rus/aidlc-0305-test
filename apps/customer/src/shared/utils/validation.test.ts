import { describe, it, expect } from 'vitest'
import { isValidTableToken, clampQuantity, isValidQuantity } from './validation'

describe('isValidTableToken', () => {
  it('유효한 토큰 허용', () => {
    expect(isValidTableToken('abc-123-def')).toBe(true)
    expect(isValidTableToken('token123')).toBe(true)
  })

  it('특수문자 포함 토큰 거부', () => {
    expect(isValidTableToken('abc/def')).toBe(false)
    expect(isValidTableToken('abc def')).toBe(false)
    expect(isValidTableToken('<script>')).toBe(false)
  })

  it('빈 문자열 거부', () => {
    expect(isValidTableToken('')).toBe(false)
  })
})

describe('clampQuantity', () => {
  it('범위 내 값 유지', () => {
    expect(clampQuantity(5)).toBe(5)
  })

  it('0 이하는 0 반환', () => {
    expect(clampQuantity(0)).toBe(0)
    expect(clampQuantity(-1)).toBe(0)
  })

  it('99 초과는 99로 제한', () => {
    expect(clampQuantity(100)).toBe(99)
    expect(clampQuantity(999)).toBe(99)
  })

  it('소수점 버림', () => {
    expect(clampQuantity(3.7)).toBe(3)
  })
})

describe('isValidQuantity', () => {
  it('유효한 수량', () => {
    expect(isValidQuantity(1)).toBe(true)
    expect(isValidQuantity(99)).toBe(true)
  })

  it('범위 밖 수량', () => {
    expect(isValidQuantity(0)).toBe(false)
    expect(isValidQuantity(100)).toBe(false)
  })

  it('소수점 거부', () => {
    expect(isValidQuantity(1.5)).toBe(false)
  })
})
