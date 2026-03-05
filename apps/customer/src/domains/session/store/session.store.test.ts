import { describe, it, expect, beforeEach } from 'vitest'
import { useSessionStore } from './session.store'

describe('SessionStore', () => {
  beforeEach(() => {
    useSessionStore.setState({
      session: null,
      storeName: '',
      tableNumber: null,
      isLoading: false,
      error: null,
    })
  })

  it('초기 상태', () => {
    const state = useSessionStore.getState()
    expect(state.session).toBeNull()
    expect(state.isLoading).toBe(false)
  })

  it('clearSession: 세션 초기화', () => {
    useSessionStore.setState({
      session: {
        sessionId: 's1',
        storeId: 'st1',
        tableId: 't1',
        tableToken: 'token',
        startedAt: new Date().toISOString(),
      },
      storeName: '테스트 매장',
    })
    useSessionStore.getState().clearSession()
    expect(useSessionStore.getState().session).toBeNull()
    expect(useSessionStore.getState().storeName).toBe('')
  })

  it('isSessionValid: 유효한 세션', () => {
    useSessionStore.setState({
      session: {
        sessionId: 's1',
        storeId: 'st1',
        tableId: 't1',
        tableToken: 'token',
        startedAt: new Date().toISOString(),
      },
    })
    expect(useSessionStore.getState().isSessionValid()).toBe(true)
  })

  it('isSessionValid: 만료된 세션', () => {
    const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    useSessionStore.setState({
      session: {
        sessionId: 's1',
        storeId: 'st1',
        tableId: 't1',
        tableToken: 'token',
        startedAt: fiveHoursAgo,
      },
    })
    expect(useSessionStore.getState().isSessionValid()).toBe(false)
  })
})
