import { create } from 'zustand'

interface NetworkStore {
  isOnline: boolean
  setOnline: (online: boolean) => void
}

export const useNetworkStore = create<NetworkStore>((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  setOnline: (online) => set({ isOnline: online }),
}))
