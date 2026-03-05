import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SessionInfo } from '../model/session.types'
import { validateSession } from '../api/session.api'
import { toAppError } from '@/shared/api/error-handler'

const SESSION_MAX_HOURS = 4

interface SessionStore {
  session: SessionInfo | null
  storeName: string
  tableNumber: number | null
  isLoading: boolean
  error: string | null
  initSession: (tableToken: string) => Promise<void>
  clearSession: () => void
  isSessionValid: () => boolean
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      session: null,
      storeName: '',
      tableNumber: null,
      isLoading: false,
      error: null,

      initSession: async (tableToken: string) => {
        // 기존 세션 유효성 확인
        const existing = get().session
        if (existing && existing.tableToken === tableToken && get().isSessionValid()) {
          return
        }

        set({ isLoading: true, error: null })
        try {
          const res = await validateSession(tableToken)
          const sessionInfo: SessionInfo = {
            sessionId: res.session?.id ?? '',
            storeId: res.store.id,
            tableId: res.table.id,
            tableToken,
            startedAt: res.session?.startedAt ?? new Date().toISOString(),
          }
          set({
            session: sessionInfo,
            storeName: res.store.name,
            tableNumber: res.table.number,
            isLoading: false,
          })
        } catch (err) {
          const appErr = toAppError(err)
          set({ isLoading: false, error: appErr.userMessage, session: null })
          throw appErr
        }
      },

      clearSession: () => {
        set({ session: null, storeName: '', tableNumber: null, error: null })
      },

      isSessionValid: () => {
        const session = get().session
        if (!session) return false
        const started = new Date(session.startedAt).getTime()
        const now = Date.now()
        return now - started < SESSION_MAX_HOURS * 60 * 60 * 1000
      },
    }),
    {
      name: 'session:v1',
      storage: createJSONStorage(() => {
        try {
          return localStorage
        } catch {
          return sessionStorage
        }
      }),
      partialize: (state) => ({ session: state.session, storeName: state.storeName, tableNumber: state.tableNumber }),
    },
  ),
)
