import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getStorageItem, setStorageItem, removeStorageItem } from './storage'

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('setStorageItem + getStorageItem', () => {
    setStorageItem('test-key', { foo: 'bar' })
    expect(getStorageItem('test-key')).toEqual({ foo: 'bar' })
  })

  it('존재하지 않는 키는 null 반환', () => {
    expect(getStorageItem('nonexistent')).toBeNull()
  })

  it('removeStorageItem', () => {
    setStorageItem('test-key', 'value')
    removeStorageItem('test-key')
    expect(getStorageItem('test-key')).toBeNull()
  })

  it('localStorage 에러 시 null 반환', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('QuotaExceeded')
    })
    expect(getStorageItem('key')).toBeNull()
    vi.restoreAllMocks()
  })
})
