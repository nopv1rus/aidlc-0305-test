import { useNetworkStore } from './network.store'

let initialized = false

export function initOnlineDetector(): () => void {
  if (initialized) return () => {}
  initialized = true

  const handleOnline = () => useNetworkStore.getState().setOnline(true)
  const handleOffline = () => useNetworkStore.getState().setOnline(false)

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
    initialized = false
  }
}
