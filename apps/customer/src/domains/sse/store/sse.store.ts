import { create } from 'zustand'
import { connectSSE, disconnectSSE } from '../services/sse-manager'

interface SSEStore {
  isConnected: boolean
  retryCount: number
  connect: (storeId: string, tableId: string) => void
  disconnect: () => void
  setConnected: (connected: boolean) => void
  incrementRetry: () => void
  resetRetry: () => void
}

export const useSSEStore = create<SSEStore>((set) => ({
  isConnected: false,
  retryCount: 0,
  connect: (storeId, tableId) => connectSSE(storeId, tableId),
  disconnect: () => {
    disconnectSSE()
    set({ isConnected: false })
  },
  setConnected: (connected) => set({ isConnected: connected }),
  incrementRetry: () => set((s) => ({ retryCount: s.retryCount + 1 })),
  resetRetry: () => set({ retryCount: 0 }),
}))
